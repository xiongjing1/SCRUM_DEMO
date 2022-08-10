<template>
  <div>
  <div class="leftside" :style="{'height':this.wholeHeight}">
    <div class="team-inform">
      <img src="../assets/team.png" height="25px" alt=" " style="position: absolute; left: 15px;top:39px">
      <div class="team-title">我的团队</div>
      <div class="real-team">
      <div class="ateam" v-for="(item,index) in teams" v-bind:key="index">
        <div class="team-part" v-on:click="teamjump(item.id,item.name,item.headshot)" >
          <div class="teamno" :style="{'background-color':color[index%4]}"></div>
          <div class="teamname" >{{ item.name }}</div>
        </div>
        <div v-for="(item2,index2) in projects" v-bind:key="index2">
          <div class="project-part" v-if="item2.teamid==item.id"  v-on:click="projectjump(item2.id,item2.name,item.name,item2.p_description,item2.p_creator,item2.p_create_time,item2.p_doc_count,item.headshot)">
            <div class="projectname">{{ item2.name }}</div>
          </div>
        </div>
      </div>
      </div>
      <div class="team-part1">
        <img src="../assets/add.png" height="16px" alt=" " style="float: left;margin-left: 16px; margin-top: 10px;">
        <div class="teamname" style="margin-left: 17px" v-on:click="begin_create=true">创建一个新团队</div>
      </div>
    </div>
  </div>
    <div class="mask" v-if="begin_create" :style="{height: this.wholeHeight}">
      <div class="name-block" v-if="begin_create">
        <div class="edit_title" >创建一个新团队</div>
        <div class="close" v-on:click="begin_create=false">
          <img src="../assets/close.png" height="18px" alt=" "  style="margin-top:8px; margin-left: 2px">
        </div>
        <div class="underline"></div>
        <el-input class="change_name" v-model="new_team"  placeholder="Your new team name here..."></el-input>
        <el-button type="primary" class="save-btn" v-on:click="create_sure">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LeftSide",
  mounted() {
   this.wholeHeight=document.documentElement.scrollHeight-50+'px';
    console.log(this.wholeHeight);
    this.$axios.get('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid')).then((res) => {
      this.origin_teams=res.data.team_list;
      this.origin_projects=res.data.project_list;
      this.teams= this.origin_teams.map((item) => {
        return Object.assign({}, { id: item.t_id, name: item.t_name,headshot:item.t_headshot})
      })
      this.projects= this.origin_projects.map((item) => {
        return Object.assign({}, { id: item.p_id, name: item.p_name, teamid: item.p_tid,p_description:item.p_description,p_creator:item.p_creator,p_create_time:item.p_create_time,p_doc_count:item.p_doc_count})
      })
      console.log(this.teams)
    });
    },

  data() {
    return {
      wholeHeight:800,
      begin_create:false,
      new_team:'',
      color: ['#3D89E9', '#9449FF', '#F42BBF', '#E74A23'],
      origin_teams:[],
      origin_projects:[],
      teams: [
        {id: '1', name: 'Yigaaa Team'},
        {id: '2', name: 'lluosi Team'},
      ],
      projects: [
        {id: '1', name: 'Short term', teamid: '1'},
        {id: '2', name: 'KinKi Kids', teamid: '2'},
        {id: '3', name: 'Operate System', teamid: '1'},
        {id: '4', name: 'Sina News', teamid: '2'},
        {id: '5', name: 'KAT-TUN', teamid: '1'},
      ]
    }
  },
  methods:{
    create_sure(){
      let param = new FormData() // 创建form对象
      param.append('is_create_new_team',1)
      param.append('name', this.new_team)// 通过append向form对象添加数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      axios.post('http://43.138.21.64:8080/user/'+ window.localStorage.getItem('uid'), param,config)
          .then(response => {
            console.log(response.data)
            // console.log("denglu:"+response.data);
            if (response.data.errno === 1000) {
              this.teams.push({name:this.new_team,id:response.data.tid});
              this.begin_create=false;
            }else{
              this.$message.error("发生错误");
            }
          })
    },
    teamjump(id,tname,headshot){
      window.localStorage.setItem('tid',id);
      window.localStorage.setItem('tname',tname);
      var shot=''

      shot='http://43.138.21.64:8080'+headshot
      console.log(shot);
      window.localStorage.setItem('theadshot',shot);
      this.$router.push('/TeamManage/'+id);
    },
    projectjump(id,name,tname,p_description,p_creator,p_create_time,p_doc_count,headshot){
      window.localStorage.setItem('pid',id);
      window.localStorage.setItem('pname',name);
      window.localStorage.setItem('tname',tname);
      window.localStorage.setItem('pintro',p_description);
      window.localStorage.setItem('p_creator',p_creator);
      window.localStorage.setItem('p_create_time',p_create_time);
      window.localStorage.setItem('p_doc_count',p_doc_count);
      var shot=''
      shot='http://43.138.21.64:8080'+headshot
      console.log(shot);
      window.localStorage.setItem('theadshot',shot);
      this.$router.push('/designManage/'+id);
    },
  }
}
</script>

<style scoped>
.leftside {
  overflow: hidden;
  float: left;
  height: 100%;
  width: 230px;
  position: absolute;
  top: 50px;
  left: 0;
  border-right: 1px solid rgba(192, 198, 210, 0.88);
}

.team-inform {
  width: 230px;
  margin-top: 20px;


}
::-webkit-scrollbar{
  width: 7px;
}
::-webkit-scrollbar-track{
  background-color: #f5f5f5;
  -webkit-box-shadow:inset 0 0 3px rgba(0,0,0,0.1);
  border-radius:5px;
}
::-webkit-scrollbar-thumb{
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
::-webkit-scrollbar-button{
  background-color: #eee;
  display: none;
}
::-webkit-scrollbar-corner{
  background-color: black;
}
.team-title {
  width: 100px;
  height: 50px;
  text-align: left;
  margin-left: 50px;
  margin-top: 2px;
  line-height: 60px;
  font-family: Inter, "Segoe UI";
  font-size: 14px;
  font-weight: 600;
  color: #383838;
}

.ateam {

}
.c{}
.teamno {
  width: 10px;
  height: 10px;
  background-color: #3D89E9;
  border-radius: 15%;
  float: left;
  margin-left: 21px;
  margin-top: 13px;
}

.teamname {

  float: left;
  text-align: left;
  width: 150px;
  margin-left: 20px;
  font-size: 13px;
  font-family: Inter, sans-serif;
  line-height: 36px;

}

.team-part {
  width: 100%;
  height: 36px;
  cursor: default;

}

.team-part:hover {
  background-color: #ECECEC;
}
.team-part1 {
  width: 100%;
  height: 36px;
  cursor: default;
  position: absolute;
  bottom: 40px;
}

.team-part1:hover {
  background-color: #ECECEC;
}
.projectname {
  float: left;
  text-align: left;
  width: 150px;
  margin-left: 51px;
  font-size: 12px;
  font-family: Inter, sans-serif;
  line-height: 30px;
}

.project-part {
  width: 100%;
  height: 30px;
  cursor: default;
}

.project-part:hover {
  background-color: #ECECEC;
}
.mask{
  position: absolute;
  z-index: 100000;
  left: 0;
  top:50px;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.3);
}
.name-block{
  position: absolute;
  left: 530px;
  top:150px;
  height: 240px;
  width: 500px;
  background-color: #FFFFFF;
  border-radius: 0.5%;
  box-shadow: 0px 0px 9px rgba(0,0,0,0.3);
}
.edit_title{
  width: 300px;
  height: 60px;
  text-align: left;
  margin-left: 30px;
  line-height: 60px;
  font-family: Inter,"Segoe UI";
  font-size: 15px;
  font-weight: 600;
  color: #383838;

}
.close{
  height: 35px;
  width: 35px;
  float: right;
  margin-top: -45px;
  margin-right: 10px;
  cursor: pointer;
}
.close:hover{
  background-color: #F3F3F3;
}
.underline{
  width: 100%;
  height: 1px;
  background-color: #E9E9E9;
}
.change_name{
  width: 80%;
  margin-top: 30px;
  margin-left: 16px;
}
.save-btn{
  margin-top: 30px;
  margin-left: 330px;
}
.real-team{
  overflow: auto;
  height: 600px;
}
</style>
