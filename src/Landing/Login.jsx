import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/firebase";
import React, { useState } from "react" ;
import {Link} from 'react-router-dom' ;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login () {
   const [email , setEmail] = useState ("") ;
   const [password , setPassword] = useState ("") ;

   const handleSubmit = async (e) => {
      e.preventDefault () ;
      try {
         await signInWithEmailAndPassword(auth, email, password) ;
         console.log ( "user logged in ") ;
         window.location.href = "/dash" ;
         toast.success ( "user logged in " , {
            position : "top-center",
         }) ;
      } 
      catch (error) {
         console.log ( error.message) ;
         toast.error(error.message, {
            position: "top-center",
         }) ;
      }
   }

   return ( 
      <div className="login" >
      <form onSubmit={handleSubmit}>
            <label className="landing-label" htmlFor="chk" aria-hidden="true" >Log In</label>

            <input type = "email"
                  className = "landing-input"
                  placeholder = "Enter email" 
                  value = {email}
                  onChange = { (e) => setEmail (e.target.value)}
                  />

            <input type = "password"
                  className = "landing-input"
                  placeholder = "Enter password" 
                  value = {password}
                  onChange = { (e) => setPassword(e.target.value)}
                  />

            <button type = "submit" className="landing-butt">
               LogIn
            </button>

         {/* <p className="forgot-password text-right"> */}
            {/* New User
            <Link to={`/register`}>
               <button> 
                  Register    
               </button>
            </Link> */}
         {/* </p> */}
            <ToastContainer />

      </form>
      </div>
   )

}

export default Login ;