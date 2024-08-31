import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Home, Payment, History, ExitToApp } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import PropertyDetails from './components/PropertyDetails';
import PayRent from './components/PayRent';
import PaymentHistory from './components/PaymentHistory';

type Property = {
  id: bigint;
  address: string;
  rentAmount: bigint;
  description: string | null;
};

const drawerWidth = 240;

const App: React.FC = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('property');
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignedProperty();
    }
  }, [isAuthenticated]);

  const fetchAssignedProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.getAssignedProperty();
      if ('ok' in result) {
        setProperty(result.ok);
      } else {
        console.error('Error fetching assigned property:', result.err);
        setError('Failed to fetch property details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching assigned property:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Rent Payment App
          </Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => setActiveView('property')}>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="My Property" />
            </ListItem>
            <ListItem button onClick={() => setActiveView('payRent')}>
              <ListItemIcon><Payment /></ListItemIcon>
              <ListItemText primary="Pay Rent" />
            </ListItem>
            <ListItem button onClick={() => setActiveView('history')}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Payment History" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              {activeView === 'property' && <PropertyDetails property={property} />}
              {activeView === 'payRent' && <PayRent property={property} />}
              {activeView === 'history' && <PaymentHistory />}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default App;
