import axios from 'axios'
const regionURL = `${process.env.API}/geometries`

export default {
  getAll () {
    let url = `${regionURL}/`
    return axios.get(url)
  },
  add (region) {
    let url = `${regionURL}`
    return axios.post(url, region)
  },
  addOrUpdate (region) {
    if (region._id) {
      let url = `${regionURL}/${region._id}`
      return axios.patch(url, region)
    } else {
      let url = `${regionURL}`
      return axios.post(url, region)
    }
  },
  getById (id) {
    let url = `${regionURL}/${id}`
    return axios.get(url)
  },
  getAllById (id) {
    let url = `${regionURL}/all/${id}`
    return axios.get(url)
  },
  update (region) {
    let url = `${regionURL}/${region._id}`
    return axios.patch(url, region)
  },
  delete (ids) {
    let url = `${regionURL}/${ids}`
    return axios.delete(url)
  }
}
