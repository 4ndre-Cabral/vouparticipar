import axios from 'axios'
const USER_URL = `${process.env.API}/users`
const USER_ROLE_URL = `${process.env.API}/usersRole`

export default {
  getAll () {
    let url = `${USER_URL}`
    return axios.get(url)
  },
  getById (id) {
    let url = `${USER_URL}/${id}`
    return axios.get(url)
  },
  save (user) {
    let url = `${USER_URL}/${user._id ? user._id : 'signup'}`
    return user._id ? axios.patch(url, user) : axios.post(url, user)
  },
  update (user) {
    let url = `${USER_URL}/${user._id}`
    return axios.patch(url, user)
  },
  delete (ids) {
    let url = `${USER_URL}/${ids}`
    return axios.delete(url)
  },
  new (user) {
    let url = `${USER_URL}/signup`
    return axios.post(url, user)
  },
  getAllUserRole () {
    let url = `${USER_ROLE_URL}`
    return axios.get(url)
  },
  login (credentials, auth) {
    window.Auth = auth
    return this.onlineLogin(credentials)
  },
  loginGoogle (accessToken) {
    let url = `${process.env.API}/auth/loginGoogle`
    return axios.post(url, { accessToken: accessToken })
  },
  onlineLogin (credentials) {
    // Define login params
    var params = {
      data: credentials,
      rememberMe: false,
      fetchUser: false
    }
    // Try login
    return new Promise((resolve, reject) => {
      window.Auth.login(params).then((response) => {
        // If ok, set this for future database save
        if (response.response && response.response.data.error) {
          reject(response.response.data)
        }
        resolve(response.data)
      }, (error) => {
        reject(error)
      })
    })
  },
  uploadProfilePicture (formData, fileName) {
    let name = ''
    if (fileName && fileName !== '') name = fileName
    let url = `${USER_URL}/upload/${name}`
    return axios.post(url, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
      }
    })
  }
}
