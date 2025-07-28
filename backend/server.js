const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express(); // ✅ this must come BEFORE app.use

// Allow requests from your frontend
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.get('/api/token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Token fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
