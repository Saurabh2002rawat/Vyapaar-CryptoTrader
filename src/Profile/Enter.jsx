import { Link, useNavigate } from 'react-router-dom';
import { CoinContext } from '../components/context/coinContext';
import { useContext, useState } from 'react';

const Enter = () => {
   const { currency } = useContext(CoinContext);
   const [amt, setAmt ] = useState ('') ;
   const [action, setAction ] = useState ( '' ) ;
   const navigate = useNavigate () ;
   const handleSubmit = (e)  => {
      e.preventDefault () ;
      if ( !amt ) {
         alert ( "Enter a valid number " ) ;
      }
      if ( action ) {
         navigate ( `${action}/${amt}`)
      }

   }
   return (
         <div className="right">
      <form onSubmit={handleSubmit} >
         <div className="right-child-1">
            <label><h5>Enter Amount </h5></label> 
            <p className="currency-sign">
               {currency.symbol}
            </p><input type = "number" className = "input-box" 
               name="amt" value={amt} onChange={(e) => setAmt(e.target.value)} required />
         </div>
         <div className="right-child-2">
            <button id="green" className = "butt" onClick={ () => setAction('add')} >
               Add Money
            </button>
            <button className="butt"  id="red" onClick={ () => setAction('withdraw')} >
               Withdraw
            </button>
            </div>
      </form>
         </div>
  )
}

export default Enter
