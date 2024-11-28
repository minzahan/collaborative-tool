import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { registerUser } from "../api/auth";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const handleRegister = async () => {
        setErrors({});
        setMessage("");

        let hasError = false;

        // Normalize username to lowercase for case-insensitivity
        const normalizedUsername = username.trim().toLowerCase();

        // Validate username
        if (normalizedUsername.length < 3 || normalizedUsername.length > 50) {
            setErrors((prev) => ({
                ...prev,
                username: "Username must be between 3 and 50 characters.",
            }));
            hasError = true;
        }

        // Validate password
        if (password.length < 6) {
            setErrors((prev) => ({
                ...prev,
                password: "Password must be at least 6 characters long.",
            }));
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await registerUser(normalizedUsername, password);
            setMessage("Registration successful! Please login");
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Create a New Account
            </Typography>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
                style={{ marginTop: "10px" }}
            >
                Register
            </Button>
            {message && (
                <Typography
                    variant="body2"
                    color={message.includes("successful") ? "primary" : "error"}
                    style={{ marginTop: "10px" }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Register;
