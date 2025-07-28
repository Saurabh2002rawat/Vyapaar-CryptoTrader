import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar/Navbar.jsx'
import Footer from './Footer/Footer.jsx'
import Home from './Home/Home.jsx'
import Coin from './Coin/Coin.jsx'
import Portfolio from '../Portfolio/Portfolio.jsx' 
import Profile from '../Profile/Profile.jsx'
import Card from '../Profile/Card.jsx'
import Buying from './transaction/Buying.jsx'
import Selling from './transaction/Selling.jsx'
import Contact from '../Contact/Contact.jsx'
// import { Link } from 'react-router-dom' ;

const Dash = () => {
  return (
   <>
   <style>{`
        a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>

      <div className='app'>
         <Navbar />
         <Routes>
            <Route index element={<Home />} /> 
            <Route path="coin/:coinId" element={<Coin />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="profile/*" element={<Profile />} />
            <Route path="profile/card/:amt" element={<Card />} />
            <Route path="buying/:coinId" element={<Buying />} />
            <Route path="selling/:coinId" element={<Selling />} />
            <Route path="contact" element={ <Contact /> } />
         </Routes>
         <Footer />
      </div>
    </>
  )
}

export default Dash
