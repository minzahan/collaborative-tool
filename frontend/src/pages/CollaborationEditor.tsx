import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";

interface SessionInfo {
    document_id: string;
    name: string;
    owner: string;
    participants: string[];
    content: string;
}

const CollaborativeEditor: React.FC = () => {
    const { document_id } = useParams<{ document_id: string }>();
    const { user } = useAuth();
    const { socket } = useWebSocket();
    const navigate = useNavigate();

    const [content, setContent] = useState<string>("");
    const [owner, setOwner] = useState<string | null>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [documentName, setDocumentName] = useState<string>("");

    useEffect(() => {
        if (!socket || !document_id || !user?.username) return;

        socket.emit("join_session", { document_id, username: user.username });

        socket.emit("get_session_info", { document_id });

        // Listen for the session_info event
        const handleSessionInfo = (data: SessionInfo) => {
            console.log("Session Info Received:", data);
            setOwner(data.owner);
            setParticipants(data.participants.filter((participant) => participant !== data.owner));
            setContent(data.content || "");
            setDocumentName(data.name || "Untitled Document");
        };

        // Listen for participant updates
        const handleParticipantUpdate = (data: { owner: string; participants: string[] }) => {
            setOwner(data.owner);
            setParticipants(data.participants.filter((participant) => participant !== data.owner));
        };

        // Listen for content updates
        const handleContentUpdate = (data: { document_id: string; content: string }) => {
            if (data.document_id === document_id) {
                setContent(data.content); // Update content
            }
        };

        // Listen for session ending
        const handleSessionEnd = (data: { document_id: string }) => {
            if (data.document_id === document_id) {
                navigate("/dashboard");
            }
        };

        // Add Socket.IO listeners
        socket.on("session_info", handleSessionInfo);
        socket.on("participant_update", handleParticipantUpdate);
        socket.on("content_update", handleContentUpdate);
        socket.on("session_ended", handleSessionEnd);

        socket.on("error", (error) => {
            console.error(error.message);
            alert(error.message);
        });

        // Cleanup listeners on component unmount
        return () => {
            socket.emit("leave_session", { document_id, username: user.username });
            socket.off("session_info", handleSessionInfo);
            socket.off("participant_update", handleParticipantUpdate);
            socket.off("content_update", handleContentUpdate);
            socket.off("session_ended", handleSessionEnd);
        };
    }, [socket, document_id, user?.username, navigate]);

    // Handle content changes
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);

        // Emit content update to the server
        socket?.emit("content_update", { document_id, content: newContent });
    };

    // Handle session ending
    const handleEndSession = () => {
        if (owner !== user?.username) {
            alert("Only the session owner can end the session.");
            return;
        }

        socket?.emit("end_session", { document_id, owner: user.username });
    };

    // Handle leaving the session
    const handleLeaveSession = () => {
        socket?.emit("leave_session", { document_id, username: user?.username }, () => {
            navigate("/dashboard"); // Redirect user to the dashboard
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "20px", padding: "20px" }}>
            {/* Editor Section */}
            <div style={{ flex: 3 }}>
                <h1>Collaborative Editor</h1>
                <p><strong>Document Name:</strong> {documentName}</p> {/* Display document name */}
                <p><strong>Session ID:</strong> {document_id}</p> {/* Display session ID */}
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    style={{ width: "100%", height: "300px" }}
                />
                {owner === user?.username && (
                    <button onClick={handleEndSession} style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}>
                        End Session
                    </button>
                )}
            </div>

            {/* Participants Section */}
            <div style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
                <h2>Session Info</h2>
                <p><strong>Owner:</strong> {owner || "Loading..."}</p>

                <h2>Participants</h2>
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                    ))}
                </ul>
                {user?.username !== owner && (
                    <button onClick={handleLeaveSession} style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}>
                        Leave Session
                    </button>
                )}
            </div>
        </div>
    );
};

export default CollaborativeEditor;
