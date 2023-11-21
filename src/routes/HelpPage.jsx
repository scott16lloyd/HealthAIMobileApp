import React from 'react';
import { Container, Paper } from '@mui/material';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import BackButton from '../components/widgets/BackButton/BackButton';
import Footer from '../components/widgets/Footer/Footer';
import Typography from '@mui/material/Typography';

function HelpPage() {
  const messageBoxStyle = {
    borderRadius: '11px',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
    padding: '1rem',
    marginTop: '20px',
  };
  const aboutUsHeaderStyle = {
    paddingLeft: '20px',
  };

  return (
    <>
      <TopNavigationBar />
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom style={aboutUsHeaderStyle}>
          <BackButton goBackPath={'/home'} /> HealthAI FAQ
        </Typography>

        <Typography variant="body1">
          Welcome to our Help Page! Below are answers to commonly asked
          questions to guide you through our platform.
        </Typography>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">How do I create an account?</Typography>
          <Typography variant="body1">
            To create an account, click on the 'Sign Up' button and follow the
            prompts to enter your details and create your login credentials.
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">How can I reset my password?</Typography>
          <Typography variant="body1">
            You can reset your password by clicking 'Forgot Password' on the
            login page and following the instructions sent to your registered
            email.
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">
            What subscriptions are available to Medical Professionals
          </Typography>
          <Typography variant="body1">
            There is no subscription for Medical Professionals, all the features
            are free.
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">How do I contact support?</Typography>
          <Typography variant="body1">
            You can contact our support team via email at this link.{' '}
            <a href="mailto:your.email@example.com">Email us</a>
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">
            How do I update my profile information?
          </Typography>
          <Typography variant="body1">
            You can update your profile by navigating to the 'Profile' section
            after logging in, where you'll find options to edit your
            information.
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">
            What browsers are supported by our platform?
          </Typography>
          <Typography variant="body1">
            Our platform is optimized for the latest versions of Chrome,
            Firefox, Safari, bing and Edge.
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">
            Can I access my account from multiple devices?
          </Typography>
          <Typography variant="body1">
            Yes, you can access your account from multiple devices by logging in
            using your credentials.
          </Typography>
        </Paper>

        <Paper elevation={3} style={messageBoxStyle}>
          <Typography variant="h5">
            Is my data secure on the platform?
          </Typography>
          <Typography variant="body1">
            We prioritize data security and use encryption methods to safeguard
            your information. Your data is kept confidential and secure.
          </Typography>
        </Paper>

        {/* Add more questions and answers as needed */}
      </Container>
      <br></br>
      <Footer />
    </>
  );
}

export default HelpPage;
