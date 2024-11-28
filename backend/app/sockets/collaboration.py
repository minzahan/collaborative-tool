import socketio
from app.db.db_client import get_mongo_client
from app.repositories.document_repository import DocumentRepository

# Create a Socket.IO server instance
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
socket_app = socketio.ASGIApp(sio)

# In-memory tracking of active sessions
active_sessions = {}

# Initialize MongoDB client and repository
client = get_mongo_client()
db = client["collaborative_tool"]
document_repo = DocumentRepository(db)

@sio.event
async def connect(sid, environ):
    """Handle client connection."""
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    """Handle client disconnection."""
    print(f"Client disconnected: {sid}")

@sio.event
async def create_session(sid, data):
    """Handle collaboration session creation."""
    owner = data.get("owner")
    document_name = data.get("document_name")

    if not owner or not document_name:
        await sio.emit("error", {"message": "Owner and document name are required."}, to=sid)
        return

    document = document_repo.create_document(name=document_name, owner=owner)

    # Track the session in-memory
    active_sessions[document.id] = {"owner": owner, "participants": [owner]}
    await sio.enter_room(sid, document.id)

    # Emit confirmation to the creator
    await sio.emit("session_created", {"document_id": document.id, "owner": owner}, to=sid)

@sio.event
async def join_session(sid, data):
    """Handle a participant joining a session."""
    username = data.get("username")
    document_id = data.get("document_id")

    if not username or not document_id:
        await sio.emit("error", {"message": "Invalid data provided."}, to=sid)
        return

    if document_id not in active_sessions:
        await sio.emit("error", {"message": "Session does not exist."}, to=sid)
        return

    # Add the user to the in-memory session
    if username not in active_sessions[document_id]["participants"]:
        active_sessions[document_id]["participants"].append(username)

    await sio.enter_room(sid, document_id)

    # Update the document's active participants in MongoDB
    document_repo.update_active_participants(document_id, username)

    # Notify all participants about the updated list
    await sio.emit(
        "participant_update",
        {
            "document_id": document_id,
            "owner": active_sessions[document_id]["owner"],
            "participants": active_sessions[document_id]["participants"],
        },
        room=document_id
    )

@sio.event
async def get_session_info(sid, data):
    """Send session info to a participant."""
    document_id = data.get("document_id")

    if not document_id or document_id not in active_sessions:
        await sio.emit("error", {"message": "Session not found."}, to=sid)
        return

    document = document_repo.get_document_by_id(document_id)
    if not document:
        await sio.emit("error", {"message": "Document not found in the database."}, to=sid)
        return

    # Send session info to the participant
    await sio.emit(
        "session_info",
        {
            "document_id": document_id,
            "name": document.name,
            "owner": document.owner,
            "participants": document.active_participants,
            "content": document.content,
        },
        to=sid
    )
    

@sio.event
async def content_update(sid, data):
    """
    Handle content updates from a participant.
    """
    document_id = data.get("document_id")
    new_content = data.get("content")

    if not document_id or new_content is None:
        await sio.emit("error", {"message": "Invalid data provided."}, to=sid)
        return

    try:
        # Update content in MongoDB
        document_repo.update_content(document_id, new_content)

        # Broadcast the updated content to all participants
        await sio.emit("content_update", {"document_id": document_id, "content": new_content}, room=document_id)
    except ValueError as e:
        await sio.emit("error", {"message": str(e)}, to=sid)

@sio.event
async def end_session(sid, data):
    """
    Handle ending a collaboration session.
    """
    document_id = data.get("document_id")
    owner = data.get("owner")

    if not document_id or not owner:
        return {"success": False, "error": "Invalid data provided."}

    # Validate ownership
    session = active_sessions.get(document_id)
    if not session or session["owner"] != owner:
        return {"success": False, "error": "Only the session owner can end the session."}

    # Move active participants to collaborators in MongoDB
    document_repo.add_collaborators(document_id, session["participants"])

    # Update the document to mark it as inactive
    document_repo.mark_session_inactive(document_id)

    # Notify all participants
    await sio.emit("session_ended", {"document_id": document_id}, room=document_id)

    # Remove session from in-memory tracking
    del active_sessions[document_id]

    # Disconnect all participants
    await sio.close_room(document_id)

    return {"success": True}


@sio.event
async def leave_session(sid, data):
    """Handle a participant leaving a session."""
    document_id = data.get("document_id")
    username = data.get("username")

    if not document_id or not username:
        return {"success": False, "error": "Invalid data provided."}

    # Ensure the session exists
    session = active_sessions.get(document_id)
    if not session:
        return {"success": False, "error": "Session does not exist."}

    # Remove the user from the in-memory session
    if username in session["participants"]:
        session["participants"].remove(username)

    # Update MongoDB
    document_repo.remove_active_participant(document_id, username)

    # Notify remaining participants
    await sio.emit(
        "participant_update",
        {
            "document_id": document_id,
            "owner": session["owner"],
            "participants": session["participants"],
        },
        room=document_id
    )

    # Remove the user from the room
    await sio.leave_room(sid, document_id)

    return {"success": True}

