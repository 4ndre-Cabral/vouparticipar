import Vue from 'vue'
import Vuex from 'vuex'
import config from './module/config'
import event from './module/event'
import GAuth from 'vue-google-oauth2'
// import example from './module-example'

Vue.use(Vuex)
const gauthOption = {
  clientId: process.env.GOOGLE_OAUTH_ID,
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      config, event
    }

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
  })

  return Store
}
