from pymongo.collection import Collection
from typing import Any, Dict, Optional

class BaseRepository:
    def __init__(self, collection: Collection):
        self.collection = collection

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return self.collection.find_one(query)

    def find_many(self, query: Dict[str, Any]) -> list[Dict[str, Any]]:
        return list(self.collection.find(query))

    def insert_one(self, data: Dict[str, Any]) -> Any:
        return self.collection.insert_one(data)

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False) -> Any:
        return self.collection.update_one(query, update, upsert=upsert)

    def delete_one(self, query: Dict[str, Any]) -> Any:
        return self.collection.delete_one(query)

    def count(self, query: Dict[str, Any]) -> int:
        return self.collection.count_documents(query)