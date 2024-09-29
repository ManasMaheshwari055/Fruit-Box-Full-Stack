// Notification.jsx
import React from 'react';

function Notification({ message, onClose }) {
    return (
        <div className="notification">
            <div className="notification-content">
                <p>{message}</p>
                <button className="close-button" onClick={onClose}>×</button> {/* Changed to a cross icon */}
            </div>
            <style jsx>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #1D232A;
                    color: white;
                    padding: 15px 20px; /* Added horizontal padding */
                    border-radius: 8px; /* Increased border radius */
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* Enhanced shadow */
                    z-index: 1000;
                    transition: opacity 0.5s ease-in-out, transform 0.3s ease-in-out;
                    opacity: 1;
                    transform: translateY(0);
                    display: flex;
                    align-items: center; /* Centered items vertically */
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between; /* Space between text and button */
                    width: 100%; /* Ensure full width for content */
                }
                p {
                    margin: 0; /* Remove default margin for paragraph */
                    padding-right: 10px; /* Add space between text and button */
                    flex-grow: 1; /* Allow text to take remaining space */
                }
                .close-button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px; /* Increased font size for better visibility */
                    cursor: pointer;
                    transition: color 0.3s;
                    padding: 0; /* Remove padding for close button */
                }
                .close-button:hover {
                    color: #ff4081; /* Change to a hover color */
                }
            `}</style>
        </div>
    );
}

export default Notification;
