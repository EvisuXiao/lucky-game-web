<template>
  <div>
    <group>
      <calendar v-model="date" title="比赛日期"></calendar>
    </group>
    <group>
      <x-button type="primary" @click.native="addSchedule">添加</x-button>
      <x-button type="primary" @click.native="generateSchedule">随机生成</x-button>
    </group>
  </div>
</template>

<script>
  import { Calendar } from 'vux'
  import { getTeams, getSchedules, generateSchedule } from '@api'
  import { parseDate } from '@utils'
  export default {
    components: {
      Calendar
    },
    data() {
      return {
        date: '',
        schedules: [],
        teams: {}
      }
    },
    created() {
      this.date = parseDate()
    },
    mounted() {
      this.getTeams()
      this.getSchedules()
    },
    methods: {
      getTeams() {
        getTeams().then(data => {
          const teams = {}
          data.forEach(v => {
            teams[v.id] = v
          })
          this.teams = teams
        })
      },
      getSchedules() {
        getSchedules(this.date).then(data => {
          this.schedules = data
        })
      },
      generateSchedule() {
        generateSchedule(this.date).then(msg => {
          this.showToast(msg)
          this.getSchedules()
        })
      },
      addSchedule() {
        this.$router.push({ path: '/backend/game/add' })
      }
    }
  }
</script>

<style scoped>

</style>
