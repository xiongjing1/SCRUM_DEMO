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
          <el-avatar style="height: 60px;width:60px;background-color:cornflowerblue;padding-top: 10px;margin-top: 10px;float: left;margin-left: 20px;"> X </el-avatar>
        </div>
        <div class="TeamName">
          {{ team.t_name }}
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
          <div class="members-top-side">
            <div class="members-add" v-on:click="invite = true" v-if="IsManage===true">
              Add member
            </div>
            <el-dialog title="Invite By Email" :visible.sync="invite" width="350px">
              <el-input v-model="inviteEmail" placeholder="Email" class="invite-input"></el-input>
              <div slot="footer" class="rename-footer">
                <el-button @click="invite = false">取 消</el-button>
                <el-button @click="invite = false;sendInvite();" class="el-buttons">确 定</el-button>
              </div>
            </el-dialog>
            <div class="members-search">
              <el-input v-model="input" prefix-icon="el-icon-search" placeholder="搜索..." v-on:keyup.enter.native="searchjump"></el-input>
            </div>
          </div>
          <div class="members-main">
            <div :class="IsManage===true?'table-leader':'table-member'">
              <el-table
                  :data="member_list"
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}"
                  style="width: 100%"
                  max-height="480">
                <el-table-column
                    fixed
                    prop="m_name"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="m_id"
                    label="uid"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="m_nickname"
                    label="昵称"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="m_email"
                    label="邮箱"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="m_login_time"
                    label="上次登录"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="m_membership"
                    label="身份"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="200"
                    fixed="right"
                    v-if="IsManage===true">
                  <template slot-scope="scope">
                    <div class="members-operation">
                      <el-button
                          @click.native.prevent="removeMember=true;currentRow=scope.row"
                          type="text"
                          size="small"
                          class="move-button">
                        移除
                      </el-button>
                      <el-dialog
                          title="提示"
                          :visible.sync="removeMember"
                          width="30%"
                          center
                          append-to-body>
                        <span>确认要删除该成员吗？</span>
                        <span slot="footer" class="dialog-footer">
                              <el-button @click="removeMember = false">取 消</el-button>
                              <el-button type="primary" @click="removeMember = false;" @click.native.prevent="deleteRow(currentRow);update();" class="el-buttons">确 定</el-button>
                        </span>
                      </el-dialog>
                      <div class="identity-choose">
                        <el-dropdown trigger="click" popper-class="drop">
                      <span class="el-dropdown-link">
                          身份设定<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native.prevent="changeManager=true;currentRow=scope.row">管理员</el-dropdown-item>
                            <el-dropdown-item @click.native.prevent="changeMember=true;currentRow=scope.row;">普通成员</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                      <el-dialog
                          title="提示"
                          :visible.sync="changeManager"
                          width="30%"
                          center
                          append-to-body>
                        <span>确认要设置该成员为管理员吗？</span>
                        <span slot="footer" class="dialog-footer">
                              <el-button @click="changeManager = false">取 消</el-button>
                              <el-button type="primary" @click="changeManager = false;" @click.native.prevent="setManager(currentRow);update();" class="el-buttons">确 定</el-button>
                        </span>
                      </el-dialog>
                      <el-dialog
                          title="提示"
                          :visible.sync="changeMember"
                          width="30%"
                          center
                          append-to-body>
                        <span>确认要设置该成员为普通成员吗？</span>
                        <span slot="footer" class="dialog-footer">
                              <el-button @click="changeMember = false">取 消</el-button>
                              <el-button type="primary" @click="changeMember = false;" @click.native.prevent="setMember(currentRow);update();" class="el-buttons">确 定</el-button>
                        </span>
                      </el-dialog>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination">
              <el-pagination
                  background="true"
                  layout="prev, pager, next"
                  :total="1000">
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
            {{ team.t_introduction }}
          </div>
          <el-divider></el-divider>
          <div class="team-leader">
            <div class="leader-name">
              The Leader
            </div>
            <div class="leader-nickname">
              <img src="../assets/user.png" class="leader-img-size">
              <div class="nickname">姓名</div>
              <div class="name-info">{{leader.l_name}}</div>
            </div>
            <div class="leader-email">
              <img src="../assets/mail.png" class="leader-img-size">
              <div class="email">电子邮箱</div>
              <div class="email-info">{{ leader.l_email }}</div>
            </div>
            <div class="leader-active">
              <img src="../assets/login.png" class="leader-img-size">
              <div class="active">上次登录</div>
              <div class="active-info">{{leader.l_login_time}}</div>
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
import HeadSide from "@/components/HeadSide";
import LeftSide from "@/components/LeftSide";
import axios from "axios";

export default {
  name: "TeamManage",
  inject:['reload'],
  components: {
    LeftSide,
    HeadSide,
  },
  mounted() {
    this.$axios.get('http://43.138.21.64:8080/user/10/team/3').then((res) => {
      this.team=res.data.team
      this.leader=res.data.leader
      this.member_list=res.data.member_list
      console.log("res.data."+res.data.team.t_id)
      console.log(res.data.is_Manager)
      if(res.data.is_Manager===0){
        this.IsManage=false
      }else{
        this.IsManage=true
      }
    })


    document.body.style.backgroundColor="#FFFFFF";
  },
  methods:{
    update(){
      this.reload()
      console.log('刷新页面')
    },
    searchjump(){

    },
    deleteRow(row){
      let param = new FormData() // 创建form对象
      param.append('is_delete_member', this.addmember)// 通过append向form对象添加数据
      param.append('a_id', row.m_id)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/10/team/3', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              this.$message.success("移除成员成功！")
            }else{
              if(response.data.errno === 4004)
                this.$message.error(response.data.msg);
            }

          })
    },
    setMember(row){
      let param = new FormData() // 创建form对象
      param.append('is_change_identity', this.addmember)// 通过append向form对象添加数据
      param.append('new_identity', '普通成员')
      param.append('a_id', row.m_id)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/10/team/3', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              this.$message.success("成功设置为普通成员！")
            }else{
              if(response.data.errno === 3003)
                this.$message.error(response.data.msg);
            }

          })
    },
    setManager(row){
      let param = new FormData() // 创建form对象
      param.append('is_change_identity', this.addmember)// 通过append向form对象添加数据
      param.append('new_identity', '团队管理员')
      param.append('a_id', row.m_id)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/10/team/3', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              this.$message.success("成功设置为团队管理员！")
            }else{
              if(response.data.errno === 3003)
                this.$message.error(response.data.msg);
            }

          })
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
      this.$router.push('/ProjectManage');
    },
    JumpToTeamManage(){
      this.$router.push('/TeamManage');
    },
    sendInvite(){
      console.log(this.inviteEmail)
      let param = new FormData() // 创建form对象
      param.append('is_add_new_member', this.addmember)// 通过append向form对象添加数据
      param.append('email', this.inviteEmail)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/10/team/3', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              this.$message.success("成功发送邀请！")
            }else{
              if(response.data.errno === 3003)
                this.$message.error(response.data.msg);
            }

          })
      this.inviteEmail=''
    }
  },
  data(){
    return{
      input:'',
      addmember:'1',
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
      inviteEmail:'',
      invite:false,
      leader:[
        {
          l_id:'',
          l_name:'',
          l_nickname: '',
          l_email: '',
          l_headshot: '',
          l_login_time: '',
        }
      ],
      team:[
        {
          t_id: '',
          t_name: '',
          t_introduction: '',
          t_headshot: '',
        }
      ],
      member_list:[
        {
          m_id: 9,
          m_name: '111222',
          m_email: '111222@qq.com',
          m_login_time: null,
          m_membership: '团队管理员',
          m_nickname:''
        }
      ]
    }
  }
};
</script>

<style scoped>
.whole{
}
.main{
  position: absolute;
  flex-direction: column;
  width: 83%;
  overflow: hidden;
  min-width: calc(1520px*81%);
  top:50px;
  left: 230px;
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
  width: 600px;
  height: 80px;
}
.buttons{
  display: flex;
  margin-left: 10px;
  padding-top: 30px;
  padding-left:500px;
  width: 350px;
  height: 80px;
}
.choose-box{
  width:100% ;
  height: 60px;
  display: flex;
  margin-bottom: -10px;
  flex-direction: row;
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
  width: 400px;
  margin-top: 10px;
  margin-left: -60px;
  font-size: 30px;
  font-family: "ruizhi";
}
.manage-project{
  width: 80px;
  height: 28px;
  border: 2px solid;
  border-radius: 3px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:12px;
  margin-left:-30px;
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
  height: 50px;
  width: 100%;
  margin-top: 60px;
}
.members-second-side{
  display: flex;

  height: 70px;
  width: 100%;
}
.members-main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height:auto;
  padding-top: 20px;
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
  left: 30px;
  color: #FFFFFF;
  background-color: #2c3e50;
  font-family: "Berlin Sans FB Demi";
  position: absolute;
  float: left;
}
.members-add:hover{
  color: #E9E9E9;
}
.members-search{
  float: left;
  margin-left: 600px;
  width: 30%;
  margin-top: 5px;
  justify-content: space-between;
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
.invite-input{
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
</style>


<style>
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
