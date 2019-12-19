// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
var need = async package => {
  const fm = FileManager.local()
  try {
    fm.createDirectory("/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/need/", false)
  } catch (exists) {}
  const path = `/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/need/${package}.hidejs`
  if (!fm.fileExists(path)) {
    const unpkg = new Request(`https://unpkg.com/${package}`)
    const code = await unpkg.load()
    fm.write(path, code)
  }
  return eval(fm.readString(path))
}