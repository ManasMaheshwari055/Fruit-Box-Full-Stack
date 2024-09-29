import React from 'react'
import DashboardNavbar from '../dashboard/DasboardNavbar'
import Profile from '../Components/Profile'
import Footer from '../Components/Footer'

function Profiles() {
  return (
    <>
        <DashboardNavbar/>
        <div className="min-h-screen">
            <Profile />
        </div>
        <Footer />
    </>
  )
}

export default Profiles