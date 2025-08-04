import { useEffect, useState } from 'react';

// Fetch conversion rate between two currencies
const getConversionRate = async (from, to) => {
  try {
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}`
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Conversion rate error:", error);
    return null;
  }
};

// Hook to convert amount between any two currencies
export const useCurrencyConversion = (amount, fromCurrency, toCurrency) => {
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    const convert = async () => {
      if (!amount || isNaN(amount)) return;
      const rate = await getConversionRate(fromCurrency, toCurrency);
      if (rate) {
        setConvertedAmount(Number((amount * rate).toFixed(2)));
      }
    };
    convert();
  }, [amount, fromCurrency, toCurrency]);

  return convertedAmount;
};
