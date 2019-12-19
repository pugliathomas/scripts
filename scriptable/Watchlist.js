// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// always-run-in-app: true; icon-color: deep-purple;
// icon-glyph: film; share-sheet-inputs: url, plain-text;
// Manages a watchlist of movies. Run the script from the share sheet in the IMDb app to add a movie to the watchlist.
// When a movie is added, you can press the "✅"-button to mark the movie as watched. Press the "👀"-button to mark the button to be watched.
// The watchlist is backed by a JSON file stored in iCloud Drive.
let txts = args.plainTexts
let urls = args.urls
// If a plain text and URL input, we're adding a mocke to the list.
if (txts.length > 0 && urls.length > 0) {
  let info = extractMovieInfo(txts[0])
  let imdbId = extractIMDbId(urls[0])
  if (info == null || imdbId == null) {
    // The necessary movie info isn't available.
    return
  }
  addMovie(info.name, info.year, imdbId)
}

// Create the table that holds the watchlist.
let table = new UITable()
table.showSeparators = true
populateTable()
table.present()

// Populates the table with movies on the watchlist. The function can be called repeatedly to update the information displayed in the table.
function populateTable() {
  table.removeAllRows()
  let movies = loadMovies()
  movies.sort(sortMovies)
  for (i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let row = new UITableRow()
    row.dismissOnSelect = false
    row.onSelect = (idx) => {
      let movie = movies[idx]
      openIMDb(movie.imdbId)
    }
    // Shows name of the movie.
    let titleCell = row.addText(
      movie.name,
      movie.year)
    titleCell.widthWeight = 80
    let watchTitle
    if (movie.watched) {
      watchTitle = "✅"
    } else {
      watchTitle = "👀"
    }
    // Button that toggles the mocie between watched and unwatched.
    let tglBtn = row.addButton(watchTitle)
    tglBtn.widthWeight = 10
    tglBtn.onTap = () => {
      // Toggle the state and populate the table again. We must reload the table after populating it.
      toggleWatched(movie.imdbId)
      populateTable()
      table.reload()
    }
    // Button that removes the movie from the list.
    let rmvBtn = row.addButton("❌")
    rmvBtn.widthWeight = 10
    rmvBtn.onTap = () => {
      promptRemoval(movie)
    }
    table.addRow(row)
  }
}

// Toggles the watched state of the movie with the specified IMDb ID.
function toggleWatched(imdbId) {
  let movies = loadMovies()
  for (movie of movies) {
    if (movie.imdbId == imdbId) {
      movie.watched = !movie.watched
    }
  }
  saveMovies(movies) 
}

// Presents an alert that prompts to confirm that the mocie should be removed.
async function promptRemoval(movie) {
  let alert = new Alert()
  alert.title = "Remove from watchlist?"
  alert.message = "Are you sure you want to remove " + movie.name + " from your watchlist?"
  alert.addDestructiveAction("Remove")
  alert.addCancelAction("Cancel")
  let idx = await alert.presentAlert()
  if (idx == 0) {
    // Remove the movie and populate the table again. We must reload the table after populating it.
    removeMovie(movie.imdbId)
    populateTable()
    table.reload()
  }
}

// Adds a movie to the watchlist.
function addMovie(name, year, imdbId) {
  let movies = loadMovies()
  let found = movies.find(m => {
    return m.imdbId == imdbId
  })
  if (found == null) {
    let movie = {
      "name": name,
      "year": year,
      "imdbId": imdbId,
      "watched": false
    }
    movies.push(movie)
    saveMovies(movies)
  }
}

// Removes the movie from the watchlist.
function removeMovie(imdbId) {
  let movies = loadMovies()
  movies = movies.filter(m => {
    return m.imdbId != imdbId
  })
  saveMovies(movies)
}

// Loads the movies from a JSON file stored in iCloud Drive.
function loadMovies() {
  let fm = FileManager.iCloud()
  let path = getFilePath()
  if (fm.fileExists(path)) {
    let raw = fm.readString(path)
    return JSON.parse(raw)
  } else {
    return []
  }
}

// Saves the movies to a file in iCloud Drive.
function saveMovies(movies) {
  let fm = FileManager.iCloud()
  let path = getFilePath()
  let raw = JSON.stringify(movies)
  fm.writeString(path, raw)
}

// Gets path of the file containing the watchlist data. Creates the file if necessary.
function getFilePath() {
  let fm = FileManager.iCloud()
  let dirPath = fm.joinPath(
    fm.documentsDirectory(),
    "sbsdata")
  if (!fm.fileExists(dirPath)) {
    fm.createDirectory(dirPath)
  }
  return fm.joinPath(
    dirPath,
    "watchlist.json")
}

// Sorts movies based on their watched state and name.
function sortMovies(a, b) {
  if (a.watched && !b.watched) {
    return 1
  } else if (!a.watched && b.watched) {
    return -1
  } else {
    return a.name < b.name
  }
}

// Opens the IMDb app.
function openIMDb(imdbId) {
  let url = "imdb:///title/" + imdbId
  Safari.open(url)
}

// Extracts movie information from an IMDb description.
function extractMovieInfo(text) {
  let regex = /^(.*) \(([0-9]{4})\)/
  let matches = regex.exec(text)
  if (matches.length >= 3) {
    return {
      "name": matches[1],
      "year": matches[2]
    }
  } else {
    return null
  y}
}

// Extracts an IMDb ID from a URL.
function extractIMDbId(url) {
  let matches = /tt[0-9]+/.exec(url)
  if (matches.length >= 1) {
    return matches[0]
  } else {
    return null
  }
}