import React, { useState } from 'react';
import VendorNavbar from './VendorNavbar';
import axios from 'axios';

const AddProduct = () => {
    const [product, setProduct] = useState({
        productName: '',
        price: '',
        quantity: '',
        unit: 'piece', // Added a field for unit selection
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

        const storedVendor = JSON.parse(localStorage.getItem('Vendors'));
        const vendorID = storedVendor ? storedVendor.vendorID : '';
        console.log(vendorID);
        const productWithVendorID = {
            ...product,
            vendorID, // Add vendorID to the product object
        };

        try {
            const response = await axios.post('http://localhost:3001/addproduct', productWithVendorID, {
                withCredentials: true 
            });

            alert(response.data.message); // Display success message
            // Clear the form after success
            setProduct({ productName: '', price: '', quantity: '', unit: 'piece' });
            setSuccess(true);
            setError(null); // Clear any previous error
        } catch (err) {
            if (err.response && err.response.data) {
                // Display the error message from the server
                setError(err.response.data.error);
            } else {
                setError('Failed to add the product. Please try again.');
            }
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
                            Price (per {product.unit}):
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

                    {/* Unit Type (Piece or 500 grams) */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="unit" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#d1d1d1' }}>
                            Unit Type:
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            value={product.unit}
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
                        >
                            <option value="piece">Per Piece</option>
                            <option value="500gm">Per 500 Grams</option>
                        </select>
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