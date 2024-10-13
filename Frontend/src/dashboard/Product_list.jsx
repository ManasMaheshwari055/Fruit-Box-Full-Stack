import React from 'react';
import { Link } from 'react-router-dom';
import './Product_list.css'; // Import the CSS file for styling

function Product_list() {
  return (
    <div className="product-page">
      <h1 className="page-header">Our Products</h1>
      <div className="product-container">
        {/* Fruits Card */}
        <div className="product-card">
          {/* <img src={fruitsImg} alt="Fruits" className="product-image" /> */}
          <h2 className="product-title">Fruits</h2>
          <Link to="/fruitsection">
            <button className="product-button">Shop Now</button>
          </Link>
        </div>

        {/* Exotic Veggies Card
        <div className="product-card">
          <img src={veggiesImg} alt="Exotic Veggies" className="product-image" />
          <h2 className="product-title">Exotic Veggies</h2>
          <Link to="/veggiesection">
            <button className="product-button">Shop Now</button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default Product_list;
