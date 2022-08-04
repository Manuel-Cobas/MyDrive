//  Imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require("express-fileupload")
require('dotenv').config();
require("./database")

// Import Routes
const usersRoutes = require("./routes/user")
const filesRoutes = require("./routes/file")

// Initializations
const app = express(); 

// Settings
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "./tmp/",
  limits: { fileSize: 50 * 1024 * 1024 * 1024 }
}))

// Variables
app.set("port", process.env.PORT || 4000)

// Routes
app.use("/users", usersRoutes)
app.use("/files", filesRoutes)

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server On Port ${app.get('port')}`)
})
