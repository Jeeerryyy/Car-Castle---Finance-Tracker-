"""Idempotent seeding of the 3 admin accounts + baseline settings."""
import os
from datetime import datetime, timezone
from auth import hash_password, verify_password
from models import new_id


async def seed(db):
    accounts = [
        {
            "email": os.environ["SUPER_ADMIN_EMAIL"],
            "password": os.environ["SUPER_ADMIN_PASSWORD"],
            "name": "Super Admin",
            "role": "super_admin",
        },
        {
            "email": os.environ["OP1_EMAIL"],
            "password": os.environ["OP1_PASSWORD"],
            "name": "Operator One",
            "role": "operator",
        },
        {
            "email": os.environ["OP2_EMAIL"],
            "password": os.environ["OP2_PASSWORD"],
            "name": "Operator Two",
            "role": "operator",
        },
    ]

    for acc in accounts:
        existing = await db.users.find_one({"email": acc["email"]})
        if existing is None:
            await db.users.insert_one({
                "id": new_id(),
                "email": acc["email"],
                "name": acc["name"],
                "role": acc["role"],
                "password_hash": hash_password(acc["password"]),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        else:
            # Keep hash in sync if password in .env changed
            if not verify_password(acc["password"], existing["password_hash"]):
                await db.users.update_one(
                    {"email": acc["email"]},
                    {"$set": {"password_hash": hash_password(acc["password"]),
                              "role": acc["role"], "name": acc["name"]}},
                )
            elif existing.get("role") != acc["role"]:
                await db.users.update_one(
                    {"email": acc["email"]},
                    {"$set": {"role": acc["role"]}},
                )

    # Seed settings singleton
    existing_settings = await db.settings.find_one({"id": "default"})
    if not existing_settings:
        savings = float(os.environ.get("SAVINGS_PERCENT", "10"))
        await db.settings.insert_one({
            "id": "default",
            "savings_percent": savings,
            "reminder_template_owner": "Namaste {name}, this is a reminder that ₹{amount} is pending from Car Castle Goa. Please share settlement details when convenient.",
            "reminder_template_agent": "Hi {name}, ₹{amount} is pending against your recent transfer job. Please confirm payment receipt.",
            "reminder_template_transfer": "Transfer update — Booking {booking_id} is now {status}.",
            "reminder_interval_days": 3,
        })


async def create_indexes(db):
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.bookings.create_index("id", unique=True)
    await db.bookings.create_index("created_at")
    await db.bookings.create_index("start_date")
    await db.car_owners.create_index("id", unique=True)
    await db.agents.create_index("id", unique=True)
    await db.cars.create_index("id", unique=True)
    await db.cars.create_index("registration_no", unique=True)
    await db.ledger.create_index("id", unique=True)
    await db.ledger.create_index([("entity_type", 1), ("entity_id", 1)])
    await db.activity_logs.create_index("created_at")
    await db.rate_history.create_index([("entity_type", 1), ("entity_id", 1)])
