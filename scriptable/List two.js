// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
var fm = FileManager.iCloud();
let baseDir = fm.documentsDirectory();
// Present a list of the following folders, which have to be located under iCloud Drive/Scriptable. You can change these folders to whatever you like.

var folders = ['Setup', 'iPad', 'Well-Being', 'Communications', 'Shortcuts', 'Apps', 'Everything Else',]
var folderLength = folders.length;

var ask = new Alert
ask.title = 'Review Folders'
ask.message = 'Choose one of the folders below.'

for (var i = 0; i < folderLength; i++) {
    ask.addAction(folders[i])
}
 ask.addCancelAction('Close')

 var show = ask.presentAlert()
 var actionIndex = await show
 var selectedAction = folders[actionIndex]

var path = fm.joinPath(baseDir, '/Review/' + selectedAction + '/')

var list = fm.listContents(baseDir)

var listLength = list.length;

var files = new Alert
files.title = 'Found Files'
files.message = 'Here are your files.'

for (var i = 0; i < listLength; i++) {
    files.addAction(list[i])
}
 files.addCancelAction('Close')

var showFiles = files.presentAlert()

var fileIndex = await showFiles
var selectedFile = list[fileIndex]

var filePath = fm.joinPath(path, selectedFile)

var img = fm.readImage(filePath)

QuickLook.present(img)