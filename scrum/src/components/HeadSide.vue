<template>
  <div>
<div class="headside">
  <img src="../assets/logo.png" height="25px" alt=" " style="position: absolute; left: 15px;top:14px" >
  <div class="username">Hilary Hong</div>
  <div class="email">lluosi1030@gmail.com</div>
  <div class="picture">
   <img src="../assets/avatar.jpg" alt="">
  </div>
  <div class="message">
    <img src="../assets/message.png" height="20px" alt=" "  style="margin-top: 15px" v-on:click="ifNotification=!ifNotification">
  </div>
  <div class="setting">
    <img src="../assets/setting.png" height="20px" alt=" "  style="margin-top: 15px" v-on:click="begin_edit=true;ifNotification=false">
  </div>
  <div class="quit" v-on:click="quit">
    <img src="../assets/quit.png" height="20px" alt=" "  style="margin-top: 14px">
  </div>
</div>
    <div class="mask" v-if="begin_edit">
      <div class="personal_edit" v-if="begin_edit&&!modify_nickname">
        <div class="edit_title">Account setting</div>
        <div class="close" v-on:click="begin_edit=false">
          <img src="../assets/close.png" height="18px" alt=" "  style="margin-top:8px; margin-left: 2px">
        </div>
        <div class="underline"></div>
          <div class="user-header">
            <div class="edit-header">
              <img src="../assets/avatar.jpg" alt="">
            </div>
            <div class="upload-header" >Edit</div>
          </div>
          <div class="information">
            <div class="atitle">Nickname</div>
            <div class="content">Hilary Hong</div>
            <div class="name-edit" v-on:click="modify_nickname=true">Change nickname</div>
            <div class="underline2"></div>
            <div class="atitle">Email</div>
            <div class="content">lluosi1030@gmail.com</div>
            <div class="underline2"></div>
            <div class="atitle">Real Name</div>
            <div class="content">洪秋訸</div>
            <div class="underline2"></div>
            <div class="atitle">uid</div>
            <div class="content">130498501</div>
          </div>
      </div>
      <div class="name-block" v-if="begin_edit&&modify_nickname">
        <div class="edit_title">Change Nickname</div>
        <div class="close" v-on:click="modify_nickname=false">
          <img src="../assets/close.png" height="18px" alt=" "  style="margin-top:8px; margin-left: 2px">
        </div>
        <div class="underline"></div>
        <el-input class="change_name" placeholder="Your new nickname here..."></el-input>
        <el-button type="primary" class="save-btn" v-on:click="modify_nickname=false">Save it</el-button>
      </div>
    </div>
    <input type="file" name="image" accept="image/*" class="real-button" v-if="begin_edit&&!modify_nickname">
   <div class="thewhole" v-if="ifNotification">
     <div class="atip"></div>
    <div class="notification" >
      <div class="edit_title">Notification</div>
      <div class="underline"></div>
      <div class="n-context">
      <ul class="newsList" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="5">
        <div v-for="(item,index) in newsList" v-bind:key="index" class="message-block">
          <div class="type1" v-if="item.type===1">
            <div class="txt-part">
            <div class="var">{{item.username}}</div>
            <div class="const">&nbsp;邀请你加入&nbsp;</div>
            <div class="var">{{item.team}}</div>
            <div class="const">&nbsp;团队&nbsp;</div>
            </div>
            <div type="primary" class="sure-btn" v-if="!item.accept" v-on:click="item.accept=true">Accept</div>
            <div type="primary" class="after-sure" v-if="item.accept" >已同意</div>
          </div>
          <div class="type1" v-if="item.type===2">
            <div class="var">{{item.username}}</div>
            <div class="const">&nbsp;将你移出&nbsp;</div>
            <div class="var">{{item.team}}</div>
            <div class="const">&nbsp;团队&nbsp;</div>
          </div>
          <div class="type1" v-if="item.type===3">
            <div class="var">{{item.username}}</div>
            <div class="const">&nbsp;将你在&nbsp;</div>
            <div class="var">{{item.team}}</div>
            <div class="const">&nbsp;团队中的身份改变为&nbsp;</div>
            <div class="var">{{item.identity}}</div>
          </div>
          <div class="type1" v-if="item.type===4">
            <div class="var">{{item.username}}</div>
            <div class="const">&nbsp;将你加入&nbsp;</div>
            <div class="var">{{item.team}}</div>
            <div class="const">&nbsp;团队的&nbsp;</div>
            <div class="var">{{item.project}}</div>
            <div class="const">&nbsp;项目&nbsp;</div>
          </div>
          <div class="type1" v-if="item.type===5">
            <div class="var">{{item.username}}</div>
            <div class="const">&nbsp;将你移出&nbsp;</div>
            <div class="var">{{item.team}}</div>
            <div class="const">&nbsp;团队的&nbsp;</div>
            <div class="var">{{item.project}}</div>
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

export default {
  name: "HeadSide",
  directives: {infiniteScroll},
  data(){
    return {
      begin_edit: false,
      modify_nickname:false,
      count: 0,
      busy: false, //是否正在加载过程中
      newsList:[
        {type:1,username:'KA',team:'Hong Team',identity:'',project:'',accept:false},
        {type:2,username:'KA',team:'Hong Team',identity:'Boss',project:'',accept:false },
        {type:3,username:'KA',team:'Hong Team',identity:'boss',project:'' ,accept:false},
        {type:4,username:'KA',team:'Hong Team',identity:'',project:'APTITUDE',accept:false },
        {type:5,username:'KA',team:'Hong Team',identity:'',project:'APTITUDE' ,accept:false},
        {type:1,username:'KA',team:'Hong Team',identity:'',project:'' ,accept:false},
        {type:1,username:'KA',team:'Hong Team',identity:'',project:'',accept:false },

      ],
      moreList : [],
      i : 0,
      droping : false,
      noMore : false,
      ifNotification:false
    }
  },
  methods:{
    quit(){
      this.$router.push('/');
    },
      loadMore(){
        // console.log(111);
        var _vm = this;
        this.busy = true;
        this.droping = true;
        this.dropDown = false;
        _vm.i += 1;
        // setTimeout(() => {

       // console.log(newsList);

        if(this.moreList.length == 0){
            _vm.noMore = true;
            _vm.droping = false;
            _vm.busy = true;
          }else{
            _vm.droping = true;
            _vm.noMore = false;
            _vm.moreList.forEach(function(item){
              _vm.newsList.push(item);
            })
          }

        this.busy = false;
        // }, 1000);
      }


  }
}
</script>

<style scoped>
.headside{
  width: 100%;
  height: 50px;
  background-color: #2C2C2C;
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
  z-index: 10000;
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
  background-color: #2c3e50;
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