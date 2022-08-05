<template>
  <div class="web">
    <div class="head">
      <HeadSide></HeadSide>
    </div>
    <div >
      <LeftSide></LeftSide>
      <div class="main">
        <div class="title">
          <div class="team">
            <div class="TeamPhoto">
              <el-avatar style="height: 60px;width:60px;background-color:cornflowerblue;padding-top: 10px;margin-top: 10px;float: left;margin-left: 20px;"> X </el-avatar>
            </div>
            <div class="TeamName">
              {{this.tname}}
            </div>
          </div>
          <div class="buttons">
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
                              <el-button type="primary" @click="removeTeam = false;" class="el-buttons">确 定</el-button>
                        </span>
                </el-dialog>
                <el-dialog title="Rename" :visible.sync="rename" width="350px">
                  <el-input v-model="nameInput" placeholder="请输入新名称" class="rename-input"></el-input>
                  <div slot="footer" class="rename-footer">
                    <el-button @click="rename = false">取 消</el-button>
                    <el-button @click="rename = false" class="el-buttons">确 定</el-button>
                  </div>
                </el-dialog>
                <el-dialog title="重新上传图标" :visible.sync="changeIcon" width="400px">
                  <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div slot="footer" class="photo-footer">
                    <el-button @click="changeIcon = false" class="cancel-buttons">取 消</el-button>
                    <el-button @click="changeIcon = false" class="yes-buttons">确 定</el-button>
                  </div>
                </el-dialog>
              </el-dropdown>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="content">
          <div class="left-side">
            <div class="project-top-side">
              <div class="project-add" v-on:click="addProject = true">
                Add project
              </div>
              <el-dialog title="Add New Project" :visible.sync="addProject" width="350px">
                <el-input v-model="Projectnameinput" placeholder="Please input the name" class="project-input"></el-input>
                <el-input v-model="Projectdescriptioninput" placeholder="Please input the description" class="project-input"></el-input>
                <div slot="footer" class="rename-footer">
                  <el-button @click="addProject = false">取 消</el-button>
                  <el-button class="el-buttons" @click="addProject = false ; createProject();update();" >确 定</el-button>
                </div>
              </el-dialog>
              <div class="project-trash" v-on:click="JumpToProjectTrash()">
                trash
              </div>
              <div class="project-search">
                <el-input v-model="input" prefix-icon="el-icon-search" placeholder="搜索..." v-on:keyup.enter.native="searchjump"></el-input>
              </div>
            </div>
            <div class="project-total">
              <div class="project-main">
                <div class="project" v-for="(item,index) in currentPageData" :key="index" >
                  <div class="project-mode">
                    <div class="project-info" v-on:click="JumpTodesignManage(item.ID)">
                      <div class="project-name">
                        {{item.project_name}}{{item.ID}}
                      </div>
                      <div class="project-leader">
                        <img src="../assets/build.png" class="project-build-img">
                        <div class="project-leader-title">项目创建者</div>
                        <div class="project-leader-name">{{item.creator_id}}</div>
                      </div>
                      <div class="project-lately-edit">
                        <img src="../assets/edittime.png" class="project-edittime-img">
                        <div class="project-lately-edit-title">最近编辑</div>
                        <div class="project-lately-edit-time">{{item.modified_date}}</div>
                      </div>
                    </div>
                    <div class="project-img" v-on:click="JumpTodesignManage()">
                      <img src="../assets/project.png" class="img-size">
                    </div>
                    <div class="project-operation">
                      <div class="project-operation-rename">
                        <img src="../assets/rename.png" class="project-rename-img" @click="renamed = true;currentRow=index">
                        <el-dialog title="Rename" :visible.sync="renamed" width="350px">
                          <el-input v-model="nameInput" placeholder="请输入新名称" class="rename-input"></el-input>
                          <div slot="footer" class="rename-footer">
                            <el-button @click="renamed = false">取 消</el-button>
                            <el-button @click="renamed = false;renameProject(currentRow);update();" class="el-buttons">确 定</el-button>
                          </div>
                        </el-dialog>
                      </div>
                      <div class="project-operation-delete">
                        <img src="../assets/delete.png" class="project-delete-img" @click="deletedProject = true;currentRow=index;current=item;">
                        <el-dialog
                            title="提示"
                            :visible.sync="deletedProject"
                            width="30%"
                            center
                            append-to-body>
                          <span>确认要删除项目 {{current.project_name}} 吗？</span>
                          <span slot="footer" class="dialog-footer">
                              <el-button @click="deletedProject = false" >取 消</el-button>
                              <el-button type="primary" @click="deletedProject = false;notice(current);update();" class="el-buttons">确 定</el-button>
                        </span>
                        </el-dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                    background
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
              <div class="summary-title">Profile</div>
              <div class="edit-summary" @click="editSummary = true">
                edit
              </div>
              <el-dialog title="Rename" :visible.sync="editSummary" width="350px">
              <textarea
                  placeholder="请输入简介内容"
                  v-model="Summarycontent"
                  class="summary-content"
                  name="comment">
              </textarea>
                <div slot="footer" class="rename-footer">
                  <el-button @click="editSummary = false">取 消</el-button>
                  <el-button @click="editSummary = false" class="el-buttons">确 定</el-button>
                </div>
              </el-dialog>
            </div>

            <div class="team-content">
              简介内容
            </div>
            <el-divider></el-divider>
            <div class="team-leader">
              <div class="leader-name">
                The Leader
              </div>
              <div class="leader-nickname">
                <img src="../assets/user.png" class="leader-img-size">
                <div class="nickname">姓名</div>
                <div class="name-info">徐亦佳</div>
              </div>
              <div class="leader-email">
                <img src="../assets/mail.png" class="leader-img-size">
                <div class="email">电子邮箱</div>
                <div class="email-info">1223160472@qq.com</div>
              </div>
              <div class="leader-active">
                <img src="../assets/login.png" class="leader-img-size">
                <div class="active">上次登录</div>
                <div class="active-info">5分钟前</div>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="lately-operation">
              <div class="lately-operation-title">
                Recent operations
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
import axios from "axios";

export default {
  name: "TeamManage",
  inject:['reload'],
  components: {
    LeftSide,
    HeadSide,
  },
  mounted() {
    let param = new FormData() // 创建form对象
    param.append('searchID', window.localStorage.getItem('tid'))// 通过append向form对象添加数据
    param.append('searchType', 2)
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    } // 添加请求头
    axios.post('http://43.138.21.64:8080/project/view/all', param,config)
        .then(response => {
          if(response.data.success===true){
            this.total=0
            this.allprojectList=response.data.message
            this.alltotal=this.allprojectList.length
            for(var i=0;i<this.alltotal;i++){
              if(this.allprojectList[i].is_recycled===false){
                this.projectList.push(this.allprojectList[i])
                this.total=this.total+1
              }
            }
          }else{
            console.log(response.data.success)
          }

          this.load();
          console.log(this.currentPage)
        })
    this.tname=window.localStorage.getItem('tname')
    document.body.style.backgroundColor="#FFFFFF";
  },
  watch:{
    $route(to,from){
      console.log(from.path);//从哪来
      console.log(to.path);//到哪去
      this.reload()
    }
  },
  methods:{
    update(){
      this.reload()
      console.log('刷新页面')
    },
    createProject(){
      let formData = new FormData();
      formData.append('userID', window.localStorage.getItem('uid'));
      formData.append('teamID', window.localStorage.getItem('tid'));
      formData.append('projectName', this.Projectnameinput);
      formData.append('description', this.Projectdescriptioninput);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      };
      axios.post('http://43.138.21.64:8080/project/add',formData,config)
          .then(response => {
            if(response.status === 200){
              console.log(response.data.message);
            }
            else if(response.status === 404){
              console.log(response.data.message);
            }
            else{
              console.log(response.data.message);
            }
            this.update();
          })
      var newproject={
        projectName:this.Projectnameinput,
        leaderName:'徐亦佳',
        latelyTime:'5分钟前',
        deleteProject:false,
        rename:false,
        nameInput:'',
      };
      this.projectList.push(newproject);
    },
    deleteProject(current){
      let formData = new FormData();
      formData.append('projectID', current.ID);
      formData.append('userID',  window.localStorage.getItem('uid'));
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      };
      axios.post('http://43.138.21.64:8080/project/remove/one',formData,config)
          .then(response => {
            if(response.status === 200){
              console.log(response.data.message);
            }
            else if(response.status === 404){
              console.log(response.data.message);
            }
            else{
              console.log(response.data.message);
            }
          })
    },
    renameProject(index){

      let formData = new FormData();
      formData.append('userID',  window.localStorage.getItem('uid'));
      formData.append('projectID', this.projectList[index].ID);
      formData.append('newName', this.nameInput);
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      };
      axios.post('http://43.138.21.64:8080/project/rename',formData,config)
          .then(response => {
            if(response.status === 200){
              console.log(response.data.message);
            }
            else {
              console.log(response.data.message);
            }
          })
      this.projectList[index].projectName=this.projectList[index].nameInput;
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
    JumpTodesignManage(pid){
      let storage = window.localStorage;
      storage.setItem('pid',pid);
      this.$router.push({
        name:'designManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
    },
    JumpToProjectTrash(){
      this.$router.push({
        name:'ProjectTrash',
        params:{
          tid:window.localStorage.getItem('tid')
        }
      });
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getList()
    },
    getList(){
      if(this.currentPage===1){
        console.log('fen')
        this.currentPageData = this.projectList.slice(1, 4);
      }else{
        let begin = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.currentPageData = this.projectList.slice(begin, end);
      }
    },
    load () {
      setTimeout(() => {
        this.getList()
      }, 50)
    },
    notice(current){
      console.log(current);
      let formData = new FormData();
      formData.append('projectID', current.ID);
      formData.append('userID',  window.localStorage.getItem('uid'));
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      };
      axios.post('http://43.138.21.64:8080/project/remove/one',formData,config)
          .then(response => {
            console.log("发送请求");
            if(response.status === 200){
              console.log(response.data.message);
            }
            else if(response.status === 404){
              console.log(response.data.message);
            }
            else{
              console.log(response.data.message);
            }
          })
    }
  },
  data(){
    return{
      input:'',
      addProject:false,
      Projectnameinput:'',
      Projectdescriptioninput: '',
      renamed:false,
      deletedProject:false,
      current:'',
      pageSize:3,
      alltotal:'',
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
      tableData: [{
        name: '王小虎1',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
      }, {
        name: '王小虎2',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
      }, {
        name: '王小虎3',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
      }, {
        name: '王小虎4',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
      }, {
        name: '王小虎5',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
      }, {
        name: '王小虎6',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
      }, {
        name: '王小虎7',
        nickname:'tiger',
        email: '20373661@qq.com',
        lastactive: '5分钟前',
        identity: '管理员',
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
      projectList:[
      ],
      tname:'',
      currentPage: 1,
      total:2,
      currentPageData:[],
      allprojectList:[],
    }
  }
};
</script>

<style scoped>
.main{
  position: absolute;
  width: 84%;
  overflow: hidden;
  min-width: calc(1520px*81%);
  top:50px;
  left: 230px;
}
.title{

  align-items: center;
  justify-content: space-between;
  margin-right: 50px;
  width: 100%;
  height: 80px;
}
.team{
  float: left;
  width: 300px;
  height: 80px;
}
.buttons{

  float: left;
  margin-left:681px;
  margin-top: 14px;
  width: 290px;
  height: 60px;
}

.content{

}
.left-side{
  height: 600px;
  float: left;
  width: 74%;
  margin-top: -70px;
}
.right-side{
  float: right;
  width:25%;
  border-left: 1px solid #EAECF0;
}
.TeamPhoto{
  float: left;
  padding-top: 10px;
  width: 70px;
  height: 70px;
}
.TeamName{
  padding-top: 20px;
  width: 300px;
  height: 70px;

  margin-top: 10px;
  margin-left: 30px;
  font-size: 30px;
  font-family: "Berlin Sans FB Demi";
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
}
.manage-project:hover{
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

.project-top-side{
  height: 50px;
  width: 100%;
  margin-top: 0px;
}
.members-second-side{

  height: 70px;
  width: 100%;
}

.pagination{
  margin-right: 60px;
  padding-top: 140px;
  margin-bottom: 30px;
}
.project-add{
  width: 94px;
  height: 24px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:8px;
  margin-left: 50px;
  font-size: 12px;
  top:130px;
  left: -10px;
  color: #FFFFFF;
  background-color: #2c3e50;
  font-family: "Berlin Sans FB Demi";
  position: absolute;
  float: left;
}
.project-add:hover{
  color: #E9E9E9;
}
.project-trash{
  position: absolute;
  width: 94px;
  height: 24px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:8px;
  margin-left: 50px;
  font-size: 12px;
  top:130px;
  left: 120px;
  color: #FFFFFF;
  background-color: #2c3e50;
  font-family: "Berlin Sans FB Demi";
  z-index: 3;
  float: left;
}
.project-trash:hover{
  color: #E9E9E9;
}
.project-search{

  padding-left:400px;
  padding-top: 60px;
  width: 20%;
  justify-content: space-between;
  margin-left: 50px;
  top:65px;
  left: 120px;
  position: absolute;
  float: left;
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
  font-size: 20px;
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

/deep/.identity-choose:hover{
 color: rgba(23,43,72,0.45);
}
/deep/.move-button{
 color: #2c3e50;
 font-size: 15px;
 cursor: pointer;
 padding-left: 50px;
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
.project-input{
  width: 200px;
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
.project-main{

 width: 100%;
 height: 400px;
}
.project-total{
  width: 100%;
 float: left;
  height: 600px;
 margin-top: 60px;
}
.project{
 width: 100%;
 height: 150px;
 margin-top: 30px;
}
.project-mode{

 width: 88%;
 height: 150px;
 margin-left: 35px;
 margin-top: 10px;
 border-radius: 30px;
 border: 1px solid #d9d9d9;
 box-shadow: 0 0 2px 2px rgba(23, 43, 72, 0.45);
}
.project-info{
 padding-left: 30px;
 float: left;
 width: 40%;
 height: 100%;
 cursor: pointer;
}
.project-name{

 width: calc(100% - 35px);
 text-align: left;
 font-family: "Berlin Sans FB Demi";
 font-size: 26px;
 padding-top: 13px;
 padding-left: 35px;
}
.project-leader{

 height: 35px;
 margin-top: 10px;

}
.project-leader-name{

 float: left;
 text-align: left;
 width: 200px;
 margin-left: 31px;
 font-size: 13px;
}
.project-leader-title{

 float: left;
 text-align: left;
 width: 200px;
 margin-left: 25px;
 font-size: 13px;

}
.project-build-img{
 float: left;
 margin-left: 31px;
 width: 25px;
 height: 25px;
 margin-top: 5px;

}
.project-lately-edit{

 height:35px;
 align-items: center;
 margin-top: 10px;
}
.project-lately-edit-title{
 float: left;
 text-align: left;
 width: 200px;
 margin-left: 25px;
 font-size: 13px;

}
.project-lately-edit-time{
 float: left;
 width: 60px;
 margin-left: 28px;
 margin-top: 2px;
 font-size: 13px;
 text-align: left;
}
.project-edittime-img{
 float: left;
 margin-left: 31px;
 width: 25px;
 height: 25px;
 margin-top: 5px;
}
.project-img{
 float: left;
 height: 100%;
 width: 280px;
 margin-left: -10px;
 cursor: pointer;
}
.img-size{
 width: 220px;
 margin-top: 30px;
}
.project-operation{

 float: right;
 margin-left: 70px;
 margin-top: 50px;
}
.project-operation-rename{
 margin-right: 40px;
 margin-top: -20px;
}
.project-operation-delete{
 margin-top: 20px;
 margin-right: 40px;
}
.project-rename-img{

 width: 32px;
 height: 32px;
 cursor: pointer;
}
.project-delete-img{

 width: 32px;
 height: 32px;
 cursor: pointer;
}

/deep/.el-dropdown-menu:hover {
 border: none;
 color: #666;
 border-radius: 0;
 padding: 0;
 margin: 0;

 align-items: center;
 justify-content: center;
}
/deep/el-input::-webkit-input-placeholder{
 color:#2c3e50;
}
/deep/el-input::-moz-placeholder{   /* Mozilla Firefox 19+ */

  color:#2c3e50;
}
/deep/el-input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */

  color:#2c3e50;
}
/deep/el-input:-ms-input-placeholder{  /* Internet Explorer 10-11 */

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

