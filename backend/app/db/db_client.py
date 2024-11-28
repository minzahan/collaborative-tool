from pymongo import MongoClient
from pymongo.database import Database
from fastapi import Depends

# Hardcoded MongoDB URI and database name
MONGO_URI = "mongodb://root:rootpassword@mongodb:27017"
DATABASE_NAME = "collaborative_tool"

def get_mongo_client() -> MongoClient:
    """
    Provides a thread-safe MongoDB client.
    Uses a singleton pattern to ensure only one client instance is created per process.
    """
    return MongoClient(MONGO_URI)

def get_database(client: MongoClient = Depends(get_mongo_client)) -> Database:
    """
    Provides the specified MongoDB database.
    Injects the client dependency into the database context.
    """
    return client[DATABASE_NAME]
