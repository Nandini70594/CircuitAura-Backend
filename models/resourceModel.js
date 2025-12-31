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

const getAllResources = async () => {
  const { data, error } = await supabase.from('resources').select('*');
  if (error) throw error;

  // ✅ PROCESS IMAGE/PDF URLS
  return data.map(resource => {
    const updatedResource = { ...resource };

    // Handle image_url (if exists)
    if (resource.image_url) {
      const filename = getFilename(resource.image_url);
      updatedResource.image_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(filename).publicUrl;
    }

    // Handle pdf_url (if exists)
    if (resource.pdf_url) {
      const pdfFilename = getFilename(resource.pdf_url);
      updatedResource.pdf_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(pdfFilename).publicUrl;
    }

    // Handle file_url (if exists)
    if (resource.file_url) {
      const fileFilename = getFilename(resource.file_url);
      updatedResource.file_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(fileFilename).publicUrl;
    }

    return updatedResource;
  });
};

const getResourceById = async (id) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;

  // ✅ PROCESS IMAGE/PDF URLS
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

  if (data.file_url) {
    const fileFilename = getFilename(data.file_url);
    data.file_url = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(fileFilename).publicUrl;
  }

  return data;
};

const getResourcesByType = async (resourceType) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('resource_type', resourceType);
  if (error) throw error;

  // ✅ PROCESS IMAGE/PDF URLS
  return data.map(resource => {
    const updatedResource = { ...resource };

    if (resource.image_url) {
      const filename = getFilename(resource.image_url);
      updatedResource.image_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(filename).publicUrl;
    }

    if (resource.pdf_url) {
      const pdfFilename = getFilename(resource.pdf_url);
      updatedResource.pdf_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(pdfFilename).publicUrl;
    }

    if (resource.file_url) {
      const fileFilename = getFilename(resource.file_url);
      updatedResource.file_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(fileFilename).publicUrl;
    }

    return updatedResource;
  });
};

const createResource = async (resourceData) => {
  const { data, error } = await supabase
    .from('resources')
    .insert(resourceData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const updateResource = async (id, resourceData) => {
  const { data, error } = await supabase
    .from('resources')
    .update(resourceData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const deleteResource = async (id) => {
  const { data, error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

module.exports = {
  getAllResources,
  getResourceById,
  getResourcesByType,
  createResource,
  updateResource,
  deleteResource,
};
