const supabase = require('../config/supabase');

const BUCKET = 'product-images'; // single bucket for kits and products

const getAllKits = async () => {
  const { data, error } = await supabase.from('kits').select('*');
  if (error) throw error;

  return data.map(kit => {
    const updatedKit = { ...kit };

    if (kit.image_url) {
      updatedKit.image_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(kit.image_url).publicUrl;
    }

    if (kit.pdf_url) {
      updatedKit.pdf_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(kit.pdf_url).publicUrl;
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
