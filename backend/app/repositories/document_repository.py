import uuid
from pymongo.database import Database
from app.models.document import Document
from app.repositories.base_repository import BaseRepository
from typing import Optional, List
from datetime import datetime, timezone
from fastapi import Depends


class DocumentRepository(BaseRepository):
    def __init__(self, db: Database = Depends()):
        super().__init__(db["documents"])

    def create_document(self, name: str, owner: str) -> Document:
        document_id = str(uuid.uuid4())

        document = Document(
            id=document_id,
            name=name,
            owner=owner,
            collaborators=[],
            active_participants=[owner],
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        self.insert_one(document.dict(by_alias=True))
        return document

    def get_document_by_id(self, document_id: str) -> Optional[Document]:
        data = self.find_one({"_id": document_id})
        return Document(**data) if data else None

    def update_active_participants(self, document_id: str, username: str) -> None:
        """
        Add a participant to the active_participants array if not already present.
        """
        result = self.update_one(
            {"_id": document_id},
            {
                "$addToSet": {"active_participants": username},
                "$set": {"updated_at": datetime.now(timezone.utc)}  # Always update the timestamp
            }
        )
        if result.matched_count == 0:
            raise ValueError(f"Document with ID {document_id} not found.")


    def remove_active_participant(self, document_id: str, username: str) -> bool:
        """
        Remove a username from the active participants of the document.
        """
        result = self.update_one(
            {"_id": document_id},
            {"$pull": {"active_participants": username}, "$set": {"updated_at": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

    def update_content(self, document_id: str, content: str) -> None:
        """
        Update the content of a document.
        """
        result = self.update_one(
            {"_id": document_id},
            {
                "$set": {
                    "content": content,
                    "updated_at": datetime.now(timezone.utc),
                }
            }
        )
        if result.matched_count == 0:
            raise ValueError(f"Document with ID {document_id} not found.")

    def mark_session_inactive(self, document_id: str) -> None:
        """
        Mark a document's session as inactive.
        """
        result = self.update_one(
            {"_id": document_id},
            {"$set": {"is_active": False, "active_participants": [], "updated_at": datetime.now(timezone.utc)}},
        )
        if result.matched_count == 0:
            raise ValueError(f"Document with ID {document_id} not found.")
    
    def add_collaborators(self, document_id: str, participants: List[str]) -> None:
        self.update_one(
            {"_id": document_id},
            {
                "$addToSet": {"collaborators": {"$each": participants}},  # Add participants to collaborators
                "$set": {"updated_at": datetime.now(timezone.utc)}
            }
        )
    
    def get_active_sessions(self) -> List[Document]:
        data = self.find_many({"is_active": True})
        return [Document(**doc) for doc in data]
