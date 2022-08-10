<template>
  <div>
    <div id="diva">
      <HeadSide></HeadSide>
      <div class="plusElement">
        <img src="../assets/PrototypeMaterial/back.png" height="25px" @click="BackToDesignManage" class="backlogo"  alt="">
        <img src="../assets/PrototypeMaterial/aspicture.png" height="25px"   v-on:click="asPicture=!asPicture" class="backlogo"  title="导出图片">
        <img src="../assets/PrototypeMaterial/delete.png" height="25px"   class="backlogo"  title="删除选中元素">
        <img src="../assets/PrototypeMaterial/clear.png" height="23px"    class="backlogo"  title="清空页面" >
        <img src="../assets/PrototypeMaterial/save.png" height="23px"    class="backlogo"  title="保存当前修改" @click="save">
      </div>
      <div class="show-picture" v-if="asPicture">
        <div class="picture-btn" @click="allTo(0)">导出为jpg</div>
        <div class="picture-btn" @click="allTo(1)">导出为png</div>
      </div>

      <div id="left" >
        <div class="title">

          <div style="width:200px;height: 40px; color: #FFFFFF; font-size: 16px; letter-spacing: 2px;margin-top: 13px">
            {{ projName }}</div>
        </div>
        <div id="menu" >
          <el-button  id="buttonAdd" @click="dialogAddVisible = true" icon="el-icon-plus">添加页面</el-button>
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
      <div id="main" role="main" v-if="selectedPage"  ref = "picArea">
        <mainEgg :pageselect="selectedPage" ></mainEgg>
      </div>
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
import FileSaver from "file-saver"
import html2canvas from "html2canvas"
import HeadSide from "@/components/HeadSide";
import newPage from '@/Factory/pageFactory'
import Drawegg from '@/components/drawer'
import MainEgg from '@/components/main';
import '@/assets/icons/system/elements/'
import {setElId} from "@/helpers/recursiveMethods";
import axios from "axios";
import JSZip from "jszip";
export default {
  name: "PrototypeHtml",
  components: { Drawegg , HeadSide,MainEgg,},

  data(){
    return{
      pages:[newPage(1 , 'aaa' , 500 , 500)],
      model3:JSON.parse("{\"id\":\"ByeOkqle0c\",\"name\":\"个人主页\",\"path\":\"/\",\"width\":\"1200\",\"height\":\"680\",\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"rgb(234, 224, 213)\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":22,\"left\":43,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":615,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"10px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":43,\"left\":78,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":133,\"height\":124,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(94, 80, 63)\",\"border-radius\":\"50px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":43,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Avatar\",\"egglement\":true,\"width\":133,\"height\":35,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"text-align\":\"center\",\"background-color\":\"rgba(255, 255, 255, 0)\",\"font-size\":\"29px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"ByeOkqle0c.rkJQ5xeA5.Sky55exAq.SkDysgeAq\",\"children\":[]}],\"id\":\"ByeOkqle0c.rkJQ5xeA5.Sky55exAq\"},{\"zIndex\":\"auto\",\"top\":181,\"left\":88,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Username\",\"egglement\":true,\"width\":150,\"height\":30,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"24px\"},\"classes\":{},\"id\":\"ByeOkqle0c.rkJQ5xeA5.rkefiee05\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":240,\"left\":33,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":223,\"height\":26,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(198, 172, 143)\"},\"children\":[],\"id\":\"ByeOkqle0c.rkJQ5xeA5.rkt4jxxRc\"},{\"zIndex\":\"auto\",\"top\":292,\"left\":32,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":223,\"height\":26,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(198, 172, 143)\"},\"children\":[],\"id\":\"ByeOkqle0c.rkJQ5xeA5.SkArsgx0c\"},{\"zIndex\":\"auto\",\"top\":346,\"left\":32,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":223,\"height\":26,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(198, 172, 143)\"},\"children\":[],\"id\":\"ByeOkqle0c.rkJQ5xeA5.Skw8oelC5\"},{\"zIndex\":\"auto\",\"top\":403,\"left\":32,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":223,\"height\":26,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(198, 172, 143)\"},\"children\":[],\"id\":\"ByeOkqle0c.rkJQ5xeA5.Sy9UieeRc\"},{\"zIndex\":\"auto\",\"top\":459,\"left\":32,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":223,\"height\":26,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(198, 172, 143)\"},\"children\":[],\"id\":\"ByeOkqle0c.rkJQ5xeA5.Bk3Lsll09\"}],\"id\":\"ByeOkqle0c.rkJQ5xeA5\"},{\"zIndex\":\"auto\",\"top\":22,\"left\":380,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":750,\"height\":151,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"8px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":22,\"left\":47,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"title1\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.BJQhoxxCc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":55,\"left\":36,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":10,\"egglement\":true,\"width\":75,\"height\":64,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"54px\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.Hk96sxlR9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":22,\"left\":225,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"title1\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.SJrk3xgC9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":22,\"left\":381,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"title1\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.Bk6JnxgA9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":22,\"left\":552,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"title1\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.rylgnelC5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":55,\"left\":219,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":10,\"egglement\":true,\"width\":75,\"height\":64,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"54px\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.Hkwb2xeRc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":55,\"left\":375,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":10,\"egglement\":true,\"width\":75,\"height\":64,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"54px\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.SJY-3lgR9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":55,\"left\":547,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":10,\"egglement\":true,\"width\":75,\"height\":64,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"54px\"},\"classes\":{},\"id\":\"ByeOkqle0c.HJ3SqelCq.B1nZhel09\",\"children\":[]}],\"id\":\"ByeOkqle0c.HJ3SqelCq\"},{\"zIndex\":\"auto\",\"top\":193,\"left\":382,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":749,\"height\":442,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"34px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":37,\"left\":38,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":665,\"height\":70,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(234, 224, 213)\"},\"children\":[],\"id\":\"ByeOkqle0c.SJpP9xxRc.Bk9E3xeCc\"},{\"zIndex\":\"auto\",\"top\":138,\"left\":38,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":665,\"height\":70,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(234, 224, 213)\"},\"children\":[],\"id\":\"ByeOkqle0c.SJpP9xxRc.HJSL3lxAc\"},{\"zIndex\":\"auto\",\"top\":239,\"left\":38,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":665,\"height\":70,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(234, 224, 213)\"},\"children\":[],\"id\":\"ByeOkqle0c.SJpP9xxRc.HJ_UnggR5\"},{\"zIndex\":\"auto\",\"top\":335,\"left\":38,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":665,\"height\":70,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(234, 224, 213)\"},\"children\":[],\"id\":\"ByeOkqle0c.SJpP9xxRc.BybP2leA5\"}],\"id\":\"ByeOkqle0c.SJpP9xxRc\"}]}"),
      model4:JSON.parse("{\"id\":\"HJgA2EqxRq\",\"name\":\"项目管理\",\"path\":\"/\",\"width\":1200,\"height\":680,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"rgb(224, 240, 244)\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":50,\"height\":657,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(3, 4, 94)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":27,\"left\":9,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"image\",\"type\":\"img\",\"egglement\":true,\"width\":32,\"height\":26,\"attrs\":{\"src\":\"/static/vuegg-fam.svg\"},\"styles\":{},\"classes\":{},\"id\":\"HJgA2EqxRq.HyljHqgA9.rJDgI5gA5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":443,\"left\":8,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":31,\"height\":31,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"50px\"},\"children\":[],\"id\":\"HJgA2EqxRq.HyljHqgA9.Bk_G89eRq\"},{\"zIndex\":\"auto\",\"top\":501.5,\"left\":7,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":31,\"height\":31,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"50px\"},\"children\":[],\"id\":\"HJgA2EqxRq.HyljHqgA9.BklS8qx0c\"},{\"zIndex\":\"auto\",\"top\":559,\"left\":6,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":31,\"height\":31,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"50px\"},\"children\":[],\"id\":\"HJgA2EqxRq.HyljHqgA9.rkoSUcx0c\"}],\"id\":\"HJgA2EqxRq.HyljHqgA9\"},{\"zIndex\":\"auto\",\"top\":0,\"left\":50,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":263,\"height\":657,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(0, 119, 182)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":30,\"left\":28,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Dialog\",\"egglement\":true,\"width\":150,\"height\":33,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"24px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.BJ-BD5gA5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":81,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.HyVrDqg09\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":122,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.SyEcvqlR9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":163,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.B1jpu9xC5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":205,\"left\":32,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.SkTwKcgA5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":245,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.B1wdtcxAq\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":285,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.Bk1FtceR5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":322,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.By8YF5lAq\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":362,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.BJqtK9eA9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":402,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.B1AYYclR5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":440,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.S1Z5FqeC5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":478,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.BkH9Y9l05\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":518,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.rk8iYceA9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":562,\"left\":31,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"item\",\"egglement\":true,\"width\":150,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"18px\",\"color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"HJgA2EqxRq.By5hH5eA5.rJcjF9lRq\",\"children\":[]}],\"id\":\"HJgA2EqxRq.By5hH5eA5\"},{\"zIndex\":\"auto\",\"top\":37,\"left\":389,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Project title\",\"egglement\":true,\"width\":296,\"height\":58,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"42px\"},\"classes\":{},\"id\":\"HJgA2EqxRq.B1F0s5x0c\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":127,\"left\":387,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.rycxnqgAq\"},{\"zIndex\":\"auto\",\"top\":128,\"left\":783,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.S1Uf29lC9\"},{\"zIndex\":\"auto\",\"top\":310,\"left\":391,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.HyMQnqxAc\"},{\"zIndex\":\"auto\",\"top\":310,\"left\":391,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.BkKmnqgA5\"},{\"zIndex\":\"auto\",\"top\":310,\"left\":391,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.S1cQhclCc\"},{\"zIndex\":\"auto\",\"top\":310,\"left\":391,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.Skecmn5lC9\"},{\"zIndex\":\"auto\",\"top\":309,\"left\":785,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.BkbqQ35xC5\"},{\"zIndex\":\"auto\",\"top\":488,\"left\":394,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.rJb43clA9\"},{\"zIndex\":\"auto\",\"top\":487,\"left\":786,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":338,\"height\":148,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"0px\",\"border-radius\":\"9px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"HJgA2EqxRq.S1QB2qxCq\"}]}"),
      model5:JSON.parse("{\"id\":\"SJldK-ilC5\",\"name\":\"网站首页\",\"path\":\"/\",\"width\":\"1200\",\"height\":\"680\",\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"rgb(222, 224, 108)\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":29,\"left\":6,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":1155,\"height\":569,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":234,\"left\":37,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":229,\"height\":300,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(148, 156, 129)\"},\"children\":[],\"id\":\"SJldK-ilC5.rJms7sxC9.r1T1rslA9\"},{\"zIndex\":\"auto\",\"top\":235,\"left\":287,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":143,\"height\":154,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(62, 80, 60)\"},\"children\":[],\"id\":\"SJldK-ilC5.rJms7sxC9.rkCbroeAc\"},{\"zIndex\":\"auto\",\"top\":386,\"left\":449,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":143,\"height\":154,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(240, 230, 209)\"},\"children\":[],\"id\":\"SJldK-ilC5.rJms7sxC9.S16XHsgA5\"},{\"zIndex\":\"auto\",\"top\":385,\"left\":607,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":143,\"height\":154,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(238, 156, 129)\"},\"children\":[],\"id\":\"SJldK-ilC5.rJms7sxC9.H1lrHslC9\"},{\"zIndex\":\"auto\",\"top\":385,\"left\":844,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":143,\"height\":154,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(148, 156, 129)\"},\"children\":[],\"id\":\"SJldK-ilC5.rJms7sxC9.r1H8SjxRc\"},{\"zIndex\":\"auto\",\"top\":219,\"left\":994,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":143,\"height\":154,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(239, 193, 169)\"},\"children\":[],\"id\":\"SJldK-ilC5.rJms7sxC9.ry5PrsxRq\"},{\"zIndex\":\"auto\",\"top\":78,\"left\":92,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"ABOUT\",\"egglement\":true,\"width\":349,\"height\":92,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"87px\",\"font-family\":\"Arial, Helvetica, sans-serif\",\"font-weight\":\"bold\"},\"classes\":{},\"id\":\"SJldK-ilC5.rJms7sxC9.r1EFSsgC9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":118,\"left\":491,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"KOUROS\",\"egglement\":true,\"width\":470,\"height\":106,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"98px\",\"font-family\":\"Arial, Helvetica, sans-serif\",\"font-weight\":\"bold\"},\"classes\":{},\"id\":\"SJldK-ilC5.rJms7sxC9.S1W6rjxCc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":232,\"left\":504,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"The above ph\",\"egglement\":true,\"width\":414,\"height\":76,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"SJldK-ilC5.rJms7sxC9.rkuN8slAq\",\"children\":[]}],\"id\":\"SJldK-ilC5.rJms7sxC9\"}]}"),
      model6:JSON.parse("{\"id\":\"ryxGvvilR5\",\"name\":\"注册页面\",\"path\":\"/\",\"width\":1200,\"height\":680,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":1165,\"height\":60,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-bottom-width\":\"2px\",\"border-top-width\":\"0px\",\"border-left-width\":\"0px\",\"border-right-width\":\"0px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":12,\"left\":14,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"LOGO\",\"egglement\":true,\"width\":150,\"height\":35,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-weight\":\"bold\",\"font-size\":\"29px\",\"color\":\"rgb(44, 103, 255)\"},\"classes\":{},\"id\":\"ryxGvvilR5.BkXjjogRq.SksJ3sxRq\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":6,\"left\":800,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"select\",\"type\":\"select\",\"egglement\":true,\"wrappegg\":true,\"width\":95,\"height\":40,\"attrs\":{},\"styles\":{\"border-width\":\"0px\"},\"classes\":{},\"children\":[{\"type\":\"option\",\"text\":\"Option 1\",\"attrs\":{},\"styles\":{},\"classes\":{},\"id\":\"ryxGvvilR5.BkXjjogRq.Hk_m3ieRc.S1lO7noxC5\",\"children\":[]},{\"type\":\"option\",\"text\":\"Option 2\",\"attrs\":{},\"styles\":{},\"classes\":{},\"id\":\"ryxGvvilR5.BkXjjogRq.Hk_m3ieRc.HyZdQ3ol05\",\"children\":[]},{\"type\":\"option\",\"text\":\"Option 3\",\"attrs\":{},\"styles\":{},\"classes\":{},\"id\":\"ryxGvvilR5.BkXjjogRq.Hk_m3ieRc.BJzu7hogRc\",\"children\":[]}],\"id\":\"ryxGvvilR5.BkXjjogRq.Hk_m3ieRc\"},{\"zIndex\":\"auto\",\"top\":16,\"left\":928,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Sign In\",\"egglement\":true,\"width\":66,\"height\":25,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"20px\"},\"classes\":{},\"id\":\"ryxGvvilR5.BkXjjogRq.HyuunixA5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":9,\"left\":1021,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Sign Up\",\"egglement\":true,\"width\":127,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"border-radius\":\"4px\",\"border-width\":\"0px\",\"color\":\"rgb(255, 255, 255)\",\"background-color\":\"rgb(44, 103, 255)\",\"font-size\":\"20px\"},\"classes\":{},\"id\":\"ryxGvvilR5.BkXjjogRq.S1dhnjx09\",\"children\":[]}],\"id\":\"ryxGvvilR5.BkXjjogRq\"},{\"zIndex\":\"auto\",\"top\":58,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"input\",\"type\":\"input\",\"egglement\":true,\"width\":1165,\"height\":50,\"attrs\":{\"value\":\"\",\"placeholder\":\"Search with colors , topics , styles and ...\",\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"styles\":{\"border-width\":\"0px\",\"border-bottom-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\",\"border-color\":\"rgb(233, 233, 233)\"},\"classes\":{},\"id\":\"ryxGvvilR5.rkF62jxR5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":167,\"left\":273,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Trending Color Palettes\",\"egglement\":true,\"width\":712,\"height\":76,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-family\":\"Geneva, Tahoma, sans-serif\",\"font-size\":\"56px\",\"font-weight\":\"bold\"},\"classes\":{},\"id\":\"ryxGvvilR5.ByrNTilAq\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":251,\"left\":414,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"The above photo is something that happens every day at the nursery. We have trash cans at the nursery by the parking lot.  \",\"egglement\":true,\"width\":412,\"height\":68,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"text-align\":\"center\",\"background-color\":\"rgba(255, 255, 255, 0)\",\"color\":\"rgb(100, 100, 100)\",\"border-color\":\"rgb(153, 153, 153)\"},\"classes\":{},\"id\":\"ryxGvvilR5.Hy5npjgCq\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":365,\"left\":36,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":316,\"height\":181,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"8px\"},\"children\":[],\"id\":\"ryxGvvilR5.rys1RoxR9\"},{\"zIndex\":\"auto\",\"top\":365,\"left\":433,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":316,\"height\":181,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"8px\"},\"children\":[],\"id\":\"ryxGvvilR5.H1ybCjlCc\"},{\"zIndex\":\"auto\",\"top\":363,\"left\":827,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":316,\"height\":181,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"8px\"},\"children\":[],\"id\":\"ryxGvvilR5.HyXZAilAc\"}]}"),

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
      dataArr:{},


      projName:window.localStorage.getItem('pname'),
      imgArr:[]
    }
  },

  methods:{
    toPic(type) {
      html2canvas(this.$refs.picArea).then(canvas => {
        // 转成图片，生成图片地址
        let imgUrl = (type === 0 ? canvas.toDataURL("image/jpg") : canvas.toDataURL("image/png"))
        this.imgArr.push({url : imgUrl.toString() , id :this.selectedPage.name})
      });
    },
    allTo(type){
      console.log(this.pages.length)
      const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

      const repeatAdd = async () => {
        for (let i = 0; i < this.pages.length; i++) {
          this.changeCanvas(this.pages[i] , i)
          await sleep(500)
          this.toPic(type)
          await sleep(500)
        }
        await sleep(2000)
        this.atchDownload()
      }
      repeatAdd(type)
      this.imgArr = []
    },
    getImgArrayBuffer(url) {
      console.log('---------------')
      return new Promise((resolve, reject) => {
        //通过请求获取文件blob格式
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.responseType = "blob";
        xmlhttp.onload = function () {
          if (this.status == 200) {
            console.log(url)
            resolve(this.response);
          } else {
            console.log('reject')
            reject(this.status);
          }
        };
        xmlhttp.send();
      });
    },
    atchDownload(type) {
      // this.images 是要下载的图片数组  [{url: 图片地址, id: 图片名称}]
      // 定时器 loading
      this.loading = true;
      this.setTimeout = setTimeout(() => {
        this.loading = false;
      }, 500);
      let _this = this;
      let zip = new JSZip();
      let cache = {};
      let promises = [];
      console.log('12121211221212212')
      for (let item of this.imgArr) {
        const promise = _this.getImgArrayBuffer(item.url).then((data) => {
          // 下载文件, 并存成ArrayBuffer对象(blob)
          if(type === 0) zip.file(item.id + ".jpg", data, { binary: true })
          else zip.file(item.id + ".png", data, { binary: true })
          //zip.file(item.id + ".png", data, { binary: true }); // 逐个添加文件
          cache[item.id] = data;
        });
        promises.push(promise);
      }

      Promise.all(promises)
          .then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
              //_this.$message("正在压缩，请稍后！");
              // 生成二进制流
              FileSaver.saveAs(content, _this.projName); // 利用file-saver保存文件  自定义文件名
              _this.$message("压缩完成！");
            });
          })
          .catch((res) => {
            console.log(res);
          });
    },
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
      //let config ={
      //  headers: {'Content-Type': 'multipart/form-data'}
     // }
     // const that = this
      //axios.post('http://43.138.21.64:8080/prototype/get', dataPost , config).then( res => {
      //  console.log(res)
      //  if(res.status === 200){
      //    console.log(res.data.message.prototype)
      //    that.prototypeData = res.data.message.prototype.results
      //  }
      //})
      //axios.post('http://43.138.21.64:8080/doc/get/all', dataPost , config).then( res => {
      //  console.log(res)
      //  if(res.status === 200){
      //    console.log(res.data.message.prototype.results)
      //    let dataArr = res.data.message.prototype.results.filter(ele =>{
      //      return ele.isRecycled === false
      //    }) || []
      //    for (var i=0;i<dataArr.length;i++)
      //    {
       //     if(dataArr[i].content === null) {
      //        const pageTemp = newPage(dataArr[i].ID ,dataArr[i].name ,dataArr[i].canvasHeight ,dataArr[i].canvasWidth)
      //        this.pages.push(pageTemp)
      //      }
      //      else this.pages.push(JSON.parse(dataArr[i].content))
      //    }
      //    console.log(this.pages)
      //  }
      //})
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
    this.pages.push(this.model3)
    this.pages.push(this.model4)
    this.pages.push(this.model5)
    this.pages.push(this.model6)

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
main{
  width: 100%;
  height: 100%;
}
</style>
