const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../models/productModel');

const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

const fetchProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await createProduct(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = req.body;
    const updatedProduct = await updateProduct(id, productData);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteProduct(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

module.exports = {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProductById,
  removeProduct,
};
