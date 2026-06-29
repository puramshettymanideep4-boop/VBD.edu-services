const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const prisma = require('../config/prisma');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token using Prisma (exclude password)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          schoolId: true,
          phone: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// @desc  Optional auth — populates req.user if a valid token is present,
//        but does NOT reject requests that have no token at all.
//        Used for routes that are public but need user context when logged in.
const optionalProtect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          schoolId: true,
          phone: true,
          status: true,
        },
      });

      if (user) req.user = user;
    }
  } catch (_err) {
    // Invalid or expired token — treat as unauthenticated, do not block
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalProtect };
