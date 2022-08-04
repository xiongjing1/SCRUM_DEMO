<template>
  <div>
    <div id="vditor"  name="description" class="edit"  ></div>
    <div style="margin-top: 10px;position: absolute;left: 730px;top: 703px;">
      <el-button type="primary"  @click="submit()">提交</el-button>
    </div>
  </div>

</template>...
<script>
import Vditor from "vditor";
import global from "@/api/global";
import 'vditor/dist/index.css';
//import axios from 'axios';


export default {
  data() {
    return {
      contentEditor: {},
      tableData: [{
        ID: '1',
        name: '文件1',
        creatorID: '用户名1',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '## hello',
        projectID: '项目1',
        isRecycled: '',
      },{
        ID: '2',
        name: '文件2',
        creatorID: '用户名2',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '## hello world',
        projectID: '项目2',
        isRecycled: '',
      }],
    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', {
      height: 710,
      width: 1535,
      placeholder: '开始编辑文本...',
      theme: 'classic',
      counter: {
        enable: true,
        type: 'markdown'
      },
      preview: {
        maxWidth: 1500,
        delay: 0,
        hljs: {
          style: 'monokai',
          lineNumber: true
        }
      },
      tab: '\t',
      typewriterMode: true,
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      mode: 'ir',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        '|',
        'quote',
        'line',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        // 'record',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'edit-mode',
        // 'content-theme',
        'code-theme',
        'export',
        {
          name: 'more',
          toolbar: [
            'fullscreen',
            'both',
            'preview',
            'info',
            'help',
          ],
        }],
      after:()=>{
        for(let i=0;i<this.tableData.length;i++){
          if(global.fileid===this.tableData[i].ID){
            this.contentEditor.setValue(this.tableData[i].content);
            break;
          }
        }
      }
    });
  },
  created() {
    this.initParams();
  },
  methods: {
    initParams(){
      /*
        let formData = new FormData();
        formData.append('projectID', '');
        formData.append('userID', '');
        axios.post('http://43.138.21.64/doc/get/all/',formData)
            .then(function (response) {
              if(response.data.success){
                this.tableData=response.data.document.results;
              }
              else {
                console.log("获取失败");
              }
            })
            .catch(function (error) {
              console.log("Fail", error)
            });
       */
    },
    submit() {
      this.$router.push('/user');
      /*
      let formData = new FormData();
      formData.append('userID', '');
      formData.append('docID', '');
      formData.append('docType', 3);
      formData.append('content', this.contentEditor.getValue());
      axios.post('http://43.138.21.64/doc/update/',formData)
          .then(function (response) {
            if(response.data.success){
              console.log(response.data.message);
            }
            else {
              console.log(response.data.message);
            }
          })
          .catch(function (error) {
            console.log("Fail", error)
          });
       */
      var find=false;
      for(let i=0;i<this.tableData.length;i++){
        if(global.fileid===this.tableData[i].ID){
          this.tableData[i].content = this.contentEditor.getValue();
          this.$router.push({path:'/'});
          find=true;
          break;
        }
      }
      if(!find){
        alert('未找到相关文件');
      }
    },

  },
}
</script>
<style scoped>
.edit{
  text-align: left;
  position: absolute;
  top: 0;
}
</style>