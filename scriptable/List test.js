// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

var fm = FileManager.iCloud()
var listItems = []

var path = fm.bookmarkedPath("documents")

var files = fm.listContents(path)
DocumentPicker.openFolder(path)
