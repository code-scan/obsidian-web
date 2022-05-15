<template>
  <div id="main">
    <div class="header">
      <el-row>
        <el-col :span="24"
          ><div class="grid-content bg-purple-dark">
            <h1>
              <span class="title">{{ title }}</span>
            </h1>
          </div></el-col
        >
      </el-row>
    </div>
    <div class="body">
      <el-row>
        <!-- v-bind:style="{ width: detailWidth + 'px' }" -->
        <el-col id="menu" class="left"  :span="5"
          >
          <div class="bg-purple">
            <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="keyword"
            >
            </el-input>
            <el-tree :data="filelist" @node-click="handleNodeClick">
              <span slot-scope="{ node, data }">
                <i v-if="data.type == 'dir'" class="el-icon-notebook-2" />
                <i v-else class="el-icon-tickets" />
                <span style="margin-left:5px;" :title="data.name">{{
                  data.name
                }}</span>
              </span>
            </el-tree>
          </div></el-col
        >
        <el-col id="content" class="right" :span="19"
          ><div class=" bg-purple-light">
            <mavon-editor
              :toolbars="markdownOption"
              :preview="true"
              :subfield="false"
              :editable="false"
              :defaultOpen="preview"
              :toolbarsFlag="false"
              v-model="text"
            ></mavon-editor></div
        ></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Main",

  data() {
    return {
      // server: "http://127.0.0.1:3000",
      server: "",
      filelist: [],
      fulllist: [],
      text: "",
      preview: "preview",
      markdownOption: {},
      title: "Obsidian Web",
      keyword: "",
      detailWidth:'300',
    };
  },
  mounted() {

    var index='index.md'
    if(this.$route.query.path){
      index = this.$route.query.path;
    }
    console.log(this.$route.query.path);
    axios.get(this.server + "/list").then(resp => {
      console.log("send requests");
      this.filelist = [];
      this.filelist.push({
        label: "首页",
        name: "首页",
        fullpath: index,
        type: "file"
      });
      this.filelist = this.filelist.concat(resp.data.nodes);
      this.fulllist = this.filelist;
      this.title = resp.data.title;
    });
    this.readFile(index)
    // this.dragControllerDiv()
  },
  watch: {
    title(newValue, oldValue) {
      if (newValue != oldValue) {
        document.title = newValue;
      }
    },
    keyword(newValue) {
      if (newValue == "") {
        this.filelist = this.fulllist;
      } else {
        this.filelist = [];
        this.searchKeyword(this.fulllist);
      }
    },
    $route(to,from){
      if(to.query.path){
        this.readFile(to.query.path)
      }
   }
  },
  methods: {
    readFile(path){
      axios.get(this.server + "/files/"+encodeURIComponent(path)).then(resp => {
        // var html=resp.data.text;
        var html=resp.data;
        html = this.replaceLink(html);
        this.text = html;
      });
    },
    searchKeyword(fulllist) {
      fulllist.forEach(element => {
        if (element.label.indexOf(this.keyword) != -1)
          this.filelist.push(element);
        if (element.type == "dir") {
          this.searchKeyword(element.children);
        }
      });
    },
    handleNodeClick(e) {
      if (e.type == "file" && e.fullpath.indexOf(".md")>-1) {
        this.title = e.label;
        this.$router.push({
          path:"/",
          query:{
            path:e.fullpath
          },
        })
      }
      console.log(e);
    },
    replaceLink(html){
      // replace image ![[]] to ![]() 
      var reg_link = /\!\[\[(.+?)\]\]/g;
      var result = html.match(reg_link)
      console.log("result:",result)
      for (let key in result) {
          var element = result[key];
          const title = element.replace(/\!\[\[/g, '').replace(/\]\]/g, '')
          const link = title.replace(/\s+/g,"%20")
          const href = `![image](/files/${link})`
          console.log("key:",element)
          console.log("link:",link)
          console.log("href:",href)
          html = html.replace(element, href)
      }
    
      // replace link [[]] to []()
      var reg_link = /\[\[(.+?)\]\]/g;
      var result = html.match(reg_link)
      console.log("result:",result)
      for (let key in result) {
          var element = result[key];
          const title = element.replace(/\[\[/g, '').replace(/\]\]/g, '')
          const link = title.replace(/\s+/g,"%20")
          const href = `[${title}](/#/?path=${link}.md)`
          console.log("key:",element)
          console.log("link:",link)
          console.log("href:",href)
          html = html.replace(element, href)
      }

      // replace markdown images to local
      var reg_image=/!\[(.+?)\]\((.+?)\)/g
      var result = html.match(reg_image)
      for (let key in result) {
          var element = result[key];
          if(element.indexOf('files') > -1){
            continue;
          }
          const image = element.replace('](', '](/files/')
          html = html.replace(element,image)
      }

      // fix markdown image path error
      var reg_image=/!\[]\((.+?)\)/g
      var result = html.match(reg_image)
      for (let key in result) {
          var element = result[key];
          if(element.indexOf('files') > -1){
            continue;
          }
          const image = element.replace('](', '](/files/')
          html = html.replace(element,image)
      }
      return html;
    },
    dragControllerDiv: function() {
      // 保留this引用
      let data = this;
      let resize = document.getElementById("menu");
      resize.onmousedown = function(e) {
        // 颜色改变提醒
        resize.style.background = "#818181";
        let startX = e.clientX;
        resize.left = resize.offsetLeft;
        document.onmousemove = function(e) {
          // 计算并应用位移量
          let endX = e.clientX;
          let moveLen = startX-endX ;
          startX = endX;
          data.detailWidth -= moveLen;
        };
        document.onmouseup = function() {
          // 颜色恢复
          resize.style.background = "";
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    }

  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #323546;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 3px;
  min-height: 50px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.left {
  background: white;
  max-height: 730px;
  height: 730px;
  overflow-y: scroll;
  /* margin-top: 20px; */
}
.right {
  max-height: 730px;
  height: 730px;
  overflow: hidden;
  padding-left: 20px;
  padding-right: 20px;
  scrollbar-width: none;
  
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.markdown-body {
  width: 100%;
  height: 730px;
}
.body {
  padding-left: 10px;
}
.title {
  color: #f5f5f5;
  position: relative;
  top: 6px;
  left: 10px;
  /* background-color: #e5e9f2; */
}
.header{
  padding-left: 10px;
  padding-right: 20px;
}
</style>
