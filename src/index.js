//  Imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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

// Variables
app.set("port", process.env.PORT || 4000)

// Routes
app.use("/users", usersRoutes)
app.use("/files", filesRoutes)

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server On Port ${app.get('port')}`)
})
