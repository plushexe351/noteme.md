const Category = require("../models/Category");
const asyncHandler = require("../middlewares/asyncHandler");

// create a category
const createCategory = asyncHandler(async (req, res) => {
  const { name, uid } = req.body;

  if (!name?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Category name cannot be empty" });
  }

  const category = new Category({ name, user: uid });
  await category.save();

  res
    .status(201)
    .json({ success: true, message: "Category created", category });
});

// get categories for a user
const getCategories = asyncHandler(async (req, res) => {
  const { uid } = req.query;

  const categories = await Category.find({ user: uid });
  res.status(200).json({ success: true, categories });
});

// delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { uid } = req.body; // make sure user sending the request is the owner

  const category = await Category.findById(id);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  if (category.user.toString() !== uid) {
    return res
      .status(403)
      .json({
        success: false,
        message: "Unauthorized to delete this category",
      });
  }

  await category.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
});

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
