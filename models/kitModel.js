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

const getAllKits = async () => {
  const { data, error } = await supabase.from('kits').select('*');
  if (error) throw error;

  return data.map(kit => {
    const updatedKit = { ...kit };

    // ✅ HANDLE FULL URL OR FILENAME
    if (kit.image_url) {
      const filename = getFilename(kit.image_url);
      updatedKit.image_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(filename).publicUrl;
    }

    if (kit.pdf_url) {
      const pdfFilename = getFilename(kit.pdf_url);
      updatedKit.pdf_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(pdfFilename).publicUrl;
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
