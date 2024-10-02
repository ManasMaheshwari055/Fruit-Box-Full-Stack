
import React, { useState } from 'react';
import VendorNavbar from './VendorNavbar';
import axios from 'axios';

const AddProduct = () => {
    const [product, setProduct] = useState({
        productName: '',
        price: '',
        quantity: '',
    });
    const [error, setError] = useState(null); // For handling any errors
    const [success, setSuccess] = useState(false); // For handling success state

  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/addproduct', product, {
                withCredentials: true 
            });

            console.log('Product Added:', response.data);
            alert(`Product Added: ${product.productName}, Price: ${product.price}, Quantity: ${product.quantity}`);
            
            // Clear the form after success
            setProduct({ productName: '', price: '', quantity: '' });
            setSuccess(true);
            setError(null); // Clear any previous error
        } catch (err) {
            console.error(err);
            setError('Failed to add the product. Please try again.');
            setSuccess(false);
        }
    };
    return (
        <>
            <VendorNavbar />
            <div
                style={{
                    padding: '20px',
                    backgroundColor: '#1D232A', // Dark background
                    borderRadius: '10px',
                    color: '#f1f1f1', // Light text color
                    maxWidth: '500px',
                    margin: '20px auto', // Center the form
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                }}
            >
                <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Add Product</h2>
                <form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="productName" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#d1d1d1' }}>
                            Product Name:
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={product.productName}
                            onChange={handleInputChange}
                            required
                            style={{
                                padding: '10px',
                                width: '100%',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#2C2F36',
                                color: '#fff',
                                fontSize: '16px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="price" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#d1d1d1' }}>
                            Price:
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            required
                            style={{
                                padding: '10px',
                                width: '100%',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#2C2F36',
                                color: '#fff',
                                fontSize: '16px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </div>

                    {/* Quantity */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="quantity" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#d1d1d1' }}>
                            Quantity:
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleInputChange}
                            required
                            style={{
                                padding: '10px',
                                width: '100%',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#2C2F36',
                                color: '#fff',
                                fontSize: '16px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            width: '100%',
                        }}
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddProduct;