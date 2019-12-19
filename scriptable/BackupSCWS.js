// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
// Find your key in Working Copy and insert it below. This is required by Working Copy in order to perform operations.
let key = "5R894PFADS"
await promptDirSelection("Please navigate to the Shortcuts folder in iCloud Drive and open the Export folder.")
let fm = FileManager.iCloud()
let shortcutsDirs = await DocumentPicker.open(["public.folder"])
let shortcutsDir = shortcutsDirs[0]
let filePaths = allFiles(shortcutsDir)
await promptDirSelection("Please use the Working Copy file provider to open the repository you want to back up to.")
let repoDirs = await DocumentPicker.open(["public.folder"])
let repoDir = repoDirs[0]
let repoName = fm.fileName(repoDir)
removeFiles(repoDir)
for (filePath of filePaths) {
  copyFile(filePath, repoDir)
}
await pushChanges(repoName, key)
let params = URLScheme.allParameters()
let url = params["x-success"]
Safari.open(url)

async function pushChanges(repo, key) {
  let baseURL = "working-copy://x-callback-url/chain/"
  let msg = "Backup from Scriptable"
  let cbu = new CallbackURL(baseURL)
  cbu.addParameter("key", key)
  cbu.addParameter("repo", repo)
  cbu.addParameter("command", "commit")
  cbu.addParameter("message", msg)
  cbu.addParameter("limit", "999")
  cbu.addParameter("command", "push")
  await cbu.open()
}

function copyFile(srcFilePath, dstDir) {
  let fm = FileManager.iCloud()
  let filename = fm.fileName(filePath, true)
  let dstFilePath = fm.joinPath(dstDir, filename)
  fm.copy(srcFilePath, dstFilePath)
}

function removeFiles(dstDir) {
  let fm = FileManager.iCloud()
  let filePaths = allFiles(dstDir)
  for (filePath of filePaths) {
    fm.remove(filePath)
  }
}

function allFiles(dir) {
  let fm = FileManager.iCloud()
  let files = fm.listContents(dir)
  let filePaths = files.map(file => {
    return fm.joinPath(dir, file)
  })
  return filePaths.filter(isShortcut)
}

function isShortcut(filePath) {
  let fm = FileManager.local()
  let ext = fm.fileExtension(filePath)
  return ext == "shortcut"
}

async function promptDirSelection(msg) {
  let alert = new Alert()
  alert.title = "Select folder"
  alert.message = msg
  alert.addAction("OK")
  await alert.presentAlert()
}
