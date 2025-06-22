const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (including your Shopify store)
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Shopify API variables
const SHOPIFY_API_URL = 'https://6bbnvk-y9.myshopify.com/admin/api/2024-04/customers.json';
const SHOPIFY_ACCESS_TOKEN = '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'; // Use your full API token here

// Create new customer
app.post('/create-customer', async (req, res) => {
  const { name, email } = req.body;

  try {
    const response = await axios.post(
      SHOPIFY_API_URL,
      {
        customer: {
          first_name: name,
          email: email,
          tags: 'popup-signup'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
        }
      }
    );

    console.log('Customer created:', response.data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating customer:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Popup Backend is live!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
