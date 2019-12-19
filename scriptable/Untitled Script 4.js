// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
// Optional: restrict file picker to images only
var utis = ["public.image"]
var fm = FileManager.iCloud()

var files = await DocumentPicker.open(utis)

var table = new UITable()
var header = new UITableRow()
var title = 'Selected Files'
var headerText = header.addText(title)
header.isHeader = true
table.addRow(header)

for (index in files) {
    await fm.downloadFileFromiCloud(files[index])
    let currentTags = fm.allTags(files[index])
    if (currentTags.length == 0) {
      // Add a special untagged label if the file has no tags
      var tags = 'Untagged'
      }
     if (currentTags.length > 0) {
       var tags = currentTags.join(', ')
      }
    let fileName = fm.fileName(files[index], true)

    let row = new UITableRow()
    let titleCell = row.addText(fileName, tags)
    titleCell.widthWeight = 90
    table.addRow(row)
}

QuickLook.present(table)