import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function DiseaseCard({ diseaseName, image, result }) {
  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={diseaseName}
      />
      <Typography variant="h6" sx={{ padding: 2 }}>
        {diseaseName}
      </Typography>
      <Typography variant="body1" sx={{ padding: 2 }}>
        Result: {result}
      </Typography>
    </Card>
  );
}

export default DiseaseCard;
