import { Loading, QSpinnerGears } from 'quasar'

export default {
  show: function (message) {
    Loading.show({
      message: message !== undefined ? message : 'Carregando...',
      messageColor: 'white',
      spinnerColor: 'white',
      spinner: QSpinnerGears
    })
  },
  salvando: function (message) {
    Loading.show({
      message: message !== undefined ? message : 'Salvando...',
      messageColor: 'white',
      spinnerColor: 'white',
      spinner: QSpinnerGears
    })
  },
  deletando: function (message) {
    Loading.show({
      message: message !== undefined ? message : 'Deletando...',
      messageColor: 'white',
      spinnerColor: 'white',
      spinner: QSpinnerGears
    })
  },
  hide: function () {
    Loading.hide()
  }
}
