import React, { useEffect, useState, useContext } from 'react';
import { auth, db } from '../../backend/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { CoinContext } from '../components/context/coinContext';
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const { currency } = useContext(CoinContext);

  const [amt, setAmt ] = useState ('') ;
   const navigate = useNavigate() ;

   const handleSubmit = (e)  => {
      if ( !amt || amt < 0 ) {
         toast.error("Please Enter a Valid Amount !", {
                     position: "top-center",
                  }) ;
         return ;
      }
      let finalAmt = amt ;
      if ( e ) {
         // console.log(userDetails.balance*getConversionRate() + Number(finalAmt)) ;
         
         if ( e == 'withdraw' )  {
            finalAmt = -finalAmt ;
            if ( userDetails.balance*getConversionRate() + Number(finalAmt) < 0 ) {
               toast.error("You don't have Enough Funds !", {
               position: "top-center",
            }) ;
            return ;
         }
            }
         finalAmt = (finalAmt * getConversionRate2()).toFixed(2) ;
         navigate ( `card/${finalAmt}`) ;
      }}

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

  const getConversionRate = () => {          // for converting balance fetched from the firestore
    switch (currency.name) {
      case "usd":
        return 1 / 85.51;
      case "eur":
        return 1 / 99.14;
      case "inr":
      default:
        return 1;
    }
  };

  const getConversionRate2 = () => {         // for converting balance added in the input box
    switch (currency.name) {
      case "usd":
        return 85.51;
      case "eur":
        return 99.14;
      case "inr":
      default:
        return 1;
    }
  };

  return (
    <div className="box">
      <div className="left">
      { userDetails ? (
        <>
          <div>
            <h3>Welcome {userDetails.fname}</h3>
            <h4>Email : {userDetails.email}</h4>
            <h4>
              Balance : {currency.symbol}
              {(userDetails.balance * getConversionRate()).toFixed(2)}
            </h4>
          </div>
        </>
         ) : (
        <p>Loading user data...</p>
      )}
      </div>


      <div className="right">
      <div className="right-child-1">
         <label><h5>Enter Amount </h5></label> 
         <p className="currency-sign">
            {currency.symbol}
         </p><input type = "number" className = "input-box" 
            name="amt" value={amt} onChange={(e) => setAmt(e.target.value)} required />
      </div>
      <div className="right-child-2">
         <button id="green" className = "butt" onClick={ () => handleSubmit('add')  } >
            Add Money
         </button>
         <button className="butt" id="red" onClick={ () => handleSubmit ('withdraw') } >
            Withdraw
         </button>
         </div>
      </div>
<ToastContainer />

    </div>
  );
}

export default Profile;
