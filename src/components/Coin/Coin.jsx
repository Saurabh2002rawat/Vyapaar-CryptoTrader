import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../context/coinContext';
import { Link } from 'react-router-dom' ;
import './Coin.css'
import LineChart from '../LineChart/LineChart';

const Coin = () => {

   const {coinId} = useParams () ;
   const [coinData , setCoinData ] = useState () ;
   const [historicalData, seteHistoricalData] = useState () ;
   const {currency} = useContext ( CoinContext) ;

   const fetchCoinData = async () => {
      const options = {method: 'GET', headers: {accept: 'application/json'}};

         fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options)
         .then(res => res.json())
         .then(res => setCoinData(res))
         .catch(err => console.error(err));
   }

   const fetchHistoricalData = async() => {
      const options = {method: 'GET', headers: {accept: 'application/json'}};

      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options)    //days can be changd
      .then(res => res.json())
      .then(res => seteHistoricalData(res))
      .catch(err => console.error(err));
   }

   useEffect ( () => {
      fetchCoinData () ;
      fetchHistoricalData () ;
   } , [currency])

   if ( coinData && historicalData) {
      return ( 
         <div className = 'coin'>
            <div className = 'coin-name' >
               <img src={coinData.image.large} alt=''/>
               <p><b>
                     {coinData.name} ( {coinData.symbol.toUpperCase()})
               </b></p>
            </div>
            <div className="coin-chart">
               <LineChart historicalData={historicalData} />
            </div>
            <div className="coin-info">
               <ul>
                  <li>Crypto Market Rank</li>
                  <li>{coinData.market_cap_rank}</li>
               </ul>
               <ul>
                  <li>Current Price</li>
                  <li>{currency.symbol} {coinData.market_data.current_price [currency.name].toLocaleString()}</li>
               </ul>
               <ul>
                  <li>Market Cap</li>
                  <li>{currency.symbol} {coinData.market_data.market_cap [currency.name].toLocaleString()}</li>
               </ul>
               <ul>
                  <li>24 Hour Low</li>
                  <li>{currency.symbol} {coinData.market_data.low_24h [currency.name].toLocaleString()}</li>
               </ul>
               <ul>
                  <li>24 Hour High</li>
                  <li>{currency.symbol} {coinData.market_data.high_24h [currency.name].toLocaleString()}</li>
               </ul>

               <div className="buysell" >
                  <Link to={`/dash/buying/${coinId}`}>
                     <button className="butt1" id="buy-btn">BUY</button>
                  </Link>
                  <Link to={`/dash/selling/${coinId}`}> 
                     <button className="butt1" id="sell-btn">SELL</button>
                  </Link>
               </div>

            </div>
         </div>
      )
   }
   else {
      return (
         <div className="spinner">
            <div className="spin">
               
            </div>
         </div>
      )
   }
}

export default Coin
