// Imports
const express = require("express")
const { Upload, sendFile } = require("../controllers/file")

// Middlewares
const authMiddleware = require("../middlewares/auth")
const verifyCurrentDirMiddleware = require("../middlewares/verifyCurrentDir")
const multer = require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.user)
    const userDir = req.user.personal_dir
    cb(null, userDir)
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
const upload = multer({
  storage, limits: {
    fileSize: 10485760
  }
})

router.get(
  "/:file_name",
  authMiddleware,
  sendFile
)

router.post(
  "/upload/:current_dir?",
  authMiddleware,
  verifyCurrentDirMiddleware,
  upload.array("files", 12),
  Upload
)

module.exports = router