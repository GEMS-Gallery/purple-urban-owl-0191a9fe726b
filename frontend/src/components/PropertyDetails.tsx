import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface Property {
  id: bigint;
  address: string;
  rentAmount: bigint;
  description: string | null;
}

interface PropertyDetailsProps {
  property: Property | null;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  if (!property) {
    return (
      <Typography variant="body1">Loading property details...</Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Your Property Details
        </Typography>
        <Typography variant="body1">Address: {property.address}</Typography>
        <Typography variant="body1">Rent Amount: ${Number(property.rentAmount)}</Typography>
        <Typography variant="body1">Description: {property.description || 'N/A'}</Typography>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
