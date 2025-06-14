import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../backend/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CoinContext } from '../context/coinContext';
import './transaction.css'

const Buying = () => {
  const { coinId } = useParams();
   const [coinData , setCoinData ] = useState () ;
  
  const navigate = useNavigate();
  const [price, setPrice] = useState(null);
  const [amount, setAmount] = useState('');
  const [userData, setUserData] = useState(null);
  const [inrToSelectedRate, setInrToSelectedRate] = useState(1); // Exchange rate
  const { currency } = useContext(CoinContext);

  useEffect(() => {
    // Fetch current user data
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        const userRef = doc(db, 'Users', u.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserData({ ...snap.data(), id: u.uid });
        }
      }
    });
    
   

    // Fetch coin price in selected currency
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency.name}`)
      .then(res => res.json())
      .then(data => setPrice(data[coinId]?.[currency.name]))
      .catch(err => console.error(err));

    // Fetch INR to selected currency rate
    if (currency.name !== 'inr') {
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=usd,eur&vs_currencies=inr`)
        .then(res => res.json())
        .then(data => {
          const rates = {
            usd: data.usd.inr,
            eur: data.eur.inr
          };
          if (rates[currency.name]) {
            setInrToSelectedRate(1 / rates[currency.name]); // INR → USD/EUR
          }
        })
        .catch(err => console.error(err));
    } else {
      setInrToSelectedRate(1); // 1:1 for INR
    }

    return () => unsubscribe();
  }, [coinId, currency]);

  const fetchCoinData = async () => {
      const options = {method: 'GET', headers: {accept: 'application/json'}};

         fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options)
         .then(res => res.json())
         .then(res => setCoinData(res))
         .catch(err => console.error(err));
   }
    useEffect ( () => {
          fetchCoinData () ;
       } , [currency])

  const handleBuy = async () => {
    if (!userData || !price) return;

    const buyAmount = parseFloat(amount);
    if (isNaN(buyAmount) || buyAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const totalCost = price * buyAmount;

    // Convert displayed currency cost to INR for comparison
    const totalCostInINR = totalCost / inrToSelectedRate;

    if (totalCostInINR > userData.balance) {
      alert(`Not enough balance (in ${currency.name.toUpperCase() })`);
      return;
    }

    const portfolio = userData.portfolio || {};
    const existing = portfolio[coinId];

    const newAmount = existing ? existing.amount + buyAmount : buyAmount;
    const newTotalSpent = existing ? existing.totalSpent + totalCost : totalCost;

    portfolio[coinId] = {
      amount: newAmount,
      totalSpent: newTotalSpent
    };

    await updateDoc(doc(db, 'Users', userData.id), {
      balance: userData.balance - totalCostInINR,
      portfolio
    });

    alert(`Bought ${buyAmount} ${coinId} for ${currency.symbol}${totalCost.toFixed(2)}`);
    setAmount('');
    navigate('/dash/portfolio');
  };

  const owned = userData?.portfolio?.[coinId]?.amount || 0;

  return (
    <div className="container mt-4" id="trxn">

      {price !== null && userData ? (
        <>
      <div className="bada">
         <div>
            <img  className="sell-img" src={coinData?.image?.large} alt={coinData?.name || 'coin'} />
         </div>
         <div className="sell-left" >
      <h2>Buy {coinId.toUpperCase()}</h2>
          <p  className="currentPrice">Current Price: {currency.symbol}{price}</p>
          <p>
            Your Balance: {currency.symbol}
            {(userData.balance * inrToSelectedRate).toFixed(2)}{' '}
            <span style={{ fontSize: '0.8em', color: 'gray' }}>(converted from ₹{userData.balance})</span>
          </p>
           <p>You own: {owned} {coinId}</p>
          <input
            className="input3"
            type="number"
            value={amount}
            placeholder={`Amount to buy (${coinId})`}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-success mt-2" id="sell-btn2" onClick={handleBuy}>
            Buy Now
          </button>
          </div>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    
      </div>

  );
};

export default Buying;
