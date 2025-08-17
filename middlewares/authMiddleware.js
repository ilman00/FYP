const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({status: "401", message: "Access Denied. No Token Provided." });
    }

    try {
        const token = authHeader.split(" ")[1]; // e.g., "Bearer abc.def.ghi"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(401).json({status: 401, message: "Token expired or invalid" });
    }
};

module.exports = authMiddleware;
