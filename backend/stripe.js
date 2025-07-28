import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config( { path : '../.env'}); 

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 
// console.log( process.env.STRIPE_SECRET_KEY) ;
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });
   //  console.log("Received amount:", amount);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
