const User = require("../models/User");

// 1. Get the list of options to show in the App
const getUserOptions = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      categories: user.categories,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching options" });
  }
};

// 2. Add a new Category to the list
const addCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.categories.includes(category)) {
      user.categories.push(category);
      await user.save();
    }
    res.status(200).json(user.categories);
  } catch (error) {
    res.status(500).json({ message: "Error adding category" });
  }
};

const deleteCategory = async (req, res) => {
  // Decode the category name (in case it has spaces like "Dining Out")
  const categoryToDelete = decodeURIComponent(req.params.category);
  
  try {
    const user = await User.findById(req.userId);
    // Filter out the item
    user.categories = user.categories.filter((c) => c !== categoryToDelete);
    await user.save();
    res.status(200).json(user.categories);
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

// 3. Add a new Payment Method to the list
const addPaymentMethod = async (req, res) => {
  const { method } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.paymentMethods.includes(method)) {
      user.paymentMethods.push(method);
      await user.save();
    }
    res.status(200).json(user.paymentMethods);
  } catch (error) {
    res.status(500).json({ message: "Error adding payment method" });
  }
};

const deletePaymentMethod = async (req, res) => {
  const methodToDelete = decodeURIComponent(req.params.method);
  
  try {
    const user = await User.findById(req.userId);
    user.paymentMethods = user.paymentMethods.filter((p) => p !== methodToDelete);
    await user.save();
    res.status(200).json(user.paymentMethods);
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment method" });
  }
};

module.exports = { getUserOptions, addCategory, addPaymentMethod, deleteCategory, deletePaymentMethod };