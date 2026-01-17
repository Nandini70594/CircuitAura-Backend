// const express = require('express');
// const multer = require('multer');
// const { createClient } = require('@supabase/supabase-js');
// const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// router.post('/', authenticateToken, authorizeRole('admin'), upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//     const fileName = `${Date.now()}_${req.file.originalname}`;
    
//     const { data, error } = await supabase.storage
//       .from('product-images')
//       .upload(fileName, req.file.buffer, {
//         contentType: req.file.mimetype,
//         cacheControl: '3600',
//         upsert: false,
//       });

//     if (error) {
//       console.error('Supabase upload error:', error);
//       return res.status(500).json({ message: 'Upload to Supabase failed', error });
//     }

//     const { data: urlData } = supabase.storage
//       .from('product-images')
//       .getPublicUrl(data.path);

//     res.json({ 
//       filename: data.path,     
//       publicUrl: urlData.publicUrl  
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'Internal server error during upload' });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authenticateToken, authorizeRole('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // 🔥 FIX: Create PURE service_role client INSIDE handler (no JWT contamination)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { 
        auth: { 
          autoRefreshToken: false, 
          persistSession: false 
        } 
      }
    );

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
      return res.status(500).json({ message: 'Upload to Supabase failed', error: error.message });
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    console.log('✅ Upload successful:', data.path); // Debug log

    res.json({ 
      filename: data.path,     
      publicUrl: urlData.publicUrl  
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error during upload' });
  }
});

module.exports = router;
