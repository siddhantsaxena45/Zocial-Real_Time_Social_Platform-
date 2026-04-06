import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.userId;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired. Please log in again.", success: false });
        }
        console.error("Authentication Error:", error);
        return res.status(401).json({ message: "Invalid or unauthorized token", success: false });
    }
}

export default isAuthenticated