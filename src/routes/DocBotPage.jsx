import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton.jsx';
import TextField from '@mui/material/TextField';

function DocBotPage() {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Endpoint for POST to Chatbot
      const response = await fetch('http://127.0.0.1:5000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: inputText }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Add user input and bot response to a conversation array to display conversation history
      setConversation([
        ...conversation, // Creates a spread of the conversation
        { text: inputText, user: true },
        { text: data.response, user: false },
      ]);


      // Set input to blank after POST
      setInputText('');
    } catch (error) {
      console.error('Error submitting input:', error);
    }
  };


  useEffect(() => {
    const startConversation = async () => {
      try {
        // Endpoint for Start - Welcome message
        const response = await fetch('http://127.0.0.1:5000/start');
        const data = await response.json();
        // Set up the initial conversation with the start message
        setConversation([{ text: data.message, user: false }]);
      } catch (error) {
        console.error('Error initiating conversation:', error);
      }
    };

    startConversation();
  }, []);


  
  return (
    <div style={{ height: '100%', margin: 0 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            border: '1px solid #000',
            borderRadius: '10px',
            padding: '20px',
            width: '60%',
            height: '60%',
          }}
        >
          {conversation.map((message, index) => (
            <div key={index} className={message.user ? 'user' : 'bot'}>
              {message.text}
            </div>
          ))}
        </Box>
        <div style={{ padding: '1rem' }}>
          <TextField
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <PrimaryButton text={'Submit'} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default DocBotPage;
