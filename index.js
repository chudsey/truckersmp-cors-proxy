const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Proxy Route
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url query parameter' });
    }

    // Validate the target URL
    try {
        const url = new URL(targetUrl);
        if (url.hostname !== 'api.truckersmp.com') {
            return res.status(403).json({ error: 'Forbidden' });
        }
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching the target URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Health Check Route
app.get('/', (req, res) => {
    res.send('TruckersMP CORS Proxy is running. Use the /proxy route with a URL parameter.');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
