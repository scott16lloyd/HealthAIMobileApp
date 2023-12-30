import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../components/auth/AuthContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MobileUserHeader from '../../components/widgets/MobileUserHeader/MobileUserHeader';
import {
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';

function DocBotPage() {
  const outerWrapper = {
    display: 'flex',
    flexDirection: 'column',
    height: '95vh',
    overflow: 'hidden',
  };

  const stageStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.8rem',
    flexShrink: 0,
    gap: '1rem',
    overflow: 'hidden',
  };

  const mainWrapper = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  };

  const chatWindowSurface = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: 'calc(70vh - 100px)',
    borderRadius: '11px',
    padding: '1rem',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    overflow: 'auto',
    position: 'relative',
  };

  const inputStyle = {
    width: '85%',
    position: 'absolute',
    bottom: '2rem',
    borderRadius: '5px',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    alignSelf: 'center',
  };

  const botMessageBubble = {
    backgroundColor: 'rgba(0, 117, 255, 0.4)',
    width: '75%',
    padding: '0.3rem',
    justifyContent: 'flex-start',
  };

  const userMessageBubble = {
    backgroundColor: 'white',
    width: '75%',
    padding: '0.3rem',
    marginLeft: '5rem',
    justifyContent: 'flex-end',
    wordWrap: 'break-word',
  };

  // Message bubble logic
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content:
        'Hello, I am the DocBot. Ask me a question or tell me a symptom and I will try my best to recommend a solution. ',
    },
  ]);
  const [input, setInput] = useState('');

  // Chat window ref
  const chatWindowRef = React.useRef(null);

  // Allow for auto scroll when new messeage submitted
  const scrollToBottom = () => {
    chatWindowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { type: 'user', content: input }]);
      setInput('');
      // Logic to generate bot response and update messages state
    }
  };
  return (
    <>
      <div style={outerWrapper}>
        <MobileUserHeader />
        <div style={stageStyle}>
          <Typography variant="h4">Welcome to DocBot</Typography>
          <div style={mainWrapper}>
            <Paper elevation={1} style={chatWindowSurface}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={message.type}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <Paper
                    elevation={2}
                    style={
                      message.type === 'bot'
                        ? botMessageBubble
                        : userMessageBubble
                    }
                  >
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                </div>
              ))}
              <div ref={chatWindowRef} />
            </Paper>
            <TextField
              variant="filled"
              style={inputStyle}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="large" onClick={handleSend}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start Typing ...."
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DocBotPage;
