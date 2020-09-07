<template>
  <div>
    <panel :footer="{ url: '/backend/team/add', title: '添加' }">
      <template slot="body">
        <swipeout v-for="(v, k) in teams" :key="k">
          <swipeout-item>
            <div slot="right-menu">
              <swipeout-button @click.native="deleteTeam(v.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="weui-media-box weui-media-box_appmsg" @click="updateTeam(v)">
              <div class="weui-media-box__hd" v-if="v.icon">
                <img class="weui-media-box__thumb" :src="v.icon" alt="">
              </div>
              <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title" v-html="v.name"></h4>
                <p class="weui-media-box__desc" v-html="v.en_name"></p>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </template>
    </panel>
  </div>
</template>

<script>
  import { Panel, Swipeout, SwipeoutButton, SwipeoutItem } from 'vux'
  import { getTeams, deleteTeam } from '@api'
  export default {
    components: {
      Panel,
      Swipeout,
      SwipeoutButton,
      SwipeoutItem
    },
    data() {
      return {
        teams: []
      }
    },
    mounted() {
      this.getTeams()
    },
    methods: {
      getTeams() {
        getTeams().then(data => {
          this.teams = data
        })
      },
      updateTeam(item) {
        this.$store.commit('setRowTmp', item)
        this.$router.push({ path: '/backend/team/edit' })
      },
      deleteTeam(id) {
        deleteTeam(id).then(msg => {
          this.showToast(msg)
          this.teams = this.teams.filter(v => {
            return v.id !== id
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>
