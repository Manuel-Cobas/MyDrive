const fse = require("fs-extra")
const validCurrentDir = require("../helpers/validCurrentDir")

const verifyCurrentDir = (req, res, next) => {
  const currentDir = req.params.current_dir
  const personalDir = req.user.personal_dir
  const currentDirProcessed = validCurrentDir(currentDir)
  const existsCurrentDir = fse.pathExistsSync(`${personalDir + currentDirProcessed}`)

  if (currentDirProcessed && !existsCurrentDir)
    return res.status(404).send({
      error: "el directorio proporcionado no existe."
    })

  req.current_dir = {
    exists: existsCurrentDir,
    currentDir: currentDirProcessed
  }

  return next()
}

module.exports = verifyCurrentDir