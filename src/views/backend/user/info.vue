<template>
  <div>
    <group>
      <x-input v-model="user.nickname" title="昵称" required></x-input>
      <x-input v-model="user.phone" title="手机号" is-type="china-mobile" required></x-input>
      <x-input v-model="user.location" title="地区"></x-input>
      <x-input v-model="user.wechat_id" title="微信ID"></x-input>
    </group>
    <group>
      <x-button type="primary" text="提交" @click.native="submit"></x-button>
    </group>
  </div>
</template>

<script>
  import { addUser, updateUser } from '@api'
  export default {
    props: {
      isAdd: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        user: {
          id: 0,
          nickname: '',
          phone: '',
          wechat_id: '',
          location: ''
        }
      }
    },
    mounted() {
      if (!this.isAdd) {
        for (const i in this.user) {
          this.user[i] = this.$store.getters.rowTmp[i]
        }
      }
    },
    methods: {
      submit() {
        if (this._.isEmpty(this.user.nickname)) {
          this.errMsg('昵称不可为空')
          return
        }
        if (this._.isEmpty(this.user.phone)) {
          this.errMsg('手机号不可为空')
          return
        }
        let data = {}
        if (this.isAdd) {
          data = this._.cloneDeep(this.user)
          delete data.id
        } else {
          let changed = false
          this._.forIn(this.user, (v, k) => {
            if (!this._.isEqual(v, this.$store.getters.rowTmp[k])) {
              data[k] = v
              changed = true
            }
          })
          if (!changed) {
            this.showAlert('信息没有改变')
            return
          }
          data.id = this.user.id
        }
        const res = this.isAdd ? addUser(data) : updateUser(data)
        res.then(msg => {
          this.showToast(msg)
          this.$router.back()
        })
      }
    }
  }
</script>

<style scoped>
</style>
