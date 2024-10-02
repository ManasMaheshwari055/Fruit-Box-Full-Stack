import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure correct import
import './FruitSection.css';
import DashboardNavbar from '../dashboard/DasboardNavbar'; // Correct the import here
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function FruitSection({ addToCart, clearCart }) {
    const navigate = useNavigate(); // This should work if wrapped in Router
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/products'); // Ensure full URL
            console.log('Fetched products:', response.data);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error('Data is not an array:', response.data);
                setProducts([]); // Reset products if not an array
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        socket.on('newProduct', (newProduct) => {
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex(product => product.productID === newProduct.productID);
                if (existingProductIndex !== -1) {
                    const updatedProducts = [...prevProducts];
                    updatedProducts[existingProductIndex].quantity += newProduct.quantity;
                    updatedProducts[existingProductIndex].isNew = false;
                    return updatedProducts;
                } else {
                    return [...prevProducts, { ...newProduct, isNew: true }];
                }
            });
        });

        return () => {
            socket.off('newProduct');
        };
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        // navigate('/cart'); // Uncomment if needed
    };

    const handleProceedToBuy = () => {
        clearCart();
        fetchProducts(); // Refresh product list
    };

    // Filter products based on the search query
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <DashboardNavbar />
            <div style={styles.productList}>
                <h2 style={styles.title}>Product List</h2>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                    style={styles.searchInput}
                />
                {loading ? (
                    <p style={styles.loadingText}>Loading products...</p>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div style={styles.productCard} key={product.productID}>
                            <h3 style={styles.productName}>{product.productName}</h3>
                            <p style={styles.productInfo}>Price: ${product.price}</p>
                            <p style={styles.productInfo}>Quantity: {product.quantity}</p>
                            {product.isNew && <span style={styles.newTag}>New!</span>}
                            <button
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart({
                                    name: product.productName,
                                    quantity: product.quantity,
                                    price: product.price
                                })}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={styles.noProductsText}>No products available.</p>
                )}
                {/* <button onClick={handleProceedToBuy}>Proceed to Buy</button> */}
            </div>
        </>
    );
}

const styles = {
    productList: {
        padding: '20px',
        backgroundColor: '#343a40',
        borderRadius: '8px',
        maxWidth: '1200px',
        margin: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        color: 'white',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        textAlign: 'center',
    },
    searchInput: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        fontSize: '16px',
    },
    productCard: {
        backgroundColor: '#495057',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    },
    productName: {
        margin: '0 0 10px 0',
    },
    productInfo: {
        margin: '5px 0',
        color: '#f8f9fa',
    },
    loadingText: {
        color: 'white',
    },
    noProductsText: {
        color: 'white',
    },
    newTag: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '0.8rem',
    },
};

export default FruitSection;
