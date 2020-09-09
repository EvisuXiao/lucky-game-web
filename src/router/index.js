import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@views/layout'
import NotFound from '@views/not-found'

Vue.use(Router)

export const constantRouters = [
  { path: '/', name: 'index', redirect: '/frontend/user' },
  {
    path: '/frontend/user',
    name: 'front_user',
    component: Layout,
    redirect: '/frontend/user/index',
    children: [
      {
        path: 'index',
        name: 'frontend_user_index',
        component: () => import('@views/frontend/user'),
        meta: {title: '用户'}
      }]
  },
  {
    path: '/frontend/game',
    name: 'frontend_game',
    component: Layout,
    redirect: '/frontend/game/schedule',
    children: [
      {
        path: 'schedule',
        name: 'frontend_game_schedule',
        component: () => import('@views/frontend/game/schedule'),
        meta: { title: '赛程' }
      }
    ]
  },
  {
    path: '/backend/user',
    name: 'backend_user',
    component: Layout,
    redirect: '/backend/user/index',
    children: [
      {
        path: 'index',
        name: 'backend_user_index',
        component: () => import('@views/backend/user'),
        meta: { title: '用户' }
      },
      {
        path: 'add',
        name: 'backend_user_add',
        component: () => import('@views/backend/user/add'),
        meta: { title: '添加用户' }
      },
      {
        path: 'edit',
        name: 'backend_user_edit',
        component: () => import('@views/backend/user/edit'),
        meta: { title: '编辑用户' }
      }
    ]
  },
  {
    path: '/backend/team',
    name: 'backend_team',
    component: Layout,
    redirect: '/backend/team/index',
    children: [
      {
        path: 'index',
        name: 'backend_team_index',
        component: () => import('@views/backend/team'),
        meta: { title: '球队' }
      },
      {
        path: 'add',
        name: 'backend_team_add',
        component: () => import('@views/backend/team/add'),
        meta: { title: '添加球队' }
      },
      {
        path: 'edit',
        name: 'backend_team_edit',
        component: () => import('@views/backend/team/edit'),
        meta: { title: '编辑球队' }
      }
    ]
  },
  {
    path: '/backend/game',
    name: 'backend_game',
    component: Layout,
    redirect: '/backend/game/schedule',
    children: [
      {
        path: 'schedule',
        name: 'backend_game_schedule',
        component: () => import('@views/backend/game/schedule'),
        meta: { title: '赛程' }
      },
      {
        path: 'add',
        name: 'backend_game_add',
        component: () => import('@views/backend/game/add'),
        meta: { title: '添加比赛' }
      }
    ]
  },
  {
    path: '/backend/setting',
    name: 'backend_setting',
    component: Layout,
    redirect: '/backend/setting/index',
    children: [
      {
        path: 'index',
        name: 'backend_setting_index',
        component: () => import('@views/backend/setting'),
        meta: { title: '设置' }
      }
    ]
  },
  { path: '*', name: 'not-found', component: NotFound }
]
export default new Router({
  routes: constantRouters
})
