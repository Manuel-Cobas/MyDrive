const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: ''
})

const userTableColumns = "user_id INT NOT NULL AUTO_INCREMENT,first_name VARCHAR(50), last_name VARCHAR(120), avatar VARCHAR(100), personal_dir VARCHAR(150),email VARCHAR(50), password VARCHAR(50), PRIMARY KEY (user_id)"
const createUserTable = `CREATE TABLE IF NOT EXISTS USERS (${userTableColumns})`

const filesTableColumns = "file_id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, file_name VARCHAR(100), path VARCHAR(150), PRIMARY KEY (file_id), FOREIGN KEY (user_id) REFERENCES USERS(user_id)"
const createFilesTable = `CREATE TABLE IF NOT EXISTS FILES (${filesTableColumns})`

const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS MY_DRIVE"

connection.connect(function (error) {
  if (error) throw error
  connection.query(createDatabaseQuery)
  connection.query("USE MY_DRIVE")
  connection.query(createUserTable)
  connection.query(createFilesTable)
})

module.exports = connection