const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// CORS Setup - allow Shopify store
app.use(cors({
  origin: [
  'https://sculptartisans.co.in',
  'https://6bbnvk-y9.myshopify.com'
],

  credentials: true
}));

// Set your store info
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

app.post('/create-customer', async (req, res) => {
  const { name, first_name, last_name, email } = req.body;

  const fName = first_name || (name ? name.split(' ')[0] : '');
  const lName = last_name || (name ? name.split(' ').slice(1).join(' ') : '');

  if (!email || !fName) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    await axios.post(
  `https://${SHOPIFY_STORE}/admin/api/2023-10/customers.json`,
  {
    customer: {
      first_name: fName,
      last_name: lName,
      email,
      tags: 'popup-form',
      accepts_marketing: true,
      marketing_opt_in_level: 'single_opt_in'
    }
  },
  {
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      'Content-Type': 'application/json'
    }
  }
);


    res.json({ success: true, message: 'Customer created!' });
 } catch (error) {
  const errData = error.response?.data;

  console.error('Shopify API Error:', errData || error.message);

  // Handle duplicate email error
  if (errData?.errors?.email?.includes('has already been taken')) {
    return res.status(409).json({ success: false, message: 'Email already subscribed' });
  }

  res.status(500).json({ success: false, message: 'Failed to create customer' });
}

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
