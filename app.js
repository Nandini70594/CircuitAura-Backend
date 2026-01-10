require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend"); 

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const kitRoutes = require("./routes/kitRoutes");
const orderRoutes = require("./routes/orderRoutes");
const resourceRoutes = require("./routes/resourceRoutes"); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:5173",
    "https://circuitaura.netlify.app"
    "https://circuitaura.in"
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

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/forgot-password', async (req, res) => {
  console.log('📨 Body received:', req.body);
  
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: '🔐 Reset CircuitAura Password',
      html: '<h2>Reset Password</h2><a href="http://localhost:3000/reset-password?token=abc123">Click Here</a>'
    });

    if (error) {
      console.error('❌ RESEND ERROR:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ EMAIL SENT ID:', data[0].id);
    res.json({ 
      success: true, 
      message: 'Email sent! Check inbox/spam.',
      emailId: data[0].id 
    });

  } catch (error) {
    console.error('❌ CATCH ERROR:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/resources", resourceRoutes);

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
