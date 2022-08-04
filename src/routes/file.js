// Imports
const express = require("express")
const { Upload } = require("../controllers/file")

// Middlewares
const authMiddleware = require("../middlewares/auth")
const multer = require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.user)
    const userDir = req.user.personal_dir
    cb(null, `src/uploads/${userDir}`)
  },

  filename: function (req, file, cb) {
    const fileName = file.originalname.split(".")[0]
    const extName = file.originalname.split(".")[1]
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, `${fileName}-${uniqueSuffix}.${extName}`)
  }
})

// Initializations
const router = express.Router()
const upload = multer({ storage })

router.get(
  "/",
  authMiddleware,
  (req, res) => res.send("file")
)

router.post(
  "/upload",
  authMiddleware,
  upload.array("files", 12),
  (req, res) => {
    res.send("ok")
  }
)

module.exports = router