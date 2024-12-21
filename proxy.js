const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: 'Missing url query parameter' });
    return;
  }

  // Validate the target URL
  try {
    const targetUrl = new URL(url);
    if (targetUrl.hostname !== 'api.truckersmp.com') {
      res.status(403).json({ error: 'Forbidden: URL not allowed' });
      return;
    }
  } catch (e) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).send(errorText);
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching the target URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
