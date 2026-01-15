const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { 
  getUserOptions, 
  addCategory, 
  deleteCategory, 
  addPaymentMethod, 
  deletePaymentMethod 
} = require("../controllers/user.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/options", getUserOptions);

router.post("/categories", addCategory);
router.delete("/categories/:category", deleteCategory); // URL param

router.post("/payment-methods", addPaymentMethod);
router.delete("/payment-methods/:method", deletePaymentMethod); // URL param

module.exports = router;