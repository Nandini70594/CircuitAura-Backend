const supabase = require('../config/supabase');

const BUCKET = 'product-images'; // same bucket

const getAllProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;

  return data.map(product => {
    const updatedProduct = { ...product };

    if (product.image_url) {
      updatedProduct.image_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(product.image_url).publicUrl;
    }

    if (product.pdf_url) {
      updatedProduct.pdf_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(product.pdf_url).publicUrl;
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

  if (data.image_url) {
    data.image_url = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(data.image_url).publicUrl;
  }

  if (data.pdf_url) {
    data.pdf_url = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(data.pdf_url).publicUrl;
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
