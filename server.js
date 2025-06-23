const express = require('express'); // A tool to create the server
const bodyParser = require('body-parser'); // Helps read form data
const axios = require('axios'); // Sends info to Shopify

const app = express();
app.use(bodyParser.json());

// Set your store info here
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

app.post('/create-customer', async (req, res) => {
  const { name, first_name, last_name, email } = req.body;

  // Handle both "name" or "first_name"/"last_name"
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
          tags: 'popup-form'
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
    console.error('Shopify API Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to create customer' });
  }
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
