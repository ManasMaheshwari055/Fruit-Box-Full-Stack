// UserDashboard.jsx
import React from 'react';
import Product_list from './Product_list.jsx';
import DashboardNavbar from './DasboardNavbar.jsx';

function UserDashboard({ clearCart }) {
  return (
    <>
      <DashboardNavbar clearCart={clearCart} />
      <Product_list />
    </>
  );
}

export default UserDashboard;
