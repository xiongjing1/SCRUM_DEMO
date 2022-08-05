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
import axios from 'axios';


export default {
  data() {
    return {
      contentEditor: {},
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
        this.contentEditor.setValue(global.filecontent);
      }
    });
  },
  created() {

  },
  methods: {
    submit() {
      let formData = new FormData();
      formData.append('userID', window.localStorage.getItem('uid'));//window.localStorage.getItem('uid')
      formData.append('docID', global.fileid);//global.fileid
      formData.append('docType', 3);
      formData.append('content', this.contentEditor.getValue());
       let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
      axios.post('http://43.138.21.64:8080/doc/update',formData,config)
          .then(response => {
            if(response.status === 200){
              console.log(response.data.message);
            }
            else {
              console.log(response.data.message);
            }
          })

      global.filecontent=this.contentEditor.getValue();
      this.$router.push({
        name:'documentManage',
        params:{
          pid:window.localStorage.getItem('pid')
        }
      });
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
