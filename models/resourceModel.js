const supabase = require('../config/supabase');

const getAllResources = async () => {
  const { data, error } = await supabase.from('resources').select('*');
  if (error) throw error;
  return data;
};

const getResourceById = async (id) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

const getResourcesByType = async (resourceType) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('resource_type', resourceType);
  if (error) throw error;
  return data;
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
