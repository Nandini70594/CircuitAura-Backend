const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../models/productModel');

// ✅ Helper to extract filename from full URL
const getFilename = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.includes('supabase.co') || imagePath.includes('/storage/')) {
    return imagePath.split('/').pop() || imagePath;
  }
  return imagePath;
};

// ✅ Fetch all products
const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    // Convert image/pdf URLs to public URLs
    const updatedProducts = products.map(product => {
      const updated = { ...product };
      if (product.image_url) {
        const filename = getFilename(product.image_url);
        updated.image_url = filename; // frontend getImageUrl will handle full URL
      }
      if (product.pdf_url) {
        const pdfFilename = getFilename(product.pdf_url);
        updated.pdf_url = pdfFilename;
      }
      return updated;
    });

    res.json(updatedProducts);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

// ✅ Fetch single product by ID
const fetchProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Convert image/pdf URLs to public URLs
    if (product.image_url) {
      const filename = getFilename(product.image_url);
      product.image_url = filename;
    }
    if (product.pdf_url) {
      const pdfFilename = getFilename(product.pdf_url);
      product.pdf_url = pdfFilename;
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

// ✅ Add new product (admin)
const addProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Sanitize image/pdf paths to store only filename
    if (productData.image_url) productData.image_url = productData.image_url.split('/').pop();
    if (productData.pdf_url) productData.pdf_url = productData.pdf_url.split('/').pop();

    const newProduct = await createProduct(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

// ✅ Update product (admin)
const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = { ...req.body };

    // Sanitize image/pdf paths to store only filename
    if (productData.image_url) productData.image_url = productData.image_url.split('/').pop();
    if (productData.pdf_url) productData.pdf_url = productData.pdf_url.split('/').pop();

    const updatedProduct = await updateProduct(id, productData);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

// ✅ Delete product (admin)
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
