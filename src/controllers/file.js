function Upload(req, res) {
  console.log(req.files)
  const files = req.files
  const user = req.user

  console.log(user)

  // if (!user) return res.status(500).send({
  //   error: "no has iniciado sesion."
  // })

  // if (!files) return res.status(500).send({
  //   error: "no hay archivos para subir"
  // })

  // const fileNames = files.files.map(file => {
  //   file.mv(`./src/uploads/${file.name}`)

  //   return file.name
  // })

  // return res.status(200).send({
  //   message: "Subida exitosa, tus archivos se han subido!",
  //   fileNames
  // })
}

module.exports = {
  Upload
}