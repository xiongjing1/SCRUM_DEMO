<template>
  <nav class="navigation" style="max-width: 400px">
      <ElementsMenu v-show="showElements" style="position: absolute;left:0"></ElementsMenu>

  </nav>
</template>


<script>
import ElementsMenu from './elements/ElementsMenu'


import '@/assets/icons/system/widgets'
import '@/assets/icons/system/settings'
import '@/assets/icons/system/page'

export default {
  name: 'drawEgg',
  components: { ElementsMenu,  },
  data: function () {
    return {
      showElements: true,
      showSettings: true,
      activeTabX: 0
    }
  },
  computed: {
    indiLeft () {
      return this.activeTabX + 'px'
    },
    indiRight () {
      return (240 - (this.activeTabX + 80)) + 'px'
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      this.showElements = true
      this.showSettings = false
      this.showPages = false
    })
  },
  methods: {
    toggleTab (name) {
      if (name === 'elements') {
        this.showElements = true
        this.showSettings = this.showPages = false
        this.activeTabX = 0
      }
      if (name === 'settings') {
        this.showSettings = true
        this.showElements = this.showPages = false
        this.activeTabX = 80
        this.$root.$emit('show-settings')
      }
    }
  }
}
</script>

<style>
/deep/. {
  overflow-x: hidden;
}
</style>
<style scoped>
/deep/. {
  overflow-x: hidden;
}
.navigation {
  overflow-x: hidden;
  top: 0;
  right: 0;
  z-index: 1005;
  width: 350px;
  height: 100%;
  max-height: 100%;
  background: #fafafa;
  display: flex;
  flex-shrink: 0;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}

/* DRAWER DOES NOT DISPLAY IN DEVICES SMALLER THAN 1024px */
@media screen and (max-width: 1024px) {
  .navigation {
    display: none;
  }
}

.tab {
  padding: 0 28px;
  height: 44px;
  cursor: pointer;
}
.tab-bar {
  display: inline-flex;
  padding-top: 20px;
  z-index: 1;
  /* border-bottom: 1px solid rgba(0,0,0,0.12); */
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
.tab-indicator {
  top: 63px;
  height: 2px;
  position: absolute;
  transition: all .2s cubic-bezier(.4,0,.4,1).01s;
}
.tab-content {
  margin-top: 1px;
  margin-left: 0px;
}
</style>
