import {CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements,} from '@stripe/react-stripe-js';
import { auth, db } from '../../backend/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { useContext, useEffect, useState } from 'react';
import { CoinContext } from '../components/context/coinContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CheckoutForm( {amt , onCompletion} ) {
  const stripe = useStripe() ;
  const elements = useElements() ;
  const [loading, setLoading] = useState(false) ;
  const [success, setSuccess] = useState(false) ;
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate () ;

  const [showOtp, setShowOtp] = useState( false ) ;
  const [no, setNo] = useState (false ) ;
  const [exp, setExp] = useState (false ) ;
  const [cvv, setCvv] = useState (false ) ;
  const [cardName, setCardName] = useState (false ) ;
  const [animateOtp, setAnimateOtp] = useState (false) ;
  const {currency} = useContext (CoinContext) ;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newAmt = (amt > 0 ? amt : - amt) * 100 ;

   //  console.log ( newAmt) ;
    const res = await fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: newAmt  }),
    });

    const {clientSecret} = await res.json();
    console.log ( clientSecret) ;

    if (!clientSecret ) {
  alert("Could not create payment intent. Try again.");
  setLoading(false);
  return;
}

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement), 
      },
    });

    if (paymentResult.error) {
      alert(paymentResult.error.message);
      onCompletion("false") ;
    } 

    else if (paymentResult.paymentIntent.status === 'succeeded') {
      setSuccess(true);

         if ( !userDetails ) {
            console.log (userDetails); 
            return ;
         }
         
         const newBalance = Number ( userDetails.balance) + Number (amt) ;
         if ( newBalance < 0 )  { 
            toast.error ( "Not Enough Fund", {
               position : "top-center",
               }) ;
            navigate ( '/dash/profile') ; 
            }
         try {
            const userDocRef = doc ( db, 'Users' , userDetails.uid ) ;
            await updateDoc ( userDocRef , {balance : newBalance }) ;
            if ( amt > 0 ) {
               toast.success ( "Balance Added Successfully", {
               position : "top-center",
               }) ;
            }
            else {
               toast.info ( "Balance Withdrawn Successfully", {
               position : "top-center",
               }) ;
            }
            setTimeout(() => {
            navigate('/dash/portfolio');
            }, 2000); 
         }
         catch ( e ) {
            console.error ( "Error updating Balance" , e ) ;
         }





      onCompletion("true") ;
    }

    setLoading(false);
  };

  const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
  };

  return (
    <form className="cardForm">
         {animateOtp && (
            <div className="animateOtp">
               <p >Sending OTP ...</p>
               <div className="spinnerOtp">
                  <div className="spinOtp">
                  </div>
               </div>
            </div>
         )}
         {showOtp && (
            <div className="otp">
               <span>Enter OTP to complete PAYMENT </span>
               <input type="number" required/>
               <button type="button" onClick={handleSubmit}> Continue </button>
               {/* {success &&  <p> successful </p>  } */}
               {loading && <p> processing ... </p> }
            </div>
         )}
         <div style={{ opacity: showOtp ? 0.000001 : 1 }}>
         <div className="cardNo" >
            <CardNumberElement options={{style, placeholder : 'Card Number' }} onChange={ (e) => setNo(e.complete) }/>
            </div>
         <div className="cvv">
            <CardExpiryElement options={{style, placeholder : 'Expiry Date' }} onChange={ (e) => setExp(e.complete)}  />
            <CardCvcElement options={{style, placeholder : 'CVV' }} onChange={(e) => setCvv(e.complete)} />
         </div>
         <input type="text" className="cardName" placeholder="Card Holder's Name" onChange={ (e) => setCardName(e.target.value.trim().length > 0 )} />
         <p><input type="checkbox" className="cardInput" /> Save this card as per RBI guidelines</p>
         <button type="button" onClick={ () => {
            if ( no && exp && cvv && cardName ) { 
               setAnimateOtp (true) ;
               setTimeout( () => {
                  setAnimateOtp (false) ;
                  setShowOtp (true) ;
               } , 3000 ) ;  
            }
            else     alert ( "Please enter proper card details ")
         }} >
            Send OTP
         </button>
         </div>
    </form>
  );
}

export default CheckoutForm ;