import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchAllProducts();
  }, []);

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', p: 3 }}>
      {/* Heading */}
      <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
        Browse Products
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          justifyContent: 'center',
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search products by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            bgcolor: '#2a475e',
            input: { color: '#c7d5e0' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#66c0f4' },
              '&:hover fieldset': { borderColor: '#66c0f4' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            bgcolor: '#66c0f4',
            color: '#ffffff',
            '&:hover': { bgcolor: '#5aafde' },
          }}
        >
          Search
        </Button>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              sx={{
                bgcolor: '#2a475e',
                color: '#c7d5e0',
                borderRadius: 2,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: '#ffffff', mb: 1 }}
                >
                  <Link
                    to={`/product/${product._id}`}
                    style={{ color: '#66c0f4', textDecoration: 'none' }}
                  >
                    {product.title}
                  </Link>
                </Typography>
                <Typography sx={{ mb: 1 }}>{product.description}</Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Quantity: {product.quantity}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Category: {product.category}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Status: {product.status}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Location: {product.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BrowseProducts;
