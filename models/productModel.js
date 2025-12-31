const supabase = require('../config/supabase');
const BUCKET = 'product-images'; 

// ✅ HELPER: Extract filename from full URL or use as-is
const getFilename = (imagePath) => {
  if (!imagePath) return null;
  // If full URL, extract filename from end
  if (imagePath.includes('supabase.co') || imagePath.includes('/storage/')) {
    return imagePath.split('/').pop() || imagePath;
  }
  // Already filename
  return imagePath;
};

const getAllProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;

  return data.map(product => {
    const updatedProduct = { ...product };

    // ✅ HANDLE FULL URL OR FILENAME
    if (product.image_url) {
      const filename = getFilename(product.image_url);
      updatedProduct.image_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(filename).publicUrl;
    }

    if (product.pdf_url) {
      const pdfFilename = getFilename(product.pdf_url);
      updatedProduct.pdf_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(pdfFilename).publicUrl;
    }

    return updatedProduct;
  });
};

const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;

  // ✅ HANDLE FULL URL OR FILENAME
  if (data.image_url) {
    const filename = getFilename(data.image_url);
    data.image_url = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(filename).publicUrl;
  }

  if (data.pdf_url) {
    const pdfFilename = getFilename(data.pdf_url);
    data.pdf_url = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(pdfFilename).publicUrl;
  }

  return data;
};

const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const deleteProduct = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
