import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../backend/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CoinContext } from '../context/coinContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import emailjs from '@emailjs/browser'
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

   buying_email (sellAmount, userData.balance - totalGainInINR, totalGain) ;   // calling emailJs



    setTimeout(() => {
      navigate('/dash/portfolio');
   }, 3000); 
  };

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

  const owned = userData?.portfolio?.[coinId]?.amount || 0;

  /////////////////////////////// send email using email js 

  const buying_email = (sellAmt, upd_bal, totalCost) => {
      // e.preventDefault () ;
      const templateParams = {
         name: userData.fname,
         email: userData.email,
         currency_sign: currency.symbol,
         prev_bal : ("₹ " + userData.balance) ,
         upd_bal : ("₹ " + upd_bal ),
         coin : coinData?.name || coinId,
         amt: sellAmt ,
         Price : price.toFixed(2),
         // cost : totalCost,
         holdings : owned
      };
      emailjs.send( 
         import.meta.env.VITE_EMAILJS_SERVICE_ID_2,
         import.meta.env.VITE_EMAILJS_TEMPLATE_ID_2,
         templateParams, 
         import.meta.env.VITE_EMAILJS_USER_ID_2
      ).then( () => {
      toast.success ( "Invoice Sent on your registered Email !" , {
         position : "top-center",
      }) ;
      },(error) => {
      toast.error( "Sorry ! Failed to send Invoice ! Error : " + error.text , {
         position: "top-center",
         }) ;
      }
      );
   };

///////////////////////////////


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
            {(userData.balance * getConversionRate()).toFixed(2)}{' '}
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
