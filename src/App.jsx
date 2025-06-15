import React , { useEffect , useState } from "react" ;
import { ToastContainer } from 'react-toastify';
import { auth } from "../backend/firebase";
import 'bootstrap/dist/css/bootstrap.min.css';

// import "./Auth.css"
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom" ;

import Login from "./Landing/Login" ;
import Dash from "./components/Dash"
import Register from "./Landing/Register" ;
import Landing from "./Landing/LandingPage" ;


function App () {
   const [ user, setUser ] = useState ( null ) ;
   useEffect ( () => {
      auth.onAuthStateChanged ( (user) => {
         setUser (user) ;
      }) ;
   }) ;
   return (
         <div className="app">
            <div className="auth-wrapper">
               <div className="auth-inner">
                  <Routes>
                     <Route path="/" element = { user ? <Navigate to ="/dash"/> : <Landing />} />
                     <Route path="/landing" element={<Landing />} />
                     {/* <Route path="/login" element={<Login />} /> */}
                     {/* <Route path="/register" element={<Register />} /> */}
                     <Route path="/dash/*" element={<Dash />} />
                  </Routes>
                  <ToastContainer />
               </div>
            </div>
         </div>
   ) ;
}

export default App ;
