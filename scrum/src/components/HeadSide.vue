<template>
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
    <img src="../assets/setting.png" height="20px" alt=" "  style="margin-top: 15px">
  </div>
  <div class="quit" v-on:click="quit">
    <img src="../assets/quit.png" height="20px" alt=" "  style="margin-top: 14px">
  </div>
</div>
</template>

<script>
export default {
  name: "HeadSide",
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
</style>