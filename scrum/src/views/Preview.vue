<template>
  <div>
    <el-empty description="页面内容不可见！！！" v-show="!visable" id="pic"></el-empty>

    <div class="preview" v-show="visable">
      <i class="el-icon-arrow-left" style="padding: 5px" id="left" title="浏览之后页面" @click.stop="minus"></i>
      <i class="el-icon-arrow-right" style="padding: 5px" id="right"  title="浏览之前页面" @click.stop="add"></i>
      <PrevStage :page="prototypes[pageindex]"></PrevStage>
    </div>

  </div>
</template>


<script>

import PrevStage from "@/components/preview/PrevStage";
import axios from "axios";
import newPage from '@/Factory/pageFactory'

export default {
  name: 'previewView',
  components: { PrevStage },
  data: function () {
    return {
      visable:false,
      pageindex:0,
      prototypes:[],
    }
  },
  computed: {
    previewStyle () {
      return {height: '100%', width: '100%'}
    },

  },
  methods: {
    init(){
      const that = this

      let dataPost = new FormData()
      dataPost.append('userID', window.localStorage.getItem('uid'))
      dataPost.append('projectID', this.$route.params.pid)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
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
              that.prototypes.push(pageTemp)
            }
            else that.prototypes.push(JSON.parse(dataArr[i].content))
          }
          console.log(this.prototypes)
        }
      })
      let dataPost2 = new FormData()
      dataPost2.append('projectID', that.$route.params.pid);
      let config2 ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/project/preview/get",dataPost2 , config2).then( res => {
        console.log(res)
        that.visable = res.data.preview

        console.log(that.visable)
        //const prototypeContent = that.prototypeData[that.indexSelected]
        //prototypeContent.content = json
        //that.prototypeData.splice(that.indexSelected , 1 , prototypeContent)
        //console.log(that.prototypeData[that.indexSelected].content)
      })

    },
    add(){
      if(this.pageindex < this.prototypes.length - 1) this.pageindex = this.pageindex + 1
      else this.$message("已经到头了")
      console.log(this.pageindex)
    },
    minus(){
      if(this.pageindex > 0) this.pageindex = this.pageindex - 1
      else this.$message("已经到头了")
      console.log(this.pageindex)
    }
  },
  mounted() {
    this.init()
  }
}
</script>


<style scoped>
.preview__wrapper {
  margin: auto;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.preview {
  height: 100%;
  width: 100%;
  overflow: scroll;


}

.action-bar__wrapper {
  height: 48px;
  z-index: 1000;
  bottom: 24px;
  right: 24px;
  padding: 0 6px;
  position: fixed;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.78);
  border-radius: 50px;
  opacity: 0.25;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-bar__wrapper:hover {
  opacity: 1;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 0 6px;
  border-radius: 100%;

  background-color: transparent;
  border: 0px none;
  user-select: none;
  outline: none;
}
.action-btn:hover {
  background-color: rgba(238, 238, 238, 0.038);
}
.action-btn:active {
  background-color: rgba(238, 238, 238, 0.38);
}
.action-btn * {
  vertical-align: middle;
}

.separator {
  width: 1px;
  height: 16px;
  margin: 0 6px;
  background-color: rgba(255, 255, 255, 0.21);
}

.mdc-menu-item {
  max-width: 250px;
}

#left{
  float: left;
  position:absolute;
  top:300px;
  left:0
}
#right{
  float: right;
  position:absolute;
  top:300px;
  right: 10px;
}
#pic{
  position: absolute;
  top:30%;
  left: 45%;
}
</style>
