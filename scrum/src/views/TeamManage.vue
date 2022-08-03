<template>
  <div>
    <HeadSide></HeadSide>
    <LeftSide></LeftSide>
  <div class="main">
    <div class="title">
      <div class="team">
        <div class="TeamPhoto">
          <el-avatar style="height: 70px;width:70px;background-color:cornflowerblue;padding-top: 15px"> X </el-avatar>
        </div>
        <div class="TeamName">
          Yigaa's Team
        </div>
      </div>
      <div class="buttons">
        <div class="manage-project">
          项目管理
        </div>
        <div class="list-members">
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
            <div class="members-add">
              Add member
            </div>
            <div class="members-search">
              <el-input v-model="input" prefix-icon="el-icon-search" placeholder="搜索..." v-on:keyup.enter.native="searchjump"></el-input>
            </div>
          </div>
          <div class="members-second-side">
            <div class="members-rank">
              <el-select v-model="value" placeholder="全部成员" class="rank">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="members-main">
            <div :class="IsManage===true?'table-leader':'table-member'">
              <el-table
                  :data="tableData"
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}"
                  style="width: 100%"
                  max-height="480">
                <el-table-column
                    fixed
                    prop="name"
                    label="姓名"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="昵称"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="lastactive"
                    label="上次登录"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="identity"
                    label="身份"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="220"
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
                              <el-button type="primary" @click="removeMember = false;" @click.native.prevent="deleteRow(currentRow)" class="el-buttons">确 定</el-button>
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
                              <el-button type="primary" @click="changeManager = false;" @click.native.prevent="deleteRow(currentRow)" class="el-buttons">确 定</el-button>
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
                              <el-button type="primary" @click="changeMember = false;" @click.native.prevent="deleteRow(currentRow)" class="el-buttons">确 定</el-button>
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
            <div class="summary-title">简介</div>
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
          <el-divider></el-divider>
          <div class="lately-operation">
            近期操作
          </div>
        </div>
    </div>
  </div>
  </div>
</template>


<script>
import HeadSide from "@/components/HeadSide";
import LeftSide from "@/components/LeftSide";

export default {
  name: "TeamManage",
  components: {
    LeftSide,
    HeadSide,
  },
  methods:{
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
    }
  },
  data(){
    return{
      input:'',
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
    }
  }
};
</script>

<style scoped>
.main{
  position: absolute;
  flex-direction: column;
  width: 83%;
  min-width: calc(1520px*83%);
  top:50px;
  left: 259px;
  background-color: #42b983;
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
.buttons{
  display: flex;
  margin-left: 10px;
  padding-top: 30px;
  padding-left:700px;
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
  display: flex;
  height: 500px;
  width: 75%;
  flex-direction: column;
}
.right-side{
  display: flex;
  width:25%;
  height: 500px;
  flex-direction: column;
}
.TeamPhoto{
  display: flex;
  padding-top: 10px;
  width: 70px;
  height: 70px;

}
.TeamName{
  padding-top: 20px;
  padding-left: 10px;
  width: 300px;
  font-size: 35px;
  font-family: "Berlin Sans FB Demi";
}
.manage-project{
  width: 80px;
  height: 37px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:15px;
  margin-left: 20px;
}
.manage-project:hover{
  color: rgba(23,43,72,0.45);
}
.list-members{
  width: 80px;
  height: 37px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:15px;
  margin-left: 15px;
}
.list-members:hover{
  color: rgba(23,43,72,0.45);
}
.more{
  width: 80px;
  height: 37px;
  border: 2px solid;
  border-radius: 5px;
  outline-color: #2c3e50;
  cursor: pointer;
  padding-top:15px;
  margin-left: 15px;
  color: #2c3e50;
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
  display: flex;
  height: 50px;
  width: 100%;
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
  padding-left:525px;
  padding-top: 5px;
  width: 30%;
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
  width: 65%;
}
.team-content{
  display: flex;
  padding-top: 10px;
  padding-left: 15px;
  width: 100%;
  height: 130px;
}
.team-leader{
  display: flex;
  width: 100%;
  height:250px;
  flex-direction: column;
  align-content: center;
}
.leader-name{
  display: flex;
  margin-left: 15px;
  padding-top: 10px;
  font-family: "Berlin Sans FB Demi";
  font-size: 20px;
}
.leader-nickname{
  display: flex;
  flex-direction: row;
}
.nickname{
  display: flex;
  padding-top: 15px;
  padding-left: 8px;
  font-size: 15px;

}
.name-info{
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  font-size: 15px;
}
.leader-active{
  display: flex;
  flex-direction: row;
}
.active{
  display: flex;
  padding-top: 15px;
  padding-left: 8px;
  font-size: 15px;

}
.active-info{
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  font-size: 15px;
}
.leader-email{
  display: flex;
  flex-direction: row;
}
.email{
  display: flex;
  padding-top: 15px;
  padding-left: 8px;
  font-size: 15px;

}
.email-info{
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  font-size: 15px;
}
.leader-img-size{
  display: flex;
  padding-left: 10px;
  padding-top: 10px;
  width: 30px;
  height: 30px;
}
.lately-operation{
  display: flex;
  width: 100%;
  height: 250px;
}
.edit-summary{
  display: flex;
  padding-left: 9px;
  margin-left: 5px;
  width: 12%;
  font-size: 18px;
  border: 2px solid;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Berlin Sans FB Demi";
}
.edit-summary:hover{
  color: rgba(23,43,72,0.45);
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
