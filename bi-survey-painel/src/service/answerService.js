import axios from 'axios'
const baseUrl = `${process.env.API}/answers`
export default {
  getAll () {
    let url = `${baseUrl}/`
    return axios.get(url)
  },
  add (answer) {
    let url = `${baseUrl}`
    return axios.post(url, answer)
  },
  getBySurveyId (id, initialDate, finalDate) {
    let url = `${baseUrl}/${id}`
    return axios.get(url, {
      params: {
        initialDate,
        finalDate
      }
    })
  },
  getIfAlredyExist (filter) {
    let url = `${baseUrl}/allByFilter`
    return axios.post(url, filter)
  },
  getTotalBySurveyId (id) {
    let url = `${baseUrl}/totalBySurveyId/${id}`
    return axios.get(url)
  },
  getUserIp () {
    return axios.get('https://www.cloudflare.com/cdn-cgi/trace')
  }
}
