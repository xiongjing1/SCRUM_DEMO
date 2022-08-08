<template>
  <div class="mainegg">
    <stageComp :page="pageselect"></stageComp>
  </div>
</template>


<script>



import StageComp from './Stage'


export default {
  name: 'mainEgg',
  components: { StageComp },

  props:['pageselect']

}
</script>

<style scoped>
.mainegg {
  margin: 0 57px;
  height: 100%;
}

.zoom-menu {
  bottom: 24px;
  left: 24px;
  padding: 0 6px;
  position: fixed;
}
</style>
