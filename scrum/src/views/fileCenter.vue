<template>
  <div>
    <el-col :span="4" class="filelist" style="background-color:#87CEFA;color: white;">
      <h4 style="text-align: center; " ><i class="el-icon-folder" style="color: yellow"></i>&emsp;文档中心</h4>
      <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
        <p><el-input v-model="input1" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
        <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew1()">确认</el-button></p>
        <div slot="reference" class="name-wrapper" >
          <el-button class="new-button" style="width: 254px">新建文件夹<i class="el-icon-folder-add el-icon--right" style="color: deepskyblue"></i></el-button>
        </div>
      </el-popover>
      <div>
        <el-menu
            :default-active="activeIndex"
            :unique-opened="false">
          <div v-for="(item,index) in tableData" :key="index">
            <!-- 一级菜单（没有任何子级菜单）-->
            <el-menu-item :index="'1-'+item.id" v-if="!item.doc_list">
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
                  ><i class="el-icon-document-add" style="color:lightskyblue;font-size: 20px;" ></i></el-button>
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
                  ><i class="el-icon-folder-add" style="color:lightskyblue;font-size: 20px;" ></i></el-button>
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
              <template slot="title">
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
                    ><i class="el-icon-document-add" style="color:lightskyblue;font-size: 20px;" ></i></el-button>
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
                    ><i class="el-icon-folder-add" style="color:lightskyblue;font-size: 20px;" ></i></el-button>
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
                <el-menu-item :index="item.id+'-2-'+i.id" v-if="!i.doc_list" @click.native="get2Content(item.id,i.id)">
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
                        ><i class="el-icon-document-add" style="color:lightskyblue;font-size: 20px;" ></i></el-button>
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
        <el-button type="primary"  @click="submit()">提交</el-button>
      </div>
    </el-col>

    <el-dialog
        title="模板选择"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <span><img src="../assets/PrototypeMaterial/model0.png" @click="getModel(0)" ></span>
      <span> &ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model1.png" @click="getModel(1) " ></span>
      <span> &ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model2.png" @click="getModel(2)" ></span>
      <span> &ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model3.png" @click="getModel(3)" ></span>

        <span><img src="../assets/PrototypeMaterial/model4.png" @click="getModel(4)" ></span>
      <span> &ensp;&ensp;&ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model5.png" @click="getModel(5)" ></span>
      <span> &ensp;&ensp;&ensp;</span>
        <span><img src="../assets/PrototypeMaterial/model6.png" @click="getModel(6)" ></span>


      <span slot="footer" class="dialog-footer">

    <el-button type="primary" @click="dialogVisible = false;chooseModel()">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>
<script>
import Vditor from "vditor";
import global from "@/api/global";
import 'vditor/dist/index.css';
import axios from "axios";


export default {
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
    getModel(index){
      if(index===0) global.filecontent='';
      else if(index===1) global.filecontent=global.model1;
      else if(index===2) global.filecontent=global.model2;
      else if(index===3) global.filecontent=global.model3;
      else if(index===4) global.filecontent=global.model4;
      else if(index===5) global.filecontent=global.model5;
      else  global.filecontent=global.model6;
    },
    chooseModel(){
      global.dialogVisible=false;
      this.contentEditor.setValue(global.filecontent);
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
                  global.activeid = itemid + '-2-' + new_doc_id;
                  global.dialogVisible = true;
                  this.reload();
                } else {
                  global.isproject = '0';
                  global.filecontent = '';
                  global.fileid = new_doc_id;
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
