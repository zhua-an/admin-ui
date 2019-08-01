import { checkPermission } from '@/util/util'

export default {
  install (Vue) {
    Vue.prototype.checkPermission = checkPermission
  }
}