import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ColonImage from '../../../images/colonImage.png';
import HeartImage from '../../../images/heartImage.png';
import LungImage from '../../../images/lungImage.png';
import ImageNotFound from '../../../images/imageNotFound.png';

function TargetAreaWidget({ cancerType, result }) {
  let color = 'rgba(217,217,217)';
  function resultColor(result) {
    if (result >= 70 && result <= 100) {
      color = 'rgba(254, 114, 114, 0.5)';
    } else if (result >= 30 && result < 70) {
      color = 'rgba(255,177,81,0.5)';
    } else if (result >= 0 && result < 30) {
      color = 'rgba(0,221,115,0.5)';
    }
    return color;
  }

  function resultBorderColor(result) {
    if (result >= 70 && result <= 100) {
      color = 'red';
    } else if (result >= 30 && result < 70) {
      color = 'orange';
    } else if (result >= 0 && result < 30) {
      color = 'green';
    }
    console.log(color);
    return color;
  }

  function imageSelector(cancerType) {
    let selectedImage;
    switch (cancerType) {
      case 'Colon Cancer':
        selectedImage = ColonImage;
        break;
      case 'Heart Cancer':
        selectedImage = HeartImage;
        break;
      case 'Lung Cancer':
        selectedImage = LungImage;
        break;
      default:
        selectedImage = ImageNotFound;
    }
    return selectedImage;
  }

  return (
    <Card
      size="md"
      variant="outlined"
      sx={{
        width: '80%',
        height: 110,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100px',
          height: '100px',
          borderRadius: 5,
          marginLeft: '0.5rem',
        }}
      >
        <CardMedia
          component="img"
          image={imageSelector(cancerType)}
          alt="Colon Image"
        />
      </Card>
      <Card
        sx={{
          display: 'flex',
          backgroundColor: '#D9D9D9',
          height: '50%',
          width: '50%',
          boxShadow: 'none',
          borderRadius: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography padding={1} variant="h5">
          {cancerType}
        </Typography>
      </Card>
      <Card
        variant="outlined"
        sx={{
          marginRight: '0.5rem',
          borderRadius: '50%',
          width: '70px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: resultBorderColor(result),
          backgroundColor: resultColor(result),
        }}
      >
        <Typography variant="h6">{result}%</Typography>
      </Card>
    </Card>
  );
}

export default TargetAreaWidget;
