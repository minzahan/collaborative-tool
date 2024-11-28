import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";

const CreateSession: React.FC = () => {
    const { user } = useAuth();
    const { connect, socket } = useWebSocket();
    const navigate = useNavigate();
    const [documentName, setDocumentName] = useState("");

    useEffect(() => {
        if (!socket) return;

        // Clean up event handlers to avoid duplicates
        socket.off("session_created");
        socket.off("error");

        socket.on("session_created", (data) => {
            const { document_id } = data;
            navigate(`/collaborate/${document_id}`);
        });

        socket.on("error", (error) => {
            console.error(error.message);
            alert(error.message);
        });

        return () => {
            socket.off("session_created");
            socket.off("error");
        };
    }, [socket, navigate]);

    const handleCreateSession = async () => {
        if (!documentName) {
            alert("Document name is required!");
            return;
        }
    
        if (!user?.username) {
            alert("You must be logged in to create a session!");
            return;
        }
    
        try {
            const connectedSocket = await connect(); // Wait for the socket to connect
            connectedSocket.emit("create_session", { owner: user.username, document_name: documentName });
        } catch (error) {
            console.error("Socket connection failed:", error);
            alert("Socket connection failed! Please try again.");
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
                    Create a Collaboration Session{user?.username ? `, ${user.username}` : ""}
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
                        Enter a Document Name
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Enter document name"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
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
                        onClick={handleCreateSession}
                    >
                        Create Session
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

export default CreateSession;
