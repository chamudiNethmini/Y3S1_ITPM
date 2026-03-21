const jwt = require("jsonwebtoken");

// =========================
// VERIFY TOKEN
// =========================
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❗ Check header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ❗ Extract token (Bearer token)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // ❗ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Save user info
    req.user = decoded;

    next();

  } catch (error) {
    console.log("TOKEN ERROR:", error.message);

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// =========================
// AUTHORIZE ROLES
// =========================
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {

    // ❗ Safety check
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    next();
  };
};