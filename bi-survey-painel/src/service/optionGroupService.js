import axios from 'axios'
const optonURL = `${process.env.API}/optionGroups`

export default {
  getAll () {
    let url = `${optonURL}/`
    return axios.get(url)
  },
  add (optionGroup) {
    let url = `${optonURL}`
    return axios.post(url, optionGroup)
  },
  addOrUpdate (optionGroup) {
    if (optionGroup._id) {
      let url = `${optonURL}/${optionGroup._id}`
      return axios.patch(url, optionGroup)
    } else {
      let url = `${optonURL}`
      return axios.post(url, optionGroup)
    }
  },
  getById (id) {
    let url = `${optonURL}/${id}`
    return axios.get(url)
  },
  update (optionGroup) {
    let url = `${optonURL}/${optionGroup._id}`
    return axios.patch(url, optionGroup)
  },
  delete (ids) {
    let url = `${optonURL}/${ids}`
    return axios.delete(url)
  }
}
