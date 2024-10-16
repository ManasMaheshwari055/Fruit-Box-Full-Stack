import React from 'react'
import './Banner.css'; // Import CSS file for styling
import banner from "/Banner.png";
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <>
      <div className="min-h-screen max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10">
        <div className="banner-container w-full order-2 md:order-1 md:w-4/5 mt-12 md:mt-20">
          <div className="banner-content">
            <h1 className="banner-title">Fresh Fruit Boxes Delivered to Your Doorstep</h1>
            <p className="banner-subtitle">
              Get the freshest and most delicious fruits from local vendors delivered directly to you.
              Enjoy the convenience of supporting your community while indulging in a variety of handpicked, seasonal fruits that are sourced locally. Our service ensures you receive high-quality, ripe, and nutritious produce, perfect for a healthy lifestyle. Stay connected with your neighborhood vendors and experience the difference of farm-fresh fruits delivered with care.
            </p>
            <Link to="/signup">
              <button className="banner-button">Order Now</button>
            </Link>
          </div>
        </div>
        <div className="order-1 w-full mt-20 md:w-1/2 mb-20">
          <img
            src={banner}
            className="md:w-[auto] md:h-[auto] md:ml-12"
            alt=""
          />
        </div>
      </div>
    </>
  )
}

export default Banner