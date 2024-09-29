import React, { useState } from 'react';
import './ViewOrders.css';
import VendorNavbar from './VendorNavbar';

const ViewOrders = () => {
    const [orders, setOrders] = useState([
        // { id: 1, user: 'John', product: 'Apple', quantity: 10, status: 'Pending' },
        // { id: 2, user: 'Emily', product: 'Banana', quantity: 5, status: 'Pending' },
        // { id: 3, user: 'Michael', product: 'Carrot', quantity: 8, status: 'Pending' }
    ]);

    const handleAcceptOrder = (id) => {
        const updatedOrders = orders.map(order =>
            order.id === id ? { ...order, status: 'Accepted' } : order
        );
        setOrders(updatedOrders);
    };

    const handleRejectOrder = (id) => {
        const updatedOrders = orders.map(order =>
            order.id === id ? { ...order, status: 'Rejected' } : order
        );
        setOrders(updatedOrders);
    };

    return (
        <>
            <VendorNavbar/>
            <div className="vendor-dashboard">
                <h1>Vendor Dashboard</h1>

                <div className="orders-section">
                    <h2>User Orders</h2>
                    <ul>
                        {orders.map(order => (
                            <li key={order.id}>
                                <p><strong>User:</strong> {order.user}</p>
                                <p><strong>Product:</strong> {order.product}</p>
                                <p><strong>Quantity:</strong> {order.quantity}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <div className="order-actions">
                                    {order.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleAcceptOrder(order.id)} className="accept-btn">Accept</button>
                                            <button onClick={() => handleRejectOrder(order.id)} className="reject-btn">Reject</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ViewOrders;
