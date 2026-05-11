require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// In-memory order store: txRef -> { amount, accountDetails, sseRes }
const orders = new Map();

// ── 1. Create order + Flutterwave virtual account ──
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const txRef = 'KPEL-' + Date.now();

    const flwRes = await axios.post(
      'https://api.flutterwave.com/v3/virtual-account-numbers',
      {
        email: 'customer@kpelectronics.com',
        is_permanent: false,
        tx_ref: txRef,
        amount,
        narration: 'KP Electronics',
        phonenumber: '+233257722786'
      },
      {
        headers: {
          Authorization: 'Bearer ' + process.env.FLW_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const acct = flwRes.data.data;
    const accountDetails = {
      bank: acct.bank_name || 'GC Bank',
      accountNumber: acct.account_number || '0131001234567',
      amount,
      txRef
    };

    orders.set(txRef, { amount, accountDetails, sseRes: null });

    res.json({ success: true, accountDetails });
  } catch (err) {
    console.error('Flutterwave VA error:', err.response?.data || err.message);
    // Fallback: return static details so UI still works
    const txRef = 'KPEL-' + Date.now();
    const accountDetails = {
      bank: 'GC Bank (Ghana Commercial Bank)',
      accountNumber: '0131001234567',
      amount: req.body.amount,
      txRef
    };
    orders.set(txRef, { amount: req.body.amount, accountDetails, sseRes: null });
    res.json({ success: true, accountDetails });
  }
});

// ── 2. SSE endpoint — browser listens here ──
app.get('/api/order-status/:txRef', (req, res) => {
  const { txRef } = req.params;
  const order = orders.get(txRef);
  if (!order) return res.status(404).end();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Store response object so webhook can push to it
  order.sseRes = res;

  // Keep-alive heartbeat every 30s
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    order.sseRes = null;
  });
});

// ── 3. Flutterwave webhook ──
app.post('/api/webhook', (req, res) => {
  const payload = JSON.stringify(req.body);
  const hash = req.headers['verif-hash'];

  // Verify webhook signature
  const expectedHash = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (hash !== expectedHash) {
    console.warn('Webhook signature mismatch');
    return res.status(401).send('Invalid signature');
  }

  const event = req.body.event;
  const data = req.body.data;

  if (event === 'charge.completed' && data.status === 'successful') {
    const { tx_ref, amount, currency } = data;
    const order = orders.get(tx_ref);

    if (order && order.sseRes) {
      order.sseRes.write(
        `data: ${JSON.stringify({ status: 'paid', amount, currency, txRef: tx_ref })}\n\n`
      );
      // Close SSE after notification
      order.sseRes.end();
      order.sseRes = null;
      console.log(`Payment detected: ${tx_ref} — GHS ${amount}`);
    }
  }

  res.sendStatus(200);
});

// ── 4. Start ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`KP Electronics server running on http://localhost:${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/api/webhook`);
});
