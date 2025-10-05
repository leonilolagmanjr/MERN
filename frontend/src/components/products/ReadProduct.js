import React, { useEffect, useState } from 'react';
import { fetchPostedProducts, deleteProduct } from '../../services/api';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const ReadProduct = ({ refresh }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchPostedProducts(token);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    getProducts();
  }, [refresh]);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteProduct(productId, token);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId)); // Remove the product from the list
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#ffffff' }}>
        My Posted Products
      </Typography>
      <Grid container spacing={3}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  bgcolor: '#2a475e',
                  color: '#c7d5e0',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                    {product.title}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>{product.description}</Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Quantity: {product.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Status: {product.status}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                    onClick={() => handleDelete(product._id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#c7d5e0' }}>
            No products available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ReadProduct;
