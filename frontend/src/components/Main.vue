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
        <el-col class="left" :span="6"
          ><div class="bg-purple">
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
        <el-col class="right" :span="18"
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
      keyword: ""
    };
  },
  mounted() {
    axios.get(this.server + "/list").then(resp => {
      console.log("send requests");
      this.filelist = [];
      this.filelist.push({
        label: "首页",
        name: "首页",
        fullpath: "index.md",
        type: "file"
      });
      this.filelist = this.filelist.concat(resp.data.nodes);
      this.fulllist = this.filelist;
      this.title = resp.data.title;
    });
    axios.get(this.server + "/read?path=index.md").then(resp => {
      this.text = resp.data.text;
    });
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
    }
  },
  methods: {
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
      if (e.type == "file") {
        this.title = e.label;
        axios
          .get(this.server + "/read?path=" + encodeURIComponent(e.fullpath))
          .then(resp => {
            this.text = resp.data.text;
          });
      }
      console.log(e);
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
  background: #6584b1;
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
  max-height: 730px;
  height: 730px;
  overflow-y: scroll;
}
.right {
  max-height: 730px;
  height: 730px;
  overflow: hidden;
}
.markdown-body {
  width: 100%;
  height: 730px;
}
.body {
  padding: 10px;
}
.title {
  color: #f5f5f5;
  padding: 25px;
  /* background-color: #e5e9f2; */
}
</style>
