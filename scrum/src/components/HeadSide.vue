<template>
  <div>
<div class="headside">
  <img src="../assets/logo.png" height="25px" alt=" " style="position: absolute; left: 15px;top:14px" >
  <div class="username">{{ nickname }}</div>
  <div class="email">{{email}}</div>
  <div class="picture">
   <img :src="imgStr" alt="">
  </div>
  <div class="message">
    <img src="../assets/message.png" height="20px" alt=" "  style="margin-top: 15px" v-on:click="changeN">
  </div>
  <div class="setting">
    <img src="../assets/setting.png" height="20px" alt=" "  style="margin-top: 15px" v-on:click="begin_edit=true;ifNotification=false">
  </div>
  <div class="quit" v-on:click="quit">
    <img src="../assets/quit.png" height="20px" alt=" "  style="margin-top: 14px">
  </div>
</div>
    <div class="mask" v-if="begin_edit" :style="{height: this.wholeHeight}">
      <div class="personal_edit" v-if="begin_edit&&!modify_nickname">
        <div class="edit_title">Account setting</div>
        <div class="close" v-on:click="begin_edit=false">
          <img src="../assets/close.png" height="18px" alt=" "  style="margin-top:8px; margin-left: 2px">
        </div>
        <div class="underline"></div>
          <div class="user-header">
            <div class="edit-header">
              <img :src="imgStr" alt="">
            </div>
            <div class="upload-header" >Edit</div>
          </div>
          <div class="information">
            <div class="atitle">Nickname</div>
            <div class="content">{{ nickname }}</div>
            <div class="name-edit" v-on:click="modify_nickname=true">Change nickname</div>
            <div class="underline2"></div>
            <div class="atitle">Email</div>
            <div class="content">{{ email }}</div>
            <div class="underline2"></div>
            <div class="atitle">Real Name</div>
            <div class="content">{{ name }}</div>
            <div class="underline2"></div>
            <div class="atitle">uid</div>
            <div class="content">{{ uid }}</div>
          </div>
      </div>
      <div class="name-block" v-if="begin_edit&&modify_nickname">
        <div class="edit_title">Change Nickname</div>
        <div class="close" v-on:click="modify_nickname=false">
          <img src="../assets/close.png" height="18px" alt=" "  style="margin-top:8px; margin-left: 2px">
        </div>
        <div class="underline"></div>
        <el-input class="change_name" placeholder="Your new nickname here..." v-model="new_nickname"></el-input>
        <el-button type="primary" class="save-btn" v-on:click="reset_nickname()">Save it</el-button>
      </div>
    </div>
    <input type="file" name="image" accept="image/*" class="real-button" v-if="begin_edit&&!modify_nickname" v-on:change="onchangeImgFun">
   <div class="thewhole" v-if="ifNotification">
     <div class="atip"></div>
    <div class="notification" >
      <div class="edit_title">Notification</div>
      <div class="underline"></div>
      <div class="n-context">
      <ul class="newsList" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="5">
        <div v-for="(item,index) in newsList" v-bind:key="index" class="message-block">
          <div class="type1"  v-if="item.type==='1'">
            <div class="txt-part">
            <div class="var">{{item.sender_name}}</div>
            <div class="const">&nbsp;邀请你加入&nbsp;</div>
            <div class="var">{{item.team_name}}</div>
            <div class="const">&nbsp;团队&nbsp;</div>
            </div>
            <div type="primary" class="sure-btn" v-if="item.accept==='0'" v-on:click="acceptInvitation(item)">Accept</div>
            <div type="primary" class="after-sure" v-if="item.accept==='1'" >已同意</div>
          </div>
          <div class="type1" v-if="item.type==='2'">
            <div class="var">{{item.sender_name}}</div>
            <div class="const">&nbsp;将你移出&nbsp;</div>
            <div class="var">{{item.team_name}}</div>
            <div class="const">&nbsp;团队&nbsp;</div>
          </div>
          <div class="type1" v-if="item.type==='3'">
            <div class="var">{{item.sender_name}}</div>
            <div class="const">&nbsp;将你在&nbsp;</div>
            <div class="var">{{item.team_name}}</div>
            <div class="const">&nbsp;团队中的身份改变为&nbsp;</div>
            <div class="var">{{item.identity}}</div>
          </div>
          <div class="type1" v-if="item.type==='4'">
            <div class="var">{{item.sender_name}}</div>
            <div class="const">&nbsp;将你加入&nbsp;</div>
            <div class="var">{{item.team_name}}</div>
            <div class="const">&nbsp;团队的&nbsp;</div>
            <div class="var">{{item.project_name}}</div>
            <div class="const">&nbsp;项目&nbsp;</div>
          </div>
          <div class="type1" v-if="item.type==='5'">
            <div class="var">{{item.sender_name}}</div>
            <div class="const">&nbsp;将你移出&nbsp;</div>
            <div class="var">{{item.team_name}}</div>
            <div class="const">&nbsp;团队的&nbsp;</div>
            <div class="var">{{item.project_name}}</div>
            <div class="const">&nbsp;项目&nbsp;</div>
          </div>
        </div>
      </ul>
      <div id="loadMore" v-show="droping" class="reminder">loading...</div>
      <div id="loadMore" v-show="noMore"  class="reminder">The End</div>
      </div>
    </div>
    </div>
</div>
</template>

<script>
import infiniteScroll from "vue-infinite-scroll";
import axios from "axios";

export default {
  name: "HeadSide",
  directives: {infiniteScroll},
  data(){
    return {
      email:'',
      name:'',
      uid:'',
      nickname:'',
      begin_edit: false,
      modify_nickname:false,
      new_nickname:'',
      count: 0,
      imgStr:require('../assets/avatar.jpg'),
      busy: false, //是否正在加载过程中
      /*
      newsList:[
        {type:1,username:'KA',team:'Hong Team',identity:'',project:'',accept:false},
        {type:2,username:'KA',team:'Hong Team',identity:'管理员',project:'',accept:false },
        {type:3,username:'KA',team:'Hong Team',identity:'普通用户',project:'' ,accept:false},
        {type:4,username:'KA',team:'Hong Team',identity:'',project:'APTITUDE',accept:false },
        {type:5,username:'KA',team:'Hong Team',identity:'',project:'APTITUDE' ,accept:false},
        {type:1,username:'KA',team:'Hong Team',identity:'',project:'' ,accept:false},
        {type:1,username:'KA',team:'Hong Team',identity:'',project:'',accept:false },
      ],*/
      newsList:[],
      moreList : [],
      i : 0,
      droping : false,
      noMore : false,
      ifNotification:false,
      wholeHeight:'',
    }
  },
  methods:{
    quit(){
      let storage = window.localStorage;
      storage.setItem('iflogin',0);
      this.$router.push('/login');
    },
    reset_nickname(){
      console.log("yes");
      let param = new FormData() // 创建form对象
      param.append('new_nickname', this.new_nickname)// 通过append向form对象添加数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid')+'/info', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              let storage = window.localStorage;
              storage.setItem('nickname',this.new_nickname);
              this.nickname=this.new_nickname;
              this.modify_nickname=false;
              this.new_nickname='';
            }else{
              this.$message.error("发生错误");
            }
          })

    },
    beginLoad(){
      this.$axios.get('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid')+'/message').then((res) => {
        this.newsList=res.data.messages;
        console.log( this.newsList);
      })

    },
    acceptInvitation(item){
      let param = new FormData()
      param.append('mid', item.mid)// 通过append向form对象添加数据
      param.append('invite_team_id', item.team_id)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid')+'/message', param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              item.accept='1';
            }else{
              this.$message.error("发生错误");
            }
          })
    },

      loadMore(){
        // console.log(111);
        var _vm = this;
        this.busy = true;
        this.droping = true;
        this.dropDown = false;
        _vm.i += 1;
        // setTimeout(() => {
        this.$axios.get('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid')+'message').then((res) => {
          // console.log(newsList);
          this.newsList=res.data;
          console.log( this.newsList);
          if (this.moreList.length == 0) {
            _vm.noMore = true;
            _vm.droping = false;
            _vm.busy = true;
          } else {
            _vm.droping = true;
            _vm.noMore = false;
            _vm.moreList.forEach(function (item) {
              _vm.newsList.push(item);
            })
          }

          this.busy = false;
      //     }, 1000);
        })
      },
    changeN(){
      this.ifNotification=!this.ifNotification;
      this.beginLoad();
    },
    onchangeImgFun (e) {
      this.file = e.target.files[0]
      console.log(e.target.files[0])
      let file=this.file
      console.log(this.file)
      // 获取图⽚的⼤⼩，做⼤⼩限制有⽤
      let imgSize = file.size
      console.log(imgSize)
      var _this = this // this指向问题，所以在外⾯先定义
      // ⽐如上传头像限制5M⼤⼩，这⾥获取的⼤⼩单位是b
      if (imgSize <= 500 * 1024) {
        // 合格
        _this.errorStr = ''
        console.log('⼤⼩合适')
        // 开始渲染选择的图⽚
        // 本地路径⽅法 1
        // this.imgStr = window.URL.createObjectURL(e.target.files[0])
        // console.log(window.URL.createObjectURL(e.target.files[0])) // 获取当前⽂件的信息
        // base64⽅法 2
        var reader = new FileReader()
        reader.readAsDataURL(file) // 读出 base64
        reader.onloadend = function () {
          // 图⽚的 base64 格式, 可以直接当成 img 的 src 属性值
          var dataURL = reader.result
          //    console.log(dataURL)

          // console.log(this.imgurl)
          _this.imgStr = dataURL
          // 下⾯逻辑处理
        }
      } else {
        this.$message.error("图⽚⼤⼩超出范围500kb");
        _this.errorStr = '图⽚⼤⼩超出范围500kb'
      }
      this.imgurl2= _this.imgStr
      console.log("he"+this.imgurl2)
      console.log(this.file)

      let param = new FormData() // 创建form对象
      param.append('new_headshot', this.file)// 通过append向form对象添加数据
      console.log("why"+param.get('new_headshot')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid')+'/info', param,config)
          .then(response => {
            console.log(response.data)
            if (response.data.errno === 1000) {
              console.log("yes");
              this.imgStr='http://43.138.21.64:8080'+response.data.headshot_url;
              console.log(this.imgStr);
              let storage = window.localStorage;
              storage.setItem('headshot',this.imgStr);
            }else{
              this.$message.error("发生错误");
            }
          })
    },


  },
  mounted() {
    let storage = window.localStorage;
    this.email=storage.getItem('email');
    this.nickname=storage.getItem('nickname');
    this.name=storage.getItem('name');
    this.uid=storage.getItem('uid');
    this.imgStr=storage.getItem('headshot');
    this.wholeHeight=document.documentElement.scrollHeight-50+'px';
  }
}
</script>

<style scoped>
.headside{
  position:absolute;
  top:0;
  width: 100%;
  min-width: 1510px;
  height: 50px;
  background-color: #2C2C2C;
  overflow: hidden;
}
.username{
  position: absolute;
  left: 55px;
  top: 10px;
  letter-spacing: 1px;
  width: 200px;
  height: 17px;
  color: #fefefe;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
}
.email{
  position: absolute;
  left: 55px;
  top: 28px;
  width: 200px;
  height: 17px;
  text-align: left;
  color: rgba(205,200,200,0.92);
  font-size: 12px;
  font-weight: 300;
  overflow: hidden;
}

.picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  left: 1300px;
  top:10px;
  text-align: left;
  background-color: #2c3e50;
}
.picture img {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  height: 100%;
}
.message{
  position: absolute;
  left: 1350px;
  width: 60px;
  height: 50px;
  top: 0;

}
.message:hover{
  background-color: #111111;
}
.setting{
  position: absolute;
  left: 1410px;
  width: 60px;
  height: 50px;
  top: 0;

}
.setting:hover{
  background-color: #111111;
}
.quit{
  position: absolute;
  left: 1470px;
  width: 60px;
  height: 50px;
  top: 0;

}
.quit:hover{
  background-color: #111111;
}
.mask{
  position: absolute;
  z-index: 100000;
  left: 0;
  top:50px;
  height: calc(100% - 50px);
  width: 100%;
  background-color: rgba(0,0,0,0.3);
}
.personal_edit{
  position: absolute;
  left: 480px;
  top:30px;
  height: 600px;
  width: 600px;
  background-color: #FFFFFF;
  border-radius: 0.5%;
  box-shadow: 0px 0px 9px rgba(0,0,0,0.3);
}
.name-block{
  position: absolute;
  left: 530px;
  top:150px;
  height: 240px;
  width: 500px;
  background-color: #FFFFFF;
  border-radius: 0.5%;
  box-shadow: 0px 0px 9px rgba(0,0,0,0.3);
}
.edit_title{
  width: 300px;
  height: 60px;
  text-align: left;
  margin-left: 30px;
  line-height: 60px;
  font-family: Inter,"Segoe UI";
  font-size: 15px;
  font-weight: 500;
  color: #383838;

}
.close{
  height: 35px;
  width: 35px;
  float: right;
  margin-top: -45px;
  margin-right: 10px;
  cursor: pointer;
}
.close:hover{
  background-color: #F3F3F3;
}
.underline{
  width: 100%;
  height: 1px;
  background-color: #E9E9E9;
}
.underline2{
  width: 88%;
  height: 1px;
  margin-top: 23px;
  background-color: #E9E9E9;
  margin-left: 17px;
}
.user-header{
  width: 180px;
  height: 520px;
  float: left;
}
.information{
  width: 420px;
  height: 520px;
  float: left;
}
.edit-header {
  width: 120px;
  height: 120px;
  margin-left: 35px;
  margin-top: 30px;
  border-radius: 50%;
  overflow: hidden;
  text-align: left;
  border-color: transparent;
}
.edit-header img {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  height: 100%;
}
.upload-header{
  color: #ABABAB;
  font-size: 12px;
  cursor: pointer;
  width: 30px;
  margin-top: 10px;
  margin-left: 82px;
  font-family: Inter, sans-serif;
}
.real-button{
  position: absolute;
  z-index: 100000;
  top:302px;
  left: 562px;
  background-color: #42b983;
  overflow: hidden;
  width: 30px;
  height: 15px;
  opacity: 0;
  cursor: pointer;
  direction: rtl;
}
.atitle{
  font-family: Inter, sans-serif;
  color: #2C2C2C;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  margin-left: 20px;
  margin-top: 30px;

}
.content{
  font-family: Inter, sans-serif;
  color: #383838;
  font-weight: 400;
  font-size: 12px;
  text-align: left;
  margin-left: 20px;
  margin-top: 17px;
}
.name-edit{
  font-family: "Segoe UI",serif;
  color: #3D89E9;
  font-weight: 400;
  font-size: 12px;
  text-align: left;
  margin-left: 20px;
  margin-top: 17px;
  cursor: pointer;
}
.change_name{
  width: 80%;
  margin-top: 30px;
  margin-left: 16px;
}
.save-btn{
  margin-top: 30px;
  margin-left: 330px;
}
/deep/.el-input__inner {
  background-color: rgba(255,255,255,0.45);
  color:#2c3e50 ;
  border-width: 1px 1px 1px 1px ;
  border-bottom-color: #2c3e50;
  border-radius: 0;
}
.notification{
  z-index: 10000;
  width:430px;
  height: 450px;
  left:1088px;
  top:60px;
  position: absolute;
  background-color: white;
  border: none;
  overflow: auto;
  border-radius: 1%;
  box-shadow: 0px 0px 9px rgba(0,0,0,0.2);
}
.atip{
  z-index: 10001;
  left:1378px;
  top:54px;
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  transform:rotate(45deg);
  box-shadow: -3em -3em 0px rgba(0,0,0,0.2);

}
.n-context{
  overflow: auto;

  width: 100%;
  height: 385px;
}
::-webkit-scrollbar{
  width: 7px;
}
::-webkit-scrollbar-track{
  background-color: #f5f5f5;
  -webkit-box-shadow:inset 0 0 3px rgba(0,0,0,0.1);
  border-radius:5px;
}
::-webkit-scrollbar-thumb{
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
::-webkit-scrollbar-button{
  background-color: #eee;
  display: none;
}
::-webkit-scrollbar-corner{
  background-color: black;
}
.message-block{

  margin-left: -10px;
  text-align: left;
  min-height: 40px;
  overflow: hidden;
  width: 96%;
  line-height: 20px;
  margin-top: 21px;
  border-bottom: 1px solid #E9E9E9;
}
.var{
  float: left;
  font-family: Inter, "Segoe UI", 黑体;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 20px;
  padding-bottom: 3px;
}
.const{
  float: left;
  font-size: 13px;
  text-align: center;
  line-height: 20px;
}
.reminder{
  font-family: Inter, "Segoe UI", 黑体;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
}
.sure-btn{
  width: 50px;
  height: 25px;
  font-size: 12px;
  font-family: Inter, "Segoe UI";
  float: right;
  background-color: #383838;
  cursor: pointer;
  color: white;
  border-radius:3px ;
  padding-left: 15px;
  padding-top: 4px;
}
.after-sure{
  width: 50px;
  height: 25px;
  font-size: 12px;
  font-family: Inter, "Segoe UI";
  float: right;
  cursor: default;
  color: #383838;
  padding-left: 15px;
  padding-top: 4px;
}
</style>
