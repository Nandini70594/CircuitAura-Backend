require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// ========== CORS SETUP ==========
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://circuitaura-frontend.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const kitRoutes = require('./routes/kitRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const uploadRouter = require('./routes/uploadRouter');
const orderRoutes = require("./routes/orderRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/upload', uploadRouter);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
