<template>
  <div class="menus-wrapper">
    <div class="el-menu">
      <div class="el-menu__el" :key="element.name"
           v-for="element in elements"
           @click="e => addItemToStage(e , element)"
           :title="element.name">
        <div>
          <svgicon :icon="'system/elements/'+element.name" width="24" height="24" color="rgba(0,0,0,.87)" v-if="element.name!==undefined"></svgicon>
          <span v-if="element.name!==undefined">{{element.displayName || element.name}}</span>
        </div>


      </div>
    </div>


    <!-- TODO: v-for components (community/personal) retrieved from GH? -->
    <!-- <menu-toggle menuHeader="Community Components" :startClosed="true">
      <div class="el-menu">
        <div class="el-menu__el" :key="component.name"
          v-for="component in components"
          :title="component.name"
          draggable="true"
          @dragstart="e => dragstartHandler(e, component)"
          @click="e => addItemToStage(e, component)"
        >
          <svgicon icon="system/elements/component" width="24" height="24" color="rgba(0,0,0,.87)"></svgicon>
          <span>{{component.displayName || component.name}}</span>
        </div>
      </div>
    </menu-toggle> -->
  </div>
</template>


<script>
import basicElements from '@/assets/BasicElements'


import '@/assets/icons/system/elements/'

export default {
  name: 'elements-menu',
  data: function () {
    return {
      elements: basicElements,
      // components: mockComponents
    }
  },
  methods:{
    addItemToStage (e, item) {
      //console.log(item)
      this.$bus.$emit('addElement',this.initItem(item))
    },
    initItem (item) {
      return { zIndex: 'auto', top: 0, left: 0, bottom: 'auto', right: 'auto', ...item }
    },
  }
}
</script>


<style scoped>
. {
  overflow: hidden;
}
.menus-wrapper {
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 58px);
  width: 100%;
}

.el-menu::before {
  display: none;
  content: "";
}
.el-menu {
  width: 100%;
  height: 100%;
  display: grid;
  margin: 1px;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(1px, 72px);
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
</style>