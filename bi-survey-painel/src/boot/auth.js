export default ({ Vue }) => {
  Vue.use(require('@websanova/vue-auth'), {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    authRedirect: '/login',
    loginData: { url: `auth/login`, method: 'POST', redirect: '/', fetchUser: false },
    logoutData: { url: `auth/logout`, method: 'POST', redirect: '/login', makeRequest: false },
    refreshData: { url: `auth/refresh`, method: 'GET', enabled: true, interval: 30 },
    fetchData: { enabled: false }
  })
}
