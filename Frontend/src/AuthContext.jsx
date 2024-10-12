// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Handle Logout function
    const handleLogout = () => {
        // Clear cart from localStorage and state
        setCartItems([]); // Clear the state
        localStorage.removeItem('cartItems'); // Clear from localStorage
        console.log("Logging out...");
        // Any additional logout logic can go here
    };

    return (
        <AuthContext.Provider value={{ cartItems, setCartItems, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
