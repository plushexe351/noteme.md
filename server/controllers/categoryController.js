const Category = require("../models/Category"); // Assume you have this model

const createCategory = async (req, res) => {
  const { name, uid } = req.body;

  try {
    const category = new Category({ name, user: uid });
    await category.save();
    res
      .status(201)
      .json({ success: true, message: "Category created", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  const { uid } = req.query;

  try {
    const categories = await Category.find({ user: uid });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
