require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// In-memory order store: txRef -> { amount, accountDetails, sseRes, customer }
const orders = new Map();

// ── Send SMS via Africa's Talking ──
async function sendSMS(phone, message) {
  const atUser = process.env.AT_USERNAME;
  const atKey = process.env.AT_API_KEY;
  if (!atUser || !atKey) {
    console.log(`[SMS would be sent] To: ${phone} — ${message}`);
    return;
  }
  try {
    const params = new URLSearchParams();
    params.append('username', atUser);
    params.append('to', phone);
    params.append('message', message);
    if (process.env.AT_FROM) params.append('from', process.env.AT_FROM);
    await axios.post('https://api.africastalking.com/version1/messaging', params.toString(), {
      headers: {
        apiKey: atKey,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log(`SMS sent to ${phone}`);
  } catch (err) {
    console.error('SMS failed:', err.response?.data || err.message);
  }
}

// ── 1. Create order + Flutterwave virtual account ──
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, name, phone, address } = req.body;
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

    orders.set(txRef, { amount, accountDetails, sseRes: null, customer: { name, phone, address } });

    res.json({ success: true, accountDetails });
  } catch (err) {
    console.error('Flutterwave VA error:', err.response?.data || err.message);
    // Fallback: return static details so UI still works
    const txRef = 'KPEL-' + Date.now();
    const { amount, name, phone, address } = req.body;
    const accountDetails = {
      bank: 'GC Bank (Ghana Commercial Bank)',
      accountNumber: '0131001234567',
      amount,
      txRef
    };
    orders.set(txRef, { amount, accountDetails, sseRes: null, customer: { name, phone, address } });
    res.json({ success: true, accountDetails });
  }
});

// ── 2. Save customer info (for MoMo/card payments) ──
app.post('/api/save-customer', (req, res) => {
  const { txRef, name, phone, address } = req.body;
  if (!txRef) return res.status(400).json({ success: false });
  let order = orders.get(txRef);
  if (!order) {
    order = { amount: 0, accountDetails: null, sseRes: null, customer: null };
    orders.set(txRef, order);
  }
  order.customer = { name, phone, address };
  res.json({ success: true });
});

// ── 3. SSE endpoint — browser listens here ──
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

    if (order) {
      // Send SMS notification to customer
      const cust = order.customer;
      if (cust && cust.phone) {
        const cleanPhone = cust.phone.replace(/[\s-]/g, '');
        const phone = cleanPhone.startsWith('0') ? '233' + cleanPhone.slice(1) : cleanPhone;
        const msg = `KP Electronics: Your order of GHS ${amount} has been received! You will receive your item(s) at: ${cust.address || 'your delivery address'}. Thank you for shopping with us.`;
        sendSMS(phone, msg);
      }

      // Notify via SSE
      if (order.sseRes) {
        order.sseRes.write(
          `data: ${JSON.stringify({ status: 'paid', amount, currency, txRef: tx_ref })}\n\n`
        );
        order.sseRes.end();
        order.sseRes = null;
        console.log(`Payment detected: ${tx_ref} — GHS ${amount}`);
      }
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
