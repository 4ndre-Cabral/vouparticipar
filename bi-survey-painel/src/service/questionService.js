import axios from 'axios'
const questionURL = `${process.env.API}/questions`

export default {
  getAll () {
    let url = `${questionURL}/`
    return axios.get(url)
  },
  add (question) {
    let url = `${questionURL}`
    return axios.post(url, question)
  },
  addOrUpdate (question) {
    if (question._id) {
      let url = `${questionURL}/${question._id}`
      return axios.patch(url, question)
    } else {
      let url = `${questionURL}`
      return axios.post(url, question)
    }
  },
  getById (id) {
    let url = `${questionURL}/${id}`
    return axios.get(url)
  },
  update (question) {
    let url = `${questionURL}/${question._id}`
    return axios.patch(url, question)
  },
  delete (ids) {
    let url = `${questionURL}/${ids}`
    return axios.delete(url)
  }
}
