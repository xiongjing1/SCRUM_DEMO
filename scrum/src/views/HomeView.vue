<template>
  <div>
    <HeadSide></HeadSide>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
    </div>
</template>

<script>
// @ is an alias to /src
import HeadSide from "@/components/HeadSide";
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    HeadSide
  }
}
</script>
