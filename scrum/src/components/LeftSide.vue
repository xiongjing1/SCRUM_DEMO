<template>
  <div class="leftside">
    <div class="team-inform">
      <img src="../assets/team.png" height="25px" alt=" " style="position: absolute; left: 15px;top:39px">
      <div class="title">My Teams</div>
      <div class="ateam" v-for="(item,index) in teams" v-bind:key="index">
        <div class="team-part">
          <div class="teamno" :style="{'background-color':color[index%4]}"></div>
          <div class="teamname">{{ item.name }}</div>
        </div>
        <div v-for="(item2,index2) in projects" v-bind:key="index2">
          <div class="project-part" v-if="item2.teamid==item.id">
            <div class="projectname">{{ item2.name }}</div>
          </div>
        </div>
      </div>
      <div class="team-part">
        <img src="../assets/add.png" height="16px" alt=" " style="float: left;margin-left: 16px; margin-top: 10px;">
        <div class="teamname" style="margin-left: 17px">Create new team</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftSide",
  data() {
    return {
      color: ['#3D89E9', '#9449FF', '#F42BBF', '#E74A23'],
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

.title {
  width: 100px;
  height: 50px;
  text-align: left;
  margin-left: 50px;
  margin-top: 2px;
  line-height: 60px;
  font-family: Inter, "Segoe UI";
  font-size: 14px;
  font-weight: 500;
  color: #383838;
}

.ateam {

}

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
</style>