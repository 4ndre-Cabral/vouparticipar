import axios from 'axios'
const baseUrl = `https://api.ipify.org?format=json`
export default {
  getIp () {
    let url = `${baseUrl}/`
    return axios.get(url)
  },
  getDadosGps (successCb, errorCb) {
    var onSuccess = function (position) {
      position.error = false
      return position
    }
    function onError (error) {
      var position = { 'error': true, 'code': error.code, 'message': error.message }
      if (errorCb) {
        errorCb()
      }
      return position
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000
    })
  }
}
