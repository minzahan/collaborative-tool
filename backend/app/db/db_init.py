from pymongo.database import Database
from datetime import datetime, timezone

def initialize_database(db: Database):
    """Initialize MongoDB with collections and seed data."""
    collections = db.list_collection_names()
    if "users" not in collections:
        db.create_collection("users")
        print("Created 'users' collection")
    if "documents" not in collections:
        db.create_collection("documents")
        print("Created 'documents' collection")

    # Seed data
    db["users"].update_one(
        {"username": "test_user"},
        {"$set": {"username": "test_user", "password": "hashed_password"}},
        upsert=True,
    )
    db["documents"].update_one(
        {"name": "Sample Document"},
        {
            "$set": {
                "_id": "c99d3e5b-9ee0-4388-8a5d-3dd92f02c45f",
                "name": "Sample Document",
                "content": "Welcome to the collaborative tool!",
                "owner": "test_user",
                "collaborators": [],  # List of users who have access to this document
                "active_participants": [],  # List of users currently in an active session
                "is_active": False,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )
    print("Database initialization complete")

