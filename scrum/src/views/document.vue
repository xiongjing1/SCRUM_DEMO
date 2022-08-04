<template>
  <div>
    <HeadSide></HeadSide>
    <div class="header">
      <el-header>我的文档</el-header>
    </div>
    <div>
      <span class="input">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </span>
      <span class="search">
        <el-button type="primary" @click="handleSearch()">搜索<i class="el-icon-search el-icon--right"></i></el-button>
      </span>
      <span class="new ">
        <el-popover class="moreinfo" trigger="click" placement="bottom"  >
          <p><el-input v-model="input1" placeholder="请输入文件名" style="width: 400px;"></el-input></p>
          <p><el-button class="confirmbnt" type="primary" size="mini" @click="handleNew()">确认</el-button></p>
          <div slot="reference" class="name-wrapper" >
            <el-button type="primary" >新建<i class="el-icon-edit el-icon--right"></i></el-button>
          </div>
        </el-popover>
      </span>
    </div>

    <div class="table">
      <el-table
          :data="searchData"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          max-height="480"
          style="width: 100%">
        <el-table-column
            fixed
            label="文档名"
            width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="所属项目"
            width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.projectID }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="创建者"
            width="200">
          <div  class="info" slot-scope="scope" >
            <el-popover class="moreinfo" trigger="hover" placement="top-start"  style="overflow-x: auto">
              <p>创建时间: {{ scope.row.createdDate }}</p>
              <p>最后修改时间: {{ scope.row.modifiedDate }}</p>
              <div slot="reference" class="name-wrapper" >
                <el-tag size="medium" effect="plain">{{ scope.row.creatorID }}</el-tag>
              </div>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="recover-button"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                type="text"
                size="small"
                class="move-button"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>


<script>

// @ is an alias to /src
import HeadSide from "@/components/HeadSide";
import global from "@/api/global";
//import axios from 'axios';


export default {
  name: 'HomeView',
  components: {
    HeadSide
  },
  data() {
    return {
      input: '',
      input1: '',
      searchData: [],
      tableData: [{
        ID: '1',
        name: '文件1',
        creatorID: '用户名1',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目1',
        isRecycled: '',
      }, {
        ID: '2',
        name: '文件2',
        creatorID: '用户名2',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目2',
        isRecycled: '',
      }, {
        ID: '3',
        name: '文件3',
        creatorID: '用户名3',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目3',
        isRecycled: '',
      }, {
        ID: '4',
        name: '文件4',
        creatorID: '用户名4',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目4',
        isRecycled: '',
      }, {
        ID: '5',
        name: '文件5',
        creatorID: '用户名5',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目5',
        isRecycled: '',
      }, {
        ID: '6',
        name: '文件6',
        creatorID: '用户名6',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目6',
        isRecycled: '',
      }, {
        ID: '7',
        name: '文件7',
        creatorID: '用户名7',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目7',
        isRecycled: '',
      }, {
        ID: '8',
        name: '文件8',
        creatorID: '用户名8',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目8',
        isRecycled: '',
      }, {
        ID: '9',
        name: '文件9',
        creatorID: '用户名9',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目9',
        isRecycled: '',
      },{
        ID: '10',
        name: '文件10',
        creatorID: '用户名10',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目10',
        isRecycled: '',
      }, {
        ID: '11',
        name: '文件11',
        creatorID: '用户名11',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目11',
        isRecycled: '',
      }, {
        ID: '12',
        name: '文件12',
        creatorID: '用户名12',
        createdDate: '2022-08-02 09:00',
        modifiedDate: '2022-08-02 10:00',
        content: '',
        projectID: '项目12',
        isRecycled: '',
      }]
    }
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
      this.searchData=this.tableData;
    },
    handleSearch(){
      var search1= this.input;
      if(search1){
        if(search1 === null || search1 === undefined){
          this.searchData=this.tableData;
        }else{
          this.searchData=[];
          for(let i=0;i<this.tableData.length;i++) {
            if(this.tableData[i].name.search(search1)!==-1){
              this.searchData.push(this.tableData[i]);
            }
          }
        }
      }
      else{
        this.searchData=this.tableData;
      }
    },
    handleNew(){
      var add=true;
      for(let i=0;i<this.tableData.length;i++) {
          if(this.tableData[i].name===this.input1){
            add=false;
          }
      }
      if(add){
        /*
        let formData = new FormData();
        formData.append('userID', '');
        formData.append('projectID', '');
        formData.append('docName', this.input1);
        axios.post('http://43.138.21.64/doc/add/',formData)
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
        var data1={
          ID: '',
          name: this.input1,
          creatorID: '当前用户',
          createdDate: '',
          modifiedDate: '',
          content: '',
          projectID: '当前项目',
          isRecycled: '',
        };
        this.tableData.push(data1);
        alert(this.input1+'添加成功');
        this.input1='';
      }
      else{
        alert(this.input1+'已存在，请重新输入');
        this.input1='';
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
      global.fileid=row.ID;
      this.$router.push({path: '/about'});
    },
    handleDelete(index, row) {
      /*
      let formData = new FormData();
      formData.append('docID', row.ID);
      formData.append('userID', '');
      formData.append('docType', 3);
      axios.post('http://43.138.21.64/doc/remove/one/',formData)
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
      this.tableData.splice(index,1);
      alert("已删除"+row.name);
    }
  }
};
</script>

<style scoped>
*{
  overflow-x: hidden;
}
.el-popover{
  overflow-y: hidden;
}
</style>
<style scoped>
.header {
  background-color: pink;
  color: #333;
  text-align: center;
  line-height: 60px;
  font-size: 40px;
}

.input {
  position: absolute;
  left: 100px;
  width: 1000px;
  margin-top: 5px;
}

.search {
  position: absolute;
  right: 315px;
  margin-top: 5px;
}

.new {
  position: absolute;
  right: 200px;
  margin-top: 5px;
}
.table{
  position: absolute;
  margin-top: 50px;
  left: 100px;
}
.info{
  position: absolute;
  margin-top: -15px;
}
.confirmbnt{
  position: absolute;
  left:180px;
  top: 70px;
}



/deep/.recover-button{
  color: #2c3e50;
  font-size: 15px;
  cursor: pointer;
  padding-left: 50px;
}
/deep/.recover-button:hover{
  color: rgba(23,43,72,0.45);
}
/deep/.move-button{
  color: #2c3e50;
  font-size: 15px;
  cursor: pointer;
  padding-left: 30px;
}
/deep/.move-button:hover{
  color: rgba(23,43,72,0.45);
}
</style>
