import axios from 'axios'
const baseUrl = `${process.env.API}/answers`
export default {
  getAll () {
    const url = `${baseUrl}/`
    return axios.get(url)
  },
  add (answer) {
    const url = `${baseUrl}`
    return axios.post(url, answer)
  },
  getBySurveyId (id) {
    const url = `${baseUrl}/${id}`
    return axios.get(url)
  },
  getIfAlredyExist (filter) {
    const url = `${baseUrl}/allByFilter`
    return axios.post(url, filter)
  },
  getUserIp () {
    return axios.get('https://www.cloudflare.com/cdn-cgi/trace')
  }
}
