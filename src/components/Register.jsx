// src/components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../services/UserService';

const Register = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const result = await registerUser(username);
            setMessage(result.message || 'Registration successful!');
        } catch (error) {
            setMessage('Registration failed.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
            />
            <button onClick={handleRegister}>Register</button>
            <p>{message}</p>
        </div>
    );
};

export default Register;
