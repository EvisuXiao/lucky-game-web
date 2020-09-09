<template>
  <div>
    <group>
      <popup-radio v-model="filter" title="筛选" :options="filters"></popup-radio>
    </group>
    <group v-if="!_.isEmpty(newRecord)">
      <card v-for="(v, k) in newRecord" :key="k" :header="{ title: v.game_time }">
        <div slot="content" class="content-box">
          <div class="text-box">
            <span class="text-box" :style="{ color: resultColor(v.game_result, true) }">{{ _.get(teams, v.home_team_id + '.name') }}</span>
            <span v-if="v.game_result > 0" :style="{ color: resultColor(v.game_result, true) }">{{ `(${v.home_team_score})` }}</span>
            <span class="text-box">{{ gameResult(v.game_result) }}</span>
            <span class="text-box" :style="{ color: resultColor(v.game_result, false) }">{{ _.get(teams, v.away_team_id + '.name') }}</span>
            <span v-if="v.game_result > 0" :style="{ color: resultColor(v.game_result, false) }">{{ `(${v.away_team_score})` }}</span>
          </div>
          <div class="text-box">
            <span class="text-box">我的下注</span>
            <span class="text-box">{{ betResult(v.bet) }}</span>
            <span class="text-box" :style="{ color: v.success ? 'red' : '' }">{{ v.success ? '竞猜成功' : '竞猜失败' }}</span>
            <span class="text-box" :style="{ color: v.lucky ? 'gold' : '' }">{{ v.lucky ? '已中奖' : '未中奖' }}</span>
          </div>
          <div class="text-box">
            <span class="text-box">下注时间</span>
            <span class="text-box time-text">{{ v.created_at }}</span>
          </div>
        </div>
      </card>
    </group>
    <divider v-else>暂无数据</divider>
  </div>
</template>

<script>
  import { Card, PopupRadio } from 'vux'
  import { getTeams, getBets } from '@api'
  import { parseMinuteTime } from '@utils'
  export default {
    components: {
      Card,
      PopupRadio
    },
    data() {
      return {
        record: [],
        teams: {},
        filter: 'all',
        filters: [{
          key: 'all',
          value: '全部'
        }, {
          key: 'success',
          value: '仅竞猜成功'
        }, {
          key: 'lucky',
          value: '仅中奖'
        }],
        betOption: [
          { key: '1', value: '胜' },
          { key: '2', value: '平' },
          { key: '3', value: '负' }
        ]
      }
    },
    computed: {
      newRecord() {
        if (this.filter === 'all') {
          return this.record
        }
        return this.record.filter(v => {
          let flag = false
          if (this.filter === 'success') {
            flag = v.success
          } else if (this.filter === 'lucky') {
            flag = v.lucky
          }
          return flag
        })
      }
    },
    mounted() {
      this.getTeams()
      this.getRecord()
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
      getRecord() {
        getBets(this.$store.getters.username).then(data => {
          this.record = data
        })
      },
      betResult(bet) {
        const map = {
          0: '无',
          1: '主队胜',
          2: '平局',
          3: '主队负'
        }
        return map[bet]
      },
      gameResult(result) {
        const map = {
          0: 'VS',
          1: '胜',
          2: '平',
          3: '负'
        }
        return map[result]
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
  .content-box {
    font-size: 15px;
    padding: 10px;
  }
  .text-box {
    padding: 5px;
  }
  .time-text {
    color: darkgrey;
  }
</style>
