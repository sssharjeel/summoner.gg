const express = require('express');
const axios = require('axios');
const cors = require('cors');
const redis = require('@redis/client');

const app = express();
const port = 3000;
const apikey = 'RGAPI-6e5d1ad7-3558-4a9d-a076-e5da1568aa20';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to Redis...');
});

client.on('error', (err) => {
  console.log('Redis error: ' + err);
});

client.connect();  // Ensure the client connects

// Use CORS middleware
app.use(cors());

app.get('/api/puuid/:ign/:tag', async (req, res) => {
  const { ign, tag } = req.params;
  const cacheKey = `puuid:${ign}:${tag}`;

  console.log(`Received request for PUUID with ign: ${ign}, tag: ${tag}`);

  try {
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}, making API call`);

    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${ign}/${tag}?api_key=${apikey}`;
    const response = await axios.get(url);
    await client.set(cacheKey, JSON.stringify(response.data.puuid), 'EX', 3600); // Use EX to set an expiration time
    res.json(response.data.puuid);
  } catch (error) {
    console.error('Error getting PUUID:', error);
    res.status(500).json({ error: 'Error getting PUUID' });
  }
});

app.get('/api/match-ids/:puuid', async (req, res) => {
  const { puuid } = req.params;
  const cacheKey = `match-ids:${puuid}`;

  try {
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}, making API call`);

    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apikey}`;
    const response = await axios.get(url);
    await client.set(cacheKey, JSON.stringify(response.data), 'EX', 3600); // Use EX to set an expiration time
    res.json(response.data);
  } catch (error) {
    console.error('Error getting match IDs:', error);
    res.status(500).json({ error: 'Error getting match IDs' });
  }
});

app.get('/api/match-data/:matchId', async (req, res) => {
  const { matchId } = req.params;
  const cacheKey = `match-data:${matchId}`;

  try {
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}, making API call`);

    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apikey}`;
    const response = await axios.get(url);
    await client.set(cacheKey, JSON.stringify(response.data), 'EX', 3600); // Use EX to set an expiration time
    res.json(response.data);
  } catch (error) {
    console.error('Error getting match data:', error);
    res.status(500).json({ error: 'Error getting match data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
