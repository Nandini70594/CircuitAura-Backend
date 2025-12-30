const {
  getAllResources,
  getResourceById,
  getResourcesByType,
  createResource,
  updateResource,
  deleteResource,
} = require('../models/resourceModel');

const fetchResources = async (req, res) => {
  try {
    const { type } = req.query;

    if (type) {
      const resources = await getResourcesByType(type);
      res.json(resources);
    } else {
      const resources = await getAllResources();
      res.json(resources);
    }
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const fetchResourceById = async (req, res) => {
  try {
    const resource = await getResourceById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const addResource = async (req, res) => {
  try {
    const data = req.body;
    const newResource = await createResource(data);
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const updateResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedResource = await updateResource(id, data);
    res.json(updatedResource);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const removeResource = async (req, res) => {
  try {
    await deleteResource(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

module.exports = {
  fetchResources,
  fetchResourceById,
  addResource,
  updateResourceById,
  removeResource,
};
