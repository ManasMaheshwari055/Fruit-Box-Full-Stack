// App.jsx
import React, { useState } from 'react';
import Home from './home/Home';
import { Route, Routes, useNavigate } from "react-router-dom";
import Profiles from './profile/Profiles';
import Signup from './Components/Signup';
import VendorSignup from './Components/VendorSignup';
import Cart from './cart/Cart';
import UserDashboard from './dashboard/UserDashboard';
import FruitSection from './dashboard/FruitSection';
import VeggieSection from './dashboard/VeggieSection';
import VendorDashboard from '../vendordashboard/VendorDashboard';
import AboutUs from './Components/AboutUs';
import ViewOrders from '../vendordashboard/ViewOrders';
import AddProduct from '../vendordashboard/AddProduct';
import Invoice from './Components/invoice';

function App() {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [notification, setNotification] = useState(''); // State for notification message
    const navigate = useNavigate();

    // Add items to cart function
    function addToCart(newItem) {
        const updatedCart = [...cartItems, newItem];
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));

        // Show notification
        setNotification("Product added to the cart");
        setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    }

    // Remove items from cart function
    function removeFromCart(index) {
        const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }

    function clearCart() {
        setCartItems([]); // Clear the state
        localStorage.removeItem('cartItems'); // Clear from localStorage
    }

    // Handle Logout function
    function handleLogout() {
        // Clear cart from localStorage and state
        setCartItems([]); // Clear the state
        localStorage.removeItem('cartItems'); // Clear from localStorage
        console.log("Logging out...");

        // Redirect to the login page after logging out
        navigate('/');  // Programmatic navigation to the login page
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profiles />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} clearCart={clearCart} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/vendorsignup" element={<VendorSignup />} />
                <Route path="/userdashboard" element={<UserDashboard clearCart={clearCart} />} />
                <Route path="/fruitsection" element={<FruitSection addToCart={addToCart} />} />
                <Route path="/veggiesection" element={<VeggieSection addToCart={addToCart} />} />
                <Route path="/vendordashboard" element={<VendorDashboard />} />
                <Route path="/vieworders" element={<ViewOrders />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/invoice" element={<Invoice />} />
            </Routes>
        </>
    );
}

export default App;
