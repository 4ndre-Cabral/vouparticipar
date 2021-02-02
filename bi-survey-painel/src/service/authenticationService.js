import axios from 'axios'
import JwtDecoder from 'jwt-decode'

export default {
  TOKEN_NAME: 'default_auth_token',

  autorizar (chave) {
    let url = `${process.env.API}/auth/autorizar`
    let formData = new FormData()
    formData.append('chave', chave)
    return axios.post(url, formData)
  },

  setToken (token) {
    if (token) {
      this.$auth.token(token)
    }
  },

  getUser () {
    return this.getJwt().user
  },

  getToken () {
    return localStorage.getItem(this.TOKEN_NAME)
  },

  deleteToken () {
    localStorage.removeItem(this.TOKEN_NAME)
  },

  getJwt () {
    let token = this.getToken()
    if (token !== null && token !== undefined) {
      let jwt = JwtDecoder(token)

      return jwt
    }

    return null
  }
}
