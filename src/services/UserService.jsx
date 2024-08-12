// src/services/UserService.js
const API_URL = 'http://localhost:8080';

export const registerUser = async (username) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        return response.json();
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (username) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        return response.json();
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

export const startGame = async (username) => {
    try {
        const response = await fetch(`${API_URL}/start?username=${username}`, {
            method: 'POST',
        });
        return response.json();
    } catch (error) {
        console.error('Error starting game:', error);
        throw error;
    }
};

export const drawCard = async (username) => {
    try {
        const response = await fetch(`${API_URL}/draw?username=${username}`, {
            method: 'GET',
        });
        return response.json();
    } catch (error) {
        console.error('Error drawing card:', error);
        throw error;
    }
};

export const getLeaderboard = async () => {
    try {
        const response = await fetch(`${API_URL}/leaderboard`, {
            method: 'GET',
        });
        return response.json();
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw error;
    }
};

export const updateLeaderboard = async (username, points) => {
    try {
        const response = await fetch(`${API_URL}/updateLeaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, points }),
        });
        return response.json();
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        throw error;
    }
};
