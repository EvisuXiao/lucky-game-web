import app from '@/main'
import axios from 'axios'

const request = axios.create({
  // baseURL: 'host',
  timeout: 20000
})

request.interceptors.response.use(response => {
  // 对响应数据做点什么
  const data = response.data
  if (data.code === 1) {
    return Promise.resolve(data)
  }
  app.errMsg(data.message)
  return Promise.reject(data.message)
}, error => {
  // 对响应错误做点什么
  // console.log(error.response.status)
  app.errMsg('系统异常')
  return Promise.reject(error)
})

export default request
