<template>
  <div>
    <group>
      <popup-picker v-model="username" title="我是" :data="users"></popup-picker>
    </group>
    <group>
      <x-button type="primary" @click.native="updateUser">提交</x-button>
    </group>
  </div>
</template>

<script>
  import { PopupPicker } from 'vux'
  import { getUsers } from '@api'
  export default {
    components: {
      PopupPicker
    },
    data() {
      return {
        username: [''],
        users: []
      }
    },
    mounted() {
      this.username[0] = this.$store.getters.username
      this.getUsers()
    },
    methods: {
      getUsers() {
        getUsers().then(data => {
          const users = []
          data.forEach(v => {
            users.push(v.nickname)
          })
          this.users = [users]
        })
      },
      updateUser() {
        this.$store.commit('setUsername', this.username[0])
        this.showToast('切换用户名成功')
      }
    }
  }
</script>

<style scoped>
</style>
