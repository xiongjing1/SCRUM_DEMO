<template>
  <div data-mr-container="true"
    class="mr-container"
    tabindex="0"
    @mousedown.capture="mouseDownHandler"
    @keydown.esc.stop.prevent="$emit('delete')"
    @keydown.delete.exact.stop.prevent="$emit('delete')"
    @dragover.prevent

  >
    <slot></slot>

  </div>
</template>


<script>
export default {
  name: 'mr-container',
  props: {

  },
  data: function () {
    return {
      initialAbsPos: {x: 0, y: 0},
      initialRelPos: {x: 0, y: 0},
      currentAbsPos: {x: 0, y: 0},
      currentRelPos: {x: 0, y: 0},
      moving: false,
      resizing: false,
      handle: null
    }
  },
  computed: {
    mrElements () {
      return this.$store.state.selectedItem.map(el => document.getElementById(el.id).parentElement)
    }
  },
  methods: {
    mouseDownHandler (e) {

      let isMrs = false
      this.initialAbsPos = this.currentAbsPos = this.getMouseAbsPoint(e)
      this.initialRelPos = this.currentRelPos = this.getMouseRelPoint(e)

      if (e.target.dataset.mrContainer) {
        console.log('clean')
        this.$store.commit('clear')
        //this.$emit('clearselection')
        //this.renderSelectionArea({x: -1, y: -1}, {x: -1, y: -1})
        //isMrs = this.selecting = true
      } else if (e.target.dataset.mrHandle) {
        isMrs = this.resizing = true
        this.handle = e.target.classList[1]
        // this.$emit('resizestart')
      } else if (this.getParentMr(e.target)) {
        //this.$store.commit('set' , e.target)
        isMrs = this.moving = true
        console.log(this.$store.state.selectedItem)
        //this.$store.commit('set' , e.target)
        // this.$emit('movestart')
      }

      if (isMrs) {
        document.documentElement.addEventListener('mousemove', this.mouseMoveHandler, true)
        document.documentElement.addEventListener('mouseup', this.mouseUpHandler, true)
      }
    },

    mouseUpHandler () {
      console.log((this.mrElements))
      console.log('asd')
      //
      console.log(this.moveStopData())
      // Saves the scroll position before giving focus and sets it back after focus
      const mainContainer = document.getElementById('main')
      let currentScroll = mainContainer.scrollTop
      this.$el.focus()
      mainContainer.scrollTop = currentScroll

      if (this.initialAbsPos !== this.currentAbsPos) {
        if (this.resizing) this.$emit('resizestop', this.resizeStopData())
        else if (this.moving) {
          this.$emit('movestop', this.moveStopData())

        }
      }
      this.moving = false
      this.resizing = false
      this.handle = null

      document.documentElement.removeEventListener('mousemove', this.mouseMoveHandler, true)
      document.documentElement.removeEventListener('mouseup', this.mouseUpHandler, true)
    },

    mouseMoveHandler (e) {
      const lastAbsX = this.currentAbsPos.x
      const lastAbsY = this.currentAbsPos.y

      this.currentAbsPos = this.getMouseAbsPoint(e)
      this.currentRelPos = this.getMouseRelPoint(e)

      let offX = this.currentAbsPos.x - lastAbsX
      let offY = this.currentAbsPos.y - lastAbsY

      if (this.resizing) {
        this.mrElements.map(mrEl => {
          if (!mrEl.children[0].dataset.global) this.resizeElementBy(mrEl, offX, offY)
        })
        // this.$emit('resizing')
      } else if (this.moving) {
        this.mrElements.map(mrEl => this.moveElementBy(mrEl, offX, offY))
      }
        //this.renderSelectionArea(this.initialRelPos, this.currentRelPos)
        // this.$emit('selecting')

    },

    //renderSelectionArea (initPoint, endPoint) {
    //  const minX = Math.min(initPoint.x, endPoint.x)
    //  const maxX = Math.max(initPoint.x, endPoint.x)
    //  const minY = Math.min(initPoint.y, endPoint.y)
     // const maxY = Math.max(initPoint.y, endPoint.y)


    resizeElementBy (el, offX, offY) {
      const parentCompStyle = window.getComputedStyle(this.getParentMr(el))
      const elCompStyle = window.getComputedStyle(el)

      const parentH = parseInt(parentCompStyle.height)
      const parentW = parseInt(parentCompStyle.width)
      const elMinH = parseInt(elCompStyle.minHeight)
      const elMinW = parseInt(elCompStyle.minWidth)

      let newTop = parseInt(elCompStyle.top)
      let newLeft = parseInt(elCompStyle.left)
      let newRight = parseInt(elCompStyle.right)
      let newBottom = parseInt(elCompStyle.bottom)
      let newHeight = parseInt(elCompStyle.height)
      let newWidth = parseInt(elCompStyle.width)

      let diffX = offX
      let diffY = offY

      if (this.handle.indexOf('t') !== -1) {
        if (newHeight - offY < elMinH) diffY = (newHeight - elMinH)
        else if (newTop + offY < 0) diffY = (0 - newTop)
        newTop += Math.round(diffY)
        newHeight -= Math.round(diffY)
      }
      if (this.handle.indexOf('l') !== -1) {
        if (newWidth - offX < elMinW) diffX = (newWidth - elMinW)
        else if (newLeft + offX < 0) diffX = (0 - newLeft)
        newLeft += Math.round(diffX )
        newWidth -= Math.round(diffX )
      }
      if (this.handle.indexOf('b') !== -1) {
        if (newHeight + offY < elMinH) diffY = (elMinH - newHeight)
        else if (newTop + newHeight + offY > parentH) diffY = (parentH - newTop - newHeight)
        newHeight += Math.round(diffY)
        newBottom -= Math.round(diffY)
      }
      if (this.handle.indexOf('r') !== -1) {
        if (newWidth + offX < elMinW) diffX = (elMinW - newWidth)
        else if (newLeft + newWidth + offX > parentW) diffX = (parentW - newLeft - newWidth)
        newWidth += Math.round(diffX)
        newRight -= Math.round(diffX)
      }

      el.style.height = (el.style.height !== 'auto') ? newHeight + 'px' : 'auto'
      el.style.width = (el.style.width !== 'auto') ? newWidth + 'px' : 'auto'
      el.style.top = (el.style.top !== 'auto') ? newTop + 'px' : 'auto'
      el.style.left = (el.style.left !== 'auto') ? newLeft + 'px' : 'auto'
      el.style.bottom = (el.style.bottom !== 'auto') ? newBottom + 'px' : 'auto'
      el.style.right = (el.style.right !== 'auto') ? newRight + 'px' : 'auto'
    },

    moveElementBy (el, offX, offY) {
      const elCompStyle = window.getComputedStyle(el)

      // Re-set height and width on move to preserve dimensions (due addition of bottom/right props)
      //el.style.height = el.style.height
      //el.style.width = el.style.width

      el.style.top = (el.style.top !== 'auto')
        ? this.fixPosition(el, parseInt(elCompStyle.top) + Math.round(offY), 'top') + 'px'
        : 'auto'
      el.style.left = (el.style.left !== 'auto')
        ? this.fixPosition(el, parseInt(elCompStyle.left) + Math.round(offX), 'left') + 'px'
        : 'auto'
      el.style.bottom = (el.style.bottom !== 'auto')
        ? this.fixPosition(el, parseInt(elCompStyle.bottom) - Math.round(offY), 'bottom') + 'px'
        : 'auto'
      el.style.right = (el.style.right !== 'auto')
        ? this.fixPosition(el, parseInt(elCompStyle.right) - Math.round(offX), 'right') + 'px'
        : 'auto'
    },

    fixPosition (el, val, prop) {
      if (val < 0) return 0

      const parentCompStyle = window.getComputedStyle(this.getParentMr(el))
      const elCompStyle = window.getComputedStyle(el)

      if ((prop === 'top' || prop === 'bottom') && (val + parseInt(elCompStyle.height) > parseInt(parentCompStyle.height))) {
        return parseInt(parentCompStyle.height) - parseInt(elCompStyle.height)
      }
      if ((prop === 'left' || prop === 'right') && (val + parseInt(elCompStyle.width) > parseInt(parentCompStyle.width))) {
        return parseInt(parentCompStyle.width) - parseInt(elCompStyle.width)
      }
      return val
    },

    getParentMr (element) {
      let parentMr = null
      let currentMr = element

      while (parentMr === null) {
        if (currentMr === null || currentMr.parentElement === null) break
        else if (currentMr.dataset.mrContainer) parentMr = currentMr
        else if (currentMr.parentElement.dataset.mrEl) parentMr = currentMr.parentElement

        currentMr = currentMr.parentElement
      }
      return parentMr
    },

    getMouseAbsPoint (e) {
      return {x: e.clientX, y: e.clientY}
    },

    getMouseRelPoint (e) {
      const mainContainer = document.getElementById('main')
      const x = e.clientX + mainContainer.scrollLeft - mainContainer.offsetLeft - this.$el.offsetLeft
      const y = e.clientY + mainContainer.scrollTop - mainContainer.offsetTop - this.$el.offsetTop

      return {x, y}
    },

    moveStopData () {
      const el = this.mrElements[0]
      return {
        top: (el.style.top.indexOf('%') !== -1 || el.style.top === 'auto')
            ? el.style.top
            : parseInt(el.style.top),
        left: (el.style.left.indexOf('%') !== -1 || el.style.left === 'auto')
            ? el.style.left
            : parseInt(el.style.left),
        bottom: (el.style.bottom.indexOf('%') !== -1 || el.style.bottom === 'auto')
            ? el.style.bottom
            : parseInt(el.style.bottom),
        right: (el.style.right.indexOf('%') !== -1 || el.style.right === 'auto')
            ? el.style.right
            : parseInt(el.style.right)
      }
    },

    resizeStopData () {
      return this.mrElements.map(el => {
        return {
          elId: el.childNodes[0].id,
          top: (el.style.top.indexOf('%') !== -1 || el.style.top === 'auto')
            ? el.style.top
            : parseInt(el.style.top),
          left: (el.style.left.indexOf('%') !== -1 || el.style.left === 'auto')
            ? el.style.left
            : parseInt(el.style.left),
          bottom: (el.style.bottom.indexOf('%') !== -1 || el.style.bottom === 'auto')
            ? el.style.bottom
            : parseInt(el.style.bottom),
          right: (el.style.right.indexOf('%') !== -1 || el.style.right === 'auto')
            ? el.style.right
            : parseInt(el.style.right),
          height: (el.style.height.indexOf('%') !== -1 || el.style.height === 'auto')
            ? el.style.height
            : parseInt(el.style.height),
          width: (el.style.width.indexOf('%') !== -1 || el.style.width === 'auto')
            ? el.style.width
            : parseInt(el.style.width)
        }
      })
    },

    selectStopData () {
      return {
        top: parseInt(this.$refs.selectionArea.style.top),
        bottom: parseInt(this.$refs.selectionArea.style.height) + parseInt(this.$refs.selectionArea.style.top),
        left: parseInt(this.$refs.selectionArea.style.left),
        right: parseInt(this.$refs.selectionArea.style.width) + parseInt(this.$refs.selectionArea.style.left)
      }
    }
  }
}
</script>


<style scoped>
.mr-container {
  position: relative;
  outline: none;
}

.selection-area {
  position: absolute;
  border: 1px solid #03a9f4;
  background-color: rgba(3, 169, 244, .08);
}
</style>
