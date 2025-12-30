const {
  getAllKits,
  getKitById,
  createKit,
  updateKit,
  deleteKit,
} = require('../models/kitModel');

const fetchKits = async (req, res) => {
  try {
    const kits = await getAllKits();
    res.json(kits);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const fetchKitById = async (req, res) => {
  try {
    const id = req.params.id;
    const kit = await getKitById(id);
    if (!kit) return res.status(404).json({ message: 'Kit not found' });
    res.json(kit);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const addKit = async (req, res) => {
  try {
    const kitData = req.body;
    const newKit = await createKit(kitData);
    res.status(201).json(newKit);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

const updateKitById = async (req, res) => {
  try {
    const id = req.params.id;
    const kitData = req.body;
    const updatedKit = await updateKit(id, kitData);
    res.json(updatedKit);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

const removeKit = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteKit(id);
    res.json({ message: 'Kit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
};

module.exports = { fetchKits, fetchKitById, addKit, updateKitById, removeKit };
