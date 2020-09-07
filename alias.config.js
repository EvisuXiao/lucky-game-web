const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@api': resolve('src/api'),
      '@views': resolve('src/views'),
      '@utils': resolve('src/utils')
    }
  }
}
