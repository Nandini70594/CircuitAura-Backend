// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);
  
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// const authorizeRole = (role) => (req, res, next) => {
//   if (req.user.role !== role) {
//     return res.sendStatus(403);
//   }
//   next();
// };

// module.exports = { authenticateToken, authorizeRole };

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No Authorization header');
    return res.status(401).json({ message: 'No Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Malformed Authorization header, token missing');
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verify error:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    // Log user payload to debug role issues
    console.log('Authenticated user:', user);
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => (req, res, next) => {
  // Defensive log in case req.user is missing
  if (!req.user) {
    console.log('authorizeRole: req.user missing');
    return res.status(403).json({ message: 'User not authenticated' });
  }
  console.log(`authorizeRole: required=${role}, actual=${req.user.role}`);
  if (req.user.role !== role) {
    console.log('User role forbidden:', req.user.role);
    return res.status(403).json({ message: `User does not have the required role: ${role}` });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };
