import React from 'react';
import { Input, Button } from '@mui/material';
import { MailOutline, LinkedIn, Twitter } from '@mui/icons-material'; 

const Footer = () => {
  const footerStyle = {
    borderRadius: '11px',
    background: 'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
    color: '#000',
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const socialMediaStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const signUpFormStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  
  const linkStyle = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  };
  
  const formInputStyle = {
    marginBottom: '10px',
  };

  const iconStyle = {
    fontSize: '24px',
    marginRight: '10px',
  };

  return (
    <footer style={footerStyle}>
        &copy; {new Date().getFullYear()} HealthAI For Medical Professionals
      <div style={containerStyle}>
        <div style={socialMediaStyle}>
            <h3>Social Media Links</h3>
          <a
            href="https://www.linkedin.com/in/your-linkedin-profile"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, color: '#0077B5' }}
          >
            <LinkedIn style={iconStyle} />
            LinkedIn
          </a>
          <a
            href="https://twitter.com/your-twitter-profile"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, color: '#1DA1F2' }}
          >
            <Twitter style={iconStyle} />
            Twitter
          </a>
        </div>

        <div style={signUpFormStyle}>
          <h3>Sign Up for Health AI Information</h3>
          <form>
            <Input
              type="email"
              placeholder="Your Email"
              fullWidth
              style={formInputStyle}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign Up
            </Button>
          </form>
        </div>

        <div>
          <h3>Contact Us by Email</h3>
          <a href="mailto:your.email@example.com" style={linkStyle}>
            <MailOutline style={iconStyle} />
            Contact us
          </a>
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
};

export default Footer;
