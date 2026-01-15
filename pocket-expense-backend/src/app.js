const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const expenseRoutes = require("./routes/expense.routes")
const userRoutes = require("./routes/user.routes");



const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server running" })
})


app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/user", userRoutes);


module.exports = app
