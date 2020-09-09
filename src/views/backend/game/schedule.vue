<template>
  <div>
    <group>
      <calendar v-model="date" title="比赛日期" @on-change="getSchedules"></calendar>
    </group>
    <group>
      <swipeout v-for="(v, k) in schedules" :key="k">
        <swipeout-item>
          <div slot="right-menu">
            <swipeout-button @click.native="deleteSchedule(v.id)" type="warn">删除</swipeout-button>
          </div>
          <card slot="content">
            <flexbox slot="content">
              <flexbox-item :style="{ color: resultColor(v.game_result, true) }" :span="5">
                <div class="team-box team-text">
                  <span>{{ _.get(teams, v.home_team_id + '.name') }}</span>
                  <span class="result-box">{{ '(主)' }}</span>
                </div>
                <div class="team-box en-text">{{ _.get(teams, v.home_team_id + '.en_name') }}</div>
                <template v-if="v.game_result > 0">
                  <div class="team-box score-text">
                    <span class="score-box">{{ v.home_team_score }}</span>
                    <span class="result-box">{{ `(${gameResult(v.game_result, true)})` }}</span>
                  </div>
                </template>
              </flexbox-item>
              <flexbox-item :span="2">
                <div class="team-box">VS</div>
                <div class="team-box time-text">{{ parseMinuteTime(v.game_time) }}</div>
              </flexbox-item>
              <flexbox-item :style="{ color: resultColor(v.game_result, false) }" :span="5">
                <div class="team-box team-text">
                  <span>{{ _.get(teams, v.away_team_id + '.name') }}</span>
                  <span class="result-box">{{ '(客)' }}</span>
                </div>
                <div class="team-box en-text">{{ _.get(teams, v.away_team_id + '.en_name') }}</div>
                <template v-if="v.game_result > 0">
                  <div class="team-box score-text">
                    <span class="score-box">{{ v.home_team_score }}</span>
                    <span class="result-box">{{ `(${gameResult(v.game_result, false)})` }}</span>
                  </div>
                </template>
              </flexbox-item>
            </flexbox>
          </card>
        </swipeout-item>
      </swipeout>
    </group>
    <group>
      <x-button type="primary" @click.native="addSchedule">添加</x-button>
      <x-button type="primary" @click.native="generateSchedule">随机生成</x-button>
    </group>
  </div>
</template>

<script>
  import { Calendar, Card, Swipeout, SwipeoutButton, SwipeoutItem } from 'vux'
  import { getTeams, getSchedules, generateSchedule, deleteSchedule } from '@api'
  import { parseDate, parseMinuteTime } from '@utils'
  export default {
    components: {
      Calendar,
      Card,
      Swipeout,
      SwipeoutButton,
      SwipeoutItem
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
      gameResult(result, isHome) {
        const homeMap = {
          0: '无',
          1: '胜',
          2: '平',
          3: '负'
        }
        const awayMap = {
          0: '无',
          1: '负',
          2: '平',
          3: '胜'
        }
        return this._.get(isHome ? homeMap : awayMap, result)
      },
      resultColor(result, isHome) {
        const homeMap = {
          0: '',
          1: 'red',
          2: 'blue',
          3: 'green'
        }
        const awayMap = {
          0: '',
          1: 'green',
          2: 'blue',
          3: 'red'
        }
        return this._.get(isHome ? homeMap : awayMap, result)
      },
      parseMinuteTime(val) {
        return parseMinuteTime(val)
      },
      generateSchedule() {
        generateSchedule(this.date).then(msg => {
          this.showToast(msg)
          this.getSchedules()
        })
      },
      deleteSchedule(id) {
        deleteSchedule(id).then(msg => {
          this.showToast(msg)
          this.schedules = this.schedules.filter(v => {
            return v.id !== id
          })
        })
      },
      addSchedule() {
        this.$router.push({ path: '/backend/game/add' })
      }
    }
  }
</script>

<style scoped>
  .team-box {
    padding: 3px 10px 3px 10px;
  }
  .team-text {
    font-size: 16px;
  }
  .en-text {
    font-size: 15px;
  }
  .time-text {
    font-size: 13px;
    color: gray;
  }
  .score-text {
    font-size: 20px;
  }
  .score-box {
    padding-left: 25px;
  }
  .result-box {
    padding-left: 5px;
  }
</style>
