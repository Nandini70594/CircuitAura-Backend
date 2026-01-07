require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const kitRoutes = require("./routes/kitRoutes");
const orderRoutes = require("./routes/orderRoutes");
const resourceRoutes = require("./routes/resourceRoutes"); 

const app = express();

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
app.options("*", cors(corsOptions)); 

app.get("/", (req, res) => {
  res.send("CircuitAura Backend Running 🚀");
});

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/resources", resourceRoutes);

app.use("/kits", (req, res, next) => {
  res.redirect(307, `/api/kits${req.url}`);
});

app.use("/products", (req, res, next) => {
  res.redirect(307, `/api/products${req.url}`);
});

app.use("/orders", (req, res, next) => {
  res.redirect(307, `/api/orders${req.url}`);
});


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
