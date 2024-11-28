import React, { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketContextType {
    socket: Socket | null;
    connect: () => Promise<Socket>;
    emit: (event: string, data: Record<string, unknown>, callback?: (response: any) => void) => void;
    disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const connect = (): Promise<Socket> => {
        return new Promise((resolve, reject) => {
            if (socket?.connected) {
                resolve(socket); // If already connected, resolve immediately
                return;
            }
    
            const newSocket = io("http://localhost:8000");
            setSocket(newSocket); // Set the socket in state
    
            newSocket.on("connect", () => {
                console.log("Socket connected!");
                resolve(newSocket); // Resolve when connected
            });
    
            newSocket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                reject(err); // Reject on connection error
            });
        });
    };

    const emit = (event: string, data: Record<string, unknown>, callback?: (response: any) => void) => {
        if (socket) {
            socket.emit(event, data, callback);
        } else {
            console.error("Socket not connected.");
        }
    };

    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        // Cleanup socket on unmount
        return () => {
            disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, connect, emit, disconnect }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};
