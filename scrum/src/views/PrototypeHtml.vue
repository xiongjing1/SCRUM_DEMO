<template>
  <div>
    <div id="diva">
      <HeadSide></HeadSide>
      <div class="plusElement">
        <img src="../assets/PrototypeMaterial/back.png" height="25px" @click="BackToDesignManage" class="backlogo"  alt="">
        <img src="../assets/PrototypeMaterial/aspicture.png" height="25px"   v-on:click="asPicture=!asPicture" class="backlogo"  title="导出图片">
        <img src="../assets/PrototypeMaterial/save.png" height="23px"    class="backlogo"  title="保存当前修改" @click="save">
        <img src="../assets/PrototypeMaterial/delete.png" height="25px"   class="backlogo"  title="生成预览" v-if="this.playing" @click="changePlay(true)">
        <img src="../assets/PrototypeMaterial/save.png" height="23px"    class="backlogo"  title="终止预览" @click="changePlay(false)" v-if="!this.playing">
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
          <el-button  id="buttonImport" @click="dialogImportVisible = true" icon="el-icon-folder-add">导入模板</el-button>
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
      <el-dialog
          title="导入模板"
          :visible.sync="dialogImportVisible"
          width="30%">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogImportVisible = false">取消</el-button>
          <el-button type="primary" @click="importModel(0)">模板1</el-button>
          <el-button type="primary" @click="importModel(1)">模板2</el-button>
          <el-button type="primary" @click="importModel(2)">模板3</el-button>
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
      playing:false,
      dialogImportVisible:false,
      pages:[],
      mmm:JSON.parse("{\"id\":\"SklUSjWb0c\",\"name\":\"Home\",\"path\":\"/\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":147,\"left\":818,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":274,\"height\":517,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":97,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Text\",\"egglement\":true,\"width\":270,\"height\":196,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"57px\"},\"classes\":{},\"id\":\"SklUSjWb0c.ryuYhGbCq.S1z6VmWAc\",\"children\":[]}],\"id\":\"SklUSjWb0c.ryuYhGbCq\"},{\"zIndex\":\"auto\",\"top\":156,\"left\":115,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":325,\"height\":495,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[],\"id\":\"SklUSjWb0c.BkCBpzZ05\"},{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":652,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(18, 157, 254, 0.89)\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5\"},{\"zIndex\":\"auto\",\"top\":42,\"left\":140,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"select\",\"type\":\"select\",\"egglement\":true,\"wrappegg\":true,\"width\":52,\"height\":40,\"attrs\":{},\"styles\":{},\"classes\":{},\"children\":[{\"type\":\"option\",\"text\":\"Option 1\",\"attrs\":{},\"styles\":{},\"classes\":{},\"id\":\"SklUSjWb0c.ByPk07Z09.HkgPyCQZR9\",\"children\":[]},{\"type\":\"option\",\"text\":\"Option 2\",\"attrs\":{},\"styles\":{},\"classes\":{},\"id\":\"SklUSjWb0c.ByPk07Z09.rJZDyCmb09\",\"children\":[]},{\"type\":\"option\",\"text\":\"Option 3\",\"attrs\":{},\"styles\":{},\"classes\":{},\"id\":\"SklUSjWb0c.ByPk07Z09.HJzv1C7b05\",\"children\":[]}],\"id\":\"SklUSjWb0c.ByPk07Z09\"},{\"zIndex\":\"auto\",\"top\":42,\"left\":365,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Search\",\"egglement\":true,\"width\":74,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"SklUSjWb0c.Sy9kAQZCc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":42,\"left\":191,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"input\",\"type\":\"input\",\"egglement\":true,\"width\":176,\"height\":40,\"attrs\":{\"value\":\"\",\"placeholder\":\"\",\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"styles\":{},\"classes\":{},\"id\":\"SklUSjWb0c.HJJx0mWR9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":100,\"left\":163,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"essay\",\"egglement\":true,\"width\":200,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(18, 166, 254)\",\"color\":\"rgb(255, 255, 255)\",\"border-color\":\"rgb(254, 254, 254)\"},\"classes\":{},\"id\":\"SklUSjWb0c.SymF0QWRc\",\"children\":[]}]}"),
      model1:[
        JSON.parse("{\"id\":38,\"name\":\"mooc\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":147,\"left\":818,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":274,\"height\":517,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":97,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Text\",\"egglement\":true,\"width\":270,\"height\":196,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"57px\"},\"classes\":{},\"id\":\"SklUSjWb0c.ryuYhGbCq.S1z6VmWAc\",\"children\":[]}],\"id\":\"SklUSjWb0c.ryuYhGbCq\"},{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":660,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(36, 193, 19, 0.45)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":11,\"left\":13,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":60,\"height\":60,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"30px\",\"background-color\":\"rgb(254, 254, 254)\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.HycgNLZC5\"}],\"id\":\"SklUSjWb0c.H1Le5QWA5\"},{\"zIndex\":\"auto\",\"top\":122,\"left\":196,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":252,\"height\":227,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"50px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q\"},{\"zIndex\":\"auto\",\"top\":6,\"left\":73,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Mooc\",\"egglement\":true,\"width\":200,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(11, 11, 11)\",\"background-color\":\"rgb(250, 250, 250)\"},\"classes\":{},\"id\":\"SklUSjWb0c.SyiCuNW0c\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":493,\"left\":55,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Learning Materials\",\"egglement\":true,\"width\":93,\"height\":52,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(24, 255, 33)\",\"background-color\":\"rgb(250, 250, 250)\"},\"classes\":{},\"id\":\"SklUSjWb0c.H1QftE-R9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":199,\"left\":52,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"University\",\"egglement\":true,\"width\":93,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(24, 255, 33)\",\"background-color\":\"rgb(250, 250, 250)\"},\"classes\":{},\"id\":\"SklUSjWb0c.SyXVYVbAc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":411,\"left\":198,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":252,\"height\":227,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"50px\"},\"children\":[],\"id\":\"SklUSjWb0c.Sy_2YE-Aq\"},{\"zIndex\":\"auto\",\"top\":64,\"left\":20,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"input\",\"type\":\"input\",\"egglement\":true,\"width\":252,\"height\":38,\"attrs\":{\"value\":\"\",\"placeholder\":\"enter to search......\",\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"styles\":{},\"classes\":{},\"id\":\"SklUSjWb0c.Hk6T78ZR5\",\"children\":[]}]}"),
        JSON.parse("{\"id\":40,\"name\":\"CollegePage\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":1,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":84,\"height\":659,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(36, 193, 19, 0.53)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":12,\"left\":8,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":60,\"height\":60,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"30px\",\"background-color\":\"rgb(254, 254, 254)\"},\"children\":[],\"id\":\"rk51RNWR9.Hkm-A4-Cq.B1YTBUbR5\"}],\"id\":\"rk51RNWR9.Hkm-A4-Cq\"},{\"zIndex\":\"auto\",\"top\":25,\"left\":66,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"BUAA\",\"egglement\":true,\"width\":200,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(101, 255, 15)\",\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"rk51RNWR9.SJkQA4-C9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":208,\"left\":52,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Teacher1\",\"egglement\":true,\"width\":94,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"rk51RNWR9.Hy7NAEZAc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":99,\"left\":200,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":244,\"height\":260,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"7px\",\"border-radius\":\"14px\"},\"children\":[],\"id\":\"rk51RNWR9.BJJPAN-R9\"},{\"zIndex\":\"auto\",\"top\":476,\"left\":57,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Teacher2\",\"egglement\":true,\"width\":86,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"rk51RNWR9.HkRDC4bR5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":393,\"left\":197,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":244,\"height\":260,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"7px\",\"border-radius\":\"13px\"},\"children\":[],\"id\":\"rk51RNWR9.HJyKA4ZRq\"}]}"),
        JSON.parse("{\"id\":39,\"name\":\"CoursePage\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":1,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":88,\"height\":659,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(36, 193, 19, 0.53)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":10,\"left\":8,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":60,\"height\":60,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"30px\",\"background-color\":\"rgb(254, 254, 254)\"},\"children\":[],\"id\":\"S1AvhVbC9.SyVc3VWA9.SkFqEIbAq\"}],\"id\":\"S1AvhVbC9.SyVc3VWA9\"},{\"zIndex\":\"auto\",\"top\":20,\"left\":63,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"courselist\",\"egglement\":true,\"width\":200,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(101, 255, 15)\",\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"S1AvhVbC9.rkd-a4WCc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":97,\"left\":116,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":88,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"21px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":9,\"left\":10,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":278,\"height\":22,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(24, 229, 242)\"},\"children\":[],\"id\":\"S1AvhVbC9.rJdB6EWR9.rJFwEUZCq\"},{\"zIndex\":\"auto\",\"top\":45,\"left\":11,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":186,\"height\":21,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(24, 229, 242)\"},\"children\":[],\"id\":\"S1AvhVbC9.rJdB6EWR9.r1vt4LbA9\"}],\"id\":\"S1AvhVbC9.rJdB6EWR9\"},{\"zIndex\":\"auto\",\"top\":215,\"left\":118,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":88,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"14px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":13,\"left\":8,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":278,\"height\":22,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(24, 229, 242)\"},\"children\":[],\"id\":\"S1AvhVbC9.rJGUTEZR9.r1NlBIZRq\"},{\"zIndex\":\"auto\",\"top\":46,\"left\":9,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":100,\"height\":23,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(24, 229, 242)\"},\"children\":[],\"id\":\"S1AvhVbC9.rJGUTEZR9.SypxBUb05\"}],\"id\":\"S1AvhVbC9.rJGUTEZR9\"},{\"zIndex\":\"auto\",\"top\":341,\"left\":114,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":88,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"16px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":32,\"left\":7,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":278,\"height\":22,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(24, 229, 242)\"},\"children\":[],\"id\":\"S1AvhVbC9.SkIIa4ZCq.BJ3fSIZC9\"}],\"id\":\"S1AvhVbC9.SkIIa4ZCq\"},{\"zIndex\":\"auto\",\"top\":467,\"left\":114,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":88,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"21px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":6,\"left\":14,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":20,\"height\":20,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"11px\",\"background-color\":\"rgb(236, 23, 232)\"},\"children\":[],\"id\":\"S1AvhVbC9.SypL6EZRc.rktwrL-05\"}],\"id\":\"S1AvhVbC9.SypL6EZRc\"},{\"zIndex\":\"auto\",\"top\":572,\"left\":114,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":88,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"16px\"},\"children\":[],\"id\":\"S1AvhVbC9.ryZv64bA5\"}]}"),
      ],

      model2:[
        JSON.parse("{\"id\":51,\"name\":\"Home\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":147,\"left\":818,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":274,\"height\":517,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":97,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Text\",\"egglement\":true,\"width\":270,\"height\":196,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"57px\"},\"classes\":{},\"id\":\"SklUSjWb0c.ryuYhGbCq.S1z6VmWAc\",\"children\":[]}],\"id\":\"SklUSjWb0c.ryuYhGbCq\"},{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":660,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(255, 231, 205, 0.89)\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5\"},{\"zIndex\":\"auto\",\"top\":60,\"left\":318,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Search\",\"egglement\":true,\"width\":74,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(254, 201, 83)\"},\"classes\":{},\"id\":\"SklUSjWb0c.Sy9kAQZCc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":123,\"left\":118,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":324,\"height\":505,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"50px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":255,\"left\":11,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":302,\"height\":207,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q.S1or4EZCc\"},{\"zIndex\":\"auto\",\"top\":52,\"left\":12,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":302,\"height\":151,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q.S1bFEV-Rc\"}],\"id\":\"SklUSjWb0c.S1V6fVZ0q\"},{\"zIndex\":\"auto\",\"top\":8,\"left\":73,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"ShoppingMall\",\"egglement\":true,\"width\":200,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(255, 149, 15)\",\"background-color\":\"rgb(250, 250, 250)\"},\"classes\":{},\"id\":\"SklUSjWb0c.B1vgQ4WAq\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":60,\"left\":8,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"input\",\"type\":\"input\",\"egglement\":true,\"width\":233,\"height\":40,\"attrs\":{\"value\":\"\",\"placeholder\":\"placeholder\",\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"styles\":{},\"classes\":{},\"id\":\"SklUSjWb0c.H1KCcL-R5\",\"children\":[]}]}"),
        JSON.parse("{\"id\":55,\"name\":\"CommodityPage\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":660,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(255, 231, 205, 0.89)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":150,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.H1cWBSWC5\"},{\"zIndex\":\"auto\",\"top\":200,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.S1dMHHZRc\"},{\"zIndex\":\"auto\",\"top\":250,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.By0MHHZRq\"},{\"zIndex\":\"auto\",\"top\":300,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.SJ07rSWCq\"},{\"zIndex\":\"auto\",\"top\":349,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.BkoVBH-Rc\"},{\"zIndex\":\"auto\",\"top\":399,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.H1rHSBbCc\"},{\"zIndex\":\"auto\",\"top\":449,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.HyRSBrWRq\"},{\"zIndex\":\"auto\",\"top\":499,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":50,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.HkAvHBbA5\"},{\"zIndex\":\"auto\",\"top\":11,\"left\":12,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":62,\"height\":62,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"31px\",\"background-color\":\"rgb(246, 240, 240)\"},\"children\":[],\"id\":\"Hk_nEBWAc.ryq6NrbAq.HkODsI-C9\"}],\"id\":\"Hk_nEBWAc.ryq6NrbAq\"},{\"zIndex\":\"auto\",\"top\":25,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"input\",\"type\":\"input\",\"egglement\":true,\"width\":242,\"height\":40,\"attrs\":{\"value\":\"\",\"placeholder\":\"\",\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"styles\":{\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"Hk_nEBWAc.SynRVBbA5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":25,\"left\":324,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Search\",\"egglement\":true,\"width\":74,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(254, 201, 83)\"},\"classes\":{},\"id\":\"Hk_nEBWAc.BJdyHBZ0q\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":95,\"left\":130,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":89,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.Sy2YHBWA9\"},{\"zIndex\":\"auto\",\"top\":220,\"left\":130,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":98,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.rJxU8BbA5\"},{\"zIndex\":\"auto\",\"top\":360,\"left\":130,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":98,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.HkoI8BZ0q\"},{\"zIndex\":\"auto\",\"top\":496,\"left\":130,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":98,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"Hk_nEBWAc.H1cu8B-C5\"}]}"),
        JSON.parse("{\"id\":65,\"name\":\"ProductDetailsPage\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"product picture\",\"egglement\":true,\"width\":235,\"height\":325,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"classes\":{},\"id\":\"HkhiUSW09.HyXRCUbC5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":324,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":450,\"height\":53,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(16, 15, 15)\"},\"children\":[],\"id\":\"HkhiUSW09.SyjQkPZA5\"},{\"zIndex\":\"auto\",\"top\":394,\"left\":9,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":425,\"height\":250,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":6,\"left\":125,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"information\",\"egglement\":true,\"width\":181,\"height\":49,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"border-width\":\"0px\",\"font-size\":\"34px\"},\"classes\":{},\"id\":\"HkhiUSW09.rk7UkPWCq.Sk0okwbR5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":52,\"left\":5,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":413,\"height\":27,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(246, 170, 24)\",\"border-radius\":\"9px\"},\"children\":[],\"id\":\"HkhiUSW09.rk7UkPWCq.rk301v-Rc\"},{\"zIndex\":\"auto\",\"top\":95,\"left\":4,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":413,\"height\":27,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(246, 170, 24)\",\"border-radius\":\"9px\"},\"children\":[],\"id\":\"HkhiUSW09.rk7UkPWCq.SJ2WlvZAc\"},{\"zIndex\":\"auto\",\"top\":137,\"left\":4,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":413,\"height\":27,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(246, 170, 24)\",\"border-radius\":\"9px\"},\"children\":[],\"id\":\"HkhiUSW09.rk7UkPWCq.Bk7GgPbC9\"},{\"zIndex\":\"auto\",\"top\":182,\"left\":8,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":308,\"height\":27,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(246, 170, 24)\",\"border-radius\":\"9px\"},\"children\":[],\"id\":\"HkhiUSW09.rk7UkPWCq.BJ2MgvbAq\"}],\"id\":\"HkhiUSW09.rk7UkPWCq\"}]}")
      ],

      model3:[
        JSON.parse("{\"id\":69,\"name\":\"Home\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":147,\"left\":818,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":274,\"height\":517,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(255, 255, 255)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":97,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"text\",\"type\":\"span\",\"text\":\"Text\",\"egglement\":true,\"width\":270,\"height\":196,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"font-size\":\"57px\"},\"classes\":{},\"id\":\"SklUSjWb0c.ryuYhGbCq.S1z6VmWAc\",\"children\":[]}],\"id\":\"SklUSjWb0c.ryuYhGbCq\"},{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":660,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(255, 236, 136, 0.89)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":159,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.ByS6r4WCc\"},{\"zIndex\":\"auto\",\"top\":214,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.rJw0B4WCc\"},{\"zIndex\":\"auto\",\"top\":268,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.r1VWINZC5\"},{\"zIndex\":\"auto\",\"top\":322,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.HyeG8VZ0q\"},{\"zIndex\":\"auto\",\"top\":375,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.r1AzUEb0c\"},{\"zIndex\":\"auto\",\"top\":430,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.B1cLL4ZCc\"},{\"zIndex\":\"auto\",\"top\":484,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":97,\"height\":55,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.ry4w8EW05\"},{\"zIndex\":\"auto\",\"top\":12,\"left\":13,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":60,\"height\":60,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"30px\",\"background-color\":\"rgb(248, 243, 243)\"},\"children\":[],\"id\":\"SklUSjWb0c.H1Le5QWA5.HJVLzwZCc\"}],\"id\":\"SklUSjWb0c.H1Le5QWA5\"},{\"zIndex\":\"auto\",\"top\":16,\"left\":323,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Search\",\"egglement\":true,\"width\":74,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(255, 222, 15)\"},\"classes\":{},\"id\":\"SklUSjWb0c.Sy9kAQZCc\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":16,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"input\",\"type\":\"input\",\"egglement\":true,\"width\":242,\"height\":40,\"attrs\":{\"value\":\"\",\"placeholder\":\"\",\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\"},\"styles\":{\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"SklUSjWb0c.HJJx0mWR9\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":123,\"left\":118,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":324,\"height\":505,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"50px\"},\"children\":[{\"zIndex\":\"auto\",\"top\":35,\"left\":10,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":302,\"height\":76,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q.S1bFEV-Rc\"},{\"zIndex\":\"auto\",\"top\":146,\"left\":10,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":302,\"height\":76,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q.rJ4uSNZC9\"},{\"zIndex\":\"auto\",\"top\":264,\"left\":10,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":302,\"height\":76,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q.r1iur4WC9\"},{\"zIndex\":\"auto\",\"top\":382,\"left\":10,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":302,\"height\":76,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\"},\"children\":[],\"id\":\"SklUSjWb0c.S1V6fVZ0q.rJ5KBE-A9\"}],\"id\":\"SklUSjWb0c.S1V6fVZ0q\"},{\"zIndex\":\"auto\",\"top\":69,\"left\":77,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"MenuList\",\"egglement\":true,\"width\":200,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"color\":\"rgb(255, 222, 15)\",\"background-color\":\"rgb(250, 250, 250)\"},\"classes\":{},\"id\":\"SklUSjWb0c.r1-Hr4-Rq\",\"children\":[]}]}"),
        JSON.parse("{\"id\":72,\"name\":\"CommodityPage\",\"width\":450,\"height\":660,\"styles\":{\"--mdc-theme-primary\":\"#673ab7\",\"--mdc-theme-secondary\":\"#f44336\",\"--mdc-theme-background\":\"#ffffff\",\"position\":\"relative\",\"margin\":\"auto\",\"background-color\":\"#ffffff\",\"overflow\":\"hidden\"},\"classes\":[],\"children\":[{\"zIndex\":\"auto\",\"top\":0,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":77,\"height\":660,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgba(255, 236, 136, 0.89)\"},\"children\":[{\"zIndex\":\"auto\",\"top\":11,\"left\":2,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":60,\"height\":60,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"border-radius\":\"30px\",\"background-color\":\"rgb(248, 243, 243)\"},\"children\":[],\"id\":\"rkcUfBb0c.HJ-YMHb0c.BJdQMDZC5\"}],\"id\":\"rkcUfBb0c.HJ-YMHb0c\"},{\"zIndex\":\"auto\",\"top\":425,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Dish name\",\"egglement\":true,\"width\":262,\"height\":40,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(255, 255, 255)\"},\"classes\":{},\"id\":\"rkcUfBb0c.ryPvXB-R5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":496,\"left\":0,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"button\",\"type\":\"button\",\"text\":\"Introduction to the dishes\",\"egglement\":true,\"width\":262,\"height\":141,\"attrs\":{},\"styles\":{\"overflow\":\"hidden\",\"text-overflow\":\"ellipsis\",\"background-color\":\"rgb(255, 255, 255)\",\"border-radius\":\"50px\"},\"classes\":{},\"id\":\"rkcUfBb0c.S1ms7BbA5\",\"children\":[]},{\"zIndex\":\"auto\",\"top\":13,\"left\":108,\"bottom\":\"auto\",\"right\":\"auto\",\"name\":\"div\",\"type\":\"div\",\"egglement\":true,\"containegg\":true,\"width\":300,\"height\":389,\"attrs\":{\"hidden\":false},\"classes\":{},\"styles\":{\"overflow\":\"hidden\",\"border-color\":\"rgba(0, 0, 0, 0.15)\",\"border-style\":\"solid\",\"border-width\":\"1px\",\"background-color\":\"rgb(189, 188, 188)\"},\"children\":[],\"id\":\"rkcUfBb0c.rkVlzPbCc\"}]}")
      ],

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
    changePlay(value){
      this.playing = value
      console.log(value)
      let dataPost = new FormData();
      dataPost.append('projectID', this.$route.params.pid);
      dataPost.append('preview',value.toString());
      let data = {'projectID':this.$route.params.pid , 'preview':value.toString() }
      console.log(data)
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post("http://43.138.21.64:8080/project/preview/update", data , config).then( res => {
        console.log(res)
      })
    },
    importModel(index){
      this.dialogImportVisible = false
      const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
      const that = this
      if(index === 0){
        const repeatImport = async () => {

          for (let i = 0; i < this.model1.length; i++) {
            let dataPost = new FormData();
            dataPost.append('userID', window.localStorage.getItem('uid'));
            dataPost.append('projectID', this.$route.params.pid);
            dataPost.append('prototypeName',this.model1[i].name);
            dataPost.append('canvas_Width',  this.model1[i].width.toString());
            dataPost.append('canvas_Height' ,  this.model1[i].height.toString());
            console.log(dataPost)
            let config ={
              headers: {'Content-Type': 'multipart/form-data'}
            }
            axios.post("http://43.138.21.64:8080/prototype/add", dataPost , config).then( res => {
              console.log(res)
              that.dialogAddVisible = false
              that.model1[i].id = res.data.id
              that.pages.push(that.model1[i])
              that.changeCanvas(that.model1[i],that.pages.length -1)
            })
            await sleep(500)
            that.save()
            }
          }
        repeatImport()
        }
      else if(index === 1){
        const repeatImport = async () => {

          for (let i = 0; i < this.model2.length; i++) {
            let dataPost = new FormData();
            dataPost.append('userID', window.localStorage.getItem('uid'));
            dataPost.append('projectID', this.$route.params.pid);
            dataPost.append('prototypeName',this.model2[i].name);
            dataPost.append('canvas_Width',  this.model2[i].width.toString());
            dataPost.append('canvas_Height' ,  this.model2[i].height.toString());
            console.log(dataPost)
            let config ={
              headers: {'Content-Type': 'multipart/form-data'}
            }
            axios.post("http://43.138.21.64:8080/prototype/add", dataPost , config).then( res => {
              console.log(res)
              that.dialogAddVisible = false
              that.model2[i].id = res.data.id
              that.pages.push(that.model2[i])
              that.changeCanvas(that.model2[i],that.pages.length -1)
            })
            await sleep(500)
            that.save()
          }
        }
        repeatImport()
      }
    else if(index === 2){
        const repeatImport = async () => {

          for (let i = 0; i < this.model3.length; i++) {
            let dataPost = new FormData();
            dataPost.append('userID', window.localStorage.getItem('uid'));
            dataPost.append('projectID', this.$route.params.pid);
            dataPost.append('prototypeName',this.model3[i].name);
            dataPost.append('canvas_Width',  this.model3[i].width.toString());
            dataPost.append('canvas_Height' ,  this.model3[i].height.toString());
            console.log(dataPost)
            let config ={
              headers: {'Content-Type': 'multipart/form-data'}
            }
            axios.post("http://43.138.21.64:8080/prototype/add", dataPost , config).then( res => {
              console.log(res)
              that.dialogAddVisible = false
              that.model3[i].id = res.data.id
              that.pages.push(that.model3[i])
              that.changeCanvas(that.model3[i],that.pages.length -1)
            })
            await sleep(500)
            that.save()
          }
        }
        repeatImport()
      }


    },
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
      dataPost.append('userID', window.localStorage.getItem('uid'))
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
      dataPost.append('userID', window.localStorage.getItem('uid'));
      dataPost.append('projectID', this.$route.params.pid);
      dataPost.append('prototypeName',this.addForm.name);
      dataPost.append('canvas_Width', this.addForm.width.toString());
      dataPost.append('canvas_Height' , this.addForm.height.toString());
      //const dataForm = {'userID': 1, 'projectID':this.$route.params.pid ,
      //  'prototypeName':this.addForm.name,'canvas_Width': this.addForm.width.toString(),'canvas_Height': this.addForm.height.toString()}
      //console.log(dataForm)
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
      dataPost.append('userID', window.localStorage.getItem('uid'))
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
      console.log(JSON.stringify(this.selectedPage))
      const that = this
      const  json = JSON.stringify(that.selectedPage)
      console.log(that.indexSelected)
      console.log(json)
      let dataPost = new FormData()
      //dataPost.append("userID", 10)
      dataPost.append('userID', window.localStorage.getItem('uid'));
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
  mounted(){
    console.log("aaa")
    this.$bus.$on("addElement" , this.addElement)
    this.$bus.$on("deleteElement" , this.deleteElement)
    this.$bus.$on("updateElement" , this.updateElement)
    this.init()
    //this.pages.push(this.model1)
    //this.pages.push(this.mmm)
    //this.pages.push(this.model1[0])
    //this.pages.push(this.model5)
    //this.pages.push(this.model6)
    const that = this
    let dataPost = new FormData()
    dataPost.append('projectID', that.$route.params.pid);
    let config ={
      headers: {'Content-Type': 'multipart/form-data'}
    }
    axios.post("http://43.138.21.64:8080/project/preview/get",dataPost , config).then( res => {
      console.log(res)
      if(res.status === 200) that.playing = true
      else that.playing = false
      //const prototypeContent = that.prototypeData[that.indexSelected]
      //prototypeContent.content = json
      //that.prototypeData.splice(that.indexSelected , 1 , prototypeContent)
      //console.log(that.prototypeData[that.indexSelected].content)
    })


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
#buttonImport{
  width: 100%;
  height:40px;
  float: left;
  margin-top: -60px;
  background-color: #333333;
  color: #FFFFFF;
  border-radius: 0;
  border-color: transparent;
}
#buttonAdd:hover,#buttonImport:hover{
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
  width: 15%;

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
