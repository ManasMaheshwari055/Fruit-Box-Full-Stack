// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './cart.css';

// function Cart({ removeFromCart, cartID, clearCart }) {
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(true);  // Loading state for fetching cart items
//     const [error, setError] = useState(null);  // Error state for handling errors
//     const navigate = useNavigate();

//     const handleProceedToBuy = () => {
//         navigate('/invoice', {
//             state: {
//                 cartItems: cartItems,
//                 totalPrice: totalPrice,
//                 platformFee: platformFee,
//                 finalTotal: finalTotal,
//                 orderId: 'ORD' + Math.floor(Math.random() * 100000),
//             },
//         });
//     };

//     const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//     const platformFee = 50;
//     const finalTotal = totalPrice + platformFee;

//     // Fetch cart items for the logged-in user
//     const fetchCartItems = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/cart-items', {
//                 withCredentials: true,  // Ensure the session cookie is sent
//             });
//             setCartItems(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching cart items:', error);
//             setError(error.response?.data?.message || 'Failed to fetch cart items');
//             setLoading(false);
//         }
//     };

//     // Fetch cart items when the component mounts
//     useEffect(() => {
//         fetchCartItems();
//     }, []);

//     // Function to update total amount in the backend
//     const updateTotalAmount = async () => {
//         try {
//             const response = await axios.post('http://localhost:3001/cart', {
//                 TotalAmount: finalTotal,
//             }, {
//                 withCredentials: true, // Important for sending session cookies
//             });

//             console.log('Response from backend:', response.data);
//         } catch (error) {
//             console.error('Error updating total amount:', error.response?.data?.message || error.message);
//         }
//     };

//     // Call updateTotalAmount whenever cartItems change
//     useEffect(() => {
//         if (cartItems.length > 0) {
//             updateTotalAmount();
//         }
//     }, [cartItems]);

//     return (
//         <>
//             <div className="cart-container">
//                 {loading ? (
//                     <div className="loading">Loading cart items...</div>
//                 ) : error ? (
//                     <div className="error">{error}</div>
//                 ) : cartItems.length === 0 ? (
//                     <div className="empty-cart-container">
//                         <h2 className="empty-cart-text">YOUR CART IS EMPTY</h2>
//                         <Link to='/userdashboard'>
//                             <button className="shop-button">SHOP OUR PRODUCTS</button>
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="cart-items">
//                         {cartItems.map((item, index) => (
//                             <div key={index} className="cart-item">
//                                 <img src={item.image} alt={item.name} className="cart-item-image" />
//                                 <div className="cart-item-details">
//                                     <h3 className="cart-item-title">{item.name}</h3>
//                                     <div className="cart-item-info">
//                                         <span>Quantity: {item.quantity}</span>
//                                         <span className="cart-item-price">Rs. {item.price * item.quantity}</span>
//                                     </div>
//                                 </div>
//                                 <button onClick={() => removeFromCart(index)} className="remove-item-btn">Remove</button>
//                             </div>
//                         ))}
//                         <div className="total-price-container">
//                             <h3>Total Price: Rs. {totalPrice}</h3>
//                             <h3>Platform Fee: Rs. {platformFee}</h3>
//                             <h2>Final Total: Rs. {finalTotal}</h2>
//                         </div>
//                         <Link to='/userdashboard'>
//                             <button className="buy-button">Continue Buying</button>
//                         </Link>

//                         <button className="buy-button" onClick={handleProceedToBuy}>Proceed to Buy</button>

//                         {/* Clear Cart Button */}
//                         <button onClick={clearCart} className="buy-button">Clear Cart</button>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }

// export default Cart;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cart.css';

function Cart({ removeFromCart, cartID, clearCart }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state for fetching cart items
    const [error, setError] = useState(null);  // Error state for handling errors
    const navigate = useNavigate();

    const handleProceedToBuy = () => {
        navigate('/invoice', {
            state: {
                cartItems: cartItems,
                totalPrice: totalPrice,
                platformFee: platformFee,
                finalTotal: finalTotal,
                orderId: 'ORD' + Math.floor(Math.random() * 100000),
            },
        });
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const platformFee = 50;
    const finalTotal = totalPrice + platformFee;

    // Fetch cart items for the logged-in user
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/cart-items', {
                withCredentials: true,  // Ensure the session cookie is sent
            });

            // Log the entire response to see if cartID is included
            console.log('Fetched Cart Items:', response.data);

            setCartItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError(error.response?.data?.message || 'Failed to fetch cart items');
            setLoading(false);
        }
    };


    // Fetch cart items when the component mounts
    useEffect(() => {
        fetchCartItems();
    }, []);

    // Function to update total amount in the backend
    const updateTotalAmount = async () => {
        try {
            const response = await axios.post('http://localhost:3001/cart', {
                TotalAmount: finalTotal,
            }, {
                withCredentials: true, // Important for sending session cookies
            });

            console.log('Response from backend:', response.data);
        } catch (error) {
            console.error('Error updating total amount:', error.response?.data?.message || error.message);
        }
    };

    // Call updateTotalAmount whenever cartItems change
    useEffect(() => {
        if (cartItems.length > 0) {
            updateTotalAmount();
        }
    }, [cartItems]);

    // Function to remove an item from the cart and the database
    const handleRemoveFromCart = async (cartID, productID) => {
        console.log(cartID);
        console.log(productID);
        try {
            const response = await axios.delete(`http://localhost:3001/cart-items`, {
                params: {
                    cartID: cartID,
                    productID: productID,
                },
                withCredentials: true, // Ensure session cookies are sent
            });
            console.log('Item removed successfully:', response.data);
            fetchCartItems(); // Re-fetch the cart items to update the UI
        } catch (error) {
            console.error('Error removing item:', error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            <div className="cart-container">
                {loading ? (
                    <div className="loading">Loading cart items...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : cartItems.length === 0 ? (
                    <div className="empty-cart-container">
                        <h2 className="empty-cart-text">YOUR CART IS EMPTY</h2>
                        <Link to='/userdashboard'>
                            <button className="shop-button">SHOP OUR PRODUCTS</button>
                        </Link>
                    </div>
                ) : (
                    <div className="cart-items">
                        {cartItems.map((item, index) => {
                            console.log("Item CartID: ", item.correctCartFieldName, "ProductID: ", item.productID);
                            return (
                                <div key={index} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-title">{item.name}</h3>
                                        <div className="cart-item-info">
                                            <span>Quantity: {item.quantity}</span>
                                            <span className="cart-item-price">Rs. {item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.correctCartFieldName, item.productID)}
                                        className="remove-item-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}

                        <div className="total-price-container">
                            <h3>Total Price: Rs. {totalPrice}</h3>
                            <h3>Platform Fee: Rs. {platformFee}</h3>
                            <h2>Final Total: Rs. {finalTotal}</h2>
                        </div>
                        <Link to='/userdashboard'>
                            <button className="buy-button">Continue Buying</button>
                        </Link>

                        <button className="buy-button" onClick={handleProceedToBuy}>Proceed to Buy</button>

                        {/* Clear Cart Button */}
                        <button onClick={clearCart} className="buy-button">Clear Cart</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Cart;
