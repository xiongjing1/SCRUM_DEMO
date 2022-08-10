<template>
  <div class="web">
    <div class="head">
      <HeadSide></HeadSide>
    </div>
    <div class="whole">
      <LeftSide></LeftSide>
      <div class="main">
        <div class="title">
          <div class="team">
            <div class="TeamPhoto">
              <img :src="this.theadshot" style="height: 60px;width:60px;background-color:cornflowerblue;margin-top: 10px;float: left;margin-left: 20px;border-radius: 100%">
            </div>
            <div class="TeamName">
              {{ this.tname }}
            </div>
          </div>
          <div class="buttons">
            <div class="document-center" v-on:click="jumpToFileCenter()">
              文档中心
            </div>
            <div class="manage-project" v-on:click="JumpToProjectManage()">
              项目管理
            </div>
            <div class="list-members" v-on:click="JumpToTeamManage()">
              成员列表
            </div>
            <div class="more">
              <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <div class="dropdown">
                  <el-dropdown-menu slot="dropdown" class="more-menu" >
                    <el-dropdown-item @click.native.prevent="rename=true;">团队重命名</el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="removeTeam=true;">删除团队</el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="changeIcon=true;">团队图标更换</el-dropdown-item>
                  </el-dropdown-menu>
                </div>
                <el-dialog
                    title="提示"
                    :visible.sync="removeTeam"
                    width="30%"
                    center
                    append-to-body>
                  <span>确认要删除团队吗？</span>
                  <span slot="footer" class="dialog-footer">
                              <el-button @click="removeTeam = false" >取 消</el-button>
                              <el-button type="primary" @click="removeTeam = false;DelteTeam();update();" class="el-buttons">确 定</el-button>
                        </span>
                </el-dialog>
                <el-dialog title="重命名" :visible.sync="rename" width="350px">
                  <el-input v-model="nameInput" placeholder="请输入新名称" class="rename-input"></el-input>
                  <div slot="footer" class="rename-footer">
                    <el-button @click="rename = false">取 消</el-button>
                    <el-button @click="rename = false;RenameTeam();update();" class="el-buttons">确 定</el-button>
                  </div>
                </el-dialog>
                <el-dialog title="重新上传图标" :visible.sync="changeIcon" width="400px">
                  <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                      :http-request="uploadFile">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div slot="footer" class="photo-footer">
                    <el-button @click="changeIcon = false;exitimage();" class="cancel-buttons">取 消</el-button>
                    <el-button @click="changeIcon = false;uploadHeadshot()" class="yes-buttons">确 定</el-button>
                  </div>
                </el-dialog>
              </el-dropdown>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="content">
          <div class="left-side">
            <div class="members-top-side">
              <div class="project-name">
                {{ this.pname}}
              </div>
            </div>
            <div class="search-mode">
              <div class="search">
                <el-input v-model="input" prefix-icon="el-icon-search" placeholder="搜索..." v-on:keyup.enter.native="searchjump"></el-input>
              </div>
              <div class="search-button" @click="handleSearch()">
                search
              </div>
              <el-popover  trigger="click" placement="right" popper-class="moreinfo" >
                <p><el-input v-model="input1" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
                <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew()">确认</el-button></p>
                <div slot="reference" class="name-wrapper" >
                  <el-button class="new-button">NEW<i class="el-icon-edit el-icon--right"></i></el-button>
                </div>
              </el-popover>
            </div>

            <div class="members-second-side">
              <div class="choose-box">
                <div class="design-box" v-on:click="JumpTodesignManage()">
                  <img src="../assets/design.png" class="design-img">
                  <div class="design-title">
                    design
                  </div>
                </div>
                <div class="document-box" v-on:click="JumpTodocumentManage()">
                  <div class="document-content">
                    <img src="../assets/document-set.png" class="document-img">
                    <div class="document-title">
                      document
                    </div>
                  </div>
                  <img src="../assets/line.png" class="line-img">
                </div>
                <div class="trash-box" v-on:click="JumpToTrashManage()">
                  <img src="../assets/trash.png" class="trash-img">
                  <div class="trash-title">
                    trash
                  </div>
                </div>
              </div>

              <div class="members-search">

              </div>
            </div>
            <div class="members-main">
              <div class="table-leader">
                <el-table
                    :data="currentPageData"
                    :header-cell-style="{'text-align':'center'}"
                    :cell-style="{'text-align':'center','padding':'0px'}"
                    :row-style="{'height':'72px'}"
                    max-height="480"
                    style="width: 100%">
                  <el-table-column
                      fixed
                      label="文档名"
                      width="200">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      label="所属项目"
                      width="200">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.projectID }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      label="创建者"
                      width="200">
                    <div  class="info" slot-scope="scope" >
                      <el-popover class="moreinfo" trigger="hover" placement="top-start"  style="overflow-x: auto">
                        <p>创建时间: {{ scope.row.createdDate }}</p>
                        <p>最后修改时间: {{ scope.row.modifiedDate }}</p>
                        <div slot="reference" class="name-wrapper" >
                          <el-tag size="medium" effect="plain">{{ scope.row.creatorID }}</el-tag>
                        </div>
                      </el-popover>
                    </div>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                          type="text"
                          size="small"
                          class="recover-button"
                          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button
                          type="text"
                          size="small"
                          class="move-button"
                          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="pagination">
                <el-pagination
                    background="true"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="this.pageSize"
                    layout="prev, pager, next"
                    :total=total>
                </el-pagination>
              </div>
            </div>
          </div>
          <div class="right-side">
            <div class="team-summary">
              <div class="summary-title">项目简述</div>
              <div class="edit-summary" @click="editSummary = true">
                edit
              </div>
              <el-dialog title="简述更新" :visible.sync="editSummary" width="350px">
              <textarea
                  placeholder="请输入简介内容"
                  v-model="Summarycontent"
                  class="summary-content"
                  name="comment">
              </textarea>
                <div slot="footer" class="rename-footer">
                  <el-button @click="editSummary = false;pintrocancel();">取 消</el-button>
                  <el-button @click="editSummary = false;pintroedit();" class="el-buttons">确 定</el-button>
                </div>
              </el-dialog>
            </div>

            <div class="team-content">
              {{ this.pintro }}
            </div>
            <el-divider></el-divider>
            <div class="team-leader">
              <div class="leader-name">
                项目信息
              </div>
              <div class="leader-nickname">
                <img src="../assets/user.png" class="leader-img-size">
                <div class="nickname">创建用户</div>
                <div class="name-info">{{ this.p_creator }}</div>
              </div>
              <div class="leader-email">
                <img src="../assets/time.png" class="leader-img-size">
                <div class="email">创建时间</div>
                <div class="email-info">{{ this.p_create_time }}</div>
              </div>
              <div class="leader-active">
                <img src="../assets/document.png" class="leader-img-size">
                <div class="active">文档数目</div>
                <div class="active-info">{{this.total}}</div>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="lately-operation">
              <div class="lately-operation-title">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import LeftSide from "@/components/LeftSide";
import HeadSide from "@/components/HeadSide";
import global from "@/api/global";
import axios from "axios";

export default {
  name: "TeamManage",
  inject:['reload'],
  components: {
    LeftSide,
    HeadSide,
  },
  mounted() {
    document.body.style.backgroundColor="#FFFFFF";
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
            console.log("ok");
            that.tableData = response.data.message.document.results || [];
            console.log('文档列表获取成功');
            console.log(response.data.message.document.results)
            this.load();
          }
          else {
            console.log('文档列表获取失败');
          }
        })
  },
  methods:{
    pintrocancel(){
      this.Summarycontent=''
    },
    pintroedit(){
      let param = new FormData() // 创建form对象
      param.append('projectID', window.localStorage.getItem('pid'))// 通过append向form对象添加数据
      param.append('description', this.Summarycontent)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/project/description/update', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.success === true) {
              window.localStorage.setItem('pintro',this.Summarycontent)
              this.$message.success(response.data.msg)
            }else {
              this.pintrocancel();
              this.$message.error("编辑简介失败！");
            }
          })
    },
    exitimage(){
      this.imageUrl=''
    },
    searchjump(){

    },
    deleteRow(row){
      console.log(row);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    jumpToFileCenter(){
      this.$router.push({
        name:'fileCenter',
      });
    },
    JumpToProjectManage(){
      this.$router.push({
        name:'ProjectManage',
        params:{
          tid:window.localStorage.getItem('tid')
        }
      });
    },
    JumpToTeamManage(){
      this.$router.push({
        name:'TeamManage',
        params:{
          tid:window.localStorage.getItem('tid')
        }
      });
    },
    JumpToTrashManage() {
      this.$router.push({
        name:'TrashManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
    },
    JumpTodesignManage() {
      this.$router.push({
        name:'designManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
    },
    JumpTodocumentManage() {
      this.$router.push({
        name:'documentManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
    },
    handleSearch(){
      var search1= this.input;
      if(search1){
        if(search1 === null || search1 === undefined){
          this.searchData=[];
          for(let i=this.tableData.length-1;i>=0;i--){
              if(!this.tableData[i].isRecycled){
                this.searchData.push(this.tableData[i]);
              }
          }
        }else{
          this.searchData=[];
          console.log('search:'+this.tableData.length);
          console.log(search1);
          for(let i=this.tableData.length-1;i>=0;i--){
            if(this.tableData[i].name.search(search1)!==-1){
              if(!this.tableData[i].isRecycled){
                this.searchData.push(this.tableData[i]);
                console.log('search'+this.tableData[i].name);
              }
            }
          }
        }
      }
      else{
        this.searchData=[];
        for(let i=this.tableData.length-1;i>=0;i--){
          if(!this.tableData[i].isRecycled){
            this.searchData.push(this.tableData[i]);
          }
        }
      }
      this.total=this.searchData.length;
      if(this.currentPage===1){
        console.log('fen')
        this.currentPageData = this.searchData.slice(0, 6);
      }else{
        let begin = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.currentPageData = this.searchData.slice(begin, end);
      }
      console.log('a'+this.currentPageData);
    },
    handleNew(){
      var new_doc_id;
      var add=true;
      if(add){
        let formData = new FormData();
        formData.append('userID', window.localStorage.getItem('uid'));//window.localStorage.getItem('uid')
       formData.append('projectID', window.localStorage.getItem('pid'));//window.localStorage.getItem('pid')
        formData.append('docName', this.input1);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        axios.post('http://43.138.21.64:8080/doc/add',formData,config)
            .then(response => {
              if(response.status === 200){
                new_doc_id=response.data.new_doc_id;
                global.fileid=new_doc_id;
                console.log('999'+new_doc_id);
              }
              else {
                console.log(response.data.message);
              }
              //this.reload();
            })
        console.log('11'+global.fileid);
        global.filename=this.input1;
        global.filecontent='';
        global.dialogVisible = true;
        this.input1='';
        this.$router.push({path: '/about'});
      }
      else{
        this.$message.error(this.input1+'已存在，请重新输入');
        this.input1='';
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
      global.fileid=row.ID;
      window.localStorage.setItem('docID',row.ID)
      global.filename=row.name;
      global.filecontent=row.content;
      this.$router.push({path: '/about'});
    },
    handleDelete(index, row) {
      console.log(row.ID);
      let formData = new FormData();
      formData.append('docID', row.ID);
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
      console.log(row);
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getList()
    },
    getList(){
      console.log(this.tableData);
      this.searchData=[];
      for(let i=this.tableData.length-1;i>=0;i--){
        if(this.tableData[i].isRecycled === false){
          this.searchData.push(this.tableData[i]);
        }
      }
      console.log(this.searchData)
      this.total=this.searchData.length;
      if(this.currentPage===1){
        console.log('fen')
        this.currentPageData = this.searchData.slice(0, 6);
      }else{
        let begin = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.currentPageData = this.searchData.slice(begin, end);
      }
      console.log(this.currentPageData)
    },
    load() {
      setTimeout(() => {
        this.getList()
      }, 50)
    },
    DelteTeam(){
      let param = new FormData() // 创建form对象
      param.append('is_delete_team', '1')// 通过append向form对象添加数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid'), param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 6000) {
              this.$message.success(response.data.msg)
              window.localStorage.setItem('tid',response.data.default_tid);
              this.$router.push({
                name:'TeamManage',
                params:{
                  tid:response.data.default_tid
                }
              });
            }else{
              this.$message.error(response.data.msg);
            }
          })
    },
    RenameTeam(){
      window.localStorage.setItem('tname',this.nameInput);
      let param = new FormData() // 创建form对象
      param.append('is_rename_team', '1')
      param.append('new_name', this.nameInput)// 通过append向form对象添加数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid'), param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 7000) {
              this.$message.success(response.data.msg)
              this.update();
            }else{
              this.$message.error(response.data.msg);
            }
          })
    },
    update(){
      this.reload()
      console.log('刷新页面')
    },
    uploadFile(params){
      this.newheadshot = params.file;
      this.imageUrl = URL.createObjectURL(this.newheadshot);
    },
    uploadHeadshot(){
      var formData = new FormData();
      formData.append('is_change_headshot', '1')// 通过append向form对象添加数据
      formData.append('new_headshot', this.newheadshot)


      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+window.localStorage.getItem('uid')+'/team/'+window.localStorage.getItem('tid'), formData,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 8000) {
              this.$message.success(response.data.msg)
              this.teamshot='http://43.138.21.64:8080'+response.data.new_headshot
              this.teamshot=this.imageUrl
              window.localStorage.setItem('theadshot',this.teamshot)
              this.update();
            }else{
              this.$message.error("头像更换失败");
            }
          })
    },
  },
  watch:{
    input(){
      console.log('yes')
    }
  },
  data(){
    return{
      input:'',
      tname:window.localStorage.getItem('tname'),
      pname:window.localStorage.getItem('pname'),
      input1:'',
      options: [{
        value: '选项1',
        label: '全部成员'
      }, {
        value: '选项2',
        label: '管理员'
      }, {
        value: '选项3',
        label: '普通成员'
      }],
      searchData: [{
          ID: '',
          content: '',
          createdDate: '',
          creatorID: '',
          isRecycled: false,
          is_subfile: '',
          modifiedDate: '',
          name: '',
          projectID: '',

      }],
      tableData: [{
        ID: '',
        content: '',
        createdDate: '',
        creatorID: '',
        isRecycled: false,
        is_subfile: '',
        modifiedDate: '',
        name: '',
        projectID: '',
      }],
      value:'',
      removeMember: false,
      currentRow:'',
      changeManager:false,
      changeMember:false,
      IsManage:true,
      removeTeam:false,
      rename:false,
      formLabelWidth:'120px',
      nameInput:'',
      changeIcon:false,
      imageUrl: '',
      editSummary:false,
      Summarycontent:'',
      recover:false,
      remove:false,
      currentPage: 1,
      currentPageData:[],
      total:2,
      pageSize:6,
      pintro:window.localStorage.getItem('pintro'),
      p_creator:window.localStorage.getItem('p_creator'),
      p_create_time:window.localStorage.getItem('p_create_time'),
      p_doc_count:window.localStorage.getItem('p_doc_count'),
      theadshot:window.localStorage.getItem('theadshot'),
      newheadshot:'',
    }
  }
};
</script>

<style scoped>
.main{
  position: absolute;
  flex-direction: column;
  width: 83%;
  overflow: hidden;
  min-width: calc(1520px*81%);
  top:50px;
  left: 230px;
  height: 800px;
}
.title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: -700px;
  margin-right: 50px;
  width: 100%;
  height: 80px;

}
.team{
  display: flex;
  flex-direction: row;
  width: 300px;
  height: 80px;
}
.choose-box{
    display: flex;
    flex-direction: row;
}
.design-box{
  display: flex;
  flex-direction: row;
  width: 30%;
  height: 100%;
  padding-top: 10px;
}
.design-img{
  display: flex;
  height: 20px;
  width: 20px;
  padding-left: 28px;
}
.design-img:hover{
  filter:;
}
.design-title{
  align-items: center;
  font-size: 15px;
  padding-left: 5px;
  font-family: "Arial Black";
  cursor: pointer;
}
.document-box{
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 100%;
  padding-top: 10px;
  padding-left: 0px;
  margin-left: -0.5px;
}
.document-content{
  display: flex;
  flex-direction: row;
}
.document-img{
  display: flex;
  height: 20px;
  width: 20px;
  padding-left: 28px;
}
.document-title{
  align-items: center;
  font-size: 15px;
  padding-left: 5px;
  font-family: "Arial Black";
  cursor: pointer;
  color: #ef8354;
}
.trash-box{
  display: flex;
  flex-direction: row;
  width: 30%;
  height: 30px;
  padding-top: 10px;
  padding-left: 37.5px;
}
.trash-content{
  display: flex;
  flex-direction: row;
}
.line-img{
  display: flex;
  padding-top: 3px;
  padding-left: 22px;
  width: 100%;
  height: 3.5px;
}
.trash-img{
  display: flex;
  height: 20px;
  width: 20px;
  padding-left: 28px;
  cursor: pointer;
}
.trash-img:hover{
  color: #ef8354;
}
.trash-title{
  align-items: center;
  font-size: 15px;
  padding-left: 5px;
  font-family: "Arial Black";
  cursor: pointer;
}
.content{
  display: flex;
  align-items: center;
  flex-direction: row;
}
.left-side{
  height: 600px;
  width: 75%;
  margin-top: -190px;
}
.right-side{
  float: right;
  width:25%;
  border-left: 1px solid #EAECF0;
}
.TeamPhoto{
  padding-top: 10px;
  width: 70px;
  height: 70px;
}
.TeamName{
  padding-top: 20px;
  width: 300px;
  margin-top: 10px;
  margin-left: 30px;
  font-size: 30px;
  font-family: "Berlin Sans FB Demi";
}
.buttons{
  float: left;
  margin-left:10px;
  padding-left: 15px;
  margin-top:0px;
  padding-top: 20px;
  width: 400px;
  height: 60px;
}
.manage-project{
  width: 80px;
  height: 28px;
  border: 2px solid;
  border-radius: 3px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:12px;
  float: left;
  margin-top: 10px;
  font-size: 14px;
  margin-left: 15px;
}
.manage-project:hover{
  color: rgba(23,43,72,0.45);
}
.document-center{
  width: 80px;
  height: 28px;
  border: 2px solid;
  border-radius: 3px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:12px;
  float: left;
  margin-top: 10px;
  margin-left: 9px;
  font-size: 14px;
}
.document-center:hover{
  color: rgba(23,43,72,0.45);
}
.list-members{
  width: 80px;
  height: 28px;
  border: 2px solid;
  border-radius: 3px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:12px;
  margin-top: 10px;
  float: left;
  font-size: 14px;
  margin-left: 15px;
}
.list-members:hover{
  color: rgba(23,43,72,0.45);
}
.more{
  width: 80px;
  height: 28px;
  border: 2px solid;
  border-radius: 3px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:12px;
  margin-top: 10px;
  font-size: 14px;
  margin-left: 15px;
  color: #2c3e50;
  letter-spacing: 3px;
  float: left;
}
.more:hover{
  color: rgba(23,43,72,0.45);
}
.el-dropdown-link{
  color: #2c3e50;
}
.el-dropdown-link:hover{
  color: rgba(23,43,72,0.45);
}
.dropdown{
  margin-left: 90px;
  margin-top: 5px;
}
.more-menu:not(.is-disabled):focus{
  background-color:rgba(23,43,72,0.45);;
}
/deep/.moreinfo{
  margin-left: 300px;
  padding-left: 300px;
}
.project-manage{
  padding-top: 20px;
  padding-left: 30px;
  cursor: pointer;
}
.project-manage:hover{
  color: rgba(23,43,72,0.65);
}
.members-manage{
  padding-top: 20px;
  padding-left: 30px;
  cursor: pointer;
}
.members-manage:hover{
  color: rgba(23,43,72,0.65);
}
.members-top-side{
  display: flex;
  height: 50px;
  width: 100%;
  margin-top: 60px;
}
.project-name{
  display: flex;
  height:50px;
  width: 100%;
  padding-left: 45px;
  font-family:"Berlin Sans FB Demi";
  font-size: 28px;
}
.members-second-side{
  display: flex;
  height: 70px;
  width: 100%;
  padding-left: 20px;
}
.members-main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height:auto;
}
.table-leader{
  display: flex;
  width: 90%;
  padding-top: 10px;
  padding-left: 40px;
}
.table-member{
  display: flex;
  width: 90%;
  padding-top: 10px;
  padding-left: 40px;
}
.pagination{
  padding-top: 30px;
  margin-bottom: 30px;
}
.members-add{
  width: 90px;
  height: 30px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:15px;
  margin-left: 50px;
  font-size: 13px;
  font-family: "Berlin Sans FB Demi";
}
.members-add:hover{
  color: rgba(23,43,72,0.45);
}
.members-search{
  display: flex;
  padding-left: 220px;
  padding-right: 90px;
  padding-top: 0px;
  margin-top: -5px;
  height: 0px;
  width: 30%;
}
.search{
  float: left;
  margin-left: 500px;
  margin-top: 0px;
  height: 0px;
}
.search-mode{
  float: left;
  margin-left: 0px;
  margin-top: 0px;
  height: 0px;
  width:100%;
  left: 0px;
}
.search-button{
  width: 90px;
  height: 24px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:4px;
  padding-bottom: 4px;
  margin-left: 50px;
  font-size: 18px;
  top:170px;
  left: 650px;
  color: #FFFFFF;
  background-color: #2c3e50;
  font-family: "Berlin Sans FB Demi";
  position: absolute;
  float: left;
}
.search-button:hover{
  color: #E9E9E9;
}
.new-button{

}
/deep/.new-button{
  width: 90px;
  height: 35px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  margin-left: 50px;
  padding-top:8px;
  padding-bottom: 8px;
  padding-left:15px;
  font-size: 18px;
  top:170px;
  left: 750px;
  color: #FFFFFF;
  background-color: #2c3e50;
  font-family: "Berlin Sans FB Demi";
  position: absolute;
  float: left;
}
/deep/.new-button:hover{
  color: #E9E9E9;
}
.members-rank{
  padding-top: 20px;
  padding-left: 775px;
}
.team-summary{
  display: flex;
  padding-left:15px ;
  padding-top: 10px;
  width: 100%;
  height: 30px;
  font-size: 20px;
  flex-direction: row;
}
.summary-title{
  display: flex;
  font-size: 19px;
  width: 65%;
  font-family: Inter, "Segoe UI", 黑体;
}
.team-content{
  padding-top: 10px;
  padding-left: 15px;
  font-family: Inter, sans-serif, 黑体;
  font-size: 13px;
  line-height: 20px;
  width: 100%;
  height: 130px;
  text-align: left;
  word-wrap: break-word;
  white-space: pre-line;
}
.team-leader{
  display: flex;
  width: 100%;
  height:220px;
  flex-direction: column;
  align-content: center;
}
.leader-name{
  display: flex;
  margin-left: 15px;
  padding-top: 10px;
  font-family: Inter, "Segoe UI", 黑体;
  font-size: 19px;
}
.leader-nickname{
  font-family: Inter, "Segoe UI", 黑体;
  font-size: 18px;
  flex-direction: row;
}
.nickname{
  display: flex;
  padding-top: 15px;
  padding-left: 8px;
  float: left;
  margin-top: 8px;
  margin-left: 3px;
  font-size: 15px;
}
.name-info{
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  margin-top: 8px;
  margin-left: 3px;
  font-size: 15px;
}
.leader-active{
  display: flex;
  flex-direction: row;
  font-family: Inter, "Segoe UI", 黑体;
}
.active{
  display: flex;
  padding-top: 15px;
  padding-left: 8px;
  font-size: 15px;
  margin-top: 12px;
  margin-left: 3px;
}
.active-info{
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  font-size: 15px;
  margin-top: 12px;
  margin-left: 3px;
}
.leader-email{
  display: flex;
  flex-direction: row;
  font-family: Inter, "Segoe UI", 黑体;
}
.email{
  display: flex;
  padding-top: 15px;
  padding-left: 8px;
  font-size: 15px;
  margin-top: 10px;
  margin-left: 3px;
}
.email-info{
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  font-size: 15px;
  margin-top: 10px;
  margin-left: 3px;
}
.leader-img-size{
  float: left;
  padding-left: 10px;
  padding-top: 10px;
  margin-left: 5px;
  margin-top: 15px;
  width: 25px;
  height: 25px;
}
.lately-operation{
  width: 100%;
  height: 150px;
}
.lately-operation-title{
  font-size: 19px;
  width:160px;
  margin-left: 10px;
  font-family: Inter, "Segoe UI", 黑体;
  height: 250px;
}
.edit-summary{
  display: flex;
  padding-left: 13px;
  margin-left: 5px;
  width: 12%;
  height: 22px;
  padding-top: 3px;
  font-size: 13px;
  border: 2px solid;
  border-radius: 5px;
  cursor: pointer;
  background-color: #383838;
  color: #FFFFFF;
  font-family: "Berlin Sans FB Demi";
}
.edit-summary:hover{
  color: #E9E9E9;
}
.members-operation{
  display: flex;
  flex-direction: row;
}
.identity-choose{
  display: flex;
  padding-left: 10px;
  padding-top: 7px;
  cursor: pointer;
}
/deep/.identity-choose:hover{
  color: rgba(23,43,72,0.45);
}
/deep/.recover-button{
  color: #2c3e50;
  font-size: 15px;
  cursor: pointer;
  padding-left: 50px;
}
/deep/.recover-button:hover{
  color: rgba(23,43,72,0.45);
}
/deep/.move-button{
  color: #2c3e50;
  font-size: 15px;
  cursor: pointer;
  padding-left: 30px;
}
/deep/.move-button:hover{
  color: rgba(23,43,72,0.45);
}
/deep/.el-input__inner {
  background-color: rgba(255,255,255,0.45);
  color:#2c3e50 ;
  border-width: 0 0 1px 0 ;
  border-bottom-color: #2c3e50;
  border-radius: 0;
}

.el-select-dropdown__item {
  color: #2c3e50;
}
/deep/ .el-dropdown-menu__item:not(.is-disabled):focus {
  color: rgba(23,43,72,0.45);
  color: #2c3e50;
}
.el-buttons{
  background-color: #2c3e50;
  color: azure;
}
.cancel-buttons{
  margin-right: 30px;
}
.yes-buttons{
  margin-left: 30px;
  background-color: #2c3e50;
  color: azure;
}
.rename-input{
  width: 120px;
}
.rename-footer{
  margin-right: 75px;
}
.photo-footer{
  margin-right: 70px;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled) {
}
/deep/.el-pagination.is-background .el-pager li:hover {
  color: #2b597d;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active{
  background-color: #2b597d;
  color: azure;
}
.summary-content{
  border-radius:18px;
  margin-left: 20px;
  width: 200px;
  height: 56px;
  resize: none;
  margin-right: 16px;
  padding: 8px 18px;
  border: none;
  background-color: rgba(241,250,238,0.05);
}
.summary-content:focus{
  border-color: #2c3e50;
}
</style>


<style scoped>
.el-popover.moreinfo{
  margin-top: 60px;
}
.moreinfo .popper__arrow {
  margin-left: 300px;
}
.moreinfo .popper__arrow::after {
  margin-left: 300px;
}
/deep/.el-dropdown-menu:hover {
  border: none;
  color: #666;
  border-radius: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
/deep/input::-webkit-input-placeholder{
  color:#2c3e50;
}
/deep/input::-moz-placeholder{   /* Mozilla Firefox 19+ */
  color:#2c3e50;
}
/deep/input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
  color:#2c3e50;
}
/deep/input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
  color:#2c3e50;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #2c3e50;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
