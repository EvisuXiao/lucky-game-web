import * as Config from './config'
import http from '@utils/request'
import store from '@/store'
import _ from 'lodash'

function request(url, data = {}, method = 'GET', field = 'data') {
  store.commit('setLoading', true)
  const config = { url: '/api' + url, method: method }
  _.set(config, method.toUpperCase() === 'GET' ? 'params' : 'data', data)
  return http(config).then(response => {
    if (!_.isEmpty(field)) {
      return Promise.resolve(_.get(response, field))
    }
    return Promise.resolve(response)
  }).catch(err => {
    return Promise.reject(err)
  }).finally(() => {
    store.commit('setLoading', false)
  })
}

export function getUsers() {
  return request(Config.UserInfo)
}

export function addUser(data) {
  return request(Config.UserInfo, data, 'POST', 'message')
}

export function updateUser(data) {
  return request(Config.UserInfo, data, 'PUT', 'message')
}

export function deleteUser(id) {
  return request(Config.UserInfo, { id: id }, 'DELETE', 'message')
}

export function getTeams() {
  return request(Config.TeamInfo)
}

export function addTeam(data) {
  return request(Config.TeamInfo, data, 'POST', 'message')
}

export function updateTeam(data) {
  return request(Config.TeamInfo, data, 'PUT', 'message')
}

export function deleteTeam(id) {
  return request(Config.TeamInfo, { id: id }, 'DELETE', 'message')
}

export function getSchedules(date) {
  return request(Config.ScheduleInfo, { date: date })
}

export function addSchedule(data) {
  return request(Config.ScheduleInfo, data, 'POST', 'message')
}

export function updateSchedule(data) {
  return request(Config.ScheduleInfo, data, 'PUT', 'message')
}

export function deleteSchedule(id) {
  return request(Config.ScheduleInfo, { id: id }, 'DELETE', 'message')
}

export function generateSchedule(date) {
  return request(Config.ScheduleRandom, { date: date }, 'POST', 'message')
}

export function getScheduleRecord(scheduleId) {
  return request(Config.ScheduleRecord, { schedule_id: scheduleId })
}

export function chooseLuckyUser(scheduleId) {
  return request(Config.GameLucky, { schedule_id: scheduleId }, 'PUT', 'message')
}

export function getGames(nickname, date) {
  return request(Config.GameList, { nickname: nickname, date: date })
}

export function getBets(nickname) {
  return request(Config.GameBet, { nickname: nickname })
}

export function betGames(nickname, games) {
  return request(Config.GameBet, { nickname: nickname, games: games }, 'POST', 'message')
}

export function getSettings() {
  return request(Config.SettingInfo)
}

export function updateSettings(data) {
  return request(Config.SettingInfo, data, 'PUT', 'message')
}
