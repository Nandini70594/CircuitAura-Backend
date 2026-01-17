const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');

const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body; // ✅ ADD adminKey
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 🔥 ADMIN KEY VALIDATION - ADD THESE 8 LINES:
    const ADMIN_SECRET = "ADMIN-CKTAURA@26";
    if (role === 'admin') {
      if (!adminKey || adminKey !== ADMIN_SECRET) {
        return res.status(403).json({ 
          message: 'Invalid admin key. Contact owner.' 
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'user';

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // ✅ Generate JWT token (ADD THESE LINES):
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email); // ✅ Safe
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signup, login };
