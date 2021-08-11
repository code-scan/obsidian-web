<template>
  <div id="main">
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-purple-dark"></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col class="left" :span="6"
        ><div class="grid-content bg-purple">
          <el-tree
            :data="filelist"
            @node-click="handleNodeClick"
          ></el-tree></div
      ></el-col>
      <el-col class="right" :span="18"
        ><div class="grid-content bg-purple-light">
          <mavon-editor
            :toolbars="markdownOption"
            :preview="true"
            :subfield="false"
            :editable="false"
            :defaultOpen="preview"
            v-model="text"
          ></mavon-editor></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Main",

  data() {
    return {
      filelist: [],
      text: "",
      preview: "preview",
      markdownOption: {}
    };
  },
  mounted() {
    axios.get("/list").then(resp => {
      console.log("send requests");
      this.filelist = resp.data;
    });
  },
  methods: {
    handleNodeClick(e) {
      if (e.type == "file") {
        axios.get("/read?path=" + encodeURIComponent(e.fullpath)).then(resp => {
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
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.left {
  max-height: 900px;
  height: 900px;
  overflow: scroll;
}
.right {
  max-height: 900px;
  height: 900px;
  overflow: scroll;
}
</style>
