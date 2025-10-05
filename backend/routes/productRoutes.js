const express = require('express');
const authenticate = require('../middleware/authenticate');
const productController = require('../controllers/productController');

const router = express.Router();

// Route to Post Product
router.post('/post', authenticate(), productController.postProduct);

// Route to Purchase Product
router.put('/purchase/:productId', authenticate(), productController.purchaseProduct);

// Route to Get All Products
router.get('/list', productController.getAllProducts);

// Route to Get Products Posted by Current User
router.get('/my-posted', authenticate(), productController.getMyPostedProducts);

// Route to Get Products Sold by Current User
router.get('/my-sold', authenticate(), productController.getMySoldProducts);

// Route to Mark Sold
router.put('/mark-sold/:productId', authenticate(), productController.markSold);

// Route to Edit Product
router.patch('/edit/:productId', authenticate(), productController.editProduct);

// Route to Cancel Product
router.put('/cancel/:productId', authenticate(), productController.cancelProduct);

// Route to Delete Product
router.delete('/remove/:productId', authenticate(), productController.deleteProduct);

// Route to Get Products Purchased by Current User
router.get('/my-purchased', authenticate(), productController.getMyPurchasedProducts);

module.exports = router;
