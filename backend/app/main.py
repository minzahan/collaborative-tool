from fastapi import FastAPI
from app.db.db_client import get_mongo_client
from app.db.db_init import initialize_database
from app.endpoints import auth
from app.sockets.collaboration import socket_app
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/socket.io", socket_app)

@app.on_event("startup")
def startup_event():
    """Run database initialization on app startup."""
    client = get_mongo_client()
    db = client["collaborative_tool"]
    initialize_database(db)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Backend is connected to MongoDB and initialized!"}

