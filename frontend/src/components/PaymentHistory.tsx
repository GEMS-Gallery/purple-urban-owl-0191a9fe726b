import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

interface Payment {
  id: bigint;
  userId: string;
  propertyId: bigint;
  amount: bigint;
  timestamp: bigint;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const result = await backend.getPaymentHistory();
      setPayments(result);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Payment History
        </Typography>
        {payments.length === 0 ? (
          <Typography variant="body1">No payment history available.</Typography>
        ) : (
          payments.map((payment) => (
            <Typography key={payment.id.toString()} variant="body1" gutterBottom>
              Amount: ${Number(payment.amount)} - Date: {new Date(Number(payment.timestamp) / 1000000).toLocaleString()}
            </Typography>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
