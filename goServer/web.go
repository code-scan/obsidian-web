package main

import (
	"embed"
	_ "embed"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

var obsidianPath = ""

//go:embed dist/index.html
var IndexHTML string

//go:embed dist/static
var Static embed.FS

type List struct {
	Name     string  `json:"name"`
	Label    string  `json:"label"`
	Type     string  `json:"type"`
	FullPath string  `json:"fullpath"`
	Children *[]List `json:"children"`
}
type Index struct {
	Title string  `json:"title"`
	Nodes *[]List `json:"nodes"`
}

func globFiles(path string) *[]List {
	var list = []List{}
	dir, err := ioutil.ReadDir(path)
	if err != nil {
		log.Println(err)
		return &list
	}
	for _, file := range dir {
		//skil . and  ..
		if file.Name() == "." || file.Name() == ".." || strings.HasPrefix(file.Name(), ".") {
			continue
		}
		//skip not markdown file
		if file.IsDir() == false && strings.HasSuffix(file.Name(), ".md") == false {
			continue
		}
		f := List{
			Name:     file.Name(),
			Label:    file.Name(),
			FullPath: fmt.Sprintf("%s/%s", path, file.Name()),
			Children: &[]List{},
		}
		if file.IsDir() {
			f.Children = globFiles(fmt.Sprintf("%s/%s", path, file.Name()))
			f.Type = "dir"
		} else {
			f.Type = "file"
		}
		f.FullPath = strings.ReplaceAll(f.FullPath, obsidianPath, "")
		// skip null dir
		if f.Type == "dir" && len(*f.Children) == 0 {
			continue
		}
		list = append(list, f)
	}
	return &list
}

func main() {
	flag.StringVar(&obsidianPath, "p", "/home/c/SyncNote/Obsidian/人生漫漫/人生漫漫", "obsidian fullpath")
	flag.Parse()
	r := gin.Default()
	r.Static("/files/", obsidianPath)
	// redirect to real static dir
	r.GET("/static/*path", func(c *gin.Context) {
		uri := c.Param("path")
		c.Redirect(302, "/static_/dist/static/"+uri)
	})
	r.StaticFS("/static_/", http.FS(Static))
	r.GET("/", func(c *gin.Context) {
		c.Header("content-type", "text/html;charset=utf-8")
		c.String(200, string(IndexHTML))
	})
	r.GET("/list", func(c *gin.Context) {
		var list = new([]List)
		list = globFiles(obsidianPath)
		web := Index{
			Title: path.Base(obsidianPath),
			Nodes: list,
		}
		c.JSON(200, web)
	})

	r.Run("0.0.0.0:8000")

}
