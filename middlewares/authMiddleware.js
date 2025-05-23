const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        const authToken = token.split(" ")[1]; // e.g., "Bearer abc.def.ghi"
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(400).json({ message: "Invalid Token." });
    }
};


module.exports = authMiddleware;
