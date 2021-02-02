
const state = {
  event: {},
  resposta: null
}

const actions = {
  setEvent: ({ commit }, event) => {
    commit('setEvent', event)
  },
  setResposta: ({ commit }, resposta) => {
    commit('setResposta', resposta)
  },
  reset: ({ commit }) => {
    commit('reset')
  }
}

const mutations = {
  setEvent (state, event) {
    state.event = event
  },
  setResposta (state, resposta) {
    state.resposta = resposta
  },
  reset (state) {
    state.event = {}
  }
}

const getters = {
  getEvent: state => state.event
}

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations
}
