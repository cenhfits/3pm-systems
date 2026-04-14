import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(Path(__file__).parent / '.env')

async def main():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]

    email = input("Masukkan email akun yang mau dijadikan admin: ").strip()

    result = await db.users.update_one(
        {"email": email},
        {"$set": {"is_admin": True, "has_access": True}}
    )

    if result.matched_count == 0:
        print(f"❌ User dengan email '{email}' tidak ditemukan.")
    else:
        print(f"✅ Berhasil! {email} sekarang sudah admin dan punya akses course.")

    client.close()

asyncio.run(main())
