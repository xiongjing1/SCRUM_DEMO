<template>
  <div>
    <el-col :span="4" class="filelist" >
      <h5><i class="el-icon-files"></i>文档中心</h5>
      <el-menu
          default-active="4"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-files"></i>
            <span>项目文档区</span>
          </template>
          <el-submenu index="1-1">
            <template slot="title">项目1</template>
            <el-menu-item index="1-1-1">文档1</el-menu-item>
          </el-submenu>
          <el-submenu index="1-2">
            <template slot="title">项目2</template>
            <el-menu-item index="1-4-1">文档2</el-menu-item>
          </el-submenu>
          <el-submenu index="1-3">
            <template slot="title">项目3</template>
            <el-menu-item index="1-3-1">文档3</el-menu-item>
          </el-submenu>
          <el-submenu index="1-4">
            <template slot="title">项目4</template>
            <el-menu-item index="1-4-1">文档1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-files"></i>
          <span slot="title">部门介绍</span>
        </el-menu-item>
        <el-menu-item index="3" >
          <i class="el-icon-files"></i>
          <span slot="title">其他文件夹</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-document"></i>
          <span slot="title">团队介绍</span>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col :span="4">
      <div id="vditor"  name="description" class="edit"  ></div>
      <div style="margin-top: 10px;position: absolute;left: 730px;top: 703px;">
        <el-button type="primary"  @click="submit()">提交</el-button>
      </div>
    </el-col>
  </div>

</template>...
<script>
import Vditor from "vditor";
import global from "@/api/global";
import 'vditor/dist/index.css';
//import axios from 'axios';


export default {
  inject:['reload'],
  data() {
    return {
      contentEditor: {},
      tableData: [],
    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', {
      height: 710,
      width: 1283,
      icon:'ant',
      placeholder: '开始编辑文本...',
      theme: 'classic',
      outline:{
        enable:true,
        position:'right',
      },
      counter: {
        enable: true,
        type: 'markdown'
      },
      preview: {
        maxWidth: 1500,
        delay: 0,
        hljs: {
          style: 'monokai',
          lineNumber: true
        },
      },
      tab: '\t',
      typewriterMode: true,
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      mode: 'ir',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        //'outdent',
        //'indent',
        '|',
        'quote',
        'line',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        // 'record',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'edit-mode',
        'export',
        {
          name: 'more',
          toolbar: [
            'content-theme',
            'code-theme',
            'fullscreen',
            "outline",
          ],
        }],
      after:()=>{
        this.contentEditor.setValue(global.filecontent);
      }
    });
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style scoped>
.edit{
  text-align: left;
  position: absolute;
  top: 0;
  left:253px;
}
.filelist{
  text-align: left;
  position: absolute;
  top:0;
  overflow-y: auto;
  overflow-x: hidden;
  height: 750px;
}
</style>
