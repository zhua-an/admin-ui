import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router'
import Store from '@/store/'
import {validatenull} from '@/util/validate'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
Vue.use(VueRouter)
NProgress.configure({showSpinner: false})
const lockPage = Store.getters.website.lockPage // 锁屏页
let Router = new VueRouter({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [].concat([])
})

AvueRouter.install(Router, Store)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)
Router.addRoutes([...PageRouter, ...ViewsRouter])

Router.beforeEach((to, from, next) => {
  // 缓冲设置
  if (to.meta.keepAlive === true && Store.state.tags.tagList.some(ele => {
    return ele.value === to.fullPath
  })) {
    to.meta.$keepAlive = true
  } else {
    NProgress.start()
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true
    } else {
      to.meta.$keepAlive = false
    }
  }
  const meta = to.meta || {}
  if (Store.getters.access_token) {
    if (Store.getters.isLock && to.path != lockPage) {
      next({path: lockPage})
    } else if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (Store.getters.roles.length === 0 && Object.keys(Store.getters.userInfo).length === 0) {
        Store.dispatch('GetUserInfo').then(() => {
          next({...to, replace: true})
        }).catch(() => {
          Store.dispatch('FedLogOut').then(() => {
            next({path: '/login'})
          })
        })
      } else {
        const value = to.query.src || to.fullPath
        const label = to.query.name || to.name
        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          Store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            group: Router.$avueRouter.group || []
          })
        }
        next()
      }
    }
  } else {
    if (meta.isAuth === false) {
      next()
    } else {
      next('/login')
    }
  }
})

Router.afterEach(() => {
  NProgress.done()
  const title = Store.getters.tag.label
  Router.$avueRouter.setTitle(title)
})

export default Router
