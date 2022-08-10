const connection = require("../database")
const fse = require("fs-extra")
const path = require("path")

function Upload(req, res) {
  const files = req.files
  const userId = req.user.user_id
  const personalDir = req.user.personal_dir
  const { exists, currentDir } = req.current_dir
  console.log(files)
  if (!userId)
    return res.status(500).send({
      error: "no has iniciado sesion."
    })

  if (!files)
    return res.status(500).send({
      error: "no hay archivos para subir."
    })

  files.map(async file => {
    const parameters = "file_id, user_id, file_name, path"
    const values = `NULL, ${userId}, "${file.filename}", "${personalDir + currentDir ? currentDir : ''}"`
    const query = `INSERT INTO files (${parameters}) VALUES (${values})`

    connection.query(query, (error, results) => {
      if (error)
        return res.status(500).send({
          error
        })

      if (!results)
        return res.status(500).send({
          error: "error en la peticion."
        })
    })

    if (currentDir && exists)
      await fse.move(
        personalDir + file.filename,
        personalDir + `${currentDir}/` + file.filename
      )
        .then()
        .catch((error) => res.status(500).send({ error }))
  })

  return res.status(200).send({
    message: "subida existosa!"
  })
}

async function sendFile(req, res) {
  const personalDir = req.user.personal_dir
  const userId = req.user.user_id
  const fileName = req.params.file_name
  console.log(personalDir)
  if (!userId || !personalDir)
    return res.status(500).send({
      error: "no has iniciado sesion."
    })

  const currentDir = path.dirname("__dirname__")
  const pathFile = path.join(currentDir, `${personalDir}${fileName}`)
  const exists = await fse.pathExists(pathFile)

  if (!exists)
    return res.status(404).send({
      error: "el archivo no fue encontrado"
    })

  return res.status(200).send({ exists })
}

module.exports = {
  Upload,
  sendFile
}