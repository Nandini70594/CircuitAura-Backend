// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const cors = require('cors');

// const app = express();

// app.use(cors({
//   origin: [
//     'http://localhost:8080',        
//     'http://127.0.0.1:8080',        
//     'https://circuitaura.netlify.app'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true
// }));



// app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const kitRoutes = require('./routes/kitRoutes');
// const resourceRoutes = require('./routes/resourceRoutes');
// const uploadRouter = require('./routes/uploadRouter');
// const orderRoutes = require("./routes/orderRoutes");

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/kits', kitRoutes);
// app.use('/api/resources', resourceRoutes);
// app.use('/api/upload', uploadRouter);
// app.use("/api/orders", orderRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const kitRoutes = require("./routes/kitRoutes");
const orderRoutes = require("./routes/orderRoutes");
const resourceRoutes = require("./routes/resourceRoutes"); 

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:5173",
    "https://circuitaura.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ FIXED

app.get("/", (req, res) => {
  res.send("CircuitAura Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/resources", resourceRoutes);

app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
