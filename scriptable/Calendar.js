// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
let uiTable = new UITable();
    let i;
    for (i = 0; i < events.length; i++) {
        let uiTableRow = new UITableRow();
        let event = events[i];
        if (event.isAllDay) continue;
        let titleCell = uiTableRow.addText(event.title);
        uiTableRow.addText(formatTime(event.startDate));
        uiTableRow.addText(formatTime(event.endDate));
        uiTableRow.height = 40;
        uiTableRow.cellSpacing = 10;
        uiTable.addRow(uiTableRow);
    }
    QuickLook.present(uiTable);
}

function handleErr(val) {
    console.error(val);
}

function handleCalendars(calendars) {
    let i;
    for (i = 0; i < calendars.length; i++) {
        let calendar = calendars[i];
        console.log ('Calendar: ' + calendar.title);
    }
    CalendarEvent.thisWeek().then(handleEvents, handleErr);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
}

CalendarEvent.today().then(handleCalendars, handleErr);