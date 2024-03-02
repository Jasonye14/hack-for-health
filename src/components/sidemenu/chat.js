import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");

  useEffect(() => {
    // Scroll to the last message
    const chatList = document.getElementById('chatList');
    if (chatList) {
      chatList.scrollTop = chatList.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { author: 'You', text, timestamp: new Date().toLocaleTimeString() };
    setMessages(messages => [...messages, userMessage]);
    setInput(''); // Clear input after sending
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = text;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = await response.text();

      const aiMessage = { author: 'Gemini', text: aiText, timestamp: new Date().toLocaleTimeString() };
      setMessages(messages => [...messages, aiMessage]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages(messages => [...messages, { author: 'AI', text: "Sorry, I couldn't fetch a response.", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage(input);
      event.preventDefault();
    }
  };

  return (
    <Paper sx={{
      backgroundColor: '#1A202C',
      color: '#CBD5E0',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#E2E8F0' }}>
        Gemini
      </Typography>
      <List id="chatList" sx={{
        maxHeight: '70vh',
        overflow: 'auto',
        backgroundColor: '#2D3748',
        color: '#E2E8F0',
        marginBottom: '20px',
        borderRadius: '4px',
        padding: '10px',
      }}>
        {messages.map((message, index) => (
          <ListItem key={index} sx={{ color: '#CBD5E0 !important' }}>
            <ListItemText primary={`${message.author} at ${message.timestamp}`} secondary={message.text} />
          </ListItem>
        ))}
      </List>
      <div>
        <TextField
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: '#4A5568',
              },
              '&:hover fieldset': {
                borderColor: '#A0AEC0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#63B3ED',
              },
            },
            '& .MuiInputLabel-outlined': {
              color: '#A0AEC0',
            },
            backgroundColor: '#2D3748',
            borderRadius: '4px',
          }}
          label="Type your message here..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          sx={{
            marginLeft: '10px',
            backgroundColor: '#005792',
            color: 'white',
            '&:hover': {
              backgroundColor: '#003D5B',
            },
          }}
          onClick={() => sendMessage(input)}
          disabled={loading}
        >
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default Chat;
