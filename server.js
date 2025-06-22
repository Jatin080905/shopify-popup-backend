const cors = require('cors');
app.use(cors());
const express = require('express'); // A tool to create the server
const bodyParser = require('body-parser'); // Helps read form data
const axios = require('axios'); // Sends info to Shopify

const app = express();
app.use(bodyParser.json());

// Set your store info here
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

app.post('/create-customer', async (req, res) => {
  const { name, email } = req.body;
  const [first_name, ...rest] = name.split(' ');
  const last_name = rest.join(' ');
  
  try {
    await axios.post(
      `https://${SHOPIFY_STORE}/admin/api/2023-10/customers.json`,
      {
        customer: {
          first_name,
          last_name,
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
    res.status(500).json({ success: false, message: 'Failed to create customer' });
  }
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
