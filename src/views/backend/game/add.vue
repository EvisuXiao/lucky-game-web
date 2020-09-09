<template>
  <div>
    <group>
      <calendar v-model="date" title="比赛日期"></calendar>
    </group>
    <group v-for="(v, k) in games" :key="k">
      <flexbox :gutter="4">
        <flexbox-item :span="4">
          <popup-picker v-model="v.home_team_id" title="主队" show-name :data="teams"></popup-picker>
        </flexbox-item>
        <flexbox-item :span="2">
          <datetime v-model="v.game_time" format="HH:mm" :minute-list="['00', '15', '30', '45']"></datetime>
        </flexbox-item>
        <flexbox-item :span="4">
          <popup-picker v-model="v.away_team_id" title="客队" show-name :data="teams"></popup-picker>
        </flexbox-item>
        <flexbox-item :span="1">
          <template v-if="k === 0">
            <x-icon v-if="k === 0" type="ios-plus-outline" size="30" @click="addGame"></x-icon>
          </template>
          <template v-else>
            <x-icon type="ios-minus-outline" size="30" @click="removeGame(k)"></x-icon>
          </template>
        </flexbox-item>
      </flexbox>
    </group>
    <group>
      <x-button type="primary" :disabled="!hasSchedule" @click.native="addSchedule">提交</x-button>
    </group>
  </div>
</template>

<script>
  import { Calendar, Datetime, PopupPicker } from 'vux'
  import { getTeams, addSchedule } from '@api'
  import { parseDate } from '@utils'
  export default {
    components: {
      Calendar,
      Datetime,
      PopupPicker
    },
    data() {
      return {
        date: '',
        games: [{
          home_team_id: [''],
          away_team_id: [''],
          game_time: '09:00'
        }],
        teams: []
      }
    },
    computed: {
      hasSchedule() {
        return !this._.isEmpty(this.schedules) && this.schedules[0].home_team_id > 0 && this.schedules[0].away_team_id > 0
      },
      schedules() {
        const schedules = []
        this.games.forEach(v => {
          const schedule = {
            home_team_id: parseInt(v.home_team_id[0]) || 0,
            away_team_id: parseInt(v.away_team_id[0]) || 0,
            game_time: `${this.date} ${v.game_time}`
          }
          if (schedule.home_team_id === 0 || schedule.away_team_id === 0 || schedule.home_team_id === schedule.away_team_id) {
            return
          }
          schedules.push(schedule)
        })
        return schedules
      }
    },
    created() {
      this.date = this.$store.getters.rowTmp.date || parseDate()
    },
    mounted() {
      this.getTeams()
    },
    beforeDestroy() {
      this.$store.commit('setRowTmp', {})
    },
    methods: {
      getTeams() {
        getTeams().then(data => {
          const teams = []
          data.forEach(v => {
            teams.push({ value: v.id.toString(), name: v.name })
          })
          this.teams = [teams]
        })
      },
      addGame() {
        this.games.push({
          home_team_id: [''],
          away_team_id: [''],
          game_time: '09:00'
        })
      },
      removeGame(idx) {
        this.games = this.games.filter((v, k) => {
          return k !== idx
        })
      },
      addSchedule() {
        addSchedule({ schedules: this.schedules }).then((msg) => {
          this.showToast(msg)
          this.$router.back()
        })
      }
    }
  }
</script>

<style scoped>

</style>
