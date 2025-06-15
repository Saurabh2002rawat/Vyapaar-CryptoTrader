import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react" ;
import { Link} from 'react-router-dom' ;
import { auth , db } from "../../backend/firebase";
import { doc, setDoc } from "firebase/firestore" ;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register () {
   const [email, setEmail] = useState ("");
   const [password, setPassword] = useState("") ;
   const [fname, setFname] = useState("") ;

   const handleRegister = async(e) => {
      e.preventDefault () ;
      try {
         await createUserWithEmailAndPassword (auth, email, password) ;
         const user = auth.currentUser ;
         await setDoc ( doc(db, "Users", user.uid), {
            fname : fname ,
            email : email ,
            uid : user.uid ,
            balance : 0 ,
            portfolio : {} ,
         }) ;
         
         console.log (user) ;
         console.log ("user registered successfully") ;
         toast.success ( 
            "user registered" , {
            position : "top-center",
         }) ;
      } 
      catch (error) {
         console.log ( error.message ) ;
         toast.error( error.message, {
            position: "top-center",
         }) ;
      }
   } ;

   return ( 
      <form className="signup" onSubmit={handleRegister} >
         <label className="landing-label" htmlFor="chk" aria-hidden="true" > Sign Up </label>

            <input type = "text"
               className = "landing-input"
               placeholder = "Your name"
               
               onChange = { (e) => setFname (e.target.value)}
               required />

            <input type = "email"
               className = "landing-input"
               placeholder = "Your Email"
               onChange = { (e) => setEmail (e.target.value)}
               required />

            <input type = "password"
               className = "landing-input"
               placeholder = "Your Password"
               onChange = { (e) => setPassword (e.target.value)}
               required />

            <button type = "submit" className="landing-butt">
               Sign Up
            </button>
            <ToastContainer />
         
      </form>
   )
}

export default Register ;