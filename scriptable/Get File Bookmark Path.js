// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: file;
//Create a bookmark for a file object passed directly from the Shortcuts app

var fm = FileManager.iCloud()

// Get the file parameter from Shortcuts
var name = args.shortcutParameter
// Get the file type parameter from Shortcuts
var bookmarkType = args.plainTexts[0]

var file = fm.bookmarkedPath(name)

// Output the file path as a dictionary to force plain text
Script.setShortcutOutput({"path":file, "name":name, "type":bookmarkType})