import { LocalStorage } from 'quasar'
const { v4: uuidV4 } = require('uuid')

export default ({ Vue }) => {
  Vue.prototype.$userId = LocalStorage.getItem('userId') ? LocalStorage.getItem('userId') : uuidV4()
}
