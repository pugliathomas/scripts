// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: folder;
// Get the path to an existing file or folder bookmark, previously created via Scriptable

// Read parameters passed by Shortcuts
var fm = FileManager.iCloud()
var bookmarkName = args.shortcutParameter
var bookmarkType = args.plainTexts[0]

// If a bookmark of this name exists, pass its info back to Shortcuts
if (fm.bookmarkExists(bookmarkName) == true) {
  var path = fm.bookmarkedPath(bookmarkName)
  Pasteboard.copyString("{\"path\":\"" + path + "\", \"name\":\"" + bookmarkName + "\", \"type\":\"" + bookmarkType + "\"}")
// Reopen Shortcuts
  Safari.open('shortcuts://')
  } else {
      var noBookmark = new Alert()
      noBookmark.title = 'No Bookmark Found'
      noBookmark.message = 'A bookmarked ' + bookmarkType + ' called \"' + bookmarkName + '\" was not found in Scriptable. Make sure you create a bookmark in Scriptable first.\n\nClose the alert to return to Shortcuts...'
      noBookmark.addCancelAction('Close')
      await noBookmark.presentAlert()
// Return error
      Pasteboard.copyString("{\"path\":\"RUNTIME ERROR\"}")
      Safari.open('shortcuts://')
}