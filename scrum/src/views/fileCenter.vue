<template>
  <div>
    <HeadSide></HeadSide>
    <div class="editing">
      <div class="tempavatar" v-for="(item,index) in userList" v-bind:key="index">
        <img  :src="item.headshot">
      </div>
    </div>
    <div class="mainbody">
    <el-col :span="4" class="filelist" >
      <img src="../assets/backtohome.png" style="position: absolute;left: 14px;top:18px;z-index: 1000;height: 28px;width:28px;cursor: pointer" v-on:click="jumpback">
      <h4 style="text-align: center; font-weight: 500;" ><i class="el-icon-folder" style="color: black"></i>&emsp;文档中心</h4>
      <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
        <p><el-input v-model="input1" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
        <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew1()">确认</el-button></p>
        <div slot="reference" class="name-wrapper" >
          <el-button class="new-button" style="width: 100%;border-right: 0;border-radius: 0 " >新建文件夹<i class="el-icon-folder-add el-icon--right" style="color: black"></i></el-button>
        </div>
      </el-popover>
      <div>
        <el-menu class="themenu"
            :default-active="activeIndex"
            :unique-opened="false">
          <div v-for="(item,index) in tableData" :key="index" >
            <!-- 一级菜单（没有任何子级菜单）-->
            <el-menu-item :index="'1-'+item.id" v-if="!item.doc_list" class="thedocument">
              {{item.name}}
              <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
                <p><el-input v-model="input2" placeholder="请输入文档名" style="width: 400px;"></el-input></p>
                <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew2(item.id,null)">确认</el-button></p>
                <div slot="reference" class="name-wrapper" >
                  <el-button
                      style="position: absolute;left:120px;top:5px"
                      type="text"
                      size="small"
                      class="move-button"
                  ><i class="el-icon-document-add" style="color:black;font-size: 20px;" ></i></el-button>
                </div>
              </el-popover>
              <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
                <p><el-input v-model="input3" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
                <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew3()">确认</el-button></p>
                <div slot="reference" class="name-wrapper" >
                  <el-button
                      v-if="item.id!==0"
                      style="position: absolute;left:150px;top:5px"
                      type="text"
                      size="small"
                      class="move-button"
                  ><i class="el-icon-folder-add" style="color:black;font-size: 20px;" ></i></el-button>
                </div>
              </el-popover>
              <el-button
                  v-if="item.id!==0"
                  style="position: absolute;left:180px;top:5px"
                  type="text"
                  size="small"
                  class="move-button"
                  @click="deletefold(item.id,1)"><i class="el-icon-folder-delete" style="color:red;font-size: 20px;" ></i></el-button>
            </el-menu-item>
            <!-- 一级菜单（有子级菜单）-->
            <el-submenu :index="'1-'+item.id" v-else>
              <template slot="title" >
                {{item.name}}
                <el-popover  trigger="click" placement="right" popper-class="moreinfo" v-if="index!==0">
                  <p><el-input v-model="input2" placeholder="请输入文档名" style="width: 400px;"></el-input></p>
                  <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew2(item.id,null)">确认</el-button></p>
                  <div slot="reference" class="name-wrapper" >
                    <el-button
                        style="position: absolute;left:120px;top:5px"
                        type="text"
                        size="small"
                        class="move-button"
                    ><i class="el-icon-document-add" style="color:black;font-size: 20px;" ></i></el-button>
                  </div>
                </el-popover>
                <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
                  <p><el-input v-model="input3" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
                  <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew3(item.id)">确认</el-button></p>
                  <div slot="reference" class="name-wrapper" >
                    <el-button
                        v-if="item.id!==0"
                        style="position: absolute;left:150px;top:5px"
                        type="text"
                        size="small"
                        class="move-button"
                    ><i class="el-icon-folder-add" style="color:black;font-size: 20px;" ></i></el-button>
                  </div>
                </el-popover>
                <el-button
                    v-if="item.id!==0"
                    style="position: absolute;left:180px;top:5px"
                    type="text"
                    size="small"
                    class="move-button"
                    @click="deletefold(item.id,1)"><i class="el-icon-folder-delete" style="color:red;font-size: 20px;" ></i></el-button>
              </template>

              <!-- 遍历二级菜单容器 -->
              <div v-for="(i,index) in item.doc_list" :key="index">
                <!-- 判断二级菜单（没有三级菜单）-->
                <el-menu-item :index="item.id+'-2-'+i.id" v-if="!i.doc_list" @click.native="get2Content(item.id,i.id)" >
                  {{i.name}}
                  <el-button
                      style="position: absolute;left:180px;top:5px"
                      type="text"
                      size="small"
                      class="move-button"
                      @click="deletefile(item.id,i.id)"
                  ><i class="el-icon-document-delete" style="color:red;font-size: 20px;" ></i></el-button>
                </el-menu-item>

                <!-- 判断二级菜单（有三级菜单）-->
                <el-submenu :index="item.id+'-2-'+i.id" v-else>
                  <template slot="title">
                    {{i.name}}
                    <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
                      <p><el-input v-model="input2" placeholder="请输入文档名" style="width: 400px;"></el-input></p>
                      <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew2(item.id,i.id)">确认</el-button></p>
                      <div slot="reference" class="name-wrapper" >
                        <el-button
                            style="position: absolute;left:150px;top:5px"
                            type="text"
                            size="small"
                            class="move-button"
                        ><i class="el-icon-document-add" style="color:black;font-size: 20px;" ></i></el-button>
                      </div>
                    </el-popover>
                    <el-button
                        v-if="item.id!==0"
                        style="position: absolute;left:180px;top:5px"
                        type="text"
                        size="small"
                        class="move-button"
                        @click="deletefold(i.id,2)"
                    ><i class="el-icon-folder-delete" style="color:red;font-size: 20px;" ></i></el-button>
                  </template>
                  <el-menu-item :index="item.id+'-'+i.id+'-3-'+j.id" v-for="(j,index) in i.doc_list" :key="index" @click.native="get3Content(item.id,i.id,j.id)">
                    {{j.name}}
                    <el-button
                        style="position: absolute;left:180px;top:5px"
                        type="text"
                        size="small"
                        class="move-button"
                        @click="deletefile(item.id,j.id)"
                    ><i class="el-icon-document-delete" style="color:red;font-size: 20px;" ></i></el-button>
                  </el-menu-item>
                </el-submenu>
              </div>
            </el-submenu>
          </div>
        </el-menu>
      </div>
    </el-col>

    <el-col :span="4">
      <div id="vditor"  name="description" class="edit"  ></div>
      <div style="margin-top: 10px;position: absolute;left: 730px;top: 703px;">
        <el-button style="background-color: #383838; color:whitesmoke;width: 150px;letter-spacing: 10px;font-size: 16px;"  @click="submit()">提 交</el-button>
      </div>
    </el-col>
    <img src="../assets/click.png"  v-if="theclick===0&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 450px;height: 80px">
      <img src="../assets/click.png"  v-if="theclick===1&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 630px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===2&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 810px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===3&&dialogVisible" style="position: absolute;z-index: 100000;top:178px;left: 990px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===6&&dialogVisible" style="position: absolute;z-index: 100000;top:448px;left: 920px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===5&&dialogVisible" style="position: absolute;z-index: 100000;top:448px;left: 720px;height: 80px">
      <img src="../assets/click.png" v-if="theclick===4&&dialogVisible" style="position: absolute;z-index: 100000;top:448px;left: 530px;height: 80px">
    <el-dialog
        title="模板选择"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <span><img src="../assets/PrototypeMaterial/model0.png" class="modeldocument" @click="getModel(0)" ></span>
      <span> &ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model1.png" class="modeldocument" @click="getModel(1) " ></span>
      <span> &ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model2.png" class="modeldocument" @click="getModel(2)" ></span>
      <span> &ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model3.png" class="modeldocument" @click="getModel(3)" ></span>

        <span><img src="../assets/PrototypeMaterial/model4.png" class="modeldocument" @click="getModel(4)" ></span>
      <span> &ensp;&ensp;&ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model5.png" class="modeldocument" @click="getModel(5)" ></span>
      <span> &ensp;&ensp;&ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model6.png" class="modeldocument" @click="getModel(6)" ></span>


      <span slot="footer" class="dialog-footer">

    <el-button type="primary" @click="dialogVisible = false;chooseModel()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
  </div>
</template>
<script>
import Vditor from "vditor";
import global from "@/api/global";
import 'vditor/dist/index.css';
import axios from "axios";
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
      dialogVisible: false,
      activeIndex:'',
      input:'',
      input1:'',
      input2:'',
      input3:'',
      contentEditor: {},
      tableData: [],
      theclick:9,
      sendjson:{
        username:'',
        content:'',
        headshot:'',
      },
      editinput:'',
      userList:[],
    }
  },
  mounted() {
    this.dialogVisible=global.dialogVisible;
    this.activeIndex=global.activeid;
    console.log('act'+this.activeIndex);
    axios.get('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/doc/info').then((res) => {
      this.tableData=res.data.folder_list;
      console.log(this.tableData);
    })
    this.initWebSocket();
    console.log("wb")
    var _this=this
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
      },input(md){
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
    jumpback(){
      this.$router.push('/TeamManage/'+window.localStorage.getItem('tid'));
    },
    get2Content(itemid,iid){
      var project;
      if(itemid===0) {
        project=1;
      }
      else project=0;
      let param = new FormData();
      param.append('is_project_doc', project);
      param.append('doc_id', iid);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/doc/view', param,config)
          .then(response => {
            global.isproject='0';
              global.filecontent=response.data.content;
              global.fileid=iid;
              window.localStorage.setItem('docID',iid)
              global.activeid=itemid+'-2-'+iid;
              console.log(response.data.msg);
              this.reload();
          })
    },
    get3Content(itemid,iid,jid){
      var project;
      if(itemid===0) {
        let param = new FormData();
        param.append('doc_id', jid);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('http://43.138.21.64:8080/user/' + window.localStorage.getItem('uid') + '/team/' + window.localStorage.getItem('tid') + '/doc/view/one', param, config)
            .then(response => {
              global.isproject='1';
              global.filecontent = response.data.content;
              global.fileid = jid;
              window.localStorage.setItem('docID',jid)
              global.activeid = itemid +'-'+ iid + '-3-' + jid;
              this.reload();
            })
      }
      else {
        project = 0;
        let param = new FormData();
        param.append('is_project_doc', project);
        param.append('doc_id', jid);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('http://43.138.21.64:8080/user/' + window.localStorage.getItem('uid') + '/team/' + window.localStorage.getItem('tid') + '/doc/view', param, config)
            .then(response => {
              global.isproject='0';
              global.filecontent = response.data.content;
              global.fileid = jid;
              window.localStorage.setItem('docID',jid)
              global.activeid = itemid +'-'+ iid + '-3-' + jid;
              console.log(response.data.msg);
              this.reload();
            })
      }
    },
    handleNew1(){
      let param = new FormData();
      param.append('folder_name', this.input1);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/folder/add', param,config)
          .then(response => {
            console.log(response.data.msg);
              this.reload();
          })
    },
    handleNew3(itemid){
      let param = new FormData();
      param.append('f_id', itemid);
      param.append('folder_name', this.input3);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/folder/add', param,config)
          .then(response => {
            console.log(response.data.msg);
            this.reload();
          })
    },
    handleNew2(itemid,iid){
      var new_doc_id;
      if(itemid!==0){
        let param = new FormData();
        if(iid===null){
          param.append('f_id', itemid);
          param.append('doc_name', this.input2);
        }
        else{
          param.append('f_id', itemid);
          param.append('s_id', iid);
          param.append('doc_name', this.input2);
        }
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/folder/doc/add', param,config)
            .then(response => {
              console.log(response.data.msg);
              if(response.data.errno === 1000) {
                new_doc_id = response.data.new_doc_id;
                console.log('55'+response.data.new_doc_id);
                if (iid === null) {
                  global.isproject = '0';
                  global.filecontent = '';
                  global.fileid = new_doc_id;
                  window.localStorage.setItem('docID',new_doc_id)
                  global.activeid = itemid + '-2-' + new_doc_id;
                  global.dialogVisible = true;
                  this.reload();
                } else {
                  global.isproject = '0';
                  global.filecontent = '';
                  global.fileid = new_doc_id;
                  window.localStorage.setItem('docID',new_doc_id)
                  global.activeid = itemid + '-' + iid + '-3-' + new_doc_id;
                  global.dialogVisible = true;
                  this.reload();
                }
              }
            })
      }
      else {
        let formData = new FormData();
        formData.append('userID', window.localStorage.getItem('uid'));
        formData.append('projectID', iid);
        formData.append('docName', this.input2);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        axios.post('http://43.138.21.64:8080/doc/add',formData,config)
            .then(response => {
              if(response.status === 200){
                new_doc_id=response.data.new_doc_id;
                console.log('999'+new_doc_id);
                console.log(response.data.message);
                global.isproject='1';
                global.filecontent = '';
                global.fileid = new_doc_id;
                window.localStorage.setItem('docID',new_doc_id)
                global.activeid = itemid +'-'+ iid + '-3-' +new_doc_id;
                global.dialogVisible=true;
                this.reload();
              }
              else {
                new_doc_id=response.data.new_doc_id;
                console.log(response.data.message);
              }
            })
      }
    },
    deletefold(foldid,isfirst){
      let param = new FormData();
      param.append('folder_id', foldid);
      param.append('first_or_second', isfirst);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/folder/delete', param,config)
          .then(response => {
            console.log(response.data.msg);
            this.reload();
          })
    },
    submit(){
      if(global.isproject==='0'){
        let param = new FormData();
        param.append('doc_id', global.fileid);
        param.append('content', this.contentEditor.getValue());
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/folder/doc/save', param,config)
            .then(response => {
              console.log(response.data.msg);
              global.filecontent=this.contentEditor.getValue();
              this.reload();
            })
      }
      else{
        let formData = new FormData();
        formData.append('userID', window.localStorage.getItem('uid'));
        formData.append('docID', global.fileid);
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
      }
    },
    deletefile(itemid,iid){
      if(itemid===0){
        let formData = new FormData();
        formData.append('docID', iid);
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
      }
      else{
        let param = new FormData();
        param.append('doc_id',iid);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid')+'/folder/doc/delete', param,config)
            .then(response => {
              console.log(response.data.msg);
              this.reload();
            })
      }
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
      console.log(this.userList)
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
  watch:{
    editinput(){
      console.log('yes')
      this.sendcontent();
    },
  }
}
</script>
<style scoped>
.mainbody{
  position: absolute;
  top:50px;

}
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
.new-button:hover{
  background-color: #EEEFF2;
  color: #383838;
  border-color: transparent;
}

.themenu{

}
.whatit{
 background-color: #42b983;
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
