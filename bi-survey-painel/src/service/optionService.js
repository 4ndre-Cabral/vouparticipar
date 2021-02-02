import axios from 'axios'
const baseUrl = process.env.API
const optonURL = `${baseUrl}/options`

export default {
  getAll () {
    let url = `${optonURL}/`
    return axios.get(url)
  },
  add (option) {
    let url = `${optonURL}`
    return axios.post(url, option)
  },
  duplicate (options) {
    let url = `${optonURL}/saveAll`
    return axios.post(url, { options: options })
  },
  addOrUpdate (option) {
    if (option._id) {
      let url = `${optonURL}/${option._id}`
      return axios.patch(url, option)
    } else {
      let url = `${optonURL}`
      return axios.post(url, option)
    }
  },
  getById (id) {
    let url = `${optonURL}/${id}`
    return axios.get(url)
  },
  update (option) {
    let url = `${optonURL}/${option._id}`
    return axios.patch(url, option)
  },
  delete (ids) {
    let url = `${optonURL}/${ids}`
    return axios.delete(url)
  },

  uploadOptionPicture (formData, fileName) {
    let name = ''
    if (fileName && fileName !== '') name = fileName
    let url = `${baseUrl}/upload/${name}`
    return axios.post(url, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
      }
    })
  }
}
