import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

interface Property {
  id: bigint;
  address: string;
  rentAmount: bigint;
  description: string | null;
}

interface PayRentProps {
  property: Property | null;
}

const PayRent: React.FC<PayRentProps> = ({ property }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    if (!property) {
      setMessage('Property details not available. Cannot process payment.');
      return;
    }

    setLoading(true);
    try {
      const result = await backend.payRent(BigInt(amount));
      if ('ok' in result) {
        setMessage('Payment successful!');
        setAmount('');
      } else {
        setMessage(`Payment failed: ${result.err}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage('An error occurred while processing the payment.');
    }
    setLoading(false);
  };

  if (!property) {
    return (
      <Typography variant="body1">Loading property details...</Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Pay Rent
        </Typography>
        <Typography variant="body1" gutterBottom>
          Rent Amount Due: ${Number(property.rentAmount)}
        </Typography>
        <TextField
          label="Payment Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          disabled={loading || !amount}
        >
          {loading ? <CircularProgress size={24} /> : 'Pay Rent'}
        </Button>
        {message && (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PayRent;
