import axios from 'axios'
const baseUrl = process.env.API
const surveyURL = `${process.env.API}/surveys`

export default {
  getAll () {
    let url = `${surveyURL}/`
    return axios.get(url)
  },
  // getAllWithUser (id) {
  //   let url = `${surveyURL}/user/${id}`
  //   return axios.get(url)
  // },
  add (survey) {
    let url = `${surveyURL}`
    return axios.post(url, survey)
  },
  duplicate (survey) {
    debugger
    let url = `${surveyURL}/duplicate`
    return axios.post(url, survey)
  },
  addOrUpdate (survey) {
    if (survey._id) {
      let url = `${surveyURL}/${survey._id}`
      return axios.patch(url, survey)
    } else {
      let url = `${surveyURL}`
      return axios.post(url, survey)
    }
  },
  getById (id) {
    let url = `${surveyURL}/${id}`
    return axios.get(url)
  },
  update (survey) {
    let url = `${surveyURL}/${survey._id}`
    return axios.patch(url, survey)
  },
  delete (id) {
    let url = `${surveyURL}/${id}`
    return axios.delete(url)
  },

  uploadSurveyPicture (formData, fileName) {
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
