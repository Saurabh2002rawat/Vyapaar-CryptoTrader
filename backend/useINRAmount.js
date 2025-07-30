import { useEffect, useState } from 'react';

const getConversionRate = async (fromCurrency, toCurrency = 'INR') => {
  try {
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
    return null; 
  }
};

export const useINRAmount = (amt, currency) => {
  const [amountInINR, setAmountInINR] = useState(0);

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

  return amountInINR;
};
