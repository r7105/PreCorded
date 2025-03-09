import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import logo from './logo.svg';
import './App.css';

function App() {
  const [botToken, setBotToken] = useState('');
  const [bots, setBots] = useState([]);
  const [botDetails, setBotDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const savedBots = JSON.parse(localStorage.getItem('bots')) || [];
    setBots(savedBots);
  }, []);

  const handleInputChange = (event) => {
    setBotToken(event.target.value);
  };

  const handleCreateBot = () => {
    fetch('/create-bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: botToken }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === 'Bot created and logged in successfully!') {
          fetchBotDetails(botToken);
        } else {
          alert(`Failed to create bot: ${data.error}`);
        }
      })
      .catch((error) => {
        alert(`Failed to create bot: ${error.message}`);
      });
  };

  const fetchBotDetails = (token) => {
    fetch('https://discord.com/api/v9/users/@me', {
      headers: {
        'Authorization': `Bot ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBotDetails(data);
        setOpenDialog(true);
      });
  };

  const handleConfirmBot = () => {
    const newBot = { token: botToken, details: botDetails, flows: [] };
    const updatedBots = [...bots, newBot];
    setBots(updatedBots);
    localStorage.setItem('bots', JSON.stringify(updatedBots));
    setBotToken('');
    setBotDetails(null);
    setOpenDialog(false);
    alert(`Bot with token "${botToken}" created!`);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBotDetails(null);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <img src={logo} className="App-logo" alt="logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PreCorded
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Create Your Custom Discord Bot
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter your Discord bot token below to create a new bot. You can manage your bots and their flows easily with PreCorded.
        </Typography>
        <TextField
          fullWidth
          label="Enter bot token"
          value={botToken}
          onChange={handleInputChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleCreateBot}>
          Create Bot
        </Button>
        <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
          Your Bots
        </Typography>
        {bots.map((bot, index) => (
          <Typography key={index} variant="body1">
            Bot {index + 1}: {bot.details.username} (ID: {bot.details.id})
          </Typography>
        ))}
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Bot Details</DialogTitle>
        <DialogContent>
          {botDetails && (
            <div>
              <Typography variant="body1">Name: {botDetails.username}</Typography>
              <Typography variant="body1">ID: {botDetails.id}</Typography>
              <Typography variant="body1">Owner: {botDetails.owner}</Typography>
              <img src={`https://cdn.discordapp.com/avatars/${botDetails.id}/${botDetails.avatar}.png`} alt="Bot Avatar" width="100" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBot} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
