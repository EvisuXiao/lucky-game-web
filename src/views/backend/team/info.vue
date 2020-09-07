<template>
  <div>
    <group>
      <x-input v-model="team.name" title="名称" required></x-input>
      <x-input v-model="team.en_name" title="英文名称"></x-input>
    </group>
    <group>
      <x-button type="primary" text="提交" @click.native="submit"></x-button>
    </group>
  </div>
</template>

<script>
  import { addTeam, updateTeam } from '@api'
  export default {
    props: {
      isAdd: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        team: {
          id: 0,
          name: '',
          en_name: '',
          icon: ''
        }
      }
    },
    mounted() {
      if (!this.isAdd) {
        for (const i in this.team) {
          this.team[i] = this.$store.getters.rowTmp[i]
        }
      }
    },
    methods: {
      submit() {
        if (this._.isEmpty(this.team.name)) {
          this.errMsg('名称不可为空')
          return
        }
        let data = {}
        if (this.isAdd) {
          data = this._.cloneDeep(this.team)
          delete data.id
        } else {
          let changed = false
          this._.forIn(this.team, (v, k) => {
            if (!this._.isEqual(v, this.$store.getters.rowTmp[k])) {
              data[k] = v
              changed = true
            }
          })
          if (!changed) {
            this.showAlert('信息没有改变')
            return
          }
          data.id = this.team.id
        }
        const res = this.isAdd ? addTeam(data) : updateTeam(data)
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
