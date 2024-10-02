import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './invoice.css';

function Invoice() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {}; 
    const { cartItems = [], totalPrice = 0, platformFee = 0, finalTotal = 0, orderId = 'N/A', userID, vendorID } = state; // Include userID and vendorID

    const handlePlaceOrder = async () => {
        try {
            const response = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems,
                    totalPrice,
                    platformFee,
                    finalTotal,
                    userID, // Pass userID
                    vendorID // Pass vendorID
                }),
                credentials: 'include', // To send session cookies with request
            });

            if (response.ok) {
                const result = await response.json();
                alert('Order placed successfully!');
                navigate('/userdashboard');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="invoice-container">
            <h1 style={{fontSize: '2em' }}>Invoice</h1>
            <div className="invoice-details">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <div className="invoice-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div key={index} className="invoice-item">
                                <p>{item.name} (x{item.quantity})</p>
                                <p>Rs. {item.price * item.quantity}</p>
                            </div>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                </div>
                <div className="invoice-summary">
                    <p><strong>Total Price:</strong> Rs. {totalPrice}</p>
                    <p><strong>Platform Fee:</strong> Rs. {platformFee}</p>
                    <p style={{ color: 'green', fontSize: '1.5em' }}><strong>Final Total:</strong> Rs. {finalTotal}</p>
                </div>
            </div>
            <button className="back-button" onClick={handlePlaceOrder}>Place Order</button>
            <Link to="/userdashboard">
                <button className="back-button">Back to Dashboard</button>
            </Link>
        </div>
    );
}

export default Invoice;
