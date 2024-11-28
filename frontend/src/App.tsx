import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home"; // Import the Home component
import CreateSession from "./pages/CreateSession"; // Import the CreateSession component
import JoinSession from "./pages/JoinSession"; // Import the JoinSession component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import CollaborativeEditor from "./pages/CollaborationEditor";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <WebSocketProvider>
                <Router>
                    <Routes>
                        {/* Default Home */}
                        <Route path="/" element={<Home />} />

                        {/* Protected Dashboard */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Create Session - Protected */}
                        <Route
                            path="/create-session"
                            element={
                                <ProtectedRoute>
                                    <CreateSession />
                                </ProtectedRoute>
                            }
                        />

                        {/* Join Session - Protected */}
                        <Route
                            path="/join-session"
                            element={
                                <ProtectedRoute>
                                    <JoinSession />
                                </ProtectedRoute>
                            }
                        />

                        {/* Collaborate - Protected */}
                        <Route
                            path="/collaborate/:document_id"
                            element={
                                <ProtectedRoute>
                                    <CollaborativeEditor />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch-All Redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </WebSocketProvider>
        </AuthProvider>
    );
};

export default App;
