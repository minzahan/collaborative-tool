import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const registerUser = async (username: string, password: string) => {
    return await axios.post(`${BASE_URL}/auth/register`, { username, password });
};

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
        return response.data;
    } catch (error: any) {
        console.error("API Login failed:", error.response || error.message);
        throw error;
    }
};

export const fetchWithAuth = async (url: string, token: string) => {
    return await axios.get(`${BASE_URL}${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
