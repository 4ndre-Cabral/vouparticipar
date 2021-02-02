import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { abilitiesPlugin, Can } from '@casl/vue'
import { AbilityBuilder, Ability } from '@casl/ability'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueClipboard from 'vue-clipboard2'
import { LocalStorage } from 'quasar'

Vue.use(VueRouter)

const { rules } = new AbilityBuilder()
Vue.use(abilitiesPlugin, new Ability(rules))
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_KEY,
    libraries: ['places', 'visualization', 'drawing']
  }
})
Vue.use(VueClipboard)
Vue.component('Can', Can)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Vue.router = Router
  Vue.router.beforeEach((to, from, next) => {
    const user = LocalStorage.getItem('user')
    const { can, rules } = new AbilityBuilder()
    const userRole = (user && user !== 'null') ? user.userRole[0] : null
    if (userRole) {
      Vue.prototype.$ability.update([])
      can('read', userRole.read)
      can('create', userRole.create)
      can('update', userRole.update)
      can('delete', userRole.delete)
      Vue.prototype.$ability.update(rules)
    }
    if (to.name) {
      switch (to.name) {
        case 'Formulários':
        case 'Dados do formulário':
          if (Vue.prototype.$ability.can('read', 'surveys')) {
            next()
          } else {
            next('/resultados')
          }
          break
        case 'Lista de usuários':
        case 'Dados do usuário':
          if (Vue.prototype.$ability.can('read', 'users')) {
            next()
          } else {
            next('/resultados')
          }
          break
        case 'Lista de Opções':
        case 'Dados lista de opções':
          if (Vue.prototype.$ability.can('read', 'options')) {
            next()
          } else {
            next('/formularios')
          }
          break
        case 'Regiões':
          if (Vue.prototype.$ability.can('read', 'regions')) {
            next()
          } else {
            next('/formularios')
          }
          break
        default :
          next()
      }
    }
  })

  return Router
}
