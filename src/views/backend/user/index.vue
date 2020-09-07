<template>
  <div>
    <panel :footer="{ url: '/backend/user/add', title: '添加' }">
      <template slot="body">
        <swipeout v-for="(v, k) in users" :key="k">
          <swipeout-item>
            <div slot="right-menu">
              <swipeout-button @click.native="deleteUser(v.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="weui-media-box weui-media-box_appmsg" @click="updateUser(v)">
              <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title" v-html="v.nickname"></h4>
                <p class="weui-media-box__desc" v-html="`${v.phone} ${v.location}`"></p>
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
  import { getUsers, deleteUser } from '@api'
  export default {
    components: {
      Panel,
      Swipeout,
      SwipeoutButton,
      SwipeoutItem
    },
    data() {
      return {
        users: []
      }
    },
    mounted() {
      this.getUsers()
    },
    methods: {
      getUsers() {
        getUsers().then(data => {
          this.users = data
        })
      },
      updateUser(item) {
        this.$store.commit('setRowTmp', item)
        this.$router.push({ path: '/backend/user/edit' })
      },
      deleteUser(id) {
        deleteUser(id).then(msg => {
          this.showToast(msg)
          this.users = this.users.filter(v => {
            return v.id !== id
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>
