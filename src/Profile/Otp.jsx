import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../backend/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './Otp.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CoinContext } from '../components/context/coinContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = () => {
  const [userDetails, setUserDetails] = useState(null);
  let { amt }= useParams() ;
  const {currency} = useContext (CoinContext) ;
   const [otp , setOtp ] = useState ("") ;
   const navigate = useNavigate ()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
   if ( !userDetails || otp == "" )  return ;
   if ( currency.name == "usd" ) {
      (amt) *= 85.51 ;
   }
   else if ( currency.name == "eur" ) {
      (amt) *= 99.14 ;
   }
   const newBalance = Number ( userDetails.balance) + Number (amt) ;
   try {
      const userDocRef = doc ( db, 'Users' , userDetails.uid ) ;
      await updateDoc ( userDocRef , {balance : newBalance }) ;
       toast.success ( "Balance Added Successfully", {
         position : "top-center",
         }) ;
      setTimeout(() => {
      navigate('/dash/portfolio');
      }, 2000); 
   }
   catch ( e ) {
      console.error ( "Error updating Balance" , e ) ;
   }
  }

  return (
    <>
      {userDetails ? (
        <form className="otp" onSubmit={(e) => {
        e.preventDefault(); 
      }}>
          <h3>Enter OTP</h3>
            <input id="otp-input" type="number" value = {otp} onChange={(e) => setOtp(e.target.value)} required />
            <button id = "butt" onClick={handleSubmit}>Submit OTP</button>
            <p className="mt-2">Amount to Add : {currency.symbol} { amt } </p>
          <ToastContainer />
        </form>
      ) : (
        <p>Loading ...</p>
      )}
    </>
  );
};

export default Otp; 
