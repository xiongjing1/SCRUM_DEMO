<template>
  <div id="app">
    <LoginView/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
<script>




import LoginView from "@/views/LoginView";
export default {
  components: {LoginView}
}
</script>