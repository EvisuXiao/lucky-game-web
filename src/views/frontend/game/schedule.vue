<template>
  <div>
    <group>
      <calendar v-model="date" title="比赛日期" @on-change="getSchedules"></calendar>
    </group>
    <group>
      <card v-for="(v, k) in schedules" :key="k">
        <flexbox slot="content">
          <flexbox-item class="en-text" :span="2">
            <radio v-model="v.my_bet" :options="betOption" :disabled="!canBet(v)"></radio>
          </flexbox-item>
          <flexbox-item :style="{ color: resultColor(v.game_result, true) }" :span="4">
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
          <flexbox-item :style="{ color: resultColor(v.game_result, false) }" :span="4">
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
    </group>
    <group>
      <x-button type="primary" :disabled="_.isEmpty(myBet)" @click.native="betGame">提交</x-button>
    </group>
  </div>
</template>

<script>
  import { Calendar, Card, Radio } from 'vux'
  import moment from 'moment'
  import { getTeams, getGames, betGames } from '@api'
  import { parseDate, parseMinuteTime } from '@utils'
  export default {
    components: {
      Calendar,
      Card,
      Radio
    },
    data() {
      return {
        date: '',
        schedules: [],
        teams: {},
        betOption: [
          { key: '1', value: '胜' },
          { key: '2', value: '平' },
          { key: '3', value: '负' }
        ]
      }
    },
    computed: {
      myBet() {
        const bet = {}
        this.schedules.forEach(v => {
          if (this.canBet(v) && v.my_bet > 0) {
            bet[v.id] = v.my_bet
          }
        })
        return bet
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
        getGames(this.$store.getters.username, this.date).then(data => {
          this.schedules = data.map(v => {
            v.my_bet = v.bet
            return v
          })
        })
      },
      betGame() {
        betGames(this.$store.getters.username, this.myBet).then(msg => {
          this.showToast(msg)
          this.getSchedules()
        })
      },
      canBet(row) {
        return row.game_result === 0 && row.bet === 0 && moment(row.game_time).isAfter(moment())
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
    padding-left: 15px;
  }
  .result-box {
    padding-left: 5px;
  }
</style>
