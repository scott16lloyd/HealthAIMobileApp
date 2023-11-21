import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ColonImage from '../../../images/colonImage.png';
import HeartImage from '../../../images/heartImage.png';
import LungImage from '../../../images/lungImage.png';

const images = [ColonImage, HeartImage, LungImage];
const cancerTypes = ['Colon Cancer', 'Heart Cancer', 'Lung Cancer'];

function TestHistoryWidget({ date }) {
  return (
    <Button
      sx={{
        boxShadow: 'none',
        textTransform: 'none',
        padding: 0,
        borderRadius: 5,
      }}
    >
      <Card
        size="md"
        variant="outlined"
        sx={{
          backgroundColor: 'rgba(217,217,217,0.4)',
          width: '900px',
          height: '100px',
          borderRadius: 5,
          paddingX: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="h5">View Test From</Typography>
          <Typography variant="h6" color={'#2187FF'}>
            {date}
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {images.map((image, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: 4,
                marginLeft: index !== 0 ? '0.5rem' : 0,
              }}
            >
              <CardMedia
                component="img"
                image={image}
                alt={`${cancerTypes[index]} Image`}
              />
            </Card>
          ))}
        </div>
      </Card>
    </Button>
  );
}

export default TestHistoryWidget;
