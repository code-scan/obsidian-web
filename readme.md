# Obsidian Web

![](/image/index.jpg)

现在主要用Obsidian写笔记，有一个伪需求就是需要把笔记发布成wiki，方便共享

Obsidian是纯靠目录结构进行笔记的存储与分类的，所以实现也比较简单，一个tree+markdown editor就可以解决了



## 编译

```bash
cd frontend
npm run go
cd ../goServer/

go build web.go 

```


## 使用

```
./web -o obsidian_full_path -p web_port
```

编译好的可以在[bin](/bin/)目录下载
