const connection = require("../database")

function Upload(req, res) {
  const files = req.files
  const userId = req.user.user_id
  const personalDir = req.user.personal_dir

  console.log(userId)
  console.log(files)
  if (!userId) return res.status(500).send({
    error: "no has iniciado sesion."
  })

  if (!files) return res.status(500).send({
    error: "no hay archivos para subir."
  })

  files.map(file => {
    if (file.size > 10485760)
      return res.status(500).send({
        error: "el archivo supera el limite de tamaño."
      })

    const parameters = "file_id, user_id, file_name, path"
    const values = `NULL, ${userId}, "${file.originalname}", "${personalDir}"`
    const query = `INSERT INTO files (${parameters}) VALUES (${values})`

    connection.query(query, (error, results) => {
      if (error)
        return res.status(500).send({
          error
        })

      if (!results || results.length < 1)
        return res.status(500).send({
          error: "error en la peticion."
        })

      return res.status(200).send({
        message: "subida existosa!"
      })
    })
  })
}

module.exports = {
  Upload
}