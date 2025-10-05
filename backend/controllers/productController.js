const productService = require('../services/productService');

// Post Product
const postProduct = async (req, res) => {
  const { title, description, price, category, location, quantity } = req.body;

  try {
    const product = await productService.createProduct(title, description, price, category, location, quantity, req.user.id);
    res.status(201).json(product);
  } catch (err) {
    console.error('Error in postProduct:', err.message); // Debugging log
    res.status(400).json({ msg: err.message }); // Return a 400 status for client errors
  }
};

// Purchase Product
const purchaseProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await productService.purchaseProduct(productId, req.user);
    res.json({ msg: 'Product purchased successfully', product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  const { price } = req.query;
  try {
    const products = await productService.getAllProducts(price);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Products Posted by Current User
const getMyPostedProducts = async (req, res) => {
  try {
    const products = await productService.getMyPostedProducts(req.user.id); // Ensure `req.user.id` is the logged-in user's ID
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Products Purchased by Current User
const getMyPurchasedProducts = async (req, res) => {
  try {
    const products = await productService.getMyPurchasedProducts(req.user.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Products Sold by Current User
const getMySoldProducts = async (req, res) => {
  try {
    const products = await productService.getMySoldProducts(req.user.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Mark Sold
const markSold = async (req, res) => {
  try {
    const product = await productService.markSold(req.params.productId, req.user);
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  const { title, description, price, category, location, quantity } = req.body;
  console.log('Edit Product Request:', {
    productId: req.params.productId,
    userId: req.user.id,
    body: req.body,
  }); // Debugging log
  try {
    const product = await productService.editProduct(
      req.params.productId,
      title,
      description,
      price,
      category,
      location,
      quantity,
      req.user.id
    );
    res.json(product);
  } catch (err) {
    console.error('Error in editProduct Controller:', err.message); // Debugging log
    res.status(500).json({ msg: err.message });
  }
};

// Cancel Product
const cancelProduct = async (req, res) => {
  try {
    const product = await productService.cancelProduct(req.params.productId, req.user);
    res.json({ msg: 'Product canceled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.productId);
    res.json({msg: 'Product Deleted'});
  } catch (err) {
    res.status(500).json({ msg: 'Server Error'});
  }
};

module.exports = {
  postProduct,
  purchaseProduct,
  getAllProducts,
  getMyPostedProducts,
  getMyPurchasedProducts,
  getMySoldProducts,
  markSold,
  editProduct,
  cancelProduct,
  deleteProduct
};
