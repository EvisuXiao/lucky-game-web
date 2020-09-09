<template>
  <div id="app" style="height:100%">
    <router-view></router-view>
    <loading :show="isLoading"></loading>
  </div>
</template>

<script>
  import { Loading } from 'vux'

  export default {
    name: 'app',
    components: {
      Loading
    },
    computed: {
      isLoading() {
        return this.$store.getters.loading
      }
    }
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
