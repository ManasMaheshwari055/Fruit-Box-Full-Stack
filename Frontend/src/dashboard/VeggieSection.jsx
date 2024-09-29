// VeggieSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VeggieSection.css'; // CSS remains the same
import DashboardNavbar from './DasboardNavbar';

function VeggieSection({ addToCart }) {
    const navigate = useNavigate();

    const [carrotQuantity, setCarrotQuantity] = useState(1);
    const [broccoliQuantity, setBroccoliQuantity] = useState(1);

    const products = [
        { name: 'Carrots', quantity: carrotQuantity, price: 50, image: '/carrot.png', setQuantity: setCarrotQuantity },
        { name: 'Broccoli', quantity: broccoliQuantity, price: 80, image: '/broccoli.png', setQuantity: setBroccoliQuantity },
    ];

    const handleAddToCart = (product) => {
        addToCart(product);
        // navigate('/cart');
    };

    return (
        <>
            <DashboardNavbar />
            <div className="veggies-page" style={{ backgroundColor: '#1D232A', minHeight: '100vh', padding: '2rem' }}>
                <h1 className="page-header" style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>Fresh Vegetables</h1>
                <div className="veggies-container">

                    {products.map((product, index) => (
                        <div className="veggies-card" key={index}>
                            <div className="veggies-image-container">
                                <img src={product.image} alt={product.name} className="veggies-image" />
                            </div>
                            <div className="veggies-info">
                                <h2 className="veggies-title">{product.name} (Per 1 KG)</h2>
                                <p className="veggies-price">
                                    <span className="discounted-price">Rs. {product.price}</span>
                                </p>
                                <div className="quantity-selector">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => product.setQuantity(Math.max(1, product.quantity - 1))}
                                    >-</button>
                                    <span>{product.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => product.setQuantity(product.quantity + 1)}
                                    >+</button>
                                </div>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart({ name: product.name, quantity: product.quantity, price: product.price, image: product.image })}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default VeggieSection;
