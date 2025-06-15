import React, { useEffect, useState  } from 'react';
import { auth, db } from '../../backend/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate , useParams } from 'react-router-dom'
import './Add.css';

const Add = () => {
   const { amt } = useParams () ;
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate () ;
  const {currency} = useParams () ;

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

  return (
    <div className="right">
      <div className = "adding">
      {userDetails ? (
         <form onSubmit={(e) => {
               e.preventDefault();
               navigate(`otp`); // OR use useNavigate()
            }}>
            {/* {userDetails.balance} <br />{amt} */}
            <p>Card Number<input className="input2" type = "Number" required /> </p> 
            <p>Holder's Name<input className="input2" type = "text" required /> </p> 
            <p className="expiry-cvv">
               <lable>
                  Expiry Date <input className="input2" id="expiry" type = "Date" required /> 
               </lable>
               <lable>
                  CVV<input className="input2" id="cvv" type = "Number" required />
               </lable>
            </p>
               <button id="send-otp" type = "submit" > Send OTP</button>
         </form>

      ) : (
         <p> Loading ... </p>
      )}
      </div>
    </div>
  )
}

export default Add
