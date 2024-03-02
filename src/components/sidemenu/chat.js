import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");

  useEffect(() => {
    const chatList = document.getElementById('chatList');
    if (chatList) {
      chatList.scrollTop = chatList.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { author: 'You', text, timestamp: new Date().toLocaleTimeString() };
    setMessages((messages) => [...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = text;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = await response.text();

      setTimeout(() => {
        const aiMessage = { author: 'Gemini', text: aiText, timestamp: new Date().toLocaleTimeString() };
        setMessages((messages) => [...messages, aiMessage]);
        setLoading(false);
      }, 2000); // Adjust delay as needed or integrate with actual API call
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages((messages) => [...messages, { author: 'AI', text: "Sorry, I couldn't fetch a response.", timestamp: new Date().toLocaleTimeString() }]);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      sendMessage(input);
      event.preventDefault();
    }
  };

  const MessageItem = ({ message }) => (
    <ListItem sx={{ display: 'flex', flexDirection: message.author === 'You' ? 'row-reverse' : 'row', mb: 1 }}>
      <Box sx={{
        maxWidth: '70%',
        py: 1,
        px: 2,
        bgcolor: message.author === 'You' ? '#005792' : '#4A5568',
        borderRadius: '10px',
        color: 'white',
        textAlign: 'left',
      }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>{message.author}</Typography>
        <Typography variant="body2">{message.text}</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5, fontSize: '0.7rem' }}>{message.timestamp}</Typography>
      </Box>
    </ListItem>
  );

  return (
    <Paper sx={{
      backgroundColor: '#1A202C',
      color: '#CBD5E0',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#E2E8F0' }}>
        Gemini Chat
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
          <MessageItem key={index} message={message} />
        ))}
        {loading && (
          <ListItem sx={{ justifyContent: 'center' }}>
            <CircularProgress color="secondary" />
          </ListItem>
        )}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          disabled={loading}
        />
        <Button
          variant="contained"
          sx={{
            ml: 2,
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
      </Box>
    </Paper>
  );
};

export default Chat;
