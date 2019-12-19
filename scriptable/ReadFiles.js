// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
// Fetch list of repos
let secretKey = "" // Find in Working Copy app settings
let url = "working-copy://x-callback-url/repos"
let callback = new CallbackURL(url)
callback.addParameter("key", secretKey)
let result = await callback.open()
let repos = JSON.parse(result.json)
for (repo of repos) {
  await listFileStatus(repo)
}

async function listFileStatus(repo) {
  let url = "working-copy://x-callback-url/branches"
  let callback = new CallbackURL(url)
  callback.addParameter("repo", repo.name)
  callback.addParameter("key", secretKey)
  let result = await callback.open()
  let branches = JSON.parse(result.json)
  log(repo.name)
  log(branches)
  log("")
}
