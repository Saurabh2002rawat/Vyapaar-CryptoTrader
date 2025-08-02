import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../backend/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CoinContext } from '../context/coinContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useINRAmount } from '../../../backend/useINRAmount';
import './transaction.css'

const Selling = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState(null);
  const [amount, setAmount] = useState('');
     const [coinData , setCoinData ] = useState () ;
  
  const [userData, setUserData] = useState(null);
  const [inrToSelectedRate, setInrToSelectedRate] = useState(1);
  const { currency } = useContext(CoinContext);

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


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        const userRef = doc(db, 'Users', u.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserData({ ...snap.data(), id: u.uid });
        }
      }
    });

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency.name}`)
      .then(res => res.json())
      .then(data => setPrice(data[coinId]?.[currency.name]))
      .catch(err => console.error(err));

    if (currency.name !== 'inr') {
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=usd,eur&vs_currencies=inr`)
        .then(res => res.json())
        .then(data => {
          const rates = {
            usd: data.usd.inr,
            eur: data.eur.inr
          };
          if (rates[currency.name]) {
            setInrToSelectedRate(1 / rates[currency.name]);
          }
        })
        .catch(err => console.error(err));
    } else {
      setInrToSelectedRate(1);
    }

    return () => unsubscribe();
  }, [coinId, currency]);

  const handleSell = async () => {
    if (!userData || !price) return;

    const sellAmount = parseFloat(amount);
    if (isNaN(sellAmount) || sellAmount <= 0) {
      toast.warning ("Please Enter a Valid Amount !", {
         position: "top-center"
      });
      return;
    }

    const portfolio = userData.portfolio || {};
    const coin = portfolio[coinId];

    if (!coin || coin.amount < sellAmount) {
       toast.error("Not Enough Coins to Sell !", {
         position: "top-center"
      });
      return;
    }

    const totalGain = price * sellAmount;
    const totalGainInINR = totalGain / inrToSelectedRate;

    const updatedPortfolio = { ...portfolio };
    const newAmount = coin.amount - sellAmount;
    const spentPerCoin = coin.totalSpent / coin.amount;
    const newTotalSpent = spentPerCoin * newAmount;

    if (newAmount <= 0) {
      delete updatedPortfolio[coinId];
    } else {
      updatedPortfolio[coinId] = {
        amount: newAmount,
        totalSpent: newTotalSpent
      };
    }

    await updateDoc(doc(db, 'Users', userData.id), {
      balance: userData.balance + totalGainInINR,
      portfolio: updatedPortfolio
    });

    toast.info(`Sold ${sellAmount} ${coinId} for ${currency.symbol}${totalGain.toFixed(2)}`, {
      position: "top-center",
      autoClose: 3000 
   });
    setAmount('');
    setTimeout(() => {
      navigate('/dash/portfolio');
   }, 3000); 
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
         <h2>Sell {coinId.toUpperCase()}</h2>
          <p className="currentPrice">Current Price: {currency.symbol}{price}</p>
          <p>
            Your Balance: {currency.symbol}
            {(userData.balance * inrToSelectedRate).toFixed(2)}{' '}
            <span style={{ fontSize: '0.8em', color: 'gray' }}>(₹{userData.balance})</span>
          </p>
          <p>You own: {owned} {coinId}</p>
          <input
             className="input3"
            type="number"
            value={amount}
            placeholder="Amount to sell"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-danger mt-2" id="sell-btn2" onClick={handleSell}>
            Sell Now
          </button>
          </div>
          </div>
        </>
      ) : (
        <div className="spinner" style={{ marginBottom: "100px" }}>
            <div className="spin">
            </div>
         </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Selling;
