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
        <div style="width:200px;height: 40px; color: #FFFFFF; font-size: 16px; letter-spacing: 2px;margin-top: 13px">项目名称</div>
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
          <li v-for="(el,index) in prototypeData" :class="{classSelected:idSelected===el.id}"
              :key="el.id" class="prototypeList"  @click="changeCanvas(el,index)">{{el.name}}
            <i class="el-icon-edit" style="padding: 5px" @click.stop="showChangeDialog(el)"></i>
            <i class="el-icon-delete-solid" @click.stop="deletePrototype(el.id)"></i>
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
        {id:10 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/picture.png')},
        {id:11 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/map.jpg')},
        {id:12 , name:"占位符" , imgURL:require('../assets/PrototypeMaterial/video.png')},
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
      prototypeData:[
        {id:0 , name:"prototype1" , content:"{\"version\":\"3.2.0\",\"objects\":[{\"type\":\"rect\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":100,\"height\":200,\"fill\":\"white\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"rx\":0,\"ry\":0},{\"type\":\"image\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":2,\"top\":90,\"width\":234,\"height\":234,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.17,\"scaleY\":0.17,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"crossOrigin\":\"anonymous\",\"cropX\":0,\"cropY\":0,\"src\":\"data:image/png;base64,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\",\"filters\":[]},{\"type\":\"image\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":38,\"top\":52,\"width\":512,\"height\":512,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.08,\"scaleY\":0.08,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"crossOrigin\":\"anonymous\",\"cropX\":0,\"cropY\":0,\"src\":\"data:image/png;base64,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\",\"filters\":[]}]}" , width:100 , height:200},
        {id:1 , name:"prototype2" , content:"{\"version\":\"3.2.0\",\"objects\":[{\"type\":\"rect\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":200,\"height\":200,\"fill\":\"white\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"rx\":0,\"ry\":0},{\"type\":\"image\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":48,\"top\":79,\"width\":512,\"height\":512,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.08,\"scaleY\":0.08,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"crossOrigin\":\"anonymous\",\"cropX\":0,\"cropY\":0,\"src\":\"data:image/png;base64,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\",\"filters\":[]},{\"type\":\"image\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":92,\"top\":17,\"width\":512,\"height\":512,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.08,\"scaleY\":0.08,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"crossOrigin\":\"anonymous\",\"cropX\":0,\"cropY\":0,\"src\":\"data:image/png;base64,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\",\"filters\":[]}]}" , width:200 , height:200},
        {id:2 , name:"prototype3" , content:"{\"version\":\"3.2.0\",\"objects\":[{\"type\":\"image\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":37,\"top\":69,\"width\":1050,\"height\":343,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.04,\"scaleY\":0.04,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"crossOrigin\":\"anonymous\",\"cropX\":0,\"cropY\":0,\"src\":\"http://localhost:8080/img/button.59e99036.png\",\"filters\":[]},{\"type\":\"image\",\"version\":\"3.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":130,\"top\":29,\"width\":327,\"height\":328,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.12,\"scaleY\":0.12,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"crossOrigin\":\"anonymous\",\"cropX\":0,\"cropY\":0,\"src\":\"data:image/png;base64,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\",\"filters\":[]}]}" , width:300 , height:300},
        {id:3 , name:"prototype4" , content:"" , width:400 , height:400},
        {id:4 , name:"prototype5" , content:"" , width:500 , height:500},

      ],
      canvasWidth:400,
      canvasHeight:400,
      dataArr:{},
      pictureData:[],
      wholeHeight:0,
    }

  },
  methods:{
    BackToDesignManage(){
      this.$router.push('/designManage');
    },
    showChangeDialog(elm){
      this.changeForm.width = elm.width
      this.changeForm.height = elm.height
      this.dialogChangeVisible = true
    },
    changePrototypeSize(){
      const prototypeContent = this.prototypeData[this.indexSelected]
      prototypeContent.width = this.changeForm.width
      prototypeContent.height = this.changeForm.height
      this.prototypeData.splice(this.indexSelected , 1 , prototypeContent)
      console.log(this.indexSelected , this.idSelected )
      this.dialogChangeVisible = false
      this.dataArr.canvas.setWidth(this.changeForm.width)
      this.dataArr.canvas.setHeight(this.changeForm.height)
    },
    addPrototype(){
      this.dialogAddVisible = false
      const newPrototype = {name: this.addForm.name , width: this.addForm.width , height: this.addForm.height ,
        id:56 , content: ''}
      this.prototypeData.push(newPrototype)
      this.changeCanvas(newPrototype)
    },
    addMaterial(index){
      console.log(this.dataArr.canvas.toJSON())
      console.log(document.getElementsByName("temp"))
      new fabric.Image.fromURL( this.materialData[index].imgURL, img => {
        this.dataArr.canvas.add(img.scaleToWidth(40)).renderAll()
      }, {crossOrigin: 'anonymous'})

    },
    changeCanvas(elm , index){
      this.indexSelected = index
      this.idSelected = elm.id
      this.dataArr.canvas.clear()
      this.dataArr.canvas.setWidth(elm.width)
      this.dataArr.canvas.setHeight(elm.height)
      const  json = JSON.stringify(this.dataArr.canvas.toJSON())
      console.log(json)
      this.dataArr.canvas.loadFromJSON(elm.content)
      this.dataArr.canvas.renderAll()
      console.log(this.indexSelected , this.idSelected)
    },
    allTo(pd){
      const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

      const repeatDownload = async () => {
        for (let i = 0; i <= 2; i++) {
          this.changeCanvas(this.prototypeData[i] , i)
          await sleep(100)
          this.toPic(pd)
          await sleep(100)
        }
      }
      repeatDownload()
    },
    init(){
      this.addForm.name = '新建原型实例'
      Vue.set( this.dataArr , 'canvas' , new fabric.Canvas('c'))
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
      const rect1 = new fabric.Rect({
        top: 0, // 距离容器顶部 30px
        left: 0, // 距离容器左侧 30px
        width: 600, // 宽 100px
        height: 600, // 高 60px
        fill: 'white', // 填充 红色

      })
      rect1.selectable = false
      // 在canvas画布中加入矩形（rect）。add是“添加”的意思
      this.dataArr.canvas.add(rect1)
    },
    deletePrototype(index){
      this.prototypeData = this.prototypeData.filter(ele =>{
        return ele.id !== index
      })
      console.log(this.prototypeData.length)
      this.idSelected = -1
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
        if(pd === 1) pika.download = this.prototypeData[this.idSelected].name+".png"
        else pika.download = this.prototypeData[this.idSelected].name+".jpg"
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
      const  json = JSON.stringify(this.dataArr.canvas.toJSON())
      const prototypeContent = this.prototypeData[this.indexSelected]
      prototypeContent.content = json
      this.prototypeData.splice(this.indexSelected , 1 , prototypeContent)
      console.log(this.prototypeData[this.indexSelected].content)
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
