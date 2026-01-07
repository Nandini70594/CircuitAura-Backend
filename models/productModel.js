const supabase = require('../config/supabase');
const BUCKET = 'product-images';

const getFilename = (imagePath) => {
  if (!imagePath) return null;
  
  let path = imagePath;
  
  if (path.includes('supabase.co/storage/v1/object/public/')) {
    const match = path.match(/\/object\/public\/product-images\/(.+)$/);
    if (match) return decodeURIComponent(match[1]);
  }
  
  if (path.startsWith('product-images/')) {
    return decodeURIComponent(path.replace('product-images/', ''));
  }
  
  return decodeURIComponent(path);
};

const getAllProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;

  return data.map(product => {
    const updatedProduct = { ...product };
    
    if (product.image_url) {
      const filename = getFilename(product.image_url);
      updatedProduct.image_url = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filename).data.publicUrl;
    }

    if (product.pdf_url) {
      const pdfFilename = getFilename(product.pdf_url);
      updatedProduct.pdf_url = supabase.storage
        .from(BUCKET)
        .getPublicUrl(pdfFilename).data.publicUrl;
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
    const filename = getFilename(data.image_url);
    data.image_url = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filename).data.publicUrl;
  }

  if (data.pdf_url) {
    const pdfFilename = getFilename(data.pdf_url);
    data.pdf_url = supabase.storage
      .from(BUCKET)
      .getPublicUrl(pdfFilename).data.publicUrl;
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
