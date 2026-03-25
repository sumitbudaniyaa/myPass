const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.login = decoded;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Error while authorizing access"});
  }
};

module.exports = verifyToken;
