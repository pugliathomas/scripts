// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
let alert = new Alert()
alert.message = "Enter a subreddit"
alert.addTextField("e.g. EarthPorn")
alert.addAction("Ok")
await alert.presentAlert()
var sub = alert.textFieldValue(0)

// grab json data from subreddit
let url = `https://www.reddit.com/r/${sub}/best.json`
let req = new Request(url)
let json = await req.loadJSON()
let jsonData = json['data']
let posts = jsonData['children']

var insert = ""

for (item of posts) {
  data2 = item['data']
  imgURL = data2['url']
// direct link
  var re = new RegExp("(https?:).*(jpg|gif|png)");
// gfycat link
  var re2 = new RegExp(/https:\/\/gfycat.com/);
// indirect imgur link
  var re3 = new RegExp(/https?:\/\/imgur.com/);
// if direct link, leave it alone and insert
  if (re.test(imgURL)) {
    insert += `<div class="column"><center><img src=${imgURL} width="95%"></center></div>`
  } else if (re3.test(imgURL)) {
// if its an indirect link, fix the url
    var imgur = imgURL.match(/[^/]+(?=\/$|$)/)
    insert += `<div class="column"><center><img src="https://i.imgur.com/${imgur}.jpg" width="95%"></center></div>`
  } else if (re2.test(imgURL)) {
// if its gfycat, insert the link to the mp4
    var gfy = imgURL.match(/(?!(.*\/))[a-zA-Z]+/g)
    let video = `https://giant.gfycat.com/${gfy}.mp4`
    insert += `<div class="column"><center><video width="320" height="240" controls> <source src=${video} type="video/mp4"></video></center></div>`; 
  } else {
// otherwise its some dumb shit we wont display
    console.log(`${imgURL} not a usable link`);
  }
}

// the html for our view
let baseHTML = `
<!DOCTYPE html>
<html>
<head>
<title></title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
.column { float: left; width: 33.33%; }
.row:after { content: ""; display: table; clear: both; }
body { white-space: pre; font-family: monospace; background-color: #000; }
span { background-color: #000; }
th { color: #fff; }
</style>
</head>
<body>
<div class="row">
${insert}
</div></div>
</body>
</html>
`
// load the view
let view = new WebView();
view.loadHTML(baseHTML);
await view.present();