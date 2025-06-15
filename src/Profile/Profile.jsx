import React, { useEffect, useState, useContext } from 'react';
import { auth, db } from '../../backend/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { CoinContext } from '../components/context/coinContext';
import './Profile.css'
import Enter from './Enter.jsx' ;
import { Route, Routes } from 'react-router-dom';
import Add from './Add.jsx'
import Withdraw from './Withdraw.jsx'
import Otp from './Otp.jsx'
import Otp2 from './Otp2.jsx'


function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const { currency } = useContext(CoinContext);

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

  const getConversionRate = () => {
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
      <Routes>
         <Route index element={<Enter/>} />
         <Route path="/add/:amt/*" element= {<Add />} />
         <Route path="/add/:amt/otp" element = {<Otp />} />
         <Route path="/withdraw/:amt/*" element = {<Withdraw />} />
         <Route path="/withdraw/:amt/otp2" element = {<Otp2 />} />

      </Routes>
    </div>
  );
}

export default Profile;
