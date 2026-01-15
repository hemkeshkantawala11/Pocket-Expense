const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpensesByDate,
  categoryBreakdown,
  monthlySummary,
  spendingInsight,
  topCategoryThisMonth,
  averageDailySpending,
  mostExpensiveDay,
  paymentMethodInsight,
  categoryThresholdAlert
} = require("../controllers/expense.controller")

const router = express.Router()

router.use(authMiddleware)

router.post("/", addExpense)
router.get("/", getExpenses)
router.put("/:id", updateExpense)
router.delete("/:id", deleteExpense)
router.get("/filter/date", getExpensesByDate)
router.get("/analytics/category", categoryBreakdown)
router.get("/analytics/monthly", monthlySummary)
router.get("/analytics/insight", spendingInsight)
router.get("/analytics/top-category", topCategoryThisMonth)
router.get("/analytics/average-daily", averageDailySpending)
router.get("/analytics/expensive-day", mostExpensiveDay)
router.get("/analytics/payment-method", paymentMethodInsight)
router.get("/analytics/threshold", categoryThresholdAlert)

module.exports = router
