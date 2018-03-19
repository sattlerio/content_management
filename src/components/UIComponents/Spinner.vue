<template>
  <div class="loading">
      <fade-loader :color="color" :size="size"></fade-loader>
  </div>
</template>

<script>
  import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

  export default {
    data () {
      return {
        color: '#cc181e',
        color1: '#5bc0de',
        size: '45px',
        margin: '2px',
        radius: '2px'
      }
    },
    components: {
      FadeLoader
    }
  }
</script>
<style>
  .loading{
    margin-top: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
