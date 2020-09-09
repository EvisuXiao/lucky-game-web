<template>
  <div>
    <group>
      <calendar v-model="date" title="比赛日期" @on-change="getSchedules"></calendar>
    </group>
    <group v-if="!_.isEmpty(schedules)">
      <swipeout v-for="(v, k) in schedules" :key="k">
        <swipeout-item>
          <div slot="right-menu">
            <swipeout-button @click.native="deleteSchedule(v.id)" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" @click="editSchedule(v)">
            <card :footer="{ title: v.game_result ? '竞猜名单' : '', link: v.game_result ? '/backend/game/record?schedule_id=' + v.id : '' }">
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
                      <span class="score-box">{{ v.away_team_score }}</span>
                      <span class="result-box">{{ `(${gameResult(v.game_result, false)})` }}</span>
                    </div>
                  </template>
                </flexbox-item>
              </flexbox>
            </card>
          </div>
        </swipeout-item>
      </swipeout>
    </group>
    <divider v-else>暂无数据</divider>
    <group>
      <x-button type="primary" @click.native="addSchedule">添加</x-button>
      <x-button type="primary" @click.native="generateSchedule">随机生成</x-button>
    </group>
    <x-dialog v-model="showDialog" hide-on-blur>
      <group>
        <cell title="主队得分">
          <x-number v-model="form.home_team_score" fillable :min="1" :max="1000"></x-number>
        </cell>
        <cell title="客队得分">
          <x-number v-model="form.away_team_score" fillable :min="1" :max="1000"></x-number>
        </cell>
      </group>
      <group>
        <x-button type="primary" @click.native="saveScore">提交</x-button>
      </group>
    </x-dialog>
  </div>
</template>

<script>
  import { Calendar, Card, Swipeout, SwipeoutButton, SwipeoutItem, XDialog, XNumber } from 'vux'
  import { getTeams, getSchedules, generateSchedule, updateSchedule, deleteSchedule } from '@api'
  import { parseDate, parseMinuteTime } from '@utils'
  export default {
    components: {
      Calendar,
      Card,
      Swipeout,
      SwipeoutButton,
      SwipeoutItem,
      XDialog,
      XNumber
    },
    data() {
      return {
        date: '',
        schedules: [],
        form: {
          id: 0,
          home_team_score: 0,
          away_team_score: 0,
          home_team_score_raw: 0,
          away_team_score_raw: 0
        },
        showDialog: false,
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
      saveScore() {
        if (this.form.home_team_score === this.form.home_team_score_raw && this.form.away_team_score === this.form.away_team_score_raw) {
          this.showAlert('比分没有更新')
          return
        }
        const data = this._.cloneDeep(this.form)
        delete data.home_team_score_raw
        delete data.away_team_score_raw
        updateSchedule(data).then(msg => {
          this.showToast(msg)
          this.schedules.map(v => {
            if (v.id === data.id) {
              v.home_team_score = data.home_team_score
              v.away_team_score = data.away_team_score
              v.game_result = v.home_team_score > v.away_team_score ? 1 : (v.home_team_score < v.away_team_score ? 3 : 2)
              return v
            }
          })
          this.showDialog = false
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
      },
      editSchedule(row) {
        this.form = {
          id: row.id,
          home_team_score: row.home_team_score,
          away_team_score: row.away_team_score,
          home_team_score_raw: row.home_team_score,
          away_team_score_raw: row.away_team_score
        }
        this.showDialog = true
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
