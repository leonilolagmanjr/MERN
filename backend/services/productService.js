const Product = require('../models/Product');

// Create Product
const createProduct = async (title, description, price, category, location, quantity, createdBy) => {
  try {
    // Check for duplicate products
    const existingProduct = await Product.findOne({ title, description, createdBy });
    if (existingProduct) {
      throw new Error('A product with the same title and description already exists.');
    }

    // Create a new product
    const product = new Product({
      title,
      description,
      price,
      category,
      location,
      quantity,
      createdBy,
    });
    await product.save();
    return product;
  } catch (err) {
    throw new Error(err.message || 'Error creating product');
  }
};

// Purchase Product
const purchaseProduct = async (productId, buyer) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    if (product.createdBy.toString() === buyer.toString()) throw new Error('Cannot Purchase Own Product');
    if (product.status !== 'available') throw new Error('Product is no longer available');
    product.status = 'sold';
    product.buyer = buyer;
    await product.save();
    return product;
  } catch (err) {
    throw new Error('Error purchasing product');
  }
};

// Get All Products
const getAllProducts = async (price) => {
  try {
    const filter = price ? { status: 'available', price: { $lte: price } } : { status: 'available' };
    const products = await Product.find(filter).populate('createdBy', 'name');
    return products;
  } catch (err) {
    throw new Error('Error fetching products');
  }
};

// Get Products Posted by Current User
const getMyPostedProducts = async (userId) => {
  try {
    return await Product.find({ createdBy: userId }); // Ensure `createdBy` is the correct field in your Product model
  } catch (err) {
    throw new Error('Error fetching posted products');
  }
};

// Get Products Purchased by Current User
const getMyPurchasedProducts = async (userId) => {
  try {
    return await Product.find({ buyer: userId, status: 'sold' });
  } catch (err) {
    throw new Error('Error fetching purchased products');
  }
};

// Get Products Sold by Current User
const getMySoldProducts = async (userId) => {
  try {
    return await Product.find({ createdBy: userId, status: 'sold' });
  } catch (err) {
    throw new Error('Error fetching sold products');
  }
};

// Mark Sold
const markSold = async (productId, buyer) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    if (String(product.buyer) !== buyer) throw new Error('Not authorized to mark this product as sold');
    product.status = 'sold';
    await product.save();
    return product;
  } catch (err) {
    throw new Error('Error marking product as sold');
  }
};

// Edit Product
const editProduct = async (productId, title, description, price, category, location, quantity, userId) => {
  try {
    console.log('Edit Product Service Input:', { productId, userId }); // Debugging log
    const product = await Product.findById(productId);
    console.log('Product Found:', product); // Debugging log
    if (!product) throw new Error('Product not found');
    if (String(product.createdBy) !== String(userId)) throw new Error('Not authorized to edit this product'); // Fix comparison
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.location = location || product.location;
    product.quantity = quantity || product.quantity;
    await product.save();
    return product;
  } catch (err) {
    console.error('Error in editProduct Service:', err.message); // Debugging log
    throw new Error(err.message || 'Error editing product');
  }
};

// Cancel Product
const cancelProduct = async (productId, createdBy) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    if (String(product.createdBy) !== createdBy) throw new Error('Not authorized to cancel this product');
    if (product.status !== 'available') throw new Error('Product is already sold or canceled');
    product.status = 'canceled';
    await product.save();
    return product;
  } catch (err) {
    throw new Error('Error Canceling Product');
  }
};

// Delete Product
const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) throw new Error('Product not found');
    return product;
  } catch (err) {
    throw new Error('Error Deleting Product');
  }
};


module.exports = {
  createProduct,
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
