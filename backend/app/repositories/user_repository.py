from pymongo.database import Database
from app.repositories.base_repository import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self, db: Database):
        super().__init__(db["users"])

    def find_by_username(self, username: str):
        return self.find_one({"username": username})

    def create_user(self, username: str, password: str):
        self.insert_one({"username": username, "password": password})
