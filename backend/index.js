const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('discord.js');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let bots = [];

app.post('/create-bot', async (req, res) => {
  const { token } = req.body;
  const bot = new Client();

  try {
    await bot.login(token);
    bots.push(bot);
    res.status(200).send({ message: 'Bot created and logged in successfully!' });
  } catch (error) {
    res.status(400).send({ message: 'Failed to log in bot', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend service running at http://localhost:${port}`);
});