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



## 新手使用


### windows

下载[release](/releases)中的windows版本,然后在下载 [bin/run.bat](/bin/run.bat) 放到下载程序的同级目录

右键run.bat使用编辑器打开,修改里面的内容

```bat
web_windows_amd64.exe -p 8000 -o "d:\obsidian\save\path"
```

把`d:\obsidian\save\path`换成你自己obsidian的存储路径,8000是对外访问的端口,可以根据自己的需求修改,确定之后双击run.bat运行

之后就可以通过浏览器`http://127.0.0.1:8000`来查看了.

如果需要在内网访问可以通过

开始菜单->输入cmd.exe->回车运行->在输入`ipconfig`回车

查看自己内网ip,最后通过ip:8000,即可访问.如果前面修改了8000为其他端口则这里改成之前修改的即可.