const fse = require("fs-extra")

const createDir = async (path) => {
  await fse.ensureDir(path)
    .then()
    .catch(error => error)
}

module.exports = createDir