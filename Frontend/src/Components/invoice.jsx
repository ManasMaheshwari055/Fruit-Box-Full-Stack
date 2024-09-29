import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './invoice.css';

function Invoice() {
    const location = useLocation();
    const state = location.state || {}; // Add a default empty object if state is null
    console.log(state);

    const { cartItems = [], totalPrice = 0, platformFee = 0, finalTotal = 0, orderId = 'N/A' } = state;

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
            <button className="back-button">Place Order</button>
            <Link to="/userdashboard">
                <button className="back-button">Back to Dashboard</button>
            </Link>
        </div>
    );
}

export default Invoice;
