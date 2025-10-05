import React, { useState, useEffect } from 'react';
import CreateProduct from '../components/products/CreateProduct';
import UpdateProduct from '../components/products/UpdateProduct';
import DeleteProduct from '../components/products/DeleteProduct';
import { Modal } from '@mui/material';
import { fetchPostedProducts } from '../services/api';
import { fetchProducts } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Market = () => {
  const { isLoggedIn } = useAuth();
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [filterPrice, setFilterPrice] = useState('');

  const triggerRefresh = () => {
    setRefreshProducts(!refreshProducts);
  };

  // Modal state
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenUpdate(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenDelete(true);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await fetchProducts();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    const fetchUserProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchPostedProducts(token);
        setUserProducts(data);
      } catch (err) {
        console.error('Error fetching user products:', err);
      }
    };
    fetchAllProducts();
    fetchUserProducts();
  }, [refreshProducts]);

  const handleSearch = () => {
    let filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterPrice) {
      filtered = filtered.filter((product) => product.price <= parseFloat(filterPrice));
    }
    setFilteredProducts(filtered);
  };

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
          Community Market
        </Typography>

        {/* User Posted Products Action Buttons */}
        {isLoggedIn && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
            <Button variant="contained" sx={{ bgcolor: '#66c0f4', color: '#fff', fontWeight: 'bold' }} onClick={() => setOpenCreate(true)}>
              Sell Product
            </Button>
          </Box>
        )}

        {/* User Posted Products - Steam-style Table - MOVED TO TOP */}
        {isLoggedIn && (
          <Box sx={{ bgcolor: '#23262e', borderRadius: 2, boxShadow: 3, mb: 4, p: 2 }}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              My Posted Products ({userProducts.length})
            </Typography>
            {/* Table Labels */}
            <Box sx={{ display: 'flex', px: 2, py: 1, bgcolor: '#1b2838', borderRadius: 1, fontWeight: 'bold', color: '#c7d5e0', fontSize: 16 }}>
              <Box sx={{ flex: 2 }}>Name</Box>
              <Box sx={{ flex: 1 }}>Date Listed</Box>
              <Box sx={{ flex: 1 }}>Status</Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>Actions</Box>
            </Box>
            {/* Table Rows */}
            {userProducts.length === 0 ? (
              <Box sx={{ px: 2, py: 2, color: '#8f98a0' }}>
                You are not selling any items on the Community Market. Sell items from your inventory, or click the "Sell Product" button above.
              </Box>
            ) : (
              userProducts.map((product) => (
                <Box key={product._id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid #2a475e', ':last-child': { borderBottom: 'none' } }}>
                  {/* Name and description */}
                  <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* If you have an image for the product, show it here. Otherwise, use a placeholder. */}
                    <Box sx={{ width: 48, height: 48, bgcolor: '#1b2838', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                      {/* Placeholder icon or image */}
                      <img src={product.imageUrl || 'https://via.placeholder.com/48x48?text=Product'} alt="product" style={{ width: 40, height: 40, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: '#66c0f4', fontWeight: 'bold' }}>{product.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#a9b7c6' }}>{product.description}</Typography>
                    </Box>
                  </Box>
                  {/* Date Listed */}
                  <Box sx={{ flex: 1, color: '#c7d5e0' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Box>
                  {/* Status */}
                  <Box sx={{ flex: 1, color: '#66c0f4', fontWeight: 'bold' }}>{product.status}</Box>
                  {/* Actions Buttons */}
                  <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="text"
                      sx={{ color: '#66c0f4', fontWeight: 'bold', textTransform: 'none' }}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      sx={{ color: '#ff4c4c', fontWeight: 'bold', textTransform: 'none' }}
                      onClick={() => handleDelete(product)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}

        {/* All Products label and search/filter box side by side - MOVED TO BOTTOM */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4, gap: 3 }}>
          {/* All Products table and label */}
          <Box sx={{ flex: 2 }}>
            <Box sx={{ bgcolor: '#22384a', borderRadius: 2, boxShadow: 3, p: 2 }}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                All Products ({filteredProducts.length})
              </Typography>
              {/* Table Labels */}
              <Box sx={{ display: 'flex', px: 2, py: 1, bgcolor: '#1b2838', borderRadius: 1, fontWeight: 'bold', color: '#c7d5e0', fontSize: 16 }}>
                <Box sx={{ flex: 2 }}>Name</Box>
                <Box sx={{ flex: 1 }}>Date Listed</Box>
                <Box sx={{ flex: 1 }}>Price</Box>
                <Box sx={{ flex: 1 }}>Category</Box>
                <Box sx={{ flex: 1 }}>Location</Box>
                <Box sx={{ flex: 1 }}>Quantity</Box>
              </Box>
              {/* Table Rows */}
              {filteredProducts.length === 0 ? (
                <Box sx={{ px: 2, py: 2, color: '#8f98a0' }}>
                  No products available.
                </Box>
              ) : (
                filteredProducts.map((product) => (
                  <Box key={product._id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid #2a475e', ':last-child': { borderBottom: 'none' }, bgcolor: '#263b50', borderRadius: 1, mb: 1 }}>
                    {/* Name and description */}
                    <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, bgcolor: '#1b2838', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                        <img src={product.imageUrl || 'https://via.placeholder.com/48x48?text=Product'} alt="product" style={{ width: 40, height: 40, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#66c0f4', fontWeight: 'bold' }}>
                          <Link to={`/product/${product._id}`} style={{ color: '#66c0f4', textDecoration: 'none' }}>
                            {product.title}
                          </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#a9b7c6' }}>{product.description}</Typography>
                      </Box>
                    </Box>
                    {/* Date Listed */}
                    <Box sx={{ flex: 1, color: '#c7d5e0' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Box>
                    {/* Price */}
                    <Box sx={{ flex: 1, color: '#c7d5e0' }}>${product.price}</Box>
                    {/* Category */}
                    <Box sx={{ flex: 1, color: '#c7d5e0' }}>{product.category}</Box>
                    {/* Location */}
                    <Box sx={{ flex: 1, color: '#c7d5e0' }}>{product.location}</Box>
                    {/* Quantity */}
                    <Box sx={{ flex: 1, color: '#c7d5e0' }}>{product.quantity}</Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
          {/* Search/filter box styled like Steam sidebar */}
          <Box sx={{ flex: 1, bgcolor: '#23262e', borderRadius: 2, boxShadow: 3, p: 2, minWidth: 320 }}>
            <Typography variant="subtitle1" sx={{ color: '#66c0f4', mb: 2, fontWeight: 'bold' }}>
              Search & Filter
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search products by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                bgcolor: '#2a475e',
                input: { color: '#c7d5e0' },
                mb: 2,
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
                mb: 2,
                width: '100%',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#5aafde' },
              }}
            >
              Search
            </Button>
            {/* Filter options */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#c7d5e0', mb: 1 }}>
                Max Price
              </Typography>
              <TextField
                type="number"
                value={filterPrice || ''}
                onChange={(e) => setFilterPrice(e.target.value)}
                variant="outlined"
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
            </Box>
          </Box>
        </Box>

        {/* Modals for Product Actions - Keep these at the bottom */}
        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#23262e', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <Typography variant="h6" sx={{ color: '#66c0f4', mb: 2 }}>Sell Product</Typography>
            <CreateProduct onProductCreated={() => { setOpenCreate(false); triggerRefresh(); }} />
            <Button onClick={() => setOpenCreate(false)} sx={{ mt: 2, color: '#fff', bgcolor: '#ff4c4c', textTransform: 'none' }}>Close</Button>
          </Box>
        </Modal>
        <Modal open={openUpdate} onClose={() => { setOpenUpdate(false); setSelectedProduct(null); }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#23262e', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <Typography variant="h6" sx={{ color: '#66c0f4', mb: 2 }}>Update Product</Typography>
            <UpdateProduct product={selectedProduct} onProductUpdated={() => { setOpenUpdate(false); setSelectedProduct(null); triggerRefresh(); }} onClose={() => { setOpenUpdate(false); setSelectedProduct(null); }} />
            <Button onClick={() => { setOpenUpdate(false); setSelectedProduct(null); }} sx={{ mt: 2, color: '#fff', bgcolor: '#ff4c4c', textTransform: 'none' }}>Close</Button>
          </Box>
        </Modal>
        <Modal open={openDelete} onClose={() => { setOpenDelete(false); setSelectedProduct(null); }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#23262e', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <DeleteProduct product={selectedProduct} onProductDeleted={() => { setOpenDelete(false); setSelectedProduct(null); triggerRefresh(); }} onClose={() => { setOpenDelete(false); setSelectedProduct(null); }} />
          </Box>
        </Modal>

      </Box>
    </Box>
  );
};

export default Market;
