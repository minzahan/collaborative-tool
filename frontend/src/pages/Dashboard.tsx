import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleCreateSession = () => {
        navigate("/create-session");
    };

    const handleJoinSession = () => {
        navigate("/join-session");
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
                    Welcome to Your Dashboard{user?.username ? `, ${user.username}` : ""}
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
                        width: "300px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                    }}
                >
                    {/* Create Session Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{
                            margin: "10px 0",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                        onClick={handleCreateSession}
                    >
                        Create Collaboration Session
                    </Button>

                    {/* Join Session Button */}
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                        onClick={handleJoinSession}
                    >
                        Join Collaboration Session
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
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </div>
    );
};

export default Dashboard;
