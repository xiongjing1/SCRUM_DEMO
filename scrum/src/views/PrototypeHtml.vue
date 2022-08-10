<template>
  <div>
    <div id="diva">
      <HeadSide></HeadSide>
      <div class="plusElement">
        <img src="../assets/PrototypeMaterial/aspicture.png" height="25px"   v-on:click="asPicture=!asPicture" class="backlogo"  title="导出图片">
        <img src="../assets/PrototypeMaterial/delete.png" height="25px"   class="backlogo"  title="删除选中元素">
        <img src="../assets/PrototypeMaterial/clear.png" height="23px"    class="backlogo"  title="清空页面">
        <img src="../assets/PrototypeMaterial/save.png" height="23px"    class="backlogo"  title="保存当前修改" @click="save">
      </div>
      <div class="show-picture" v-if="asPicture">
        <div class="picture-btn">jpg格式</div>
        <div class="picture-btn" >png格式</div>
      </div>

      <div id="left" >
        <div class="title">
          <img src="../assets/PrototypeMaterial/back.png" height="25px" @click="BackToDesignManage" class="backlogo"  alt="">
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
      <main id="main" role="main" v-if="selectedPage" >
        <mainEgg :pageselect="selectedPage"></mainEgg>
      </main>
      <drawegg></drawegg>

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
import Drawegg from '@/components/drawer'
import MainEgg from '@/components/main';
import '@/assets/icons/system/elements/'
import {setElId} from "@/helpers/recursiveMethods";
import axios from "axios";
export default {
  name: "PrototypeHtml",
  components: { Drawegg , HeadSide,MainEgg,},

  data(){
    return{
      pages:[],

      selectedElements:[],
      selectedPage:null,
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
    BackToDesignManage(){
      this.$router.push({
        name:'designManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
    },
    init(){
      console.log(this.idSelected)
      this.addForm.name = '新建原型实例'

      let dataPost = new FormData()
      dataPost.append('userID', 1)
      dataPost.append('projectID', this.$route.params.pid)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
     // const that = this
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
          console.log(res.data.message.prototype.results)
          let dataArr = res.data.message.prototype.results.filter(ele =>{
            return ele.isRecycled === false
          }) || []
          for (var i=0;i<dataArr.length;i++)
          {
            if(dataArr[i].content === null) {
              const pageTemp = newPage(dataArr[i].ID ,dataArr[i].name ,dataArr[i].canvasHeight ,dataArr[i].canvasWidth)
              this.pages.push(pageTemp)
            }
            else this.pages.push(JSON.parse(dataArr[i].content))
          }
          console.log(this.pages)
        }
      })
    },

    addPrototype() {

      let dataPost = new FormData();
      dataPost.append('userID', 1);
      dataPost.append('projectID', this.$route.params.pid);
      dataPost.append('prototypeName',this.addForm.name);
      dataPost.append('canvas_Width', this.addForm.width.toString());
      dataPost.append('canvas_Height' , this.addForm.height.toString());
      const dataForm = {'userID': 1, 'projectID':this.$route.params.pid ,
        'prototypeName':this.addForm.name,'canvas_Width': this.addForm.width.toString(),'canvas_Height': this.addForm.height.toString()}
      console.log(dataForm)
      const that = this
      console.log(dataPost)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/prototype/add", dataPost , config).then( res => {
        console.log(res)
        that.dialogAddVisible = false
        let page = newPage(res.data.id , this.addForm.name , this.addForm.height,this.addForm.width)
        that.pages.push(page)
        that.changeCanvas(page,that.pages.length -1)
      })
    },
    changeCanvas(elm, index) {
      this.indexSelected = index
      this.idSelected = elm.id
      this.selectedPage = this.pages[index]
      console.log(this.selectedPage.id)
      this.$store.commit('clear')
    },
    showChangeDialog(elm){
      this.changeForm.width = elm.width
      this.changeForm.height = elm.height
      this.dialogChangeVisible = true
    },
    changePrototypeSize(){
      this.dialogChangeVisible = false
      this.selectedPage.width = this.changeForm.width
      this.selectedPage.height = this.changeForm.height
      this.save()

    },
    deletePrototype(){

      //todo
      const that = this
      let dataPost = new FormData()
      //dataPost.append("userID", 10)
      dataPost.append('docID', that.idSelected)
      dataPost.append('userID', 1)
      dataPost.append('docType', 1)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/doc/remove/one",dataPost,config).then( res => {
        if( res.status  === 200){
          console.log(res)

          that.dialogDeleteVisible = false
          that.pages = that.pages.filter(ele =>{
            return ele.id !== that.idSelected
          })
          that.idSelected = null
          that.indexSelected = -1
          that.selectedPage = null
        }

      })
    },
    save(){
      //todo
      const that = this
      const  json = JSON.stringify(that.selectedPage)
      console.log(that.indexSelected)
      console.log(json)
      let dataPost = new FormData()
      //dataPost.append("userID", 10)
      dataPost.append('userID', 1);
      dataPost.append('docID', that.idSelected);
      dataPost.append('docType', 1);
      dataPost.append('content', json);
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/doc/update",dataPost , config).then( res => {
        console.log(res)
        //const prototypeContent = that.prototypeData[that.indexSelected]
        //prototypeContent.content = json
        //that.prototypeData.splice(that.indexSelected , 1 , prototypeContent)
        //console.log(that.prototypeData[that.indexSelected].content)
      })
    },
    addElement(elm){
      let egglement = setElId(elm, this.selectedPage.pageId)
      //this.$store.commit('set' , egglement)
      this.selectedPage.children.push(egglement)
      console.log(egglement)
      console.log(this.selectedPage)

    },
    deleteElement(){
      if(this.$store.state.selectedItem.length){
        let eggIndex = this.selectedPage.children.findIndex(egg => egg.id === this.$store.state.selectedItem[0].elId)
        this.selectedPage.children.splice(eggIndex, 1)
        this.$store.commit('clear')
      }

    },
    updateElement(payload) {
      let eggIndex = this.selectedPage.children.findIndex(egg => egg.id === this.$store.state.selectedItem[0].id)
      //eggIndex = 1
      console.log('vv')
      console.log(eggIndex)
      console.log(this.selectedPage.children[0].id)
      //console.log(this.selectedPage.children[1].id)
      console.log(this.$store.state.selectedItem[0].id)
      console.log(this.selectedPage.children[eggIndex].left)
      console.log(payload)
      if ((typeof payload.left !== 'undefined') && (payload.left !== null)) this.selectedPage.children[eggIndex].left = payload.left
      if ((typeof payload.top !== 'undefined') && (payload.top !== null)) this.selectedPage.children[eggIndex].top = payload.top
      if ((typeof payload.right !== 'undefined') && (payload.right !== null)) this.selectedPage.children[eggIndex].right = payload.right
      if ((typeof payload.bottom !== 'undefined') && (payload.bottom !== null)) this.selectedPage.children[eggIndex].bottom = payload.bottom
      if ((typeof payload.zIndex !== 'undefined') && (payload.zIndex !== null)) this.selectedPage.children[eggIndex].zIndex = payload.zIndex
      if ((typeof payload.height !== 'undefined') && (payload.height !== null)) this.selectedPage.children[eggIndex].height = payload.height
      if ((typeof payload.width !== 'undefined') && (payload.width !== null)) this.selectedPage.children[eggIndex].width = payload.width
      if ((typeof payload.text !== 'undefined') && (payload.text !== null)) this.selectedPage.children[eggIndex].text = payload.text
      if (payload.classes) this.selectedPage.children[eggIndex].classes = payload.classes
      if (payload.styles) this.selectedPage.children[eggIndex].styles = payload.styles
      if (payload.attrs) this.selectedPage.children[eggIndex].attrs = payload.attrs
    },


  },
  mounted() {
    this.$bus.$on("addElement" , this.addElement)
    this.$bus.$on("deleteElement" , this.deleteElement)
    this.$bus.$on("updateElement" , this.updateElement)
    this.init()

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

  height: 100%;
  display: flex;
  float: right;
  z-index: 1005;
  flex-shrink: 0;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
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
  width: 95%;

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
.el-menu__el {
  width: 79px;
  cursor: pointer;
  padding-top: 1em;
  color: rgba(0,0,0,.87);
  text-align: center;
  border-radius: 2px;
  background-color: transparent;
  transition: all 0.20s cubic-bezier(0.4, 0, 0.2, 1);
}
.el-menu__el:hover{
  background-color: rgba(0,0,0,.08);
}
.el-menu__el span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: small;
  padding: 0 8px;
}
</style>
