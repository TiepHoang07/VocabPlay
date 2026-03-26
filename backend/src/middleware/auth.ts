import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = header.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET) as any;

    req.userId = payload.userId;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};