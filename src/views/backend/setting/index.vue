<template>
  <div>
    <group>
      <cell title="每场中奖人数">
        <x-number v-model="settings.success_num" fillable :min="1" :max="1000"></x-number>
      </cell>
    </group>
    <group>
      <x-button type="primary" @click.native="updateSettings">提交</x-button>
    </group>
  </div>
</template>

<script>
  import { XNumber } from 'vux'
  import { getSettings, updateSettings } from '@api'
  export default {
    components: {
      XNumber
    },
    data() {
      return {
        settings: {
          success_num: 0
        }
      }
    },
    mounted() {
      this.getSettings()
    },
    methods: {
      getSettings() {
        getSettings().then(data => {
          this.settings = data
        })
      },
      updateSettings() {
        updateSettings(this.settings).then(msg => {
          this.showToast(msg)
        })
      }
    }
  }
</script>

<style scoped>
</style>
