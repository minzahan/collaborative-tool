from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Document(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    content: str = ""
    owner: str  # User who created the session
    collaborators: List[str] = []
    active_participants: List[str] = []
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True  # Allow the use of 'id' to populate '_id'
