import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Tabs, Tab, Typography, Container, Paper } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth(); // Check if the user is logged in
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    // Redirect logged-in users to the dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

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
                    variant="h3"
                    style={{
                        fontWeight: "bold",
                        color: "#333",
                    }}
                >
                    Floma Collaborative Tool Hub
                </Typography>
            </Box>

            {/* Content */}
            <Container maxWidth="sm" style={{ flexGrow: 1, marginTop: "20px" }}>
                <Paper
                    elevation={3}
                    style={{
                        padding: "30px",
                        textAlign: "center",
                        backgroundColor: "white",
                        borderRadius: "8px",
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Login" style={{ fontWeight: "bold" }} />
                        <Tab label="Register" style={{ fontWeight: "bold" }} />
                    </Tabs>
                    <Box marginTop={3}>
                        {tabIndex === 0 && <Login />}
                        {tabIndex === 1 && <Register />}
                    </Box>
                </Paper>
            </Container>

            {/* Footer */}
            <Box
                style={{
                    textAlign: "center",
                    padding: "10px",
                    backgroundColor: "#f4f4f4",
                    borderTop: "1px solid #ccc",
                }}
            >
                <Typography variant="body2" style={{ color: "#666" }}>
                    © 2024 Collaborative Tool Hub
                </Typography>
            </Box>
        </div>
    );
};

export default Home;
