<script>



import MrEl from '@/components/common/mr-vue/MrEl'
import StageEl from './StageEl'

export default {
  name: 'stage-el',
  props: ['elem', 'isPlain'],
  components: { MrEl },
  render: function (createElement) {
    let elementO =  this.elem

    let styles = elementO.styles
    if (this.isPlain && elementO.egglement) {
      styles = {
        ...elementO.styles,
        position: 'absolute',
        zIndex: elementO.zIndex,
        minWidth: elementO.minWidth,
        minHeight: elementO.minHeight,
        top: (typeof elementO.top === 'number') ? (elementO.top + 'px') : elementO.top,
        left: (typeof elementO.left === 'number') ? (elementO.left + 'px') : elementO.left,
        bottom: (typeof elementO.bottom === 'number') ? (elementO.bottom + 'px') : elementO.bottom,
        right: (typeof elementO.right === 'number') ? (elementO.right + 'px') : elementO.right,
        width: (typeof elementO.width === 'number') ? (elementO.width + 'px') : elementO.width,
        height: (typeof elementO.height === 'number') ? (elementO.height + 'px') : elementO.height
      }
    }

    const data = {
      'class': elementO.classes,
      'style': styles,
      'attrs': {
        id: elementO.id,
        'data-global': elementO.global,
        'data-egglement': elementO.egglement,
        'data-containegg': elementO.containegg,
        'data-componegg': elementO.componegg,
        'data-wrappegg': elementO.wrappegg,
        ...elementO.attrs
      }
    }

    let children = []
    if (elementO.text) {
      children.push(elementO.text)
    } else if (elementO.children) {
      for (let child of elementO.children) {
        children.push(createElement(StageEl, {
          'props': {
            elem: child,
            isPlain: elementO.componegg || elementO.wrappegg || this.isPlain
          }
        }))
      }
    }

    let stageElem
    if (this.isPlain) {
      stageElem = createElement(elementO.type, data, children)
    } else {
      let mrElProps = {
        active: this.isActive,
        left: elementO.left,
        top: elementO.top,
        right: elementO.right,
        bottom: elementO.bottom,
        zIndex: elementO.zIndex,
        width: elementO.width,
        height: elementO.height,
        minWidth: elementO.minWidth,
        minHeight: elementO.minHeight
      }

      stageElem = createElement(MrEl, {
        'props': (elementO.global) ? {...mrElProps, handles: null} : mrElProps,
        'on': { activated: this.activatedHandler }
      }, [ createElement(elementO.type, data, children) ])
    }

    return stageElem
  },
  computed: {
    isActive () {
      return (this.$store.state.selectedItem[0] && this.$store.state.selectedItem[0].id === this.elem.id)
    },
  },
  methods: {
    activatedHandler (e) {
      e.stopPropagation()
      e.preventDefault()
      this.$store.commit('set' , this.elem)
      console.log('bvc')
      console.log(this.$store.state.selectedItem)

     // if (e.shiftKey && !this.isActive) {
      //  this._addSelectedElement(this.elem)
     // } else if (!e.shiftKey && !this.isActive) {
     //   this._clearSelectedElements()
     //   this._addSelectedElement(this.elem)
     // }
    },

    //...mapMutations([_clearSelectedElements, _addSelectedElement])
  }
}
</script>
