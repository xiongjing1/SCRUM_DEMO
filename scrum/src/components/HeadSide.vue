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
    <img src="../assets/message.png" height="20px" alt=" "  style="margin-top: 15px">
  </div>
  <div class="setting">
    <img src="../assets/setting.png" height="20px" alt=" "  style="margin-top: 15px" v-on:click="begin_edit=true">
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
</div>
</template>

<script>
export default {
  name: "HeadSide",
  data(){
    return {
      begin_edit: false,
      modify_nickname:false
    }
  },
  methods:{
    quit(){
      this.$router.push('/');
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
</style>