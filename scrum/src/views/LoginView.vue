<template>
<div>
  <img src="../assets/loginPaint.jpeg" height="680" style="position: absolute;left: 120px">
  <div class="block">
  <!--  <div class="choice">
   </div>
    <div class="underline"></div> -->
    <ul class="tabs" v-if="iffind===0">
      <i class="line" :style="{left: slideLeft}"></i>
      <li v-for="(item, index) in tabList" :key="index" class="tab" :class="{'tab-current':  index == currentIndex}" @click="clickTab(index)">{{item}}</li>
    </ul>
    <div class="login" v-if="currentIndex===0&&iffind===0">
    <h2 style="margin-left: 55px; margin-top: 50px">Log in to your account</h2>
      <div class="small_title">Your Email</div>
      <el-input v-model="login_email" prefix-icon="el-icon-message" placeholder="请输入邮箱地址"></el-input>
      <div class="small_title">Password</div>
      <el-input v-model="login_password" show-password prefix-icon="el-icon-key" placeholder="请输入密码"></el-input>
      <div class="forget" v-on:click="find">Forgot your Password?</div>
      <el-button type="login_button" v-on:click="login_0">Log in</el-button>
    </div>
    <div class="register" v-if="currentIndex===1&&iffind===0">
      <h2 style="margin-left: 55px; margin-top: 50px">Create account</h2>
      <el-input class="register_input" v-model="register_email" prefix-icon="el-icon-message" placeholder="请输入邮箱地址" @blur="email_blur"></el-input>
      <el-button type="email_check" v-on:click="send_code">send code</el-button>
      <div class="email_warn" v-if="fault_code===1">邮箱不存在</div>
      <div class="email_warn" v-if="fault_code===2">邮箱格式错误</div>
      <el-input  class="code_input" v-model="register_code"  placeholder="请输入验证码"></el-input>
      <el-input  class="register_input" v-model="register_name" prefix-icon="el-icon-user" placeholder="请输入真实姓名" @blur="name_blur"></el-input>
      <div class="name_warn" v-if="fault_code===3">请输入正确的姓名</div>
      <el-input  class="register_input" v-model="register_password" show-password prefix-icon="el-icon-key" placeholder="请输入密码"  @blur="password_blur"></el-input>
      <div class="password_warn" v-if="fault_code===4" >请输入8-16位数字字母或特殊符号且不能纯数字</div>
      <el-button type="login_button" v-on:click="login_0">Register</el-button>
    </div>
    <div class="find" v-if="iffind===1">
      <h2 style="margin-left: 55px; margin-top: 50px">Forgot your password?</h2>
      <div class="detail">Enter the email you registered with and we'll send the vertification code to reset the password</div>
      <el-input class="register_input" v-model="reset_email" prefix-icon="el-icon-message" placeholder="请输入邮箱地址"></el-input>
      <el-button type="email_check">send code</el-button>
      <el-input  class="code_input" v-model="reset_code"  placeholder="请输入验证码"></el-input>
      <el-input  class="register_input" v-model="reset_password" show-password prefix-icon="el-icon-key" placeholder="请输入新密码"></el-input>
      <div class="return" v-on:click="returnTologin">Return to Log in</div>
      <el-button type="login_button" v-on:click="login_0">Reset</el-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "LoginView",
  mounted() {
    document.body.style.backgroundColor="#FCF7F7";
    this.slideLineLeft();
  },
  data () {
    return {
      tabList: ['Log in', 'Register'],
      tabLen: '',
      currentIndex: 0,
      slideLeft: '',
      iffind:0,
      register_email:'',
      register_code:"",
      register_name:'',
      register_password:'',
      login_email:'',
      login_password:'',
      reset_email:'',
      reset_code:'',
      reset_password:'',
      fault_code:0,
    }
  },
  methods: {
    // 点击时的下划线跟随效果
    clickTab (index) {
      this.currentIndex = index
      // 算出一个tab所占屏幕的宽度，除以2是为了让下划线待在tab标签宽度二分之一处，因为css中给line标签样式使用了绝对定位，并且设置了margin负值，所以这个位置可以让line正好在tab标签下面居中
     // const left = 100 / this.tabLen/2
      // 一次滑动二分一tab标签值
      // 三个标签，可以看成把屏幕分成了6份，每人占2份
      // 第一个下划线，从第1份的地方开始，是0*2+1
      // 第二个下划线，从第3份的地方开始，是1*2+1
      // 第三个下划线，从第5份的地方开始, 是2*2+1
      this.slideLeft = this.currentIndex * 85+55 + 'px'
    },
    // 刚进入页面没有点击时的下划线设置
    slideLineLeft () {
      this.tabLen = this.tabList.length
      //const left = 100 / this.tabLen / 2
      this.slideLeft = this.currentIndex * 100+55 + 'px'
    },
    find(){
      this.iffind=1
    },
    returnTologin(){
      this.iffind=0
    },
    login_0(){
      this.$router.push('/user');
    },
    email_blur() {
      var verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (!verify.test(this.register_email)) this.fault_code = 2
      else this.fault_code=0
    },
    password_blur(){
      var verify = /^[\u0021-\u00ff]{8,16}$/;
      if (!verify.test(this.register_password)) this.fault_code = 4
      else this.fault_code=0
    },
    send_code(){
      if(this.fault_code!==1&&this.fault_code!==2){
        console.log("send")
      }
    },


  },

}
</script>

<style scoped>
.el-input {
  width: 73%;
  margin-top: 13px;
  margin-left: 65px;
}

/deep/ .el-input__inner {
  border-width: 1px 1px 1px 1px;
}
/deep/ .el-input__inner {
  border-width: 1px 1px 1px 1px;
}
/deep/ .el-input__inner:focus {
  border-color: #383838;
}
.register_input{
  margin-top: 30px;
}
.code_input{
  width: 23%;
  margin-left: 162px;
  height: 40px;
}
.block{
  background-color: white;
  width: 570px;
  height: 600px;
  text-align: left;
  position: absolute;
  left: 900px;
  top:80px;
  border-radius: 2%;
  box-shadow: 0px 0px 10px #E9D8D8;
}
.choice{
  height: 50px;
  width: 100%;
  margin-top: 20px;

}
.underline{
  float: left;
  margin-left: 5%;
  width: 90%;
  height: 3px;
  background-color: blanchedalmond;

}
.tabs{
  margin-top: 20px;
  text-align: center;
  position: relative;
  height: 40px;
}
.tab{
  width: 86px;
  float: left;
  margin-top: 10px;
  font-weight: lighter;
  color: #c3c6cd;
  font-size: 16px;
  list-style: none;
  cursor: pointer;
}
.tab-current{
  font-size: 16px;
  margin-top: 10px;
  color: #1c253a;
  font-weight: 500;
  list-style: none;
  cursor: default;
}
.line{
  position: absolute;
  bottom: 0;
  width: 70px;
  margin-left: -.4rem;
  transition: all 0.3s;
  height: .08rem;
  border-radius: .04rem;
  background: #fe686c;
}
.small_title{
  margin-left: 65px;
  margin-top: 30px;
  font-size: 14px;
  color: rgba(117,104,104,0.89);
}
.forget{
  height: 25px;
  width: 180px;
  cursor: pointer;
  margin-top: 35px;
  margin-left: 300px;
  text-align: center;
  line-height: 25px;
  border-bottom: 1px solid #ABABAB;
}
.forget:hover{
  border-bottom: 1px solid #383838;
}
.el-button--login_button {
  color: #FFF;
  margin-left: 55px;
  margin-top: 50px;
  width: 450px;
  background-color: #F2595D;
  border-color: #F2595D;
  font-size: 18px;
  letter-spacing: 1px;
}
.el-button--login_button:hover {
  color: #FFF;
  margin-left: 55px;
  margin-top: 50px;
  width: 450px;
  background-color: #F79B9D;
  border-color: #F79B9D;
  font-size: 18px;
  letter-spacing: 1px;
}
.el-button--login_button:focus {
  color: #FFF;
  margin-left: 55px;
  margin-top: 50px;
  width: 450px;
  background-color: #F2595D;
  border-color: #F2595D;
  font-size: 18px;
  letter-spacing: 1px;
}
.el-button--email_check {
  color: #FFF;
  margin-left: 65px;
  margin-top: 10px;
  width: 120px;
  height: 40px;
  background-color: #F2595D;
  border-color: #F2595D;
  font-size: 16px;
}
.el-button--email_check:hover {
  color: #FFF;
  margin-left: 65px;
  margin-top: 10px;
  width: 120px;
  height: 40px;
  background-color: #F79B9D;
  border-color: #F79B9D;
  font-size: 16px;
}
.el-button--email_check:focus {
  color: #FFF;
  margin-left: 65px;
  margin-top: 10px;
  width: 120px;
  height: 40px;
  background-color: #F2595D;
  border-color: #F2595D;
  font-size: 16px;
}
.detail{
  color: #383838;
  margin-left: 55px;
  font-size: 15px;
  width: 440px;
  line-height:24px;
}
.return{
  height: 25px;
  width: 130px;
  cursor: pointer;
  margin-top: 50px;
  margin-left: 50px;
  text-align: center;
  line-height: 25px;
  border-bottom: 1px solid #ABABAB;
}
.return:hover{
  border-bottom: 1px solid #383838;
}
.email_warn{
  width: 140px;
  position: absolute;
  overflow: hidden;
  line-height: 30px;
  float: left;
  font-size: 13px;
  text-align: left;
  left:190px;
  top:250px;
  color: #F2595D;
}
.name_warn{
  width: 140px;
  position: absolute;
  overflow: hidden;
  line-height: 30px;
  float: left;
  font-size: 13px;
  text-align: left;
  left:65px;
  top:350px;
  color: #F2595D;
}
.password_warn{
  width: 340px;
  position: absolute;
  overflow: hidden;
  line-height: 30px;
  float: left;
  font-size: 13px;
  text-align: left;
  left:65px;
  top:420px;
  color: #F2595D;
}
</style>