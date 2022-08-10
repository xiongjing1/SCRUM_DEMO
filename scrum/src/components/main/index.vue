<template>
  <div class="mainegg" >
    <stageComp :page="pageselect" ></stageComp>
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
  margin: 0 ;
  height: 100%;
}
</style>
