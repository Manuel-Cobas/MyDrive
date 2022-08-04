const jwt = require("jsonwebtoken")
const connection = require("../database")

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization
  let verifyToken = {}

  if (!authorization || !authorization.toLowerCase().startsWith("bearer")) {
    return res.status(401).send({
      error: "no se han recibido las cabeceras de autenticación."
    })
  }
  
  const token = authorization.split(" ")[1]

  try {
    verifyToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return res.status(500).send({
      error
    })
  }
  console.log("token", token)
  console.log("verify-token", verifyToken)
  if (!token || !verifyToken.USER_ID) {
    return res.status(401).send({
      error: "token invalido."
    })
  }

  const userMatchQuery = `SELECT * FROM USERS WHERE USER_ID=${verifyToken.USER_ID}`
  connection.query(userMatchQuery, (error, results) => {
    if (error) return res.status(403).send({
      error
    })

    if (!results[0]) return res.status(404).send({
      error: "Estas Credenciales no estan registradas."
    })

    req.user = {
      ...results[0],
      PASSWORD: undefined
    }

    next()
  })
}

module.exports = authMiddleware