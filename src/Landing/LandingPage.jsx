import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/firebase";
import React, { useState } from "react" ;
import {Link} from 'react-router-dom' ;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Landing.css' ;
import Login from './Login'
import Register from './Register'


const LandingPage = () => {
  return (
   <div className="bahar" >
      <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" style={{ display: "none" }} />
            <Register />
            <Login />
      </div>
    </div>
  )
}

export default LandingPage
