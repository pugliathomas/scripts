// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
// Get image from arguments
var clipboard = args.images[0]
var fileName = args.shortcutParameter

if (typeof clipboard !== 'undefined') {
  var screenTitle = fileName + '.jpeg'
  var fm = FileManager.iCloud();
  var baseDir = fm.documentsDirectory();
  // Get the bookmark named "Image Assets"
  var path = fm.bookmarkedPath("Image Assets") + '/' + screenTitle
  // Write image data to the bookmarked folder
  await fm.writeImage(path,clipboard)
  if (fm.fileExists(path) == true) {
    //Add a tag named "Assets"
    await fm.addTag(path, 'Assets')
    let textRef = '/Image Assets/' + screenTitle
    // Copy local file path to the clipboard
    Pasteboard.copyString(textRef)
    var confirm = new Alert
    confirm.title = 'File Saved'
    confirm.message = 'The file ' + fm.fileName(path, false) + ' has been saved in Files and tagged with Assets.\n\n' + textRef + '\n\nThe file path has been copied to the clipboard.'
    confirm.addCancelAction('Close')
    confirm.presentAlert()
  }
 }
else {
  // No image found in the clipboard
  throw Error('You did not copy an image!')
}