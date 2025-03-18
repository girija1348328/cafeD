const express = require("express");
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");


router.post("/createCategory", createCategory); // Create a category
router.get("/", getCategories); // Get all categories
router.get("/:id", getCategoryById); // Get a single category by ID
router.put("/:id", updateCategory); // Update a category
router.delete("/:id", deleteCategory); // Delete a category


module.exports = router;
