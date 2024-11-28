from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., example="test_user", min_length=3, max_length=50)
    # Email in the future

class LoginRequest(UserBase):
    password: str = Field(..., example="secure_password", min_length=6)

class RegisterRequest(UserBase):
    password: str = Field(..., example="secure_password", min_length=6)

class TokenResponse(BaseModel):
    access_token: str = Field(..., example="your_jwt_token")
    token_type: str = Field(default="Bearer", example="Bearer")
    user: Optional[UserBase] = None  # Embed user details in the response if needed
