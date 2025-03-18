const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getMenu = async (req, res) => {
  const menuItems = await prisma.menuItem.findMany();
  res.json(menuItems);
};

// ✅ Create a new menu item
exports.addMenuItem = async (req, res) => {
  try {
      const { name, price, categoryId, description, imageUrl, available } = req.body;

      // Ensure categoryId is provided
      if (!categoryId) {
          return res.status(400).json({ message: "categoryId is required" });
      }

      const menuItem = await prisma.menuItem.create({
          data: {
              name,
              description,
              price,
              imageUrl,
              available,
              category: {
                  connect: { id: categoryId }, // ✅ Connect menu item to existing category
              },
          },
      });

      res.status(201).json({ message: "Menu item created successfully", menuItem });
  } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ error: error.message });
  }
};
