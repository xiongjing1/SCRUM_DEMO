<template>
  <div>
    <HeadSide></HeadSide>
    <!--
    <div class="editing">
      <div class="tempavatar" v-for="(item,index) in userList" v-bind:key="index">
        <img  :src="item.headshot">
      </div>
    </div> -->
    <div class="mainbody">
      <img src="../assets/click.png"  v-if="theclick===0&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 450px;height: 80px">
      <img src="../assets/click.png"  v-if="theclick===1&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 630px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===2&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 810px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===3&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 990px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===6&&dialogVisible" style="position: absolute;z-index: 100000;top:448px;left: 920px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===5&&dialogVisible" style="position: absolute;z-index: 100000;top:448px;left: 720px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===4&&dialogVisible" style="position: absolute;z-index: 100000;top:448px;left: 530px;height: 80px">
    <el-col :span="4" class="filelist" style="color: black;">
      <img src="../assets/backtohome.png" style="position: absolute;left: 14px;top:18px;z-index: 1000;height: 28px;width:28px;cursor: pointer" v-on:click="jumpback">
      <h4 style="text-align: center; font-weight: 500; " ><i class="el-icon-folder" style="color: black"></i>&emsp;我的文档</h4>
      <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
        <p><el-input v-model="input1" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
        <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew()">确认</el-button></p>
        <div slot="reference" class="name-wrapper" >
          <el-button class="new-button" style="width: 100%;border-right: 0;border-radius: 0 " >新建文件<i class="el-icon-folder-add el-icon--right"></i></el-button>
        </div>
      </el-popover>
      <el-menu
          default-active="1-1"
          @open="handleOpen"
          @close="handleClose"
          active-text-color="#ffd04b"
          >
        <el-menu-item :index="1-1" >
          <i class="el-icon-document" style="font-size: 20px;color: black"></i>
          <span style="color:black">
            {{this.editfile}}
          </span>
          <span style="color:black">
            编辑中
          </span>
          <i class="el-icon-edit-outline el-icon--right" style="color:black;font-size:20px;text-align: right;position: absolute;top:20px;left:200px"></i>
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
              <i class="el-icon-document" style="font-size: 20px;color: #7D7D7D"></i>
              <span style="font-size: 15px;color: #7D7D7D">&ensp;{{ scope.row.name }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="42">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="move-button"
                @click="handleDelete(scope.row.ID)"><i class="el-icon-delete" style="color:darkred;font-size: 20px;" ></i></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-col>
    <el-col :span="4">
      <div id="vditor"  name="description" class="edit" ></div>
      <div style="margin-top: 10px;position: absolute;left: 730px;top: 703px;">
        <el-button style="background-color: #383838; color:whitesmoke;width: 150px;letter-spacing: 10px;font-size: 16px;"  @click="submit()">提交</el-button>
      </div>
    </el-col>

    <el-dialog
        title="模板选择"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <span><img src="../assets/PrototypeMaterial/model0.png"  class="modeldocument" @click="getModel(0)" ></span>
      <span> &ensp;</span>
      <span><img src="../assets/PrototypeMaterial/model1.png"  class="modeldocument" @click="getModel(1) " ></span>
      <span> &ensp;</span>
      <span><img src="../assets/PrototypeMaterial/model2.png"  class="modeldocument" @click="getModel(2)" ></span>
      <span> &ensp;</span>
      <span><img src="../assets/PrototypeMaterial/model3.png"  class="modeldocument" @click="getModel(3)" ></span>

      <span><img src="../assets/PrototypeMaterial/model4.png"  class="modeldocument" @click="getModel(4)" ></span>
      <span> &ensp;&ensp;&ensp;</span>
      <span><img src="../assets/PrototypeMaterial/model5.png" class="modeldocument"  @click="getModel(5)" ></span>
      <span> &ensp;&ensp;&ensp;</span>
      <span><img src="../assets/PrototypeMaterial/model6.png"  class="modeldocument" @click="getModel(6)" ></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false;chooseModel()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
  </div>
</template>...
<script>
import Vditor from "vditor";
import global from "@/api/global";
import 'vditor/dist/index.css';
import axios from 'axios';
import HeadSide from "@/components/HeadSide";

function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i].username=== obj) {
      return true;
    }
  }
  return false;
}

export default {
  components: {HeadSide},
  inject:['reload'],
  data() {
    return {
      sendjson:{
        username:'',
        content:'',
        headshot:'',
      },
      editinput:'',
      dialogVisible: false,
      theclick:9,
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
      userList:[],
    }
  },
  mounted() {
    this.dialogVisible=global.dialogVisible;
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
    this.initWebSocket();
    console.log("wb")
    var _this=this
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
      },
      input(md){
        _this.editinput=md
        console.log(_this.editinput)
      },
    });
  },
  methods: {
    getModel(index){
      if(index===0) global.filecontent='';
      else if(index===1) global.filecontent=global.model1;
      else if(index===2) global.filecontent=global.model2;
      else if(index===3) global.filecontent=global.model3;
      else if(index===4) global.filecontent=global.model4;
      else if(index===5) global.filecontent=global.model5;
      else  global.filecontent=global.model6;
      this.theclick=index;
    },
    chooseModel(){
      global.dialogVisible=false;
      this.theclick=9;
      this.contentEditor.setValue(global.filecontent);
    },
    getList(){
      this.editfile=global.filename;
      console.log('88'+global.fileid);
      this.searchData=[];
      for(let i=this.tableData.length-1;i>=0;i--){
        if(this.tableData[i].isRecycled === false){
          if(this.tableData[i].ID!== global.fileid){
            console.log('kk'+this.tableData[i].ID+this.tableData[i].name)
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
      global.fileid=id;
      global.filename=name;
      global.filecontent=content;
      window.localStorage.setItem('docID',id)
      this.reload();
    },
    jumpback(){
      this.$router.push('/designManage/'+window.localStorage.getItem('pid'));
    },
    handleNew() {
      global.filename=this.input1;
      this.editfile=this.input1;
      var new_doc_id;
      var add = true;
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
                new_doc_id=response.data.new_doc_id;
                console.log(response.data.message);
                global.fileid=new_doc_id;
                global.filecontent='';
                global.dialogVisible = true;
                this.reload();
                console.log('77'+this.editfile);
              } else {
                new_doc_id=response.data.new_doc_id;
                console.log(response.data.message);
              }
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
      this.reload();
      /*
      this.$router.push({
        name:'documentManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
       */
    },
    initWebSocket(){
      const wsuri = "ws://43.138.21.64:8080/ws/chat/"+ window.localStorage.getItem('docID')+'/';
      console.log(wsuri)
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(){ //连接建立之后执行send方法发送数据
      console.log('连接成功！')
    },
    websocketonerror(){//连接建立失败重连
      this.initWebSocket();
    },
    websocketclose(){  //关闭
      //console.log('断开连接');
    },
    websocketonmessage(e){ //数据接收
      var jsondata=JSON.parse(e.data.replace(/\n/g,"\\n").replace(/\r/g,"\\r"));
      console.log(jsondata)
      this.content=jsondata.content
      console.log("0the length"+this.userList.length);
      this.contentEditor.setValue(this.content)
      if(contains(this.userList,jsondata.username)){
        console.log("有了")
      }
      else {
        var tmp={
          "username":jsondata.username,
          "headshot":jsondata.headshot,
        }
        this.userList.push(tmp)
        console.log("the length"+this.userList.length);
        console.log("waht"+this.userList);
      }
    },
    sendcontent(){
      this.sendjson.content=this.editinput;
      this.sendjson.username=window.localStorage.getItem('name')
      this.sendjson.headshot=window.localStorage.getItem('headshot')
      this.websocketsend(JSON.stringify(this.sendjson));
      console.log('发送数据')
    },
    websocketsend(Data){//数据发送
      this.websock.send(Data);
    },
  },
  watch: {
    editinput(){
        console.log('yes')
        this.sendcontent();
    },
  },
}
</script>
<style scoped>
.edit{
  text-align: left;
  position: absolute;
  top: 0;

  width: calc(100% - 250px);
  left:236px;
}
.filelist{
  text-align: left;
  position: absolute;
  left: 0;
  width: 260px;
  height: 750px;
  border-right: 2px solid #EDEEF2;
  background-color: #ffffff;
  z-index: 100;
  overflow-x: hidden;
  overflow-y:auto ;
}
.mainbody{
  position: absolute;
  top:50px;
}
.new-button:hover{
  background-color: #EEEFF2;
  color: #383838;
  border-color: transparent;
}
.modeldocument{
  cursor: pointer;
}
.modeldocument:after{
  box-shadow: 5px 0px 10px #2c3e50;
}
.modeldocument:hover{
  box-shadow: 0px 0px 6px #2c3e50;
}
span::selection{
  box-shadow: 0px 0px 10px #2c3e50;
}
.editing{
  z-index: 10000;
  top:0;
  position: absolute;
  left: 260px;
  width: 300px;
  height: 50px;
  background-color: #3D89E9;
}
.tempavatar{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  text-align: left;
  background-color: #2c3e50;
}
.tempavatar img{
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  height: 100%;
}
</style>
