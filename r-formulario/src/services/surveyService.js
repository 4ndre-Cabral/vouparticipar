import axios from 'axios'
const surveyURL = `${process.env.API}/surveys`

export default {
  getById (id) {
    const url = `${surveyURL}/${id}`
    return axios.get(url)
  }
}
