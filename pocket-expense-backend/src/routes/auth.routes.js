const express = require("express")
const { register, login, changePassword, getProfile } = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")


const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/change-password", authMiddleware, changePassword)
router.get("/profile", authMiddleware, getProfile)

module.exports = router
