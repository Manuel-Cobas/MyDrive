// Imports
const validateEmail = require("../helpers/validateEmail")
const SHA256 = require('crypto-js/sha256')
const jwt = require('jsonwebtoken');

// Services
const { createDir } = require("../services/dirService")

// Initializations
const connection = require("../database")

function SignUp(req, res) {
  const { first_name, last_name, email, password, avatar } = req.body

  if (!first_name || !last_name || !email || !password) {
    return res.status(500).send({
      error: "llene el formulario."
    })
  }

  const checkEmail = validateEmail(email)

  if (!checkEmail) return res.status(500).send({
    error: "el email es invalido"
  })

  if (password.length < 6) return res.status(500).send({
    error: "la contraseña es muy corta"
  })

  const hash = SHA256(password).toString()

  if (!hash) return res.status(500).send({
    error: "error al generar el hash"
  })

  const matchQuery = `SELECT EMAIL FROM USERS WHERE EMAIL="${email}"`

  connection.query(matchQuery, (error, match) => {
    if (error) return res.status(500).send({
      error
    })

    if (match[0]) return res.status(500).send({
      error: "estas credenciales ya estan en uso."
    })

    const nameDir = `${process.env.UPLOAD_DIR}${first_name}-${Date.now()}/`
    const parameters = "user_id, first_name, last_name, avatar, personal_dir, email, password"
    const values = `NULL, "${first_name}", "${last_name}", NULL, "${nameDir}", "${email}", "${hash}"`
    const query = `INSERT INTO USERS (${parameters}) VALUES (${values})`
    createDir(nameDir)

    connection.query(query, (error, results) => {
      if (error) return res.status(500).send({
        error
      })

      if (!results) return res.status(500).send({
        error: "No se logro terminar el proceso de registro",
        first_name,
        last_name,
        email,
        password
      })

      return res.status(200).send({
        first_name,
        last_name,
        email,
      })
    })
  })
}

function SignIn(req, res) {
  const { email, password } = req.body

  if (!email || !password) return res.status(500).send({
    error: "llene el formulario."
  })

  const matchQuery = `SELECT USER_ID, EMAIL, PASSWORD FROM USERS WHERE EMAIL="${email}"`

  connection.query(matchQuery, async (error, match) => {
    if (error) return res.status(500).send({
      error
    })

    if (!match[0]) return res.status(500).send({
      error: "estas credenciales no estan registradas.",
      email,
      password
    })

    const checkPass = SHA256(password).toString()
    const token = jwt.sign({
      ...match[0],
      password: undefined,
      email: undefined
    },
      process.env.SECRET
    )

    if (checkPass !== match[0].PASSWORD)
      return res.status(500).send({
        error: "contraseña incorrecta.",
        email,
        password
      })

    return res.status(200).send({
      email,
      password,
      token
    })
  })
}

module.exports = {
  SignUp,
  SignIn
}