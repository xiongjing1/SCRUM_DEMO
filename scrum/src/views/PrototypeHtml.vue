<template>
  <div>
    <div id="diva">
      <HeadSide></HeadSide>
      <div class="plusElement">
        <img src="../assets/PrototypeMaterial/aspicture.png" height="25px"   v-on:click="asPicture=!asPicture" class="backlogo"  title="导出图片">
        <img src="../assets/PrototypeMaterial/delete.png" height="25px"   class="backlogo"  title="删除选中元素">
        <img src="../assets/PrototypeMaterial/clear.png" height="23px"    class="backlogo"  title="清空页面">
        <img src="../assets/PrototypeMaterial/save.png" height="23px"    class="backlogo"  title="保存当前修改">
      </div>
      <div class="show-picture" v-if="asPicture">
        <div class="picture-btn">jpg格式</div>
        <div class="picture-btn" >png格式</div>
      </div>
      <div id="left" >
        <div class="title">
          <img src="../assets/PrototypeMaterial/back.png" height="25px" class="backlogo"  alt="">
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
          <ul style="padding: 0; width: 100%; height:400px ; margin: 0 ">
            <li v-for="(el,index) in pages" :class="{classSelected:idSelected===el.id}"
                :key="index" class="prototypeList"  @click="changeCanvas(el,index)">{{el.name}}
              <i class="el-icon-edit" style="padding: 5px"  title="修改页面大小" @click.stop="showChangeDialog(el)"></i>
              <i class="el-icon-delete-solid" title="放入回收站"  @click.stop="dialogDeleteVisible = true"></i>
            </li>
          </ul>
          <el-empty description="还没有创建原型实例"  v-show="pages.length===0" :image-size="200"></el-empty>
        </div>
      </div>

      <main id="main" role="main" >
        <mainEgg :pageselect="selectedPage"></mainEgg>
      </main>
      <drawEgg></drawEgg>

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
      <el-dialog
          title="提示"
          :visible.sync="dialogDeleteVisible"
          width="30%"
          >
        <span>确认删除此原型实例？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogDeleteVisible = false">取 消</el-button>
    <el-button type="primary" @click="deletePrototype">确 定</el-button>
  </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import HeadSide from "@/components/HeadSide";
import newPage from '@/Factory/pageFactory'
import DrawEgg from "@/components/drawer";
import MainEgg from '@/components/main';
import { setElId, } from '@/helpers/recursiveMethods'

export default {
  name: "PrototypeHtml",
  components: {DrawEgg, HeadSide,MainEgg,},

  data(){
    return{
      pages:[newPage('新建原型实例' , 500 , 500) , newPage('新建原型实例2' , 400 , 300)],
      selectedPage:null,
      selectedElements:[],


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
      dialogDeleteVisible:false,
      dialogAddVisible: false,
      dialogChangeVisible:false,
      indexSelected:-1,
      idSelected:null,
      prototypeData: [],
      canvasWidth:400,
      canvasHeight:400,
      dataArr:{},
      pictureData:[],
      wholeHeight:0,
      projName:window.localStorage.getItem('pname'),
      arr:[{id:1 , name:"2222"} , {id:2 , name:"3333"}]
    }
  },
  methods:{
    addPrototype() {
      this.dialogAddVisible = false
      let page = newPage(this.addForm.name , this.addForm.height,this.addForm.width)
      this.pages.push(page)
      //todo
    },
    changeCanvas(elm, index) {
      this.indexSelected = index
      this.idSelected = elm.id
      this.selectedPage = this.pages[index]
    },
    showChangeDialog(elm){
      this.changeForm.width = elm.width
      this.changeForm.height = elm.height
      this.dialogChangeVisible = true
    },
    changePrototypeSize(){
      //console.log(that.indexSelected)
      //const prototypeContent = that.prototypeData[that.indexSelected]
      //console.log(prototypeContent)
      this.dialogChangeVisible = false
      this.selectedPage.width = this.changeForm.width
      this.selectedPage.height = this.changeForm.height
      //todo
    },
    deletePrototype(){
      this.dialogDeleteVisible = false
      this.pages = this.pages.filter(ele =>{
        return ele.id !== this.idSelected
      })
      this.idSelected = null
      this.indexSelected = -1
      //todo
    },

    addElement(elm){
      let egglement = setElId(elm, this.selectedPage.pageId)
      //this.$store.commit('set' , egglement)
      this.selectedPage.children.push(egglement)
    },
    deleteElement(elm){
      let eggIndex = this.selectedPage.children.findIndex(egg => egg.id === elm.elId)
      this.selectedPage.children.splice(eggIndex, 1)
      this.$store.commit('clear')
    }


  },
  mounted() {
    this.$bus.$on("addElement" , this.addElement)
    this.$bus.$on("deleteElement" , this.deleteElement)
  }
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
  width: 30%;
  height: 100%;
  display: inline-block;
  float: right;
  margin-top: -10px;
  vertical-align: top;
  background-color: #404446;
  padding: 0;
}
#menu{
  height: 60px;
  border: #42b983 2px ;
  text-align: center;
  padding-top: 20px;
}
#work{
  width: 49%;

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
