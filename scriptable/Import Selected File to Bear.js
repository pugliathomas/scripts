// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: documents;
// Presents the document picker prompting you to pick a file. The contents of the selected file is then imported into Bear as a new note.
// Because the script uses the CallbackURL bridge, Bear will return to Scriptable.
let utis = [ "public.plain-text" ]
let fileURLs = await DocumentPicker.open(utis)
let fileURL = fileURLs[0]
let baseURL = "bear://x-callback-url/create"
let fm = FileManager.local()
let txt = fm.read(fileURL)
let cb = new CallbackURL(baseURL)
cb.addParameter("text", txt)
await cb.open()