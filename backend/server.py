from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
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
    access_expires_at: Optional[str] = None

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

def _check_access(user: dict) -> bool:
    """Returns True if user has valid (non-expired) access."""
    if user.get("is_admin"):
        return True
    if not user.get("has_access", False):
        return False
    expires = user.get("access_expires_at")
    if expires:
        try:
            exp_dt = datetime.fromisoformat(expires)
            if exp_dt.tzinfo is None:
                exp_dt = exp_dt.replace(tzinfo=timezone.utc)
            if datetime.now(timezone.utc) > exp_dt:
                return False
        except Exception:
            pass
    return True

def parse_user_out(user: dict) -> UserOut:
    created_at = user.get("created_at")
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    return UserOut(**{**user, "created_at": created_at, "has_access": _check_access(user)})

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
    access_expires_at: Optional[str] = None

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
            has_access=_check_access(u),
            is_admin=u.get("is_admin", False),
            created_at=created_at,
            overall_progress=overall,
            completed_lessons=len(completed),
            access_expires_at=u.get("access_expires_at"),
        ))
    return result


class AccessGrantRequest(BaseModel):
    user_id: str
    duration: str = 'lifetime'  # '3months', '6months', '1year', 'lifetime'

@api_router.post("/admin/grant-access")
async def grant_access(data: AccessGrantRequest, admin: dict = Depends(require_admin)):
    now = datetime.now(timezone.utc)
    if data.duration == '3months':
        expires = (now + timedelta(days=90)).isoformat()
    elif data.duration == '6months':
        expires = (now + timedelta(days=180)).isoformat()
    elif data.duration == '1year':
        expires = (now + timedelta(days=365)).isoformat()
    else:
        expires = None
    update = {"has_access": True, "access_expires_at": expires}
    result = await db.users.update_one({"id": data.user_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return {"ok": True, "expires_at": expires}


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
    target: str = 'all'  # 'all', 'has_access', 'no_access'


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
    """Send email to users filtered by access status."""
    query: dict = {}
    if data.target == 'has_access':
        query["has_access"] = True
    elif data.target == 'no_access':
        query["has_access"] = False
    users = await db.users.find(query, {"_id": 0, "email": 1, "name": 1}).to_list(5000)
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


# ── Chapter Management ────────────────────────────────────────────────────────

COLOR_THEMES = {
    'orange': {'color': 'from-orange-500/20 to-orange-500/5', 'accent': 'text-orange-400', 'border': 'border-orange-500/30', 'badge': 'bg-orange-500/20 text-orange-400'},
    'purple': {'color': 'from-purple-500/20 to-purple-500/5', 'accent': 'text-purple-400', 'border': 'border-purple-500/30', 'badge': 'bg-purple-500/20 text-purple-400'},
    'blue':   {'color': 'from-blue-500/20 to-blue-500/5',   'accent': 'text-blue-400',   'border': 'border-blue-500/30',   'badge': 'bg-blue-500/20 text-blue-400'},
    'green':  {'color': 'from-green-500/20 to-green-500/5', 'accent': 'text-green-400',  'border': 'border-green-500/30',  'badge': 'bg-green-500/20 text-green-400'},
    'red':    {'color': 'from-red-500/20 to-red-500/5',     'accent': 'text-red-400',    'border': 'border-red-500/30',    'badge': 'bg-red-500/20 text-red-400'},
    'cyan':   {'color': 'from-cyan-500/20 to-cyan-500/5',   'accent': 'text-cyan-400',   'border': 'border-cyan-500/30',   'badge': 'bg-cyan-500/20 text-cyan-400'},
    'yellow': {'color': 'from-yellow-500/20 to-yellow-500/5','accent': 'text-yellow-400','border': 'border-yellow-500/30', 'badge': 'bg-yellow-500/20 text-yellow-400'},
}

class StaticChapterConfigUpdate(BaseModel):
    visible: Optional[bool] = None
    locked: Optional[bool] = None
    coming_soon: Optional[bool] = None

class DynamicLessonData(BaseModel):
    id: Optional[str] = None
    type: str = 'video'
    title: str
    duration: str = '10 min'
    videoUrl: Optional[str] = None
    content: List[dict] = []
    visible: bool = True

class DynamicChapterCreate(BaseModel):
    title: str
    code: str
    icon_name: str = 'BookOpen'
    color_theme: str = 'orange'
    coming_soon: bool = False
    visible: bool = True
    lessons: List[DynamicLessonData] = []


@api_router.get("/chapters")
async def get_all_chapters():
    """Returns all visible chapters with full content (for Dashboard)."""
    chapters = await db.chapters.find(
        {"visible": {"$ne": False}}, {"_id": 0}
    ).sort("order", 1).to_list(200)
    return chapters


@api_router.get("/chapters-config")
async def get_chapters_config():
    """Legacy endpoint — kept for backward compat."""
    static_docs = await db.chapter_config.find({"type": "static"}, {"_id": 0}).to_list(50)
    static_configs = {str(d["chapter_id"]): d for d in static_docs}
    dynamic = await db.dynamic_chapters.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return {"static_configs": static_configs, "dynamic_chapters": dynamic}


@api_router.get("/admin/chapters")
async def admin_get_chapters(admin: dict = Depends(require_admin)):
    """Returns all chapters for admin panel (static + dynamic from chapters collection)."""
    chapters = await db.chapters.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    static_chapters = [c for c in chapters if c.get("type") == "static"]
    dynamic_chapters = [c for c in chapters if c.get("type") != "static"]
    return {"static_chapters": static_chapters, "dynamic_chapters": dynamic_chapters}


@api_router.get("/admin/chapters/detail/{chapter_id}")
async def admin_get_chapter_detail(chapter_id: str, admin: dict = Depends(require_admin)):
    """Get full chapter content for editing."""
    try:
        cid = int(chapter_id)
    except ValueError:
        cid = chapter_id
    chapter = await db.chapters.find_one({"id": cid}, {"_id": 0})
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter tidak ditemukan. Jalankan seed_chapters.py terlebih dahulu.")
    return chapter


@api_router.put("/admin/chapters/detail/{chapter_id}")
async def admin_update_chapter_detail(chapter_id: str, request: Request, admin: dict = Depends(require_admin)):
    """Full content update for any chapter (static or dynamic)."""
    data = await request.json()
    try:
        cid = int(chapter_id)
    except ValueError:
        cid = chapter_id
    data.pop("_id", None)
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.chapters.update_one(
        {"id": cid},
        {"$set": data},
        upsert=True,
    )
    return {"ok": True}


@api_router.patch("/admin/chapters/static/{chapter_id}")
async def admin_update_static_chapter(chapter_id: int, data: StaticChapterConfigUpdate, admin: dict = Depends(require_admin)):
    """Toggle visibility / locked / coming_soon for a built-in chapter."""
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        return {"ok": True}
    update_data.update({"chapter_id": chapter_id, "type": "static"})
    await db.chapter_config.update_one(
        {"chapter_id": chapter_id, "type": "static"},
        {"$set": update_data},
        upsert=True,
    )
    return {"ok": True}


@api_router.post("/admin/chapters/dynamic")
async def admin_create_dynamic_chapter(data: DynamicChapterCreate, admin: dict = Depends(require_admin)):
    """Create a new admin-defined chapter."""
    chapter_id = str(uuid.uuid4())
    lessons = []
    for i, lesson in enumerate(data.lessons):
        l = lesson.dict()
        if not l.get("id"):
            l["id"] = f"d{chapter_id[:6]}-{i+1}"
        lessons.append(l)
    last = await db.dynamic_chapters.find_one({}, sort=[("order", -1)])
    order = (last.get("order", 90) + 10) if last else 100
    doc = {
        "id": chapter_id,
        "title": data.title,
        "code": data.code,
        "icon_name": data.icon_name,
        "color_theme": data.color_theme,
        **COLOR_THEMES.get(data.color_theme, COLOR_THEMES["orange"]),
        "coming_soon": data.coming_soon,
        "visible": data.visible,
        "order": order,
        "lessons": lessons,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.dynamic_chapters.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/chapters/dynamic/{chapter_id}")
async def admin_update_dynamic_chapter(chapter_id: str, data: DynamicChapterCreate, admin: dict = Depends(require_admin)):
    """Update a dynamic chapter (full replace)."""
    existing = await db.dynamic_chapters.find_one({"id": chapter_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Chapter tidak ditemukan")
    lessons = []
    for i, lesson in enumerate(data.lessons):
        l = lesson.dict()
        if not l.get("id"):
            l["id"] = f"d{chapter_id[:6]}-{i+1}"
        lessons.append(l)
    update = {
        "title": data.title,
        "code": data.code,
        "icon_name": data.icon_name,
        "color_theme": data.color_theme,
        **COLOR_THEMES.get(data.color_theme, COLOR_THEMES["orange"]),
        "coming_soon": data.coming_soon,
        "visible": data.visible,
        "lessons": lessons,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.dynamic_chapters.update_one({"id": chapter_id}, {"$set": update})
    return {"ok": True}


@api_router.delete("/admin/chapters/dynamic/{chapter_id}")
async def admin_delete_dynamic_chapter(chapter_id: str, admin: dict = Depends(require_admin)):
    """Delete a dynamic chapter."""
    result = await db.dynamic_chapters.delete_one({"id": chapter_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chapter tidak ditemukan")
    return {"ok": True}


# ── Seed ─────────────────────────────────────────────────────────────────────

@api_router.post("/admin/seed-chapters")
async def seed_chapters(admin: dict = Depends(require_admin)):
    """Seed all static chapters to DB. Safe to run multiple times (upsert)."""
    from seed_chapters import CHAPTERS
    inserted, updated = 0, 0
    for ch in CHAPTERS:
        result = await db.chapters.update_one(
            {"id": ch["id"], "type": "static"},
            {"$set": ch},
            upsert=True,
        )
        if result.upserted_id:
            inserted += 1
        else:
            updated += 1
    total = await db.chapters.count_documents({})
    return {"ok": True, "inserted": inserted, "updated": updated, "total": total}


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
