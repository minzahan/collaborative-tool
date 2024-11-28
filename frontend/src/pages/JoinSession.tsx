import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";

const JoinSession: React.FC = () => {
    const { user } = useAuth();
    const { socket, connect } = useWebSocket();
    const navigate = useNavigate();

    const [documentId, setDocumentId] = useState<string>("");
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleParticipantUpdate = (data: { document_id: string }) => {
            if (data.document_id === documentId) {
                setIsJoining(false);
                navigate(`/collaborate/${documentId}`);
            }
        };

        const handleError = (error: { message: string }) => {
            console.error(error.message);
            alert(error.message);
            setIsJoining(false);
        };

        socket.on("participant_update", handleParticipantUpdate);
        socket.on("error", handleError);

        return () => {
            socket.off("participant_update", handleParticipantUpdate);
            socket.off("error", handleError);
        };
    }, [socket, documentId, navigate]);

    const handleJoinSession = async () => {
        if (!documentId) {
            alert("Document ID is required!");
            return;
        }
    
        if (!user?.username) {
            alert("You must be logged in to join a session!");
            return;
        }
    
        setIsJoining(true);
    
        try {
            const connectedSocket = await connect(); // Wait for the socket to connect
            connectedSocket.emit(
                "join_session",
                { username: user.username, document_id: documentId },
                (response: { error?: string }) => {
                    if (response?.error) {
                        alert(response.error);
                        setIsJoining(false);
                    } else {
                        // Navigate to the collaboration page if successful
                        navigate(`/collaborate/${documentId}`);
                    }
                }
            );
        } catch (error) {
            console.error("Socket connection error", error);
            alert("Failed to connect to the server. Please try again.");
            setIsJoining(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Header */}
            <Box
                style={{
                    textAlign: "center",
                    padding: "20px",
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <Typography
                    variant="h5"
                    style={{
                        fontWeight: "bold",
                        color: "#333",
                    }}
                >
                    Join a Collaboration Session{user?.username ? `, ${user.username}` : ""}
                </Typography>
            </Box>

            {/* Content */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexGrow={1}
                style={{ backgroundColor: "#f4f4f4", borderRadius: "8px", padding: "20px" }}
            >
                <Paper
                    elevation={3}
                    style={{
                        padding: "30px",
                        textAlign: "center",
                        width: "400px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                    }}
                >
                    <Typography
                        variant="h6"
                        style={{
                            fontWeight: "bold",
                            marginBottom: "20px",
                            color: "#555",
                        }}
                    >
                        Enter Session ID
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Document ID"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                        disabled={isJoining} // Disable input during join
                        style={{ marginBottom: "20px" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            padding: "10px",
                        }}
                        onClick={handleJoinSession}
                        disabled={isJoining}
                    >
                        {isJoining ? "Joining..." : "Join Session"}
                    </Button>
                </Paper>
            </Box>

            {/* Logout Button */}
            <Box
                display="flex"
                justifyContent="center"
                style={{ padding: "20px", backgroundColor: "#fff", borderTop: "1px solid #ccc" }}
            >
                <Button
                    variant="text"
                    color="secondary"
                    style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </div>
    );
};

export default JoinSession;
