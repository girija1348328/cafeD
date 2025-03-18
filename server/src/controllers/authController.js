const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ token, user });
};


exports.getUserProfile = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) return res.status(404).json({ message: "User not found" });

      // Send user data (excluding password)
      res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
  } catch (error) {
      res.status(401).json({ message: "Invalid token", error: error.message });
  }
};