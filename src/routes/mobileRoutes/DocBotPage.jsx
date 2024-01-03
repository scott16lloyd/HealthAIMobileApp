import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfile from '../../components/widgets/UserProfile/UserProfile';
import { UserAuth } from '../../components/auth/AuthContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ThreeDots } from 'react-loader-spinner';

function DocBotPage() {
  // Styles
  const outerWrapper = {
    display: 'flex',
    flexDirection: 'column',
    height: '95vh',
    overflow: 'hidden',
  };

  const topBarStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
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
    bottom: '5rem',
    borderRadius: '5px',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    alignSelf: 'center',
  };

  const botMessageBubble = {
    backgroundColor: 'rgba(0, 117, 255, 0.4)',
    width: 'max-content',
    maxWidth: '75%',
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

  // Logged in user object
  const { user } = UserAuth();

  // Message bubble logic
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content:
        'Hello, I am the DocBot. Ask me a question or tell me a symptom and I will try my best to recommend a solution.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat window ref for auto-scrolling
  const chatWindowRef = React.useRef(null);

  // Auto-scroll to bottom of chat window when new message arrives
  useEffect(() => {
    chatWindowRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle sending message
  const handleSend = (e) => {
    e.preventDefault();

    if (input.trim() !== '') {
      // Add user message to chat
      setMessages([...messages, { type: 'user', content: input }]);

      // Set loading state to true
      setLoading(true);

      axios
        .post('https://docbot-image-tmzbdquo3q-lz.a.run.app/post', {
          user_input: input,
        })
        .then((response) => {
          // Add bot response to chat
          setMessages((prev) => [
            ...prev,
            { type: 'bot', content: response.data.response },
          ]);
          // Set loading state to false
          setLoading(false);
        })
        .catch((error) => console.error('Error:', error));

      // Clear input field
      setInput('');
    }
  };

  return (
    <>
      <div style={outerWrapper}>
        <div style={topBarStyle}>
          {user ? <UserProfile /> : null}
          <Typography variant="h5" style={{ fontSize: 25 }}>
            Hello,
            <Typography variant="h4" style={{ fontWeight: 600 }}>
              {user.displayName ? user.displayName : 'User'}
            </Typography>
          </Typography>
        </div>
        <div style={stageStyle}>
          <Typography variant="h4">Welcome to DocBot</Typography>
          <div style={mainWrapper}>
            <Paper elevation={1} style={chatWindowSurface}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.type === 'bot' ? 'botMessage' : 'userMessage'
                  }
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
              {/* Displays loading animation when waiting for response */}
              {loading && (
                <div
                  className="loadingMessage"
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <Paper elevation={2} style={botMessageBubble}>
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="black"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </Paper>
                </div>
              )}
              <div ref={chatWindowRef} />
            </Paper>
            <form onSubmit={handleSend}>
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default DocBotPage;
