// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './FruitSection.css';
// import DashboardNavbar from '../dashboard/DasboardNavbar';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001');

// function FruitSection({ addToCart, cartID }) { // cartID is passed from parent
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [alertMessage, setAlertMessage] = useState(''); // Alert message state
//     const [showAlert, setShowAlert] = useState(false); // Visibility state for alert
//     const [quantities, setQuantities] = useState({}); // State for product quantities

//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/products');
//             console.log('Fetched products:', response.data);
//             if (Array.isArray(response.data)) {
//                 setProducts(response.data);
//             } else {
//                 console.error('Data is not an array:', response.data);
//                 setProducts([]);
//             }
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();

//         socket.on('newProduct', (newProduct) => {
//             setProducts((prevProducts) => {
//                 const existingProductIndex = prevProducts.findIndex(product => product.productID === newProduct.productID);
//                 if (existingProductIndex !== -1) {
//                     const updatedProducts = [...prevProducts];
//                     updatedProducts[existingProductIndex].quantity += newProduct.quantity;
//                     updatedProducts[existingProductIndex].isNew = false;
//                     return updatedProducts;
//                 } else {
//                     return [...prevProducts, { ...newProduct, isNew: true }];
//                 }
//             });
//         });

//         return () => {
//             socket.off('newProduct');
//         };
//     }, []);

//     // Handle changes in quantity selector
//     const handleQuantityChange = (productID, newQuantity) => {
//         setQuantities({
//             ...quantities,
//             [productID]: newQuantity,
//         });
//     };

//     const handleAddToCart = async (product) => {
//         const selectedQuantity = quantities[product.productID] || 1; // Default quantity is 1

//         try {
//             // Make a POST request to add the item to the cart, sending credentials (session cookies)
//             const response = await axios.post('http://localhost:3001/cart-items', {
//                 productID: product.productID,
//                 quantity: selectedQuantity, // Pass the selected quantity
//             }, { 
//                 withCredentials: true  // Ensure session cookie is sent
//             });
    
//             console.log(response.data); // Should log 'Item added to cart'
    
//             // Show success alert
//             setAlertMessage(`${product.productName} has been added to your cart!`);
//             setShowAlert(true);
    
//             // Hide the alert after 3 seconds
//             setTimeout(() => {
//                 setShowAlert(false);
//             }, 3000);
    
//             // Optionally update frontend cart state
//             addToCart({
//                 name: product.productName,
//                 quantity: selectedQuantity, // Add the selected quantity
//                 price: product.price,
//                 image: product.image // Ensure the product has an image property
//             });
    
//         } catch (error) {
//             console.error('Error adding to cart:', error);
//             // Show error message to the user
//             setAlertMessage('Failed to add item to cart. Please try again.');
//             setShowAlert(true);
    
//             // Hide the error alert after a few seconds
//             setTimeout(() => {
//                 setShowAlert(false);
//             }, 3000);
//         }
//     };        

//     const filteredProducts = products.filter(product =>
//         product.productName.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <>
//             <DashboardNavbar />

//             {/* Alert message */}
//             {showAlert && (
//                 <div style={styles.alert}>
//                     {alertMessage}
//                 </div>
//             )}

//             <div style={styles.productList}>
//                 <h2 style={styles.title}>Product List</h2>
//                 <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     style={styles.searchInput}
//                 />
//                 {loading ? (
//                     <p style={styles.loadingText}>Loading products...</p>
//                 ) : filteredProducts.length > 0 ? (
//                     filteredProducts.map((product) => (
//                         <div style={styles.productCard} key={product.productID}>
//                             <h3 style={styles.productName}>{product.productName}</h3>
//                             <p style={styles.productInfo}>Price: Rs. {product.price}</p>
//                             <p style={styles.productInfo}>Quantity Available: {product.quantity}</p>
//                             {product.isNew && <span style={styles.newTag}>New!</span>}

//                             {/* Quantity Selector */}
//                             <div style={styles.quantitySelector}>
//                                 <label htmlFor={`quantity-${product.productID}`}>Quantity: </label>
//                                 <input
//                                     id={`quantity-${product.productID}`}
//                                     type="number"
//                                     value={quantities[product.productID] || 1}
//                                     min="1"
//                                     max={product.quantity}
//                                     onChange={(e) => handleQuantityChange(product.productID, parseInt(e.target.value))}
//                                     style={styles.quantityInput}
//                                 />
//                             </div>

//                             <button
//                                 className="add-to-cart-btn"
//                                 onClick={() => handleAddToCart(product)}
//                             >
//                                 Add to Cart
//                             </button>
//                         </div>
//                     ))
//                 ) : (
//                     <p style={styles.noProductsText}>No products available.</p>
//                 )}
//             </div>
//         </>
//     );
// }

// const styles = {
//     productList: {
//         padding: '20px',
//         backgroundColor: '#1D232A', // Updated to the required background color
//         borderRadius: '8px',
//         maxWidth: '1200px',
//         margin: 'auto',
//         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//         color: 'white',
//     },
//     title: {
//         fontSize: '2.5rem',
//         marginBottom: '20px',
//         textAlign: 'center',
//     },
//     searchInput: {
//         width: '100%',
//         padding: '10px',
//         borderRadius: '4px',
//         border: '1px solid #ccc',
//         marginBottom: '20px',
//         fontSize: '16px',
//     },
//     productCard: {
//         backgroundColor: '#495057',
//         borderRadius: '8px',
//         padding: '20px',
//         marginBottom: '20px',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//         position: 'relative',
//     },
//     productName: {
//         margin: '0 0 10px 0',
//     },
//     productInfo: {
//         margin: '5px 0',
//         color: '#f8f9fa',
//     },
//     loadingText: {
//         color: 'white',
//     },
//     noProductsText: {
//         color: 'white',
//     },
//     newTag: {
//         position: 'absolute',
//         top: '10px',
//         right: '10px',
//         backgroundColor: '#28a745',
//         color: 'white',
//         padding: '5px',
//         borderRadius: '5px',
//         fontSize: '0.8rem',
//     },
//     alert: {
//         position: 'fixed',
//         top: '20px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         backgroundColor: '#28a745',
//         color: 'white',
//         padding: '10px 20px',
//         borderRadius: '5px',
//         zIndex: '9999',
//         fontSize: '1rem',
//         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
//     },
//     quantitySelector: {
//         marginTop: '10px',
//     },
//     quantityInput: {
//         width: '60px',
//         padding: '5px',
//         fontSize: '16px',
//     },
// };

// export default FruitSection;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FruitSection.css';
import DashboardNavbar from '../dashboard/DasboardNavbar.jsx';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from "react-hot-toast";

// Initialize socket connection
const socket = io('http://localhost:3001');

function FruitSection({ addToCart, updateCart }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [alertMessage, setAlertMessage] = useState(''); // For alert messages
    const [showAlert, setShowAlert] = useState(false); // To manage alert visibility
    const [quantities, setQuantities] = useState({}); // Manage selected quantities
    const [cartItems, setCartItems] = useState([]); // Manage local cart items

    // Fetch products from the server
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/products');
            console.log('Fetched products:', response.data);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
                const initialQuantities = response.data.reduce((acc, product) => {
                    acc[product.productID] = 1;
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            } else {
                console.error('Data is not an array:', response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // UseEffect to fetch products and listen for new products through WebSocket
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

    // Handle changes in product quantity selection
    const handleQuantityChange = (productID, newQuantity) => {
        if (newQuantity < 1) return;
        setQuantities({
            ...quantities,
            [productID]: Math.min(newQuantity, products.find(p => p.productID === productID)?.quantity || 0)
        });
    };

    // Handle adding items to the cart
    const handleAddToCart = async (product) => {
        const selectedQuantity = quantities[product.productID] || 1;

        try {
            const response = await axios.post('http://localhost:3001/cart-items', {
                productID: product.productID,
                quantity: selectedQuantity, // Pass the selected quantity
            }, {
                withCredentials: true // Ensure session cookie is sent
            });

            console.log(response.data);

            // Show success alert
            setAlertMessage(`${product.productName} has been added to your cart!`);
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            // Optionally update frontend cart state
            addToCart({
                name: product.productName,
                quantity: selectedQuantity,
                price: product.price,
                image: product.imageURL || 'Fruit/defaultImage.jpg'
            });

        } catch (error) {
            console.error('Error adding to cart:', error);
            setAlertMessage('Failed to add item to cart. Please try again.');
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    };

    // Navigate to Cart page
    const handleProceedToBuy = () => {
        navigate('/cart');
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <DashboardNavbar />

            {/* Alert message */}
            {showAlert && (
                <div style={styles.alert}>
                    {alertMessage}
                </div>
            )}

            <div style={styles.productList}>
                <h2 style={styles.title}>Product List</h2>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />

                {loading ? (
                    <p style={styles.loadingText}>Loading products...</p>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div style={styles.productCard} key={product.productID}>
                            <h3 style={styles.productName}>{product.productName}</h3>
                            <img
                                src={product.imageURL || 'Fruit/defaultImage.jpg'}
                                alt={product.productName}
                                style={styles.productImage}
                            />
                            <p style={styles.productInfo}>Price: ₹{product.price} per piece.</p>
                            <p style={styles.productInfo}>Available Quantity: {product.quantity}</p>

                            {/* Quantity Selector */}
                            <label htmlFor={`quantity-${product.productID}`} style={styles.quantityLabel}>
                                Select Quantity:
                            </label>
                            <input
                                type="number"
                                id={`quantity-${product.productID}`}
                                min="1"
                                max={product.quantity}
                                value={quantities[product.productID]}
                                onChange={(e) => handleQuantityChange(product.productID, Number(e.target.value))}
                                style={styles.quantityInput}
                            />
                            {product.isNew && <span style={styles.newTag}>New!</span>}

                            <button
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart(product)}
                                disabled={quantities[product.productID] < 1 || quantities[product.productID] > product.quantity}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={styles.noProductsText}>No products available.</p>
                )}

                <button onClick={handleProceedToBuy} style={styles.proceedToCartBtn}>
                    Go To Cart
                </button>
            </div>
        </>
    );
}

// Styles
const styles = {
    productList: {
        padding: '20px',
        backgroundColor: '#1D232A',
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
    productImage: {
        width: '100%',
        maxWidth: '200px',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    productInfo: {
        margin: '5px 0',
        color: '#f8f9fa',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: '1.5rem',
        color: 'white',
    },
    noProductsText: {
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5rem',
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
    alert: {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        zIndex: '9999',
        fontSize: '1rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
    quantityLabel: {
        color: '#f8f9fa',
        marginRight: '10px',
    },
    quantityInput: {
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '60px',
        marginRight: '10px',
    },
    proceedToCartBtn: {
        padding: '15px 25px',
        backgroundColor: '#28a745',
        color: 'white',
        borderRadius: '8px',
        fontSize: '1.2rem',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center',
    },
};

export default FruitSection;
