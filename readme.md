# Obsidian Web

![](/image/index.jpg)

现在主要用Obsidian写笔记，有一个伪需求就是需要把笔记发布成wiki，方便共享

Obsidian是纯靠目录结构进行笔记的存储与分类的，所以实现也比较简单，一个tree+markdown editor就可以解决了

## 配置
编辑 **/Server/index.js**

```js
// 端口
const port = 3000;
...
// 笔记路径
const obsdianPath =
  "/Users/c/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/人生漫漫/人生漫漫";
// 图片文件夹，目前只支持存储到统一目录的
// 比如我实际的路径是
// /Users/c/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/人生漫漫/人生漫漫/图片存储
// 不需要写完整路径,只需要写文件夹的名字即可
const imagePath = "图片存储";
```

## 运行
```bash
cd Server
npm run serve
```


## golang server

```bash
cd frontend
npm run go
cd ../goServer/
go run web.go -p obsidian_full_path

go build web.go 

./web.exe -p obsidian_full_path
```

编译好的可以在[bin](/bin/)目录下载