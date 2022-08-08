<template>
  <mr-container
    :id="page.id"

    :style="pageStyles"
    :class="[page.classes, {stage: true}]"


    @moving="movingHandler"
    @movestop="moveStopHandler"

    @clearselection="clearSelectionHandler"
    @delete="deleteHandler"

  >
    <!-- @resizestop="resizeStopHandler"  -->
    <!--@selectstop="selectStopHandler" -->
    <stage-el
      v-for="element in page.children"
      :key="element.id"
      :elem="element">
    </stage-el>

  </mr-container>
</template>


<script>
import StageEl from './StageEl'
import MrContainer from '@/components/common/mr-vue/MrContainer'
import elementsFromPoint from '@/polyfills/elementsFromPoint'
import {getChildNode} from "@/helpers/recursiveMethods";

const DROP_BORDER = {
  width: '2px',
  style: 'solid',
  color: '#f1867f'
}

export default {
  name: 'stageComp',
  components: { StageEl, MrContainer },
  props: ['page',],
  data: function () {
    return {
      clipboard: [],
      dropContainer: null,
      defaultBorder: {
        width: '',
        style: '',
        color: ''
      }
    }
  },
  computed: {
    pageStyles () {
      return {
        ...this.page.styles,
        height: (typeof this.page.height === 'string') ? this.page.height : (this.page.height + 'px'),
        width: (typeof this.page.width === 'string') ? this.page.width : (this.page.width + 'px'),
      }
    },
  },
  methods: {
    clearSelectionHandler () {
      this.$store.commit('clear')
    },

    deleteHandler () {
      if (this.$store.state.selectedItem !== null) {
        this.$bus.$emit('deleteElement' , this.$store.state.selectedItem)
        this.$store.commit('clear')
      }
    },
    //selectStopHandler (selectionBox) {
     // if ((selectionBox.top === selectionBox.bottom && selectionBox.left === selectionBox.right) ||
    //      (this.page.children.length === 0)) return

    //  let selectedElements = []
    //  this.page.children.forEach(childEl => {
    //    const child = (childEl.global) ? {...childEl, ...this.getComponentRef(childEl), id: childEl.id} : childEl

    //    let childTop = getComputedProp('top', child)
    //    let childLeft = getComputedProp('left', child)
    //    let childBottom = getComputedProp('height', child, this.page) + childTop
    //    let childRight = getComputedProp('width', child, this.page) + childLeft

   //     if (((childTop <= selectionBox.bottom) && (childLeft <= selectionBox.right) &&
     //           (childBottom >= selectionBox.top) && (childRight >= selectionBox.left)) ||
    //        ((childTop <= selectionBox.bottom) && (childRight >= selectionBox.left) &&
    //            (childBottom >= selectionBox.top) && (childLeft <= selectionBox.right))) {
    //      selectedElements.push(child)
    //    }
    //  })
//
    //  if (selectedElements.length > 0) {
    //    this._addSelectedElements(selectedElements)
    //  }
    //},

    //  if (selectedElements.length > 0) {
    //    this._addSelectedElements(selectedElements)
    //  }
    //},

    //getComponentRef (component) {
    //  return this.projectComponents[this.projectComponents.findIndex(comp => comp.name === component.name)]
    //},

    //resizeStopHandler (resStopData) {
    //  resStopData.map(resElData => this.resizeElement({...resElData, pageId: this.page.id}))
    //  this.rebaseSelectedElements()
    //},


    movingHandler (absMouseX, absMouseY) {
      this.dropContainer = this.getContaineggOnPoint(absMouseX, absMouseY)
      this.toggleDroppableCursor(!!this.dropContainer)
    },

    moveStopHandler () {
      //const containegg = this.getContaineggOnPoint(moveStopData.absMouseX, moveStopData.absMouseY)
      //const parentId = containegg ? containegg.id : null

      //moveStopData.moveElData.map(moveData => this.moveElement({
      //  ...moveData,
      //  pageId: this.page.id,
      //  parentId,
      //  mouseX: moveStopData.relMouseX,
      //  mouseY: moveStopData.relMouseY
      //}))
      let freshElements =  getChildNode(this.page, this.$store.state.selectedItem.id)
      this.$store.commit('clear')
      this.$store.commit('set' , freshElements)
      this.toggleDroppableCursor(false)
      this.dropContainer = null
    },

    getContaineggOnPoint (x, y) {
      const movingEggs = this.$store.state.selectedItem
      const parentsIds = movingEggs.id.substring(0, movingEggs.id.lastIndexOf('.'))
      const commonParentId = parentsIds.every((val, i, arr) => val === arr[0]) ? parentsIds[0] : null
      const elementsOnPoint = elementsFromPoint(x, y)

      for (let el of elementsOnPoint) {
        if (el.id === commonParentId) return null
        if ((el.dataset.mrContainer) ||
          (
            (el.dataset.containegg) &&
            (!el.dataset.componegg) &&
            (movingEggs.every(egg => !el.id.includes(egg.id)))
          )
        ) return el
      }
     return null
    },

    toggleDroppableCursor (isDroppable) {
      isDroppable
        ? document.documentElement.classList.add('droppable')
        : document.documentElement.classList.remove('droppable')
    },


  },
  watch: {
    dropContainer: function (newVal, oldVal) {
      if (oldVal) {
        oldVal.style.borderWidth = this.defaultBorder.width
        oldVal.style.borderStyle = this.defaultBorder.style
        oldVal.style.borderColor = this.defaultBorder.color
      }

      if (newVal) {
        this.defaultBorder.width = newVal.style.borderWidth
        this.defaultBorder.style = newVal.style.borderStyle
        this.defaultBorder.color = newVal.style.borderColor
        newVal.style.borderWidth = DROP_BORDER.width
        newVal.style.borderStyle = DROP_BORDER.style
        newVal.style.borderColor = DROP_BORDER.color
      }
    }
  }
}
</script>


<style>
html.droppable,
html.droppable * {
  cursor: copy !important;
}
</style>

<style scoped>
.stage {
  transform-origin: 0 0;
  user-select: none;
  margin: 10px auto 35px !important;
  border: 2px solid rgba(0, 0, 0, 0);
  /* for paper style */
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
</style>
