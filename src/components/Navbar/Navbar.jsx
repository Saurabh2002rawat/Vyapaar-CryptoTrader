import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow_icon from '../../assets/arrow_icon.png'
import { CoinContext } from '../context/coinContext'
import { Link } from 'react-router-dom'
import { auth } from '../../../backend/firebase';
import { NavLink } from 'react-router-dom';




const Navbar = () => {

  const {setCurrency} = useContext(CoinContext)  

  const currencyHandler = (event) => {
      switch (event.target.value) {
         case "inr" : {
            setCurrency({name: "inr" , symbol: "₹"})  ;
            break ;
         }
         case "eur" : {
            setCurrency({name: "eur" , symbol: "€"})  ;
            break ;
         }
         case "usd" : {
            setCurrency({name: "usd" , symbol: "$"})  ;
            break ;
         }
         default : {
            setCurrency({name: "inr" , symbol: "₹"})  ;
         }
      }
  }

async function handleLogOut() {
    try {
      await auth.signOut();
      window.location.href = '/landing';
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  }

// <NavLink to="/dash/profile" className={({ isActive }) => isActive ? 'active-tab' : ''}>
//   Profile
// </NavLink>

  return (
    <div className="navbar">
      <Link to={`/`}>
         <img src = {logo} alt= "logo" className = 'logo'/>
      </Link>
      <ul> 
         <li>
            <NavLink id="navBar" to={`/dash`} className={({ isActive }) => isActive ? 'active-tab' : ''}>
            Home
            </NavLink>
         </li>
         <li>
            <NavLink id="navBar"  to={`/dash/portfolio`} className={({ isActive }) => isActive ? 'active-tab' : ''}>
               Portfolio
            </NavLink>
         </li>  
         {/* <li>Pricing</li>    */}
         <li>
            <NavLink id="navBar"  to={`/dash/profile`} className={({ isActive }) => isActive ? 'active-tab' : ''}>
               Profile
            </NavLink>
         </li>
         <li>
            <NavLink id="navBar"  to={'/dash/contact'} className={ ({ isActive }) => isActive ? 'active-tab': '' } >
               Contact Us
            </NavLink>
         </li>
      </ul>      
      <div className="nav-right">
         <select onChange={currencyHandler}>
            <option value="inr">INR</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
         </select>
         <button onClick = {handleLogOut}>LogOut
            <img src={arrow_icon} alt="arrow_icon" />
         </button>
      </div>




      {/* <button className="btn btn-primary mt-2" onClick={handleLogOut}>
            Logout
          </button> */}


    </div>
  )
}

export default Navbar
