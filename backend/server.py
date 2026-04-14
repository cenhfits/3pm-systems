from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import io
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List
import asyncio
import uuid
import random
import requests as http_requests
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import pandas as pd

EMAIL_FROM_NAME = "3PM System"

# In-memory OTP store: email -> {otp, name, phone, password_hash, expires_at}
_otp_store: dict = {}
# In-memory reset store: email -> {otp, expires_at}
_reset_store: dict = {}
OTP_EXPIRY_MINUTES = 10


def _send_email(to_email: str, subject: str, html_body: str):
    api_key = os.environ.get("BREVO_API_KEY", "").strip()
    sender_email = os.environ.get("SMTP_USER", "cenhfits@gmail.com").strip()
    logging.info(f"[EMAIL] Sending to {to_email}, brevo key set: {bool(api_key)}")
    if not api_key:
        raise Exception("BREVO_API_KEY not configured")
    resp = http_requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={"api-key": api_key, "Content-Type": "application/json"},
        json={
            "sender": {"name": EMAIL_FROM_NAME, "email": sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_body,
        },
        timeout=15,
    )
    logging.info(f"[EMAIL] Brevo response: {resp.status_code} {resp.text}")
    if resp.status_code >= 400:
        raise Exception(f"Brevo API error {resp.status_code}: {resp.text}")


async def _send_email_async(to_email: str, subject: str, html_body: str):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send_email, to_email, subject, html_body)


def _otp_email_html(name: str, otp: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#111111;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#1A1A1A;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
    <div style="background:#f97316;padding:28px 32px;">
      <h1 style="margin:0;color:#000;font-size:22px;font-weight:900;letter-spacing:-0.5px;">3PM System</h1>
      <p style="margin:4px 0 0;color:rgba(0,0,0,0.6);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Train. Eat. Sleep.</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#a3a3a3;font-size:15px;margin:0 0 8px;">Halo, <strong style="color:#fff;">{name}</strong> 👋</p>
      <p style="color:#a3a3a3;font-size:14px;line-height:1.6;margin:0 0 28px;">
        Ini kode OTP untuk verifikasi akun kamu. Kode berlaku selama <strong style="color:#fff;">{OTP_EXPIRY_MINUTES} menit</strong>.
      </p>
      <div style="background:#111;border:1px solid rgba(249,115,22,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 6px;color:#a3a3a3;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Kode OTP</p>
        <p style="margin:0;color:#f97316;font-size:40px;font-weight:900;letter-spacing:10px;font-family:monospace;">{otp}</p>
      </div>
      <p style="color:#525252;font-size:12px;margin:0;">Kalau lo ga minta kode ini, abaikan aja email ini.</p>
    </div>
  </div>
</body>
</html>
"""

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', override=True)

# SMTP — must be read AFTER load_dotenv
SMTP_USER = os.environ.get("SMTP_USER", "cenhfits@gmail.com").strip()
SMTP_PASS = os.environ.get("SMTP_PASS", "").strip()

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT
SECRET_KEY = os.environ.get('SECRET_KEY', 'changeme')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ── Models ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OtpSendRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class OtpVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    has_access: bool = False
    is_admin: bool = False
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class LessonComplete(BaseModel):
    chapter_id: int
    lesson_id: str

class ProgressOut(BaseModel):
    completed_lessons: List[str]
    chapter_progress: dict   # {chapter_id: percentage}
    overall_progress: float  # 0-100


# ── Helpers ───────────────────────────────────────────────────────────────────

def hash_password(p): return pwd_context.hash(p)
def verify_password(plain, hashed): return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token tidak valid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau expired")
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user

def parse_user_out(user: dict) -> UserOut:
    created_at = user.get("created_at")
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    # Admin always has access
    has_access = user.get("has_access", False) or user.get("is_admin", False)
    return UserOut(**{**user, "created_at": created_at, "has_access": has_access})

# Total lessons per chapter (must match frontend)
CHAPTER_LESSONS = {
    0: ["0-1"],  # Introduction
    1: ["1-1"],
    2: ["2-1", "2-2", "2-3"],
    3: ["3-1"],
    4: ["4-1"],
    5: ["5-1"],
    6: ["6-1"],
    7: [],  # coming soon
}
TOTAL_LESSONS = sum(len(v) for v in CHAPTER_LESSONS.values())


# ── Auth ──────────────────────────────────────────────────────────────────────

@api_router.post("/auth/send-otp", status_code=200)
async def send_otp(data: OtpSendRequest):
    """Step 1 of registration: validate email, store pending data, send OTP."""
    email = data.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    otp = str(random.randint(100000, 999999))
    _otp_store[email] = {
        "otp": otp,
        "name": data.name,
        "phone": data.phone or "",
        "password_hash": hash_password(data.password),
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES),
    }
    try:
        await _send_email_async(email, "Kode OTP Verifikasi — 3PM System", _otp_email_html(data.name, otp))
    except Exception as e:
        logging.error(f"SMTP error: {e}")
        raise HTTPException(status_code=500, detail="Gagal mengirim email OTP. Coba lagi.")
    return {"message": "OTP terkirim ke email kamu"}


@api_router.post("/auth/verify-otp", response_model=Token, status_code=201)
async def verify_otp(data: OtpVerifyRequest):
    """Step 2 of registration: verify OTP and create account."""
    email = data.email.lower().strip()
    pending = _otp_store.get(email)
    if not pending:
        raise HTTPException(status_code=400, detail="OTP tidak ditemukan. Mulai dari awal lagi.")
    if datetime.now(timezone.utc) > pending["expires_at"]:
        _otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP sudah kadaluarsa. Minta OTP baru.")
    if pending["otp"] != data.otp.strip():
        raise HTTPException(status_code=400, detail="Kode OTP salah.")
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    await db.users.insert_one({
        "id": user_id,
        "name": pending["name"],
        "phone": pending.get("phone", ""),
        "email": email,
        "password": pending["password_hash"],
        "has_access": False,
        "created_at": now.isoformat(),
    })
    _otp_store.pop(email, None)
    user_out = UserOut(id=user_id, name=pending["name"], email=email, has_access=False, created_at=now)
    return Token(access_token=create_access_token(user_id), user=user_out)


@api_router.post("/auth/forgot-password", status_code=200)
async def forgot_password(data: ForgotPasswordRequest):
    """Send OTP to registered email for password reset."""
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user:
        return {"message": "Kalau email terdaftar, kode OTP akan dikirim."}
    otp = str(random.randint(100000, 999999))
    _reset_store[email] = {
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES),
    }
    try:
        await _send_email_async(email, "Reset Password — 3PM System", _otp_email_html(user.get("name", "User"), otp))
    except Exception as e:
        logging.error(f"SMTP error: {e}")
        raise HTTPException(status_code=500, detail="Gagal mengirim email. Coba lagi.")
    return {"message": "Kalau email terdaftar, kode OTP akan dikirim."}


@api_router.post("/auth/reset-password", status_code=200)
async def reset_password(data: ResetPasswordRequest):
    """Verify OTP and update password."""
    email = data.email.lower().strip()
    pending = _reset_store.get(email)
    if not pending:
        raise HTTPException(status_code=400, detail="OTP tidak ditemukan. Mulai dari awal.")
    if datetime.now(timezone.utc) > pending["expires_at"]:
        _reset_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP sudah kadaluarsa. Minta OTP baru.")
    if pending["otp"] != data.otp.strip():
        raise HTTPException(status_code=400, detail="Kode OTP salah.")
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password minimal 8 karakter.")
    await db.users.update_one(
        {"email": email},
        {"$set": {"password": hash_password(data.new_password)}}
    )
    _reset_store.pop(email, None)
    return {"message": "Password berhasil diubah."}


@api_router.post("/auth/register", response_model=Token, status_code=201)
async def register(data: UserCreate):
    email = data.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    await db.users.insert_one({
        "id": user_id,
        "name": data.name,
        "email": email,
        "password": hash_password(data.password),
        "has_access": False,
        "created_at": now.isoformat(),
    })
    user_out = UserOut(id=user_id, name=data.name, email=email, has_access=False, created_at=now)
    return Token(access_token=create_access_token(user_id), user=user_out)


@api_router.post("/auth/login", response_model=Token)
async def login(data: UserLogin):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    return Token(access_token=create_access_token(user["id"]), user=parse_user_out(user))


@api_router.get("/auth/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return parse_user_out(current_user)


# ── Progress ──────────────────────────────────────────────────────────────────

@api_router.get("/progress", response_model=ProgressOut)
async def get_progress(current_user: dict = Depends(get_current_user)):
    doc = await db.progress.find_one({"user_id": current_user["id"]}, {"_id": 0})
    completed = doc.get("completed_lessons", []) if doc else []

    chapter_progress = {}
    for ch_id, lessons in CHAPTER_LESSONS.items():
        if not lessons:
            chapter_progress[str(ch_id)] = 0.0
            continue
        done = sum(1 for l in lessons if l in completed)
        chapter_progress[str(ch_id)] = round((done / len(lessons)) * 100, 1)

    overall = round((len(completed) / TOTAL_LESSONS * 100), 1) if TOTAL_LESSONS > 0 else 0.0

    return ProgressOut(
        completed_lessons=completed,
        chapter_progress=chapter_progress,
        overall_progress=overall,
    )


@api_router.post("/progress/complete")
async def complete_lesson(data: LessonComplete, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    await db.progress.update_one(
        {"user_id": user_id},
        {"$addToSet": {"completed_lessons": data.lesson_id},
         "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True}


@api_router.delete("/progress/uncomplete")
async def uncomplete_lesson(data: LessonComplete, current_user: dict = Depends(get_current_user)):
    await db.progress.update_one(
        {"user_id": current_user["id"]},
        {"$pull": {"completed_lessons": data.lesson_id}},
    )
    return {"ok": True}


# ── Admin Middleware ──────────────────────────────────────────────────────────

ADMIN_SECRET = os.environ.get('ADMIN_SECRET', 'admin-secret-key')

async def require_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """Admin diverifikasi via token JWT biasa + flag is_admin di DB."""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Akses ditolak. Bukan admin.")
    return user


# ── Admin Endpoints ───────────────────────────────────────────────────────────

class AccessAction(BaseModel):
    user_id: str

class UserAdminOut(BaseModel):
    id: str
    name: str
    email: str
    has_access: bool
    is_admin: bool = False
    created_at: str
    overall_progress: float = 0.0
    completed_lessons: int = 0

@api_router.get("/admin/users", response_model=List[UserAdminOut])
async def admin_list_users(admin: dict = Depends(require_admin)):
    """Daftar semua user + progress masing-masing."""
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    result = []
    for u in users:
        progress_doc = await db.progress.find_one({"user_id": u["id"]}, {"_id": 0})
        completed = progress_doc.get("completed_lessons", []) if progress_doc else []
        overall = round((len(completed) / TOTAL_LESSONS * 100), 1) if TOTAL_LESSONS > 0 else 0.0
        created_at = u.get("created_at", "")
        if isinstance(created_at, datetime):
            created_at = created_at.isoformat()
        result.append(UserAdminOut(
            id=u["id"],
            name=u.get("name", ""),
            email=u.get("email", ""),
            has_access=u.get("has_access", False),
            is_admin=u.get("is_admin", False),
            created_at=created_at,
            overall_progress=overall,
            completed_lessons=len(completed),
        ))
    return result


@api_router.post("/admin/grant-access")
async def grant_access(data: AccessAction, admin: dict = Depends(require_admin)):
    result = await db.users.update_one({"id": data.user_id}, {"$set": {"has_access": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return {"ok": True}


@api_router.post("/admin/revoke-access")
async def revoke_access(data: AccessAction, admin: dict = Depends(require_admin)):
    result = await db.users.update_one({"id": data.user_id}, {"$set": {"has_access": False}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return {"ok": True}


@api_router.get("/admin/user/{user_id}/progress")
async def admin_user_progress(user_id: str, admin: dict = Depends(require_admin)):
    """Detail progress satu user per chapter."""
    progress_doc = await db.progress.find_one({"user_id": user_id}, {"_id": 0})
    completed = progress_doc.get("completed_lessons", []) if progress_doc else []
    chapter_progress = {}
    for ch_id, lessons in CHAPTER_LESSONS.items():
        if not lessons:
            chapter_progress[str(ch_id)] = {"pct": 0, "done": 0, "total": 0}
            continue
        done = sum(1 for l in lessons if l in completed)
        chapter_progress[str(ch_id)] = {
            "pct": round((done / len(lessons)) * 100, 1),
            "done": done,
            "total": len(lessons),
        }
    return {
        "user_id": user_id,
        "completed_lessons": completed,
        "chapter_progress": chapter_progress,
        "overall_progress": round((len(completed) / TOTAL_LESSONS * 100), 1) if TOTAL_LESSONS > 0 else 0.0,
    }


@api_router.post("/admin/make-admin")
async def make_admin(data: AccessAction, admin: dict = Depends(require_admin)):
    """Jadikan user lain sebagai admin."""
    await db.users.update_one({"id": data.user_id}, {"$set": {"is_admin": True, "has_access": True}})
    return {"ok": True}


# ── Feedback ──────────────────────────────────────────────────────────────────

class FeedbackCreate(BaseModel):
    chapter_id: int
    answers: dict      # { "question_key": "answer_label" }
    comment: str = ""

class FeedbackOut(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_email: str
    chapter_id: int
    chapter_name: str
    answers: dict
    comment: str
    created_at: str

CHAPTER_NAMES_MAP = {
    1: "Mindset", 2: "Nutrisi", 3: "Masak",
    4: "Build Your Muscle", 5: "Workout Program", 6: "Final", 7: "Gym Myth",
}

@api_router.post("/feedback")
async def submit_feedback(data: FeedbackCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    await db.feedback.update_one(
        {"user_id": current_user["id"], "chapter_id": data.chapter_id},
        {"$set": {
            "user_id": current_user["id"],
            "user_name": current_user.get("name", ""),
            "user_email": current_user.get("email", ""),
            "chapter_id": data.chapter_id,
            "chapter_name": CHAPTER_NAMES_MAP.get(data.chapter_id, "Overall"),
            "answers": data.answers,
            "comment": data.comment,
            "updated_at": now,
        }, "$setOnInsert": {"id": str(uuid.uuid4()), "created_at": now}},
        upsert=True,
    )
    return {"ok": True}


@api_router.get("/feedback/me")
async def get_my_feedback(current_user: dict = Depends(get_current_user)):
    """Ambil semua feedback milik user yang login."""
    docs = await db.feedback.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    return {str(d["chapter_id"]): {"answers": d.get("answers", {}), "comment": d.get("comment", "")} for d in docs}


@api_router.get("/admin/feedback")
async def admin_get_feedback(admin: dict = Depends(require_admin)):
    """Semua feedback dari semua user."""
    docs = await db.feedback.find({}, {"_id": 0}).to_list(10000)
    return docs


@api_router.get("/admin/feedback/export")
async def admin_export_feedback(admin: dict = Depends(require_admin)):
    """Download semua feedback sebagai file Excel."""
    docs = await db.feedback.find({}, {"_id": 0}).to_list(10000)
    if not docs:
        rows = [{"user_name": "", "user_email": "", "chapter_id": "", "chapter_name": "", "rating": "", "comment": "", "created_at": ""}]
    else:
        rows = []
        for d in docs:
            row = {
                "Nama": d.get("user_name", ""),
                "Email": d.get("user_email", ""),
                "Chapter": d.get("chapter_name", ""),
                "Komentar": d.get("comment", ""),
                "Tanggal": d.get("created_at", ""),
            }
            for q, a in (d.get("answers") or {}).items():
                row[q] = a
            rows.append(row)

    df = pd.DataFrame(rows)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Feedback")
    output.seek(0)

    filename = f"feedback_3pmsystem_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


# ── Broadcast Email ───────────────────────────────────────────────────────────

class BroadcastRequest(BaseModel):
    subject: str
    body: str  # plain text or HTML


def _broadcast_email_html(name: str, subject: str, body: str) -> str:
    body_html = body.replace('\n', '<br>')
    return f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#111111;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#1A1A1A;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
    <div style="background:#f97316;padding:24px 32px;">
      <h1 style="margin:0;color:#000;font-size:20px;font-weight:900;">3PM System</h1>
      <p style="margin:4px 0 0;color:rgba(0,0,0,0.6);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Train. Eat. Sleep.</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#a3a3a3;font-size:14px;margin:0 0 20px;">Halo, <strong style="color:#fff;">{name}</strong> 👋</p>
      <div style="color:#d4d4d4;font-size:14px;line-height:1.8;margin:0 0 28px;">{body_html}</div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
      <p style="color:#525252;font-size:11px;margin:0;">Email ini dikirim dari 3PM System Admin. Jangan reply email ini.</p>
    </div>
  </div>
</body>
</html>
"""


@api_router.post("/admin/broadcast-email")
async def broadcast_email(data: BroadcastRequest, admin: dict = Depends(require_admin)):
    """Send email to all registered users."""
    users = await db.users.find({}, {"_id": 0, "email": 1, "name": 1}).to_list(5000)
    if not users:
        raise HTTPException(status_code=404, detail="Tidak ada user terdaftar.")

    sent, failed = 0, 0
    errors = []
    for u in users:
        if u["email"].lower() == SMTP_USER.lower():
            continue  # skip sender's own email
        try:
            await _send_email_async(
                u["email"],
                data.subject,
                _broadcast_email_html(u.get("name", "Member"), data.subject, data.body)
            )
            sent += 1
        except Exception as e:
            failed += 1
            errors.append(f"{u['email']}: {str(e)[:80]}")
            logging.error(f"Broadcast error to {u['email']}: {e}")

    return {
        "sent": sent,
        "failed": failed,
        "total": len(users),
        "errors": errors[:10],  # return max 10 error samples
    }


# ── Health ────────────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "3PM System API is running"}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
