// Server-side payment verification with Paystack
// This is a Node.js/Express example for verifying payments

const express = require('express');
const fetch = require('node-fetch'); // or use native fetch in Node 18+
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Replace with your Paystack secret key
const PAYSTACK_SECRET_KEY = 'YOUR_PAYSTACK_SECRET_KEY'; // sk_test_... or sk_live_...

// Verify payment endpoint
app.get('/verify-payment/:reference', async (req, res) => {
  const reference = req.params.reference;
  
  try {
    // Call Paystack API to verify transaction
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status && data.data.status === 'success') {
      // Payment is successful
      const transaction = data.data;
      
      // Here you would typically:
      // 1. Save the transaction to your database
      // 2. Generate and send ticket/receipt to customer
      // 3. Update inventory/booking system
      
      console.log('Verified payment:', {
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert from kobo to KES
        email: transaction.customer.email,
        status: transaction.status
      });
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          email: transaction.customer.email,
          package: transaction.metadata?.package || 'Ticket'
        }
      });
    } else {
      // Payment failed or not found
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: data.message || 'Transaction not successful'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.message
    });
  }
});

// Webhook endpoint for Paystack notifications (optional)
app.post('/paystack-webhook', (req, res) => {
  const event = req.body;
  
  // Verify webhook signature (recommended for production)
  // const signature = req.headers['x-paystack-signature'];
  
  if (event.event === 'charge.success') {
    const transaction = event.data;
    
    console.log('Webhook - Payment successful:', {
      reference: transaction.reference,
      amount: transaction.amount / 100,
      email: transaction.customer.email
    });
    
    // Process the successful payment
    // Send confirmation email, generate ticket, etc.
  }
  
  res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view your website`);
});

module.exports = app;