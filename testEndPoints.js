const axios = require('axios');

const measureResponseTime = async (url) => {
  const start = Date.now();
  await axios.get(url);
  const end = Date.now();
  return end - start;
};

const testEndpoints = async () => {
  const url = 'http://localhost:3000/api/puuid/nubsee/na1';
  
  let totalTime = 0;
  const iterations = 5;

  for (let i = 0; i < iterations; i++) {
    const time = await measureResponseTime(url);
    totalTime += time;
    console.log(`Request ${i + 1}: ${time} ms`);
  }

  const averageTime = totalTime / iterations;
  console.log(`Average Response Time: ${averageTime} ms`);
};

testEndpoints();
