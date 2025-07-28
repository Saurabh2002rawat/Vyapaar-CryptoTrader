import React, { useEffect, useState } from 'react';
import { auth, db } from '../../backend/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useContext } from "react";
import { CoinContext } from "../components/context/coinContext";
import './Portfolio.css'
import { Link } from 'react-router-dom'


function Portfolio() {
  const [userDetails, setUserDetails] = useState(null);
  const { allCoin,currency } = useContext(CoinContext);

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
      return 1 / 85.51 ;
    case "eur":
      return 1 / 99.14 ;
    case "inr":
    default:
      return 1;
  }
};

  return (
    <div className="home">
      {userDetails ? (
         <>
         <div className="heros">
          <h3>Your Portfolio</h3>
          {/* <p>Email: {userDetails.email}</p> */}
          <h4>Your Balance: {currency.symbol}
            { (userDetails.balance * getConversionRate() )?.toFixed(2)}</h4>
        </div>
         <div className="port">

      <div className="crypto-table">
         <div className="table-layout">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p style={{textAlign:"center"}}>Holdings</p>
            {/* <p>Shares</p> */}
            <p className='market-cap'>Market Value</p>
         </div> 

          {userDetails.portfolio ? (
            <>
               {Object.entries(userDetails.portfolio).map(([coinId, data]) => {
                  const coinInfo = allCoin.find(coin => coin.id === coinId);

               return (
                  <Link to={`/dash/coin/${coinInfo.id}`} key={coinId} className="table-layout">
                     <p>{coinInfo?.market_cap_rank || '-'}</p>
                     <div>
                        <img src={coinInfo?.image} alt={coinId} />
                        {coinInfo?.name || coinId.toUpperCase()}
                     </div>
                     <p>{currency.symbol}{coinInfo?.current_price?.toFixed(2) || '-'}</p>
                     <p style={{textAlign:"center"}}>
                        {data.amount}
                     </p>
                     <p className="market-cap">
                        {data.totalSpent?.toFixed(2) || '-'}
                     </p>
                     
                  </Link>
                  );
               })}
            </>
         ) : (
            <p>No coins owned yet.</p>
         )}

          </div>
          </div>
        </>
      ) : (
         <>
        <p>Loading user data...</p>
        <div className="spinner">
            <div className="spin">
               
            </div>
         </div>
         </>
      )}
    </div>
  );
}

export default Portfolio;
