import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

type Property = {
  id: bigint;
  address: string;
  rentAmount: bigint;
  description: string | null;
};

const drawerWidth = 240;

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { control, handleSubmit, reset } = useForm<Property>();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllProperties();
      setProperties(result);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
    setLoading(false);
  };

  const onSubmit = async (data: Property) => {
    setLoading(true);
    try {
      if (selectedProperty) {
        await backend.updateProperty(selectedProperty.id, data.address, BigInt(data.rentAmount.toString()), data.description);
      } else {
        await backend.addProperty(data.address, BigInt(data.rentAmount.toString()), data.description);
      }
      fetchProperties();
      reset();
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteProperty(id);
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Property Management
          </Typography>
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
            {properties.map((property) => (
              <ListItem button key={property.id.toString()} onClick={() => setSelectedProperty(property)}>
                <ListItemText primary={property.address} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      {selectedProperty ? 'Edit Property' : 'Add New Property'}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Controller
                        name="address"
                        control={control}
                        defaultValue={selectedProperty?.address || ''}
                        rules={{ required: 'Address is required' }}
                        render={({ field }) => (
                          <input {...field} placeholder="Address" className="w-full p-2 mb-4 border rounded" />
                        )}
                      />
                      <Controller
                        name="rentAmount"
                        control={control}
                        defaultValue={selectedProperty?.rentAmount.toString() || ''}
                        rules={{ required: 'Rent amount is required' }}
                        render={({ field }) => (
                          <input {...field} type="number" placeholder="Rent Amount" className="w-full p-2 mb-4 border rounded" />
                        )}
                      />
                      <Controller
                        name="description"
                        control={control}
                        defaultValue={selectedProperty?.description || ''}
                        render={({ field }) => (
                          <textarea {...field} placeholder="Description" className="w-full p-2 mb-4 border rounded" />
                        )}
                      />
                      <Button type="submit" variant="contained" color="primary">
                        {selectedProperty ? 'Update' : 'Add'} Property
                      </Button>
                      {selectedProperty && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(selectedProperty.id)}
                          sx={{ ml: 2 }}
                        >
                          Delete
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </Grid>
              {selectedProperty && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div" gutterBottom>
                        Property Details
                      </Typography>
                      <Typography variant="body1">Address: {selectedProperty.address}</Typography>
                      <Typography variant="body1">Rent Amount: ${Number(selectedProperty.rentAmount)}</Typography>
                      <Typography variant="body1">Description: {selectedProperty.description || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default App;
