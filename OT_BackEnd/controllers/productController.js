const Product = require('../models/Product');

// ✅ Create single product
exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, grades, category, company,
      units, price, isFeatured, createdAt
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      grades: JSON.parse(grades),
      category,
      company: JSON.parse(company),
      units,
      price,
      isFeatured: JSON.parse(isFeatured),
      createdAt,
      image: req.file?.filename || null,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
};

// ✅ Bulk create products
exports.bulkCreateProducts = async (req, res) => {
  try {
    const productsData = JSON.parse(req.body.products);
    const files = req.files;

    if (!Array.isArray(productsData)) {
      return res.status(400).json({ message: 'Invalid products data' });
    }

    const productsToInsert = productsData.map((product, index) => ({
      ...product,
      image: files[index]?.filename || null,
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    res.status(201).json({ message: `${createdProducts.length} products added`, products: createdProducts });

  } catch (err) {
    console.error('Bulk insert error:', err);
    res.status(500).json({ message: 'Bulk insert failed', error: err.message });
  }
};

// ✅ Get product list
exports.getProductList = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    let products = await Product.find();

    if (!isAdmin) {
      products = products.map(p => {
        const { price, ...rest } = p.toObject();
        return rest;
      });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// ✅ Get top-selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ quoteCount: -1 }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top-selling products', error: err.message });
  }
};
