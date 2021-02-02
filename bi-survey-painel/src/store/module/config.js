
import { LocalStorage } from 'quasar'

const state = {
  admin: false,
  credentials: {},
  idioma: { label: 'Português', value: 'pt-br' },
  // connection: (navigator.connection.type !== 'None'),
  connection: ('None'),
  titulo: '',
  gpsPosition: {},
  config: null,
  currentPage: null,
  leftMenuOpened: true,
  expandLeftMenu: false,
  map: null
}

const actions = {
  setTitle: ({ commit }, titulo) => {
    commit('setTitle', titulo)
  },
  setIdioma: ({ commit }, idioma) => {
    LocalStorage.set('user_lang', idioma)
    commit('setIdioma', idioma)
  },
  setAdmin: ({ commit }, admin) => {
    commit('setAdmin', admin)
  },
  setConnection: ({ commit }, connection) => {
    commit('setConnection', connection)
  },
  setCredentials: ({ commit }, credentials) => {
    commit('setCredentials', credentials)
  },
  setGpsPosition: ({ commit }, gpsPosition) => {
    commit('setGpsPosition', gpsPosition)
  },
  setConfig: ({ commit }, config) => {
    commit('setConfig', config)
  },
  setCurrentPage: ({ commit }, currentPage) => {
    commit('setCurrentPage', currentPage)
  },
  remove: ({ commit }) => {
    commit('remove', null)
  },
  reset: ({ commit }) => {
    commit('reset')
  },
  toggleLeftMenu: ({ commit }) => {
    commit('TOGGLE_LEFT_MENU')
  },
  expandLeftMenu: ({ commit }) => {
    commit('EXPAND_LEFT_MENU')
  },
  setMap: ({ commit }, map) => {
    commit('setMap', map)
  }
}

const mutations = {
  setTitle (state, titulo) {
    state.titulo = titulo
  },
  setConnection (state, connection) {
    state.connection = connection
  },
  setCredentials (state, credentials) {
    state.credentials = credentials
  },
  setGpsPosition (state, gpsPosition) {
    state.gpsPosition = gpsPosition
  },
  setAdmin (state, admin) {
    state.admin = admin
  },
  setIdioma (state, idioma) {
    state.idioma = idioma
  },
  setConfig (state, config) {
    state.config = config
  },
  setCurrentPage (state, currentPage) {
    state.currentPage = currentPage
  },
  remove (state) {
    state.toolbar = null
  },
  reset (state) {
    state.toolbar = {}
    state.admin = false
    state.credentials = {}
    state.idioma = 'pt-br'
    // state.connection = (navigator.connection.type !== 'None')
    state.connection = ('None')
    state.titulo = ''
    state.gpsPosition = {}
    state.config = null
  },
  TOGGLE_LEFT_MENU (state) {
    state.leftMenuOpened = !state.leftMenuOpened
    if (!state.leftMenuOpened) {
      state.currentMenu = null
      state.markerSelecionado = null
    }
  },
  EXPAND_LEFT_MENU (state) {
    state.expandLeftMenu = !state.expandLeftMenu
  },
  setMap (state, map) {
    state.map = map
  }
}

const getters = {
  getTitle: state => state.titulo,
  getIdioma: state => state.idioma,
  getConnection: state => state.connection,
  getCredentials: state => state.credentials,
  getGpsPosition: state => state.gpsPosition,
  isAdmin: state => state.admin,
  getConfig: state => state.config,
  getCurrentPage: state => state.currentPage,
  getIsExpandLeftMenu: state => state.expandLeftMenu

}

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations
}
