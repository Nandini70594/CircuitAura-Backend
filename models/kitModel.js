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

const getAllKits = async () => {
  const { data, error } = await supabase.from('kits').select('*');
  if (error) throw error;

  return data.map(kit => {
    const updatedKit = { ...kit };
    
    if (kit.image_url) {
      const filename = getFilename(kit.image_url);
      updatedKit.image_url = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filename).data.publicUrl;
    }

    if (kit.pdf_url) {
      const pdfFilename = getFilename(kit.pdf_url);
      updatedKit.pdf_url = supabase.storage
        .from(BUCKET)
        .getPublicUrl(pdfFilename).data.publicUrl;
    }

    return updatedKit;
  });
};

const getKitById = async (id) => {
  const { data, error } = await supabase
    .from('kits')
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

const createKit = async (kitData) => {
  const { data, error } = await supabase
    .from('kits')
    .insert(kitData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const updateKit = async (id, kitData) => {
  const { data, error } = await supabase
    .from('kits')
    .update(kitData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const deleteKit = async (id) => {
  const { data, error } = await supabase
    .from('kits')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

module.exports = { getAllKits, getKitById, createKit, updateKit, deleteKit };
