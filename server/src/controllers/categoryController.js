const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Create a new category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category already exists
        const existingCategory = await prisma.category.findUnique({
            where: { name },
        });

        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = await prisma.category.create({
            data: { name },
        });

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { items: true }, // Include associated menu items
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: { items: true }, // Include associated menu items
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({ message: "Category updated successfully", updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.category.delete({
            where: { id },
        });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
