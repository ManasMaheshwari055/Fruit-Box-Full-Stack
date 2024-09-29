// FruitSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FruitSection.css';
import DashboardNavbar from './DasboardNavbar.jsx';

function FruitSection({ addToCart }) {
    const navigate = useNavigate();

    const [orangeQuantity, setOrangeQuantity] = useState(1);
    const [papayaQuantity, setPapayaQuantity] = useState(1);
    const [mangoQuantity, setMangoQuantity] = useState(1);

    const products = [
        { name: 'Orange', quantity: orangeQuantity, price: 250, image: '/orange.png', setQuantity: setOrangeQuantity },
        { name: 'Papaya', quantity: papayaQuantity, price: 300, image: '/papaya.png', setQuantity: setPapayaQuantity },
        { name: 'Mango', quantity: mangoQuantity, price: 925, image: '/mango.png', setQuantity: setMangoQuantity },
    ];

    const handleAddToCart = (product) => {
        addToCart(product);
        // navigate('/cart');
    };

    return (
        <>
            <DashboardNavbar />
            <div className="product-page">
                <h1 className="page-header">Our Products</h1>
                <div className="product-container">
                    {products.map((product, index) => (
                        <div className="product-card" key={index}>
                            <div className="product-image-container">
                                <img src={product.image} alt={product.name} className="product-image" />
                            </div>
                            <div className="product-info">
                                <h2 className="product-title">{product.name}</h2>
                                <p className="product-weight">
                                    <span className="weight">Per 1000 GRAMS</span>
                                </p>
                                <p className="product-price">
                                    <span className="discounted-price">Rs. {product.price}</span>
                                </p>
                                <div className="quantity-selector">
                                    <button className="quantity-btn" onClick={() => product.setQuantity(Math.max(1, product.quantity - 1))}>-</button>
                                    <span>{product.quantity}</span>
                                    <button className="quantity-btn" onClick={() => product.setQuantity(product.quantity + 1)}>+</button>
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

export default FruitSection;
