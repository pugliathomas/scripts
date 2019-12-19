// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
var fm = FileManager.iCloud();
let baseDir = fm.documentsDirectory();
var path = fm.bookmarkedPath("documents")

var list = fm.listContents(path)
var lutc = fm.getUTI(path)

var listLength = list.length;

var ask = new Alert
ask.title = 'Review Folders'
ask.message = 'Choose one of the folders below.'

for (var i = 0; i < listLength; i++) {
    ask.addAction(list[i])
}
 ask.addCancelAction('Close')


 var show = ask.presentAlert()
 var actionIndex = await show
 var selectedAction = list[actionIndex]

console.log(selectedAction)