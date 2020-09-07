const common = {
  state: {
    username: '用户1',
    isFront: true,
    loading: false,
    rowTmp: {}
  },
  mutations: {
    setUsername(state, n) {
      state.username = n
    },
    switchMode(state) {
      state.isFront = !state.isFront
    },
    setLoading(state, n) {
      state.loading = n
    },
    setRowTmp(state, n) {
      state.rowTmp = n
    }
  }
}

export default common
