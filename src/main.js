import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import App from '@/App'
import ElementUI from 'element-ui'
import axios from '@/router/axios'
import VueAxios from 'vue-axios'
import router from '@/router/router'
import store from '@/store'
import { loadStyle } from '@/util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import installPlugin from '@/plugin'
import * as filters from '@/filters' // 全局filter
import Table from '@/components/table'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/common.scss'
// 引入avue的包
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'

import basicContainer from '@/components/basic-container/main'

import { validatenull } from '@/util/validate'

Vue.prototype.validatenull = validatenull

Vue.use(ElementUI)
Vue.use(Avue)
Vue.use(VueAxios, axios)
Vue.use(Table)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)

/**
 * @description 注册全局容器
 */
Vue.component('basicContainer', basicContainer)

/**
 * @description 加载相关url地址
 */
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

/**
 * @description 加载过滤器
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/**
 * @description 动态加载阿里云字体库
 */
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
