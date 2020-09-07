<template>
  <div style="height: 100%">
    <view-box :body-padding-top="headerHeight" :body-padding-bottom="bottomHeight">
      <x-header ref="header" slot="header" class="layout-header" :title="title" :right-options="{ showMore: true }" @on-click-more="switchMode"></x-header>
      <router-view></router-view>
      <tabbar ref="footer" slot="bottom" class="layout-footer">
        <tabbar-item v-for="(v, k) in tabs" :key="k" :link="v.link" :selected="selected(v.link)">
          <span slot="label">{{ v.title }}</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
  import { Drawer, Tabbar, TabbarItem, ViewBox, XHeader } from 'vux'
  export default {
    components: {
      Drawer,
      Tabbar,
      TabbarItem,
      ViewBox,
      XHeader
    },
    data() {
      return {
        title: this.$route.meta.title,
        headerHeight: '0',
        bottomHeight: '0'
      }
    },
    computed: {
      tabs() {
        const backend = [
          { title: '用户', link: '/backend/user' },
          { title: '球队', link: '/backend/team' },
          { title: '赛程', link: '/backend/game' },
          { title: '设置', link: '/backend/setting' }
        ]
        return backend
      }
    },
    mounted() {
      this.headerHeight = this.$refs.header.$el.offsetHeight + 'px'
      this.bottomHeight = this.$refs.footer.$el.offsetHeight + 'px'
    },
    methods: {
      switchMode() {
        this.$store.commit('switchMode')
        this.showToast('切换为' + (this.$store.getters.isFront ? '前台' : '后台'))
      },
      selected(link) {
        return this.$route.matched[0].path === link
      }
    }
  }
</script>

<style scoped>
  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  .layout-header {
    width:100%;
    position:fixed;
    left:0;
    top:0;
    z-index:100;
  }
  .layout-footer {
    width:100%;
    position:fixed;
    left:0;
    bottom:0;
    z-index:100;
  }
</style>
