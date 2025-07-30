import React, { useEffect, useState } from 'react';
import './AnimatePayment.css';

const PaymentStatus = ({ success }) => {
  const [statusDone, setStatusDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusDone(true);
    }, 3000);

    const redirectTimeout = setTimeout(() => {
      window.location.href = '/dash/profile';
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div className="containerr">
      <div
        className={`coinn ${statusDone ? (success ? 'successs' : 'faill') : ''}`}
        style={{ animation: !statusDone ? 'spin 3s linear forwards' : 'none' }}
      >
        {statusDone && (
          <div className="symboll">{success ? '✔' : '✖'}</div>
        )}
      </div>

      {statusDone && (
        <div className={`messagee ${success ? 'greenn' : 'redd'}`}>
          {success ? 'Payment Successful!' : 'Payment Failed!'}
          <p id="redirectt">Redirecting to Profile Page ...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
