<template>
  <div>
  <div id="diva">
    <HeadSide></HeadSide>
    <div class="plusElement">
      <img src="../assets/PrototypeMaterial/aspicture.png" height="25px"   v-on:click="asPicture=!asPicture" class="backlogo"  alt="">
      <img src="../assets/PrototypeMaterial/delete.png" height="25px"   v-on:click="deleteEle" class="backlogo"  alt="">
      <img src="../assets/PrototypeMaterial/clear.png" height="23px"   v-on:click="clear" class="backlogo"  alt="">
      <img src="../assets/PrototypeMaterial/save.png" height="23px"   v-on:click="save" class="backlogo"  alt="">
    </div>
    <div class="show-picture" v-if="asPicture">
      <div class="picture-btn" @click="allTo(0)">jpg格式</div>
      <div class="picture-btn" @click="allTo(1)">png格式</div>
    </div>
    <div id="left" :style="{height: this.wholeHeight}">
      <div class="title">
        <img src="../assets/PrototypeMaterial/back.png" height="25px" class="backlogo" @click="BackToDesignManage" alt="">
        <div style="width:200px;height: 40px; color: #FFFFFF; font-size: 16px; letter-spacing: 2px;margin-top: 13px">
          {{ projName }}</div>
      </div>
      <div id="menu" >
        <el-button  id="buttonAdd" @click="dialogAddVisible = true" icon="el-icon-plus">添加页面</el-button>
        <!--
        <el-dropdown>
          <el-button type="primary" v-show="prototypeData.length !== 0" style="background-color: #F2595D">导出图片
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native.prevent="allTo(0)">jpg格式</el-dropdown-item>
            <el-dropdown-item @click.native.prevent="allTo(1)">png格式</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        -->
      </div>
      <div id="list">
        <ul style="padding: 0; width: 100%; margin: 0">
          <li v-for="(el,index) in prototypeData" :class="{classSelected:idSelected===el.ID}"
              :key="el.ID" class="prototypeList"  @click="changeCanvas(el,index)">{{el.name}}
            <i class="el-icon-edit" style="padding: 5px" @click.stop="showChangeDialog(el)"></i>
            <i class="el-icon-delete-solid" @click.stop="deletePrototype(el.ID)"></i>
          </li>
        </ul>
        <el-empty description="还没有创建原型实例" v-show="prototypeData.length===0" :image-size="200"></el-empty>
      </div>

    </div>
    <div id="work" >
      <span style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" v-show="idSelected !== -1">
        <canvas id="c"></canvas>
      </span>

    </div>
    <div id="right" >
      <div id="materialPanel" v-show="idSelected !== -1">
        <div v-for="ele in materialData" :key="ele.id" class="material" @click="addMaterial(ele.id)">{{ele.name}}</div>
      </div>
    </div>
    <el-dialog title="设置原型属性" :visible.sync="dialogAddVisible">
      <el-form :model="addForm">
        <el-form-item label="原型名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="画布宽度" :label-width="formLabelWidth" >
          <el-input v-model.number="addForm.width" autocomplete="off"
                    oninput="value=value.replace(/\D/g,'')" placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="画布高度" :label-width="formLabelWidth">
          <el-input v-model.number="addForm.height" autocomplete="off"
                    oninput="value=value.replace(/\D/g,'')" placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPrototype">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改原型属性" :visible.sync="dialogChangeVisible">
      <el-form :model="changeForm">
        <el-form-item label="画布宽度" :label-width="formLabelWidth" >
          <el-input v-model.number="changeForm.width" autocomplete="off"
                    oninput="value=value.replace(/\D/g,'')" placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="画布高度" :label-width="formLabelWidth">
          <el-input v-model.number="changeForm.height" autocomplete="off"
                    oninput="value=value.replace(/\D/g,'')" placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePrototypeSize">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import Vue from "vue";
import HeadSide from "@/components/HeadSide";
import axios from "axios";
export default {
  name: "PrototypeView",
  components: {HeadSide},

  data(){
    return{
      changeForm:{
        width:150,
        height:150,
      },
      addForm:{
        name:'',
        width:150,
        height:150,
      },
      asPicture:false,
      formLabelWidth: '80px',
      dialogAddVisible: false,
      dialogChangeVisible:false,
      indexSelected:-1,
      idSelected:-1,
      materialData:[
        {id:0 , name:"图片" , imgURL:require('../assets/PrototypeMaterial/picture.png')},
        {id:1 , name:"地图" , imgURL:require('../assets/PrototypeMaterial/map.jpg')},
        {id:2 , name:"视频" , imgURL:require('../assets/PrototypeMaterial/video.png')},
        {id:3 , name:"二维码" , imgURL:require('../assets/PrototypeMaterial/code.jpg')},
        {id:4 , name:"气泡" , imgURL:require('../assets/PrototypeMaterial/chat.png')},
        {id:5 , name:"开关" , imgURL:require('../assets/PrototypeMaterial/switch.png')},
        {id:6 , name:"箭头" , imgURL:require('../assets/PrototypeMaterial/arrows.png')},
        {id:7 , name:"饼状图" , imgURL:require('../assets/PrototypeMaterial/pieChart.png')},
        {id:8 , name:"按钮" , imgURL:require('../assets/PrototypeMaterial/button.png')},
        {id:9 , name:"便签" , imgURL:require('../assets/PrototypeMaterial/note.png')},
        {id:10 , name:"选符号" , imgURL:require('../assets/PrototypeMaterial/select.png')},
        {id:11 , name:"搜索框" , imgURL:require('../assets/PrototypeMaterial/search.jpg')},
        {id:12 , name:"侧边菜单" , imgURL:require('../assets/PrototypeMaterial/menu.jpg')},
        {id:13 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/code.jpg')},
        {id:14 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/chat.png')},
        {id:15 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/switch.png')},
        {id:16 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/arrows.png')},
        {id:17 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/pieChart.png')},
        {id:18 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/button.png')},
        {id:19 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/note.png')},
        {id:20 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/picture.png')},
        {id:21 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/map.jpg')},
        {id:22 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/video.png')},
        {id:23 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/code.jpg')},
        {id:24 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/chat.png')},
        {id:25 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/switch.png')},
        {id:26 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/arrows.png')},
        {id:27 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/pieChart.png')},
        {id:28 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/button.png')},
        {id:29 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/note.png')},
        {id:30 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/picture.png')},
        {id:31 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/map.jpg')},
        {id:32 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/video.png')},
        {id:33 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/code.jpg')},
        {id:34 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/chat.png')},
        {id:35 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/switch.png')},
        {id:36 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/arrows.png')},
        {id:37 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/pieChart.png')},
        {id:38 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/button.png')},
        {id:39 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/note.png')},
        {id:40 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/location.png')},
        {id:41 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/histogram.png')},
      ],
      prototypeData: [],
      canvasWidth:400,
      canvasHeight:400,
      dataArr:{},
      pictureData:[],
      wholeHeight:0,
      projName:window.localStorage.getItem('pname')
    }

  },
  methods:{
    BackToDesignManage(){
      this.$router.push({
        name:'designManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
    },
    showChangeDialog(elm){
      this.changeForm.width = elm.canvasWidth
      this.changeForm.height = elm.canvasHeight
      this.dialogChangeVisible = true
    },
    changePrototypeSize(){
      const that = this
      let dataPost = new FormData()
      dataPost.append('prototypeID',that.idSelected)
      dataPost.append('width' , that.changeForm.width)
      dataPost.append('height',that.changeForm.height)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/prototype/canvas/resize",dataPost , config).then( res => {
        console.log(res.data)
        if( res.status  === 200){
          console.log(that.indexSelected)
          const prototypeContent = that.prototypeData[that.indexSelected]
          console.log(prototypeContent)
          prototypeContent.canvasWidth = that.changeForm.width
          prototypeContent.canvasHight = that.changeForm.height
          this.prototypeData.splice(that.indexSelected , 1 , prototypeContent)
          console.log(that.indexSelected , that.idSelected)
          that.dialogChangeVisible = false
          that.dataArr.canvas.setWidth(that.changeForm.width)
          that.dataArr.canvas.setHeight(that.changeForm.height)
        }

      })

    },
    addPrototype(){
      const that = this
      let dataPost = new FormData()
      dataPost.append("userID", window.localStorage.getItem('uid'))
      dataPost.append("projectID", this.$route.params.pid)
      dataPost.append("prototypeName",that.addForm.name)
      dataPost.append("canvas_Width", that.addForm.width.toString())
      dataPost.append("canvas_Height" , that.addForm.height.toString())
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/prototype/add", dataPost , config).then( res => {
        console.log(res)
        that.dialogAddVisible = false
        const newPrototype = {name: that.addForm.name , canvasWidth: that.addForm.width , canvasHeight: that.addForm.height ,
          ID:res.data.id , content: ''}
        that.prototypeData.push(newPrototype)
        that.changeCanvas(newPrototype,that.prototypeData.length -1)
      })

    },
    addMaterial(index){
      console.log(this.dataArr.canvas.toJSON())
      console.log(document.getElementsByName("temp"))
      new fabric.Image.fromURL( this.materialData[index].imgURL, img => {
        this.dataArr.canvas.add(img.scaleToWidth(40)).renderAll()
      }, {crossOrigin: 'anonymous'})

    },
    changeCanvas(elm , index){
      console.log(elm.ID)
      console.log(this.idSelected)
      this.indexSelected = index
      this.idSelected = elm.ID

      this.dataArr.canvas.clear()
      this.dataArr.canvas.setWidth(elm.canvasWidth)
      this.dataArr.canvas.setHeight(elm.canvasHeight)
      const  json = JSON.stringify(this.dataArr.canvas.toJSON())
      console.log(json)
      this.dataArr.canvas.loadFromJSON(elm.content)
      this.dataArr.canvas.renderAll()
      console.log(this.indexSelected , this.idSelected)
    },
    allTo(pd){
      const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

      const repeatDownload = async () => {
        for (let i = 0; i < this.prototypeData.length; i++) {
          this.changeCanvas(this.prototypeData[i] , i)
          await sleep(500)
          this.toPic(pd)
          await sleep(500)
        }
      }
      repeatDownload()
    },
    init(){
      console.log(this.idSelected)
      this.addForm.name = '新建原型实例'
      Vue.set( this.dataArr , 'canvas' , new fabric.Canvas('c' , {
        includeDefaultValues: false }))
      this.dataArr.canvas.on('object:moving', (e) => {
        // 阻止对象移动到画布外面
        let padding = 10; // 内容距离画布的空白宽度，主动设置
        var obj = e.target;
        if (obj.currentHeight > obj.canvas.height - padding * 2 ||
            obj.currentWidth > obj.canvas.width - padding * 2) {
          return;
        }
        obj.setCoords();
        if (obj.getBoundingRect().top < padding || obj.getBoundingRect().left < padding) {
          obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top + padding);
          obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left + padding);
        }
        if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height - padding || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width - padding) {
          obj.top = Math.min(
              obj.top,
              obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top - padding
          );
          obj.left = Math.min(
              obj.left,
              obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left - padding
          );
        }
      });
      let dataPost = new FormData()
      dataPost.append("userID", window.localStorage.getItem('uid'))
      dataPost.append("projectID", this.$route.params.pid)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      const that = this
      //axios.post('http://43.138.21.64:8080/prototype/get', dataPost , config).then( res => {
      //  console.log(res)
      //  if(res.status === 200){
      //    console.log(res.data.message.prototype)
      //    that.prototypeData = res.data.message.prototype.results
      //  }
      //})
      axios.post('http://43.138.21.64:8080/doc/get/all', dataPost , config).then( res => {
        console.log(res)
        if(res.status === 200){
          console.log(res.data.message.prototype)
          that.prototypeData = res.data.message.prototype.results || []
        }
      })
    },
    deletePrototype(index){
      const that = this
      let dataPost = new FormData()
      //dataPost.append("userID", 10)
      dataPost.append("docID", index)
      dataPost.append("userID", window.localStorage.getItem('uid'))
      dataPost.append("docType", 1)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/doc/remove/one",dataPost,config).then( res => {
        if( res.status  === 200){
          console.log(res)
          that.prototypeData = that.prototypeData.filter(ele =>{
            return ele.ID !== index
          })
          console.log(that.prototypeData)
          that.idSelected = -1
          that.indexSelected = -1
        }

      })

    },
    deleteEle(){
      this.dataArr.canvas.remove(this.dataArr.canvas.getActiveObject())
      this.dataArr.canvas.renderAll()
    },
    toPic(pd){
      //this.changeCanvas(this.prototypeData[2] , 2)
      //setTimeout(() => {
      const rect2 = new fabric.Rect({
        top: 0, // 距离容器顶部 30px
        left: 0, // 距离容器左侧 30px
        width: this.dataArr.canvas.width, // 宽 100px
        height: this.dataArr.canvas.height, // 高 60px
        fill: 'white', // 填充 红色
      })
      this.dataArr.canvas.add(rect2)
      this.dataArr.canvas.sendToBack(rect2)
        const blob = this.dataArr.canvas.toDataURL();
        const pika = document.createElement("a");
        pika.href = blob;
        if(pd === 1) pika.download = this.prototypeData[this.indexSelected].name+".png"
        else pika.download = this.prototypeData[this.indexSelected].name+".jpg"
        pika.click();
      //}, 1);
    },
    copy(){
      const  json = JSON.stringify(this.dataArr.canvas.toJSON())
      console.log(json)
      this.dataArr.canvas2.loadFromJSON(json)
    },
    clear(){
      this.dataArr.canvas.clear()
    },
    save(){
      const that = this
      const  json = JSON.stringify(that.dataArr.canvas.toJSON())
      console.log(that.indexSelected)
      console.log(json)
      let dataPost = new FormData()
      //dataPost.append("userID", 10)
      dataPost.append("userID", window.localStorage.getItem('uid'))
      dataPost.append("docID", that.idSelected)
      dataPost.append("docType", 1)
      dataPost.append("content", json)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/doc/update",dataPost , config).then( res => {
        console.log(res)
        const prototypeContent = that.prototypeData[that.indexSelected]
        prototypeContent.content = json
        that.prototypeData.splice(that.indexSelected , 1 , prototypeContent)
        console.log(that.prototypeData[that.indexSelected].content)
      })

    }
  },
  mounted() {
    document.body.style.backgroundColor="#4A4E50";
    this.wholeHeight=document.documentElement.scrollHeight-50+'px';
    console.log(this.wholeHeight);
    this.init()
  },
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
#buttonAdd{
  width: 100%;
  height:40px;
  float: left;
  margin-top: -20px;
  background-color: #333333;
  color: #FFFFFF;
  border-radius: 0;
  border-color: transparent;
}
#buttonAdd:hover{
  background-color:#fe686c;
}
#workPanel{
  height: 20%;
  padding: 10px;
  border-radius: 15px;
  border: #42b983 solid 2px;
  margin: 3px;
}
.material{
  width: 100px;
  height: 50px;
  line-height: 50px;
  border: whitesmoke solid 1px;
  display: inline-block;
  text-align: center;
  color: #FFFFFF;
}
.material:hover{
  background-color: lightskyblue;
}
#materialPanel{
  height: 100%;
  width: 100%;
  padding: 0;
  overflow-y: scroll;
  border: black  1px;
}
#right{
  width: 21%;
  height: 100%;
  display: inline-block;
  float: right;
  margin-top: -10px;
  vertical-align: top;
  background-color: #404446;
}
#menu{
  height: 60px;
  border: #42b983 2px ;
  text-align: center;
  padding-top: 20px;
}
#work{
  width: 58%;

  height: 700px;
  border: black  1px;
  display: inline-block;
  position: absolute;
  left: 21%;
  top:50px;
  overflow: scroll;

  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;

}
#left{
  background-color: #404446;
  width: 21%;

  border: black  1px;
  position: absolute;
  left:0;
  top:50px;


}
#list{
  height: 100%;
  margin-top: -40px;
  overflow-y: scroll;
}
.classSelected{
  background-color: #F2595D;
}
.classSelected i{
  display:inline-block;
}
.prototypeList{
  list-style: none;
  line-height:50px;
  height: 50px;
  border-bottom: black solid 1px;
  width: 100%;
  color: #FFFFFF;
  background-color: #383838;
  font-family: Inter, "Segoe UI", 黑体;
}
.prototypeList:hover{
  background-color: #F79B9D;
}
.prototypeList i{
  display:none;
}
canvas{
  background-color: #fff;
  border: transparent;
  top: 50%;
  left: 50%;

}
.prototypeList i{
  display:none;
}
.classSelected i{
  display:inline-block;
}
#back :hover{
  background-color: grey;
}
.title{
  background-color: #2C2C2C;
  border-top: 1px solid rgba(236,236,236,0.4);
  height: 50px;
  width: 100%;
}
.backlogo{
  margin-top: 12px;
  margin-left: 30px;
  float: left;
  width: 25px;
  height:25px;
}
.plusElement{
  position: absolute;
  top:0;
  left: 350px;
  height: 50px;
  width: 500px;
}
.show-picture{

  z-index: 10000;
  width:130px;
  height: 100px;
  left:338px;
  top:54px;
  position: absolute;
  background-color: white;
  border: none;
  overflow: auto;
  border-radius: 1%;
  box-shadow: 0px 0px 9px rgba(0,0,0,0.2);
}
.picture-btn{
  width: 100%;
  height: 36px;
  padding-top: 12px;
  cursor: pointer;
  font-size: 16px;
  font-family: Inter, "Segoe UI", 黑体;
}
.picture-btn:hover{
  background-color: rgba(200,200,200,0.8);
}
</style>
