const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const host = "/files/";
const webpath = "../frontend/dist";
const obsdianPath =
  "/Users/c/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/人生漫漫/人生漫漫/开源书籍/安全之路";
const imagePath =
  "/Users/c/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/人生漫漫/人生漫漫/图片存储";
const imageFolder = imagePath.split("/")[imagePath.split("/").length - 1];
function GetFileList(current) {
  var result = [];
  var ret = fs.readdirSync(current);
  ret.forEach((file) => {
    if (file == imageFolder || file == "index.md" || file[0] == ".") return;
    if (fs.statSync(`${current}/${file}`).isDirectory()) {
      result.push({
        name: file,
        label: file,
        type: "dir",
        fullpath: `${current}/${file}`.replace(obsdianPath, ""),
        children: GetFileList(`${current}/${file}`),
      });
    } else {
      result.push({
        name: file,
        label: file,
        type: "file",
        fullpath: `${current}/${file}`.replace(obsdianPath, ""),
        children: [],
      });
    }
  });
  return result;
}
function replaceStatic(text) {
  var t = text.match(/!\[\[(.+?)\]\]/g);
  if (t) {
    t.forEach((r) => {
      var image =
        host + r.replace("![[", "").replace("]]", "").replace(/\s+/g, "%20");
      text = text.replace(r, `\n![image](${image})\n`);
    });
  }
  return text;
}
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// app.get("/", (req, res) => {
//   res.send("hello world");
// });
app.get("/list", (req, res) => {
  const result = {
    title: obsdianPath.split("/")[obsdianPath.split("/").length - 1],
    nodes: GetFileList(obsdianPath),
  };
  res.send(result);
});
app.get("/read", (req, res) => {
  var result = {
    code: 200,
    text: "",
  };
  var path = req.query.path;
  path = obsdianPath + "/" + path.replace(/\.\./g, "");
  console.log("[*] Read " + path);
  if (fs.existsSync(path)) {
    result.text = replaceStatic(fs.readFileSync(path).toString());
  }
  res.send(result);
});
app.use("/files", express.static(`${imagePath}`));

app.use(express.static(webpath));
app.listen(port, () => {
  console.log("[*] Start Server");
});
