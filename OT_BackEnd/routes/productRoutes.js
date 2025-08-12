const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const productController = require('../controllers/productController');

// ✅ Single product create
router.post('/create', upload.single('image'), productController.createProduct);

// ✅ Bulk product create
router.post('/bulk-create', upload.array('images'), productController.bulkCreateProducts);

// ✅ Product list
router.get('/list', productController.getProductList);

// ✅ Top-selling products
router.get('/top-selling', productController.getTopSellingProducts);

module.exports = router;
