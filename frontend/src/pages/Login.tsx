import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth";

const Login: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateInputs = (): boolean => {
        if (!username.trim()) {
            setMessage("Username is required.");
            return false;
        }
        if (!password.trim()) {
            setMessage("Password is required.");
            return false;
        }
        return true;
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(""); // Clear previous messages

        if (!validateInputs()) {
            return; // Do not proceed if inputs are invalid
        }

        setLoading(true);

        try {
            const response = await loginUser(username, password);
            const { access_token, user } = response; // Destructure response data
            login(access_token, user); // Store in AuthContext
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error: any) {
            console.error("Login failed:", error);

            if (error.response && error.response.data) {
                setMessage(error.response.data.detail || "Invalid credentials. Please try again.");
            } else {
                setMessage("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Login to Your Account
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!message && username.trim() === ""}
                    helperText={!!message && username.trim() === "" ? "Username is required" : ""}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!message && password.trim() === ""}
                    helperText={!!message && password.trim() === "" ? "Password is required" : ""}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "10px" }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </form>
            {message && (
                <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Login;
