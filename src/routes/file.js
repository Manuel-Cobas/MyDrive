const express = require("express")
const authMiddleware = require("../middlewares/auth")
const { Upload } = require("../controllers/file")
const router = express.Router()

router.get("/", authMiddleware, (req, res) => res.send("file"))
router.post("/upload", authMiddleware, Upload)

module.exports = router