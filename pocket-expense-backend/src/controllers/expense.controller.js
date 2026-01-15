const Expense = require("../models/Expense")
const mongoose = require("mongoose")

const addExpense = async (req, res) => {
  const { amount, category, paymentMethod, date } = req.body

  if (!amount || !category || !paymentMethod || !date) {
    return res.status(400).json({ message: "All fields required" })
  }

  const expense = await Expense.create({
    userId: req.userId,
    amount,
    category,
    paymentMethod,
    date
  })

  res.status(201).json(expense)
}

const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 })
  res.status(200).json(expenses)
}

const updateExpense = async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  )

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" })
  }

  res.status(200).json(expense)
}

const deleteExpense = async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId
  })

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" })
  }

  res.status(200).json({ message: "Expense deleted" })
}

const getExpensesByDate = async (req, res) => {
  const { startDate, endDate } = req.query

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start and end date required" })
  }

  const expenses = await Expense.find({
    userId: req.userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort({ date: -1 })

  res.status(200).json(expenses)
}

const categoryBreakdown = async (req, res) => {
  const data = await Expense.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(req.userId) }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    }
  ])

  res.status(200).json(data)
}

const monthlySummary = async (req, res) => {
  const { month, year } = req.query

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const total = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.userId),
        date: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" }
      }
    }
  ])

  res.status(200).json(total[0]?.totalAmount || 0)
}

const spendingInsight = async (req, res) => {
  const { month, year } = req.query

  const currStart = new Date(year, month - 1, 1)
  const currEnd = new Date(year, month, 1)
  const prevStart = new Date(year, month - 2, 1)
  const prevEnd = new Date(year, month - 1, 1)

  const [current, previous] = await Promise.all([
    Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: currStart, $lt: currEnd }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: prevStart, $lt: prevEnd }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ])

  const currTotal = current[0]?.total || 0
  const prevTotal = previous[0]?.total || 0

  let message = "No data to compare"

  if (prevTotal > 0) {
    const diff = ((currTotal - prevTotal) / prevTotal) * 100
    message =
      diff > 0
        ? `You spent ${diff.toFixed(1)}% more this month`
        : `You spent ${Math.abs(diff).toFixed(1)}% less this month`
  }

  res.status(200).json({ currTotal, prevTotal, message })
}

const topCategoryThisMonth = async (req, res) => {
  const { month, year } = req.query

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const data = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.userId),
        date: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ])

  res.status(200).json(data[0] || null)
}

const averageDailySpending = async (req, res) => {
  const { month, year } = req.query

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)
  const daysInMonth = new Date(year, month, 0).getDate()

  const total = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.userId),
        date: { $gte: start, $lt: end }
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ])

  const avg = (total[0]?.total || 0) / daysInMonth

  res.status(200).json({ average: avg.toFixed(2) })
}

const mostExpensiveDay = async (req, res) => {
  const data = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.userId)
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ])

  res.status(200).json(data[0] || null)
}

const paymentMethodInsight = async (req, res) => {
  const data = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.userId)
      }
    },
    {
      $group: {
        _id: "$paymentMethod",
        total: { $sum: "$amount" }
      }
    }
  ])

  res.status(200).json(data)
}

const categoryThresholdAlert = async (req, res) => {
  const { category, threshold, month, year } = req.query

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const total = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.userId),
        category,
        date: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])

  const spent = total[0]?.total || 0

  res.status(200).json({
    spent,
    crossed: spent > threshold
  })
}



module.exports = {
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
}
