import React, { useEffect, useState  } from 'react';
import { auth, db } from '../../backend/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom'

const Withdraw = () => {
   const { amt } = useParams () ;
  const [userDetails, setUserDetails] = useState(null);
   const navigate = useNavigate () ;
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
    <div className = "right">
      {userDetails ? (
         <form id="withdraw-form" onSubmit={(e) => {
               e.preventDefault();
               navigate(`otp2`); // OR use useNavigate()
            }}>
            {/* {userDetails.balance} <br />{amt} */}
            <p>Account Number<input className="input2" type = "Number" required /> </p> 
            <p>Holder's Name<input className="input2" type = "text" required /> </p> 
            <p className="expiry-cvv">
               <lable>
                  IFSC Code <input id="expiry" type = "text" required /> 
               </lable>
               <lable>
                  CVV<input id="cvv" type = "Number" required />
               </lable>
            </p>
               <button id="send-otp" type = "submit" > Next </button>
         </form>

      )  : (
         <p> Loading ... </p>
      )}
    </div>
  )
}

export default Withdraw 
