<template>
  <div>
    <template v-if="!_.isEmpty(record)">
      <x-table>
        <tbody>
          <tr v-for="(v, k) in record" :key="k">
            <td><span class="user-text">{{ v.user_nickname }}</span></td>
            <td><span class="user-text">{{ v.user_phone }}</span></td>
            <td><span class="lucky-text" :style="{ color: v.success ? 'red' : '' }">{{ v.success ? '竞猜成功' : '竞猜失败' }}</span></span></td>
            <td><span class="lucky-text" :style="{ color: v.lucky ? 'gold' : '' }">{{ v.lucky ? '已中奖' : '未中奖' }}</span></td>
            <td><span class="time-text">{{ v.created_at }}</span></td>
          </tr>
        </tbody>
      </x-table>
      <group>
        <x-button type="primary" :disabled="!hasSuccess" @click.native="chooseLuckyUser">开奖</x-button>
      </group>
    </template>
    <divider v-else>暂无数据</divider>
  </div>
</template>

<script>
  import { XTable } from 'vux'
  import { getScheduleRecord, chooseLuckyUser } from '@api'
  export default {
    components: {
      XTable
    },
    data() {
      return {
        schedule_id: 0,
        record: []
      }
    },
    computed: {
      hasSuccess() {
        return this.record.some(v => {
          return v.success
        })
      }
    },
    created() {
      this.schedule_id = this.$route.query.schedule_id || 0
    },
    mounted() {
      this.getScheduleRecord()
    },
    methods: {
      getScheduleRecord() {
        getScheduleRecord(this.schedule_id).then(data => {
          this.record = data
        })
      },
      chooseLuckyUser() {
        chooseLuckyUser(this.schedule_id).then(msg => {
          this.showToast(msg)
          this.getScheduleRecord()
        })
      }
    }
  }
</script>

<style scoped>
  .user-text {
    font-size: 14px;
  }
  .lucky-text {
    font-size: 15px;
  }
  .time-text {
    font-size: 13px;
    color: #9999;
  }
</style>
