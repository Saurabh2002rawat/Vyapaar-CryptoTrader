import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import './Card.css'
import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
 import AnimatePayment from './AnimatePayment'
import { CoinContext } from '../components/context/coinContext';
import { useINRAmount } from '../../backend/useINRAmount';

// console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 
function Card() {
   const  [isComplete,setIsComplete] = useState(false) ;
   const {currency} = useContext(CoinContext) ;
  
   const {amt} = useParams () ;
   const amount = Number (parseFloat(amt).toFixed(2)) ;
   const amountInINR = useINRAmount(amt, currency);

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

   <div className="badaCard">
      <div className="leftCard">
         <img src='/stripe-logo.png' />
         Stripe Payment Gateway
         <div className="lu">
            <p>Price Summary : { amt > 0 ? `CREDIT` : `DEBIT`  } </p>
            <p> {currency.symbol} {(Math.abs(amount) * getConversionRate() )?.toFixed(2)} </p>
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
