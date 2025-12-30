const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup to keep file in memory (buffer) instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/', authenticateToken, authorizeRole('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ message: 'Upload to Supabase failed', error });
    }

    const { publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path);

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error during upload' });
  }
});

module.exports = router;
