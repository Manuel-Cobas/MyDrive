const validCurrentDir = (currentDir) => {
  console.log("AQUIII", currentDir.replaceAll("-", "/"))
  if (!currentDir) return ""

  if (currentDir && !currentDir.includes("-")) return currentDir

  if (currentDir && currentDir.includes("-")) return currentDir.replaceAll("-", "/") + "/"
}

module.exports = validCurrentDir