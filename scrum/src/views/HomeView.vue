<template>
  <div>
    <div class="page1">
        <img src="../assets/headbackgournd.jpg" class="background1">
      <div class="bottom-block"></div>
      <div class="middle-block"></div>
      <div class="title">
        <div class="MO animate__animated animate__fadeInUp" >MO</div>
        <div class="BOOK animate__animated animate__fadeInUp">Book</div>
        <div class="mo0 animate__animated animate__fadeInUp">墨</div>
        <div class="book0 animate__animated animate__fadeInUp">书</div>
      </div>
      <img src="../assets/Scribbles.svg" class="scribbles animate__animated animate__fadeInBottomLeft">
      <div class="inform1 animate__animated animate__fadeInUp">一款高效团队协作设计平台</div>
      <div class="start-btn animate__animated animate__bounceIn" v-on:click="jump"></div>
      <div class="start-word animate__animated animate__bounceIn" v-on:click="jump">现在开始</div>
    </div>
    <div class="page2">
      <img src="../assets/back2.svg" class="back2 wow bounceInDown" data-wow-duration="1s" data-wow-delay="500ms">
      <img src="../assets/front2.svg" class="front2 wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="1400ms">
      <div class="title21 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="2100ms">团队项目</div>
      <div class="title22 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="2100ms">一键管理</div>
      <div class="inform2 wow fadeInLeft" data-wow-duration="0.6s" data-wow-delay="2500ms">
        团队管理+项目管理，<br/>
        层层相扣，<br/>
        有条不紊地开展团队工作
      </div>
    </div>
    <div class="page3">
      <img src="../assets/vuegg.png" class="back3 wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="1400ms">
      <img src="../assets/middle3.svg" class="middle3 wow animate__flipInY" data-wow-duration="1s" data-wow-delay="500ms">
      <img src="../assets/front3.svg" class="front3 wow animate__fadeInLeft" data-wow-duration="0.6s" data-wow-delay="2100ms">
      <div class="title31 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="2500ms">在线</div>
      <div class="title32 wow fadeInUp"  data-wow-duration="0.6s" data-wow-delay="2500ms">原型设计</div>
      <div class="inform3 wow fadeInRight" data-wow-duration="0.6s" data-wow-delay="3000ms">
        随时随地进行网页设计<br/>
        拖拽即可添加组件，素材丰富<br/>
        支持预览，导出JPG等格式<br/>
        配置&ensp;&ensp;&ensp;&ensp;&ensp;绘制窗口
      </div>
      <div class="inform3plus wow fadeInRight" data-wow-duration="0.6s" data-wow-delay="3000ms">UML</div>
    </div>
    <!--
    <div class="partition">
      <div class="scrollword">MOBOOK</div>
      <div class="xiexian"></div>
      <div class="scrollword">MOBOOK</div>
      <div class="xiexian"></div>
      <div class="scrollword">MOBOOK</div>
      <div class="xiexian"></div>
      <div class="scrollword">MOBOOK</div>
      <div class="xiexian"></div>
      <div class="scrollword">MOBOOK</div>
      <div class="xiexian"></div>
      <div class="scrollword">MOBOOK</div>
      <div class="xiexian"></div>
    </div>
    -->
    <div class="page4">
      <img src="../assets/cloud1.svg" class="cloud1 wow fadeInLeft" data-wow-duration="0.4s" data-wow-delay="600ms">
      <img src="../assets/cloud2.svg" class="cloud2 wow fadeInLeft" data-wow-duration="0.4s" data-wow-delay="800ms">
      <img src="../assets/cloud3.svg" class="cloud3 wow fadeInRight" data-wow-duration="0.5s" data-wow-delay="700ms">
      <img src="../assets/ipad.png" class="ipad wow animate__slideInUp"  data-wow-duration="0.8s" data-wow-delay="1540ms">
      <img src="../assets/mailbox.svg" class="mailbox wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="1040ms">
      <img src="../assets/dog.svg" class="dog wow animate__bounceInUp" data-wow-duration="0.5s" data-wow-delay="1000ms">
      <div class="title41 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="2400ms">文档</div>
      <div class="title42 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="2400ms">管理 便捷直达</div>
      <div class="inform4 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="2900ms">
        在线编辑Markdown文件<br/>
        多种模式供选择，支持即时渲染<br/>
        团队成员共享
      </div>
    </div>
    <div class="page5">
      <img src="../assets/back5.svg" class="back5 wow animate__zoomInRight" data-wow-duration="0.7s" data-wow-delay="400ms">
      <img src="../assets/front5.svg" class="front5 wow animate__fadeInLeft" data-wow-duration="0.7s" data-wow-delay="1200ms">
      <div class="title51 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="1640ms">高效协作  &ensp;&ensp;&ensp;&ensp;同步</div>
      <div class="title52 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="1640ms">实时</div>
      <div class="inform5 wow fadeInLeft" data-wow-duration="0.6s" data-wow-delay="2000ms">
        原型设计、文档编辑内容实时同步<br/>
        多人协作更流畅<br/>
        创建更为高效的团队工作模式
      </div>
    </div>
    <div class="page6">
      <img src="../assets/back6.png" class="back6 wow animate__slideInUp"  data-wow-duration="0.8s" data-wow-delay="440ms">
      <img src="../assets/front6.svg" class="front6 wow animate__slideInLeft"  data-wow-duration="1.0s" data-wow-delay="840ms">
      <div class="title61 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="1640ms">
        点击开启<br/>
        &ensp;&ensp;探索你的设计之旅
      </div>
      <div class="title62 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="1640ms" >Start with us right now</div>
      <div class="end-btn wow animate__jackInTheBox" data-wow-duration="0.8s" data-wow-delay="1840ms" v-on:click="jump">
        <div class="end-word">Click here</div>
      </div>
    </div>
  </div>
</template>


<script>
import { WOW } from 'wowjs'
export default {
  name: "HomeView",
  mounted() {
    console.log(document.body.scrollWidth)
    console.log(document.body.clientHeight)
    var wow = new WOW({
      boxClass: "wow",    //需要执行动画的元素的 class
      animateClass: "animated", // animation.css 动画的 class
      offset: 0, // 距离可视区域多少开始执行动画
      mobile: true, // 是否在移动设备上执行动画
      live: true // 异步加载的内容是否有效
    })
    wow.init();
 },
  methods:{
    jump(){
      this.$router.push('/login/');
    }
  }
}
</script>

<style scoped>
.background1{
  position: absolute;
  left: 0px;
  top: calc(100% - 812.49px);
  width: 1518.24px;
  height: 812.49px;
}
.bottom-block{
  position: absolute;
  left: 349px;
  top: 175.6px;
  width: 806px;
  height: 399px;
  background: #ffffff;
  background-blend-mode: normal;
}
.middle-block{
  position: absolute;
  left: 375px;
  top: 197.79px;
  width: 754px;
  height: 349.81px;
  border: 5px solid #ff80c2;
  background: #f9f9f9;
  background-blend-mode: normal;
}

.MO{
  position: absolute;
  left: 529px;
  top: 265.4px;
  width: 119px;
  height: 86px;
  color: #e065a3;
  font-family: AMCSongGBK-Light;
  font-size: 68px;
  font-weight: 700;
  letter-spacing: 1px;
}
.BOOK{
  position: absolute;
  left: 648px;
  top: 265.4px;
  width: 178px;
  height: 86px;
  color: black;
  font-family: AMCSongGBK-Light;
  font-size: 68px;
  font-weight: 700;
  letter-spacing: 1px;
}
.mo0{
  position: absolute;
  left: 842px;
  top: 254.4px;
  width: 73px;
  height: 86px;
  color: #e065a3;
  font-family: Leelawadee;
  font-size: 72px;
  font-weight: 700;
  letter-spacing: 1px;
}
.book0{
  position: absolute;
  left: 915px;
  top: 254.4px;
  width: 73px;
  height: 86px;
  color: black;
  font-family: Leelawadee;
  font-size: 72px;
  font-weight: 700;
  letter-spacing: 1px;
}
.scribbles {
  position: absolute;
  left: 437px;
  top: 275.68px;
  width: 322px;
  height: 140.92px;
  background-blend-mode: normal;
  animation-delay:500ms;
}
.inform1{
  position: absolute;
  left: 490px;
  top: 360px;
  width: 539px;
  height: 52px;
  font-family: "Microsoft JhengHei UI";
  font-size: 26px;
  font-weight: 400;
  text-align: center;
  letter-spacing: 2px;
  animation-delay:800ms;
}
.start-btn{
  position: absolute;
  left: 637px;
  top: 432.8px;
  width: 230px;
  height: 55px;
  border-radius: 5px;
  background: #2a2626;
  cursor: pointer;
  background-blend-mode: normal;
  animation-delay:1400ms;
}
.start-word{
  position: absolute;
  left: 694px;
  top: 444px;
  width: 128px;
  height: 26px;
  cursor: pointer;
  background-blend-mode: normal;
  color: #ffffff;
  font-family: "Berlin Sans FB";
  font-size: 24px;
  font-weight: 400;
  text-align: right;
  letter-spacing: 8px;
  animation-delay:1400ms;
}
.page2{
  position: absolute;
  left: 0px;
  top: 100%;
  width: 100%;
  height: 100%;
  background: #33a5d6;
  background-blend-mode: normal;
}
.back2{
  position: absolute;
  left: 804.84px;
  top: calc(820px - 100%);
  width: 609.16px;
  height: 477.2px;
}
.front2{
  position: absolute;
  left: 835px;
  top: calc(877px - 100%);
  width: 548px;
  height: 548px;
}
.title21{
  position: absolute;
  left: 93.2px;
  top: calc(905.8px - 100%);
  width: 308px;
  height: 142px;
  color: #e3ec2e;
  background-blend-mode: normal;
  font-family: "Berlin Sans FB";
  font-size: 61px;
  font-weight: 400;
  letter-spacing: 8px;
}
.title22{
  position: absolute;
  left: 408px;
  top: calc(906.2px - 100%);
  width: 292px;
  height: 71px;
  color: #fafafa;
  background-blend-mode: normal;
  font-family: "Berlin Sans FB";
  font-size: 61px;
  font-weight: 400;
  letter-spacing: 8px;
}
.inform2{
  position: absolute;
  left: 109.2px;
  top: calc(1028px - 100%);
  width: 539px;
  height: 277px;
  color: #ffffff;
  font-family: "Microsoft JhengHei UI";
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 2px;
  text-align: left;
  line-height: 48px;
}
.page3{
  position: absolute;
  left: 0px;
  top: 200%;
  width: 100%;
  height: 100%;
  background: #a47de0;
  background-blend-mode: normal;
}
.back3{
  position: absolute;
  left: 160.05px;
  top: calc(1682px - 200%);
  width: 490.95px;
  height: 240.99px;
}
.middle3{
  position: absolute;
  left: 75px;
  top: calc(1520px - 200%);
  width: 615.83px;
  height: 482.43px;
}
.front3{
  position: absolute;
  left: 75px;
  top: calc(1618px - 200%);
  width: 481px;
  height: 481px;
}
.title32{
  position: absolute;
  left: 983px;
  top: calc(1646px - 200%);
  width: 296px;
  height: 73px;
  background: #ffd200;
  background-blend-mode: normal;
  font-family: "Berlin Sans FB";
  font-size: 66px;
  font-weight: 400;
  letter-spacing: 8px;
}
.title31{
  position: absolute;
  left: 835px;
  top: calc(1646px - 200%);
  width: 148px;
  height: 73px;
  color: #fefefe;
  background-blend-mode: normal;
  font-family: "Berlin Sans FB";
  font-size: 66px;
  font-weight: 400;
  letter-spacing: 8px;
}
.inform3{
  position: absolute;
  left: 841px;
  top: calc(1756px - 200%);
  width: 539px;
  height: 277px;
  color: #ffffff;
  font-family: "Microsoft JhengHei UI";
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 2px;
  text-align: left;
}
.inform3plus{
  position: absolute;
  left: 906px;
  top: calc(1864px - 200%);
  width: 70px;
  height: 36px;
  color: #f8c822;
  background-blend-mode: normal;
  font-family: "Microsoft JhengHei UI";
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
}
.partition{
  position: absolute;
  left: 0;
  top:300%;
  width: 100%;
  height: 82px;
  background: #010101;
  background-blend-mode: normal;
  overflow: hidden;
}
.scrollword{
  margin-top: 10px;
  width: 207px;
  height: 75px;
  color: #ffffff;
  font-family: "UD Digi Kyokasho N-R";
  font-size: 65px;
  font-weight: 400;
  text-align: right;
  letter-spacing: 2px;
  margin-left: 5px;
  float: left;

}
.xiexian{
  float: left;
  background: white;
  margin-top: 40px;
  height:0px;
  border: 2px solid white;
  width: 66px;
  margin-left: -10px;
  transform:rotate(100deg);
  -o-transform:rotate(100deg);
  -moz-transform:rotate(100deg);
  -webkit-transform:rotate(100deg);
  overflow: hidden;
}
.page4{
  position: absolute;
  left: 0px;
  top: 300%;
  width: 100%;
  height: 100%;
  background: #eeca00;
  background-blend-mode: normal;
  overflow: hidden;
}
.cloud1{
  position: absolute;
  left: -100.8px;
 bottom: 30px;
  width: 450.07px;
  height: 421.94px;
}
.cloud2{
  position: absolute;
  left: 128.47px;
  bottom: 10px;
  width: 507.83px;
  height: 288.76px;
}
.cloud3{
  position: absolute;
  left: 1228px;
  bottom: 120px;
  width: 276px;
  height: 258.75px;
}
.ipad{
  position: absolute;
  left: 222.8px;
  bottom:0;
  width: 1059.5px;
  height: 505.74px;
}
.mailbox{
  position: absolute;
  left: 1091px;
  bottom: -84px;
  width: 413px;
  height: 413px;
}
.dog{
  position: absolute;
  left: -57px;
  top: calc(2419px - 300%);
  width: 571px;
  height: 571px;
}
.title41{
  position: absolute;
  left: 441px;
  top: calc(2220px - 300%);
  width: 148px;
  height: 82px;
  color: #59B0E2;
  font-family: FZLanTingKanHei;
  font-size: 72px;
  font-weight: 400;
  text-align: right;
  letter-spacing: 2px;
}
.title42{
  position: absolute;
  left: 594.3px;
  top: calc(2220px - 300%);
  width: 480px;
  height: 82px;
  color: white;
  font-family: FZLanTingKanHei;
  font-size: 72px;
  font-weight: 400;
  letter-spacing: 2px;
  text-align: left;
}
.inform4{
  position: absolute;
  left: 482.6px;
  top: calc(2316px - 300%);
  width: 539px;
  height: 116px;
  color: #ffffff;
  font-family: "Microsoft JhengHei UI";
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  letter-spacing: 2px;
}
.page5{
  position: absolute;
  left: 0px;
  top: 400%;
  width: 100%;
  height: 100%;
  background: #6fb486;
  background-blend-mode: normal;
  overflow: hidden;
}
.back5{
  position: absolute;
  left: 760.2px;
  top: calc(2990px - 400%);
  width: 663.75px;
  height: 501px;
}
.front5{
  position: absolute;
  left: 782.46px;
  top: calc(3200px - 400%);
  width: 624.54px;
  height: 316.72px;
}
.title51{
  position: absolute;
  left: 51px;
  text-align: left;
  top: calc(3094px - 400%);
  width: 648px;
  height: 94px;
  color: white;
  font-family: "Microsoft YaHei UI";
  font-size: 65px;
  font-weight: 290;
  letter-spacing: 4px;
}
.title52{
  position: absolute;
  left: 352px;
  top: calc(3094px - 400%);
  width: 152px;
  height: 94px;
  color: #fad60d;
  font-family: "Microsoft YaHei UI";
  font-size: 65px;
  font-weight: 290;
  letter-spacing: 4px;
}
.inform5{
  position: absolute;
  left: 51px;
  top: calc(3226px - 400%);
  width: 450px;
  height: 125px;
  color: #f7f5ec;
  font-family: "Microsoft YaHei UI";
  font-size: 28px;
  font-weight: 290;
  letter-spacing: 2px;
  text-align: left;
  line-height: 44px;
}
.page6{
  position: absolute;
  left: 0px;
  top: 500%;
  width: 100%;
  height: 100%;
  background: #DC8057;
  background-blend-mode: normal;
  overflow: hidden;
}
.back6{
  position: absolute;
  left: -181px;
  top: calc(3605px - 500%);
  width: 2387px;
  height: 1152.92px;
}
.front6{
  position: absolute;
  left: 23px;
  top: calc(3710px - 500%);
  width: 704px;
  height: 528px;
}
.title61{
  position: absolute;
  left: 752.2px;
  top: calc(3711px - 500%);
  width: 997px;
  height: 159px;
  color: #fffcfc;
  font-family:BIZ-X;
  font-size: 64px;
  font-weight: 400;
  text-align: left;
}
.title62{
  position: absolute;
  left: 802px;
  top: calc(3880px - 500%);
  width: 474px;
  height: 51px;
  color: #ffffff;
  font-family: "Bahnschrift Semibold";
  font-size: 34px;
  font-weight: 400;
  text-align: center;
  letter-spacing: 4px;
}
.end-btn{
  position: absolute;
  left: 894px;
  top: calc(3964px - 500%);
  width: 290px;
  height: 60px;
  border-radius: 8px;
  border: 3px solid #fffcfc;
  background: rgba(211,211,211,0);
  background-blend-mode: normal;
  cursor: pointer;
}
.end-word{
  width: 199px;
  height: 43px;
  color: #ffffff;
  margin-left: 45px;
  margin-top: 14px;
  font-family: "Bahnschrift Semibold";
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  letter-spacing: 4px;
  cursor: pointer;
}
</style>