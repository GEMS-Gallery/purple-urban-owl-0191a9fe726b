import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Welcome to Rent Payment App
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={onLogin}
        >
          Login with Internet Identity
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
