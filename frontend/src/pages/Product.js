import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';

const Product = () => {
  const { productId } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const products = await fetchProducts(); // Fetch all products
        const selectedProduct = products.find((product) => product._id === productId); // Find the specific product
        if (selectedProduct) {
          setProduct(selectedProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to fetch product details');
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ textAlign: 'center' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2, color: '#c7d5e0' }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', py: 5 }}>
      <Container>
        <Typography variant="h3" sx={{ color: '#ffffff', mb: 3 }}>
          {product.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#c7d5e0', mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Price:</strong> ${product.price}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Quantity:</strong> {product.quantity}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Category:</strong> {product.category}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Status:</strong> {product.status}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Posted by:</strong> {product.createdBy.name}
        </Typography>
      </Container>
    </Box>
  );
};

export default Product;
