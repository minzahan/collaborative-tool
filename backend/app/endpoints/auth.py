from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database
from datetime import timedelta
from app.models.auth import LoginRequest, RegisterRequest, TokenResponse, UserBase
from app.db.db_client import get_database
from app.repositories.user_repository import UserRepository
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=dict)
def register_user(request: RegisterRequest, db: Database = Depends(get_database)):
    user_repo = UserRepository(db)

    # Check if username already exists
    if user_repo.find_by_username(request.username):
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password and create the user
    hashed_password = hash_password(request.password)
    user_repo.create_user(request.username, hashed_password)

    return {"message": "User registered successfully"}


@router.post("/login", response_model=TokenResponse)
def login_user(request: LoginRequest, db: Database = Depends(get_database)):
    user_repo = UserRepository(db)

    # Find the user by username
    user = user_repo.find_by_username(request.username)
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generate access token
    access_token = create_access_token({"sub": request.username}, timedelta(minutes=30))

    # Return token and user details
    return TokenResponse(
        access_token=access_token,
        token_type="Bearer",
        user=UserBase(username=user["username"]),
    )
