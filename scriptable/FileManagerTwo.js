// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic-wand;
let fm = FileManager.iCloud()
let dir = fm.documentsDirectory()
let path = fm.joinPath(dir, "myfile.txt")
fm.write(path, "Hello world")
let text = fm.read(path)
QuickLook.present(text)