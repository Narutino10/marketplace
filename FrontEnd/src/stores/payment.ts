

   // stores/payment.ts
   import { ref } from 'vue';
   import { defineStore } from 'pinia';
   import axiosInstance from "@/services/api";
   import { loadStripe } from '@stripe/stripe-js';
   
   const stripePromise = loadStripe('pk_test_51MzKwrI4CWQS7W9jUqGbkjMfywCGLlu3ssgCbslIKp31FYWHiOrDnZmuUK1QNOMZ35v1QgR3dB1FkoRhWjwbprii00vdSRgTX6'); // Replace with your public key
   
   export const usePaymentStore = defineStore('payment', () => {
       const loading = ref(false);
       const error = ref('');
       const stripe = ref(null);
       const elements = ref(null);
       const card = ref(null);
   
       // Mock cart items
       const cartItems = ref([
           { _id: 'mock1', name: 'Test Product 1', quantity: 1, price: 10 },
           { _id: 'mock2', name: 'Test Product 2', quantity: 2, price: 20 }
       ]);
   
         // const cartStore = useCartStore(); // Comment this out for now
       // const cartItems = cartStore.cartItems; // Comment this out for now
       
       const initializeStripe = async () => {
           stripe.value = await stripePromise;
           elements.value = stripe.value.elements();
           card.value = elements.value.create('card');
           card.value.mount('#card-element');
       };
   
       const createPaymentIntent = async (amount: number, customerEmail: string) => {
           try {
               const response = await axiosInstance.post('/stripe/create-payment-intent', {
                   amount,
                   customer: { email: customerEmail || 'test@example.com' }
               });
               return response.data.clientSecret;
           } catch (err) {
               console.error('Error creating payment intent:', err);
               throw new Error('An error occurred. Please try again.');
           }
       };
   
       const handleCardPayment = async (cardName: string) => {
           loading.value = true;
           error.value = '';
   
           try {
               const items = cartItems.value.length > 0 ? cartItems.value : [
                   { _id: 'mock1', name: 'Test Product', quantity: 1, price: 10 }
               ];
   
               const amount = items.reduce((total, item) => total + item.price * item.quantity, 0) * 100;
               const clientSecret = await createPaymentIntent(amount, cardName);
   
               const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret, {
                   payment_method: {
                       card: card.value,
                       billing_details: { name: cardName }
                   }
               });
   
               if (stripeError) {
                   console.error(stripeError.message);
                   error.value = stripeError.message;
               } else {
                   console.log('Payment successful!', paymentIntent);
                   window.location.href = 'http://localhost:5173/paymentSuccess'; // Redirect to success page
               }
           } catch (err) {
               console.error('Error during card payment:', err);
               error.value = err.message;
           } finally {
               loading.value = false;
           }
       };
   
       const handlePaypalCheckout = async (customerEmail: string) => {
           loading.value = true;
           error.value = '';
   
           try {
               const items = cartItems.value.length > 0 ? cartItems.value : [
                   { _id: 'mock1', name: 'Test Product', quantity: 1, price: 10 }
               ];
   
               const response = await axiosInstance.post('/stripe/create-paypal-checkout-session', {
                   items,
                   customer: { email: customerEmail || 'test@example.com' }
               });
   
               const { sessionId } = response.data;
               const { error } = await stripe.value.redirectToCheckout({ sessionId });
   
               if (error) {
                   console.error('Error redirecting to Stripe Checkout:', error);
                   throw new Error('An error occurred. Please try again.');
               }
           } catch (err) {
               console.error('Error creating PayPal checkout session:', err);
               error.value = err.message;
           } finally {
               loading.value = false;
           }
       };
   
       return {
           loading,
           error,
           initializeStripe,
           handleCardPayment,
           handlePaypalCheckout
       };
   });