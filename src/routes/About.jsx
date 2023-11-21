import React, { useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import UserProfile from '../components/widgets/UserProfile/UserProfile';
import { UserAuth } from '../components/auth/AuthContext';
import Photo from '../images/IMG_0405.png';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import Footer from '../components/widgets/Footer/Footer';
import BackButton from '../components/widgets/BackButton/BackButton';

const messageBoxStyle = {
  borderRadius: '11px',
  background:
    'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
  boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(1.5px)',
  padding: '1rem',
};

const aboutUsHeaderStyle = {
  paddingLeft: '20px',
};

const photoStyle = {
  paddingBottom: '20px',
  borderRadius: '10px',
  width: '100%',
  height: 'auto',
  overflow: 'hidden',
};

const topBarWrapper = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: '2rem',
};

function AboutUsPage() {
  const { user } = UserAuth();
  return (
    <>
      <div style={topBarWrapper}>
        <TopNavigationBar />
        {user ? <UserProfile /> : null}
      </div>

      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom style={aboutUsHeaderStyle}>
          <BackButton goBackPath={'/home'} /> About Our Team
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={messageBoxStyle}>
              <Typography variant="h6">Our Mission</Typography>
              <Typography>
                At HealthAI-Web, our mission is to revolutionize the healthcare
                experience for medical professionals and patients alike. We are
                dedicated to developing a comprehensive platform that empowers
                healthcare providers and enhances patient care. Our platform's
                core features include:
                <br />
                <br />
                1. Registration and Access Control: We enable medical
                professionals to register and access the platform securely
                through email and social media logins. To maintain the highest
                level of privacy and confidentiality, healthcare professionals
                are granted access only to the patient data under their care.
                <br />
                <br />
                2. Patient Risk Assessment: Our HealthAI-Predict Interface
                equips medical professionals with the tools to assess and
                monitor the risk profiles of their patients. With data-driven
                insights, they can make informed decisions and interventions for
                the well-being of their patients.
                <br />
                <br />
                3. User Profiling: Our platform allows medical professionals to
                create comprehensive patient profiles, providing an in-depth
                understanding of patient health and risk factors across various
                categories. This data-driven approach helps in identifying and
                addressing health risks effectively.
                <br />
                <br />
                4. Data Aggregation and Export: HealthAI-Web provides the
                capability to aggregate new patient data seamlessly.
                Administrators have the option to create and export new
                datasets, which can be extended and integrated with
                HealthAI-Predict. This flexibility ensures that our platform
                remains adaptable and can grow with the evolving needs of
                healthcare providers and patients.
                <br />
                <br />
                Our commitment to delivering excellence in healthcare technology
                is driven by a passion for innovation, security, and
                user-centric design. We collaborate with healthcare
                professionals, prioritize patient privacy, and follow regulatory
                standards to ensure that HealthAI-Web is a reliable and
                effective healthcare tool.
                <br />
                <br />
                Join us in our mission to transform healthcare, making it more
                accessible, data-driven, and patient-focused. Together, we can
                build a healthier future for all.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div style={photoStyle}>
              <Paper elevation={3}>
                <img
                  src={Photo}
                  alt="Description"
                  style={{ oheight: 'auto', display: 'block' }}
                />
              </Paper>
            </div>
            <Paper elevation={3} style={messageBoxStyle}>
              <Typography variant="h6">Meet Our Team</Typography>
              <Typography>
                We are a team of four students from MTU dedicated to making a
                positive impact in the healthcare industry. Our team members
                come from diverse backgrounds and bring various skills and
                expertise to the project.
                <br></br>
                <br></br>
                Sara Rahim - Software Development B.Sc Honors
                <br></br>
                <a href="https://github.com/SaraRahim">Sara Rahim - GitHub</a>
                <br></br>
                Scott Lloyd - Computer Systems B.Sc Honors
                <br></br>
                <a href="https://github.com/scott16lloyd">
                  Scott Lloyd - GitHub
                </a>
                <br></br>
                Sam Roche - Computer Systems B.Sc Honors
                <br></br>
                <a href="https://github.com/SamuelRoche">Sam Roche - GitHub</a>
                <br></br>
                Daniel Dennehy - Computer Systems B.Sc Honors
                <br></br>
                <a href="https://github.com/daniel-dennehy">
                  Daniel Dennehy - GitHub
                </a>
              </Typography>
            </Paper>
            <br></br>
            <Paper elevation={3} style={messageBoxStyle}>
              <Typography variant="h6">Our Approach</Typography>
              <Typography>
                We prioritize user-centered design, security, and privacy in our
                project. We collaborate with healthcare professionals, seek
                regular feedback from patients, and follow healthcare
                regulations to ensure a safe and effective healthcare tool.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <br></br>
      <Footer />
    </>
  );
}

export default AboutUsPage;
