import React, { useState, useEffect } from 'react';
import './ViewOrders.css';
import VendorNavbar from './VendorNavbar';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from the backend when component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/vendor/orders', {
                    method: 'GET',
                    credentials: 'include', // To send session cookies with request
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders); // Assuming 'data.orders' contains the order details
                } else {
                    console.error('Failed to fetch orders.');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Function to handle accept order
    const handleAcceptOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/orders/${id}/accept`, {
                method: 'PATCH',
                credentials: 'include',
            });

            if (response.ok) {
                // Update the order status locally after successful API call
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === id ? { ...order, status: 'Accepted' } : order
                    )
                );
            } else {
                console.error('Failed to accept the order.');
            }
        } catch (error) {
            console.error('Error accepting the order:', error);
        }
    };

    // Function to handle reject order
    const handleRejectOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/orders/${id}/reject`, {
                method: 'PATCH',
                credentials: 'include',
            });

            if (response.ok) {
                // Update the order status locally after successful API call
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === id ? { ...order, status: 'Rejected' } : order
                    )
                );
            } else {
                console.error('Failed to reject the order.');
            }
        } catch (error) {
            console.error('Error rejecting the order:', error);
        }
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    return (
        <>
            <VendorNavbar />
            <div className="vendor-dashboard">
                <h1>Vendor Dashboard</h1>

                <div className="orders-section">
                    <h2>User Orders</h2>
                    <ul>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <li key={order.orderID}>
                                    <p><strong>User:</strong> {order.userName}</p> {/* Ensure you have this data in orders */}
                                    <p><strong>Order ID:</strong> {order.orderID}</p> {/* Display order ID */}
                                    <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p> {/* Display total amount */}
                                    <p><strong>Status:</strong> {order.status}</p>
                                    <div className="order-actions">
                                        {order.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleAcceptOrder(order.orderID)} className="accept-btn">Accept</button>
                                                <button onClick={() => handleRejectOrder(order.orderID)} className="reject-btn">Reject</button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No orders available.</p>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ViewOrders;
