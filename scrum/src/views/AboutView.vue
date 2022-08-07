<template>
  <div>
    <el-col :span="4" class="filelist" style="background-color:#87CEFA;color: white;">
      <h4 style="text-align: center; " ><i class="el-icon-folder" style="color: yellow"></i>&emsp;我的文档</h4>
      <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
        <p><el-input v-model="input1" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
        <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew()">确认</el-button></p>
        <div slot="reference" class="name-wrapper" >
          <el-button class="new-button" style="width: 254px">NEW<i class="el-icon-folder-add el-icon--right"></i></el-button>
        </div>
      </el-popover>
      <el-menu
          default-active="1-1"
          @open="handleOpen"
          @close="handleClose"
          active-text-color="#ffd04b"
          >
        <el-menu-item :index="1-1">
          <i class="el-icon-document" style="font-size: 20px;color: #ffd04b"></i>
          <span style="color: #ffd04b">
            {{this.editfile}}
          </span>
          <span style="color: #ffd04b">
            编辑中
          </span>
          <i class="el-icon-edit-outline el-icon--right" style="color: #ffd04b;font-size:20px;text-align: right;position: absolute;top:20px;left:200px"></i>
        </el-menu-item>
      </el-menu>
      <el-table
          :show-header="false"
          :data="searchData"
          :header-cell-style="{'text-align':'left'}"
          :cell-style="{'text-align':'left'}"
          height="590px"
          style="width: 100%">
        <el-table-column
            fixed
            label="文档名"
            width="198">
          <template slot-scope="scope">
            <el-button
                style="margin-left: 10px"
                type="text"
                size="small"
                class="move-button"
                @click="jumpAnother(scope.row.ID,scope.row.name,scope.row.content)">
              <i class="el-icon-document" style="font-size: 20px"></i>
              <span style="font-size: 15px">&ensp;{{ scope.row.name }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="42">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="move-button"
                @click="handleDelete(scope.row.ID)"><i class="el-icon-delete" style="color:red;font-size: 20px;" ></i></el-button>
          </template>
        </el-table-column>
      </el-table>

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
import axios from 'axios';


export default {
  inject:['reload'],
  data() {
    return {
      input1:'',
      editfile:'',
      contentEditor: {},
      tableData: [],
      searchData:[{
        ID:'1',
        name:'1156151651',
        creatorID: '1',
        createdDate:'1',
        modifiedDate: '1',
        content: '',
        projectID: '1',
        isRecycled: false,
      },{
        ID:'2',
        name:'2',
        creatorID: '1',
        createdDate:'1',
        modifiedDate: '1',
        content: '',
        projectID: '1',
        isRecycled: false,
      }],
    }
  },
  mounted() {
    const that=this;
    let formData = new FormData();
    formData.append('projectID', window.localStorage.getItem('pid'));//window.localStorage.getItem('pid')
    formData.append('userID', window.localStorage.getItem('uid'));//window.localStorage.getItem('uid')
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    };
    axios.post('http://43.138.21.64:8080/doc/get/all',formData,config)
        .then(response => {
          if(response.status === 200){
            that.tableData = response.data.message.document.results || [];
            console.log('文档列表获取成功');
            this.load();
          }
          else {
            console.log('文档列表获取失败');
          }
        })

    this.editfile=global.filename;
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
    getList(){
      console.log(this.tableData);
      this.searchData=[];
      for(let i=this.tableData.length-1;i>=0;i--){
        if(this.tableData[i].isRecycled === false){
          if(this.tableData[i].name === global.filename){
            global.fileid=this.tableData[i].ID;
            global.filecontent=this.tableData[i].content;
          }
          else{
            this.searchData.push(this.tableData[i]);
          }
        }
      }
    },
    load () {
      setTimeout(() => {
        this.getList()
      }, 50)
    },
    jumpAnother(id,name,content){
      console.log(id);
      console.log(name);
      console.log(content);
      global.fileid=id;
      global.filename=name;
      global.filecontent=content;
      this.reload();
    },
    handleNew() {
      var add = true;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name === this.input1 && this.tableData[i].isRecycled === false) {
          add = false;
        }
      }
      if (add) {
        let formData = new FormData();
        formData.append('userID', window.localStorage.getItem('uid'));//window.localStorage.getItem('uid')
        formData.append('projectID', window.localStorage.getItem('pid'));//window.localStorage.getItem('pid')
        formData.append('docName', this.input1);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        axios.post('http://43.138.21.64:8080/doc/add', formData, config)
            .then(response => {
              if (response.status === 200) {
                console.log(response.data.message);
              } else {
                console.log(response.data.message);
              }
              this.reload();
            })
        this.input1 = '';
      }
    },
    handleDelete(id){
      console.log(id);
      let formData = new FormData();
      formData.append('docID', id);
      formData.append('userID', window.localStorage.getItem('uid'));//window.localStorage.getItem('uid')
      formData.append('docType', 3);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      };
      axios.post('http://43.138.21.64:8080/doc/remove/one',formData,config)
          .then(response => {
            if(response.status === 200){
              console.log(response.data.message);
            }
            else {
              console.log(response.data.message);
            }
            this.reload()
          })
      //this.tableData.splice(index,1);
      console.log(id);
    },
    submit() {
      let formData = new FormData();
      formData.append('userID', window.localStorage.getItem('uid'));//window.localStorage.getItem('uid')
      formData.append('docID', global.fileid);//global.fileid
      formData.append('docType', 3);
      formData.append('content', this.contentEditor.getValue());
       let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
      axios.post('http://43.138.21.64:8080/doc/update',formData,config)
          .then(response => {
            if(response.status === 200){
              console.log(response.data.message);
            }
            else {
              console.log(response.data.message);
            }
          })

      global.filecontent=this.contentEditor.getValue();
      /*
      this.$router.push({
        name:'documentManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
       */
    },
  },
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
