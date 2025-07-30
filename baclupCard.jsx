import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import './Card.css'
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
 import AnimatePayment from './AnimatePayment'
import { CoinContext } from '../components/context/coinContext';

// console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 
function Card() {
   const  [isComplete,setIsComplete] = useState(false) ;
  const {currency} = useContext(CoinContext) ;
const [amountInINR, setAmountInINR] = useState(null);
   const {amt} = useParams () ;


 useEffect(() => {
    const convert = async () => {
      let value = parseFloat(amt);
      if (currency.name.toLowerCase() !== 'inr') {
        const rate = await getConversionRate(currency.name.toUpperCase());
        value *= rate;
      }
      setAmountInINR(Number(value.toFixed(2)));
    };

    convert();
  }, [amt, currency]);

  const getConversionRate = async (fromCurrency) => {
    const response = await fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=INR`);
    const data = await response.json();
    return data.result;
  };


   const amount = Number (parseFloat(amt).toFixed(2)) ;
  return (

   <div className="badaCard">
      <div className="leftCard">
         <img src='/stripe-logo.png' />
         Stripe Payment Gateway
         <div className="lu">
            <p>Price Summary : { amt > 0 ? `CREDIT` : `DEBIT`  } </p>
            <p> {currency.symbol} {amount > 0 ? amount : -amount} </p>
         </div>
         <div className="ld">
               <i className='bx bx-id-card'></i>  Using as +91 999-9999-999 <i className='bx bx-chevron-right'></i>
         </div>
      </div>
      <div className="rightCard">
      {
         isComplete && <AnimatePayment success={isComplete} />             // coin animation for success/failure
      }
      {
         !isComplete && (
         <>
         <div className="rlCard">
            <p> <i className='bx bx-arrow-back'  ></i> </p>
            <div className="rlBox"> 
               <div>UPI </div> 
               <div className="rlBoxDiv"> <img src='/g-pay.webp' /><img src='/paytm.png' /> <img src='/pop.png' /></div>
            </div>
            <div className="rlBox"> 
               <div>Card </div> 
               <div className="rlBoxDiv"> <img src='/flipkart.png' /><img src='/mobi.png' /></div>
            </div>
            <div className="rlBox"> 
               <div>Wallet </div> 
               <div className="rlBoxDiv"> <img src='/master-card.png' /><img src='/visa.png' /></div>
            </div>
            <div className="rlBox"> 
               <div>Net Banking </div> 
               <div className="rlBoxDiv"> <img src='/sbi.webp'/><img src='/bob.png'/><img src='/pnb.png' /></div>
            </div>
            <button>More Options</button>
         </div>
         <div className="rrCard">
            <div className='rrCardTop'>
               <div>Payment Details     </div>
               <div> <i className='bx bx-dots-horizontal-rounded'></i> 
                  <i className='bx bx-x'  ></i>  </div>
            </div>
            <div className="stripeElement">
       {/* <p id="cardP">Add a New Card </p> */}

               <Elements stripe={stripePromise}>
                  <CheckoutForm amt={amountInINR} onCompletion={(value)=> setIsComplete(value)}/>
               </Elements>
            </div>
         </div>
         </>
         )}
         </div>

    </div>
  );
}

export default Card ;
