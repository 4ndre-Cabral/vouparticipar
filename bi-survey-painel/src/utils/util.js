
import { parse, format } from 'date-fns'

export default {
  validarTelefone (prop) {
    let re = /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g
    return re.test(prop)
  },
  formatarTelefone (prop) {
    //  Tira caracteres não númericos da string
    let formatedString = prop.replace(/\D/g, '')
    // Coloca parênteses em volta dos dois primeiros dígitos
    formatedString = formatedString.replace(/^(\d{2})(\d)/g, '($1) $2')
    // Coloca hífen entre o quarto e o quinto dígitos
    return formatedString.replace(/(\d)(\d{4})$/, '$1-$2')
  },
  isStringContainsNumber (prop) {
    let re = /[0-9]/g
    return re.test(prop)
  },
  isEmail (email) {
    let er = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
    if (typeof email === 'string') {
      if (er.test(email)) {
        return true
      } else {
        return false
      }
    } else if (typeof email === 'object') {
      if (er.test(email.value)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  validaCPF (cpf) {
    if (!cpf || cpf === '') {
      return false
    }
    let novoCPF = cpf.replace(/[.-]/g, '')
    let soma = 0
    let resto
    if (novoCPF === '00000000000' || novoCPF === '11111111111' ||
      novoCPF === '22222222222' || novoCPF === '33333333333' ||
      novoCPF === '44444444444' || novoCPF === '55555555555' ||
      novoCPF === '66666666666' || novoCPF === '77777777777' ||
      novoCPF === '88888888888' || novoCPF === '99999999999') {
      return false
    }
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(novoCPF.substring(i - 1, i)) * (11 - i)
      resto = (soma * 10) % 11
    }
    if ((resto === 10) || (resto === 11)) {
      resto = 0
    }
    if (resto !== parseInt(novoCPF.substring(9, 10))) {
      return false
    }
    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(novoCPF.substring(i - 1, i)) * (12 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) {
      resto = 0
    }
    if (resto !== parseInt(novoCPF.substring(10, 11))) {
      return false
    }
    return true
  },
  formatDate (date) {
    if (date) {
      let data = parse(date, 'yyyy-MM-dd', new Date())
      return format(data, 'dd/MM/yyyy')
    }
  }
}
