<template>
  <q-form @submit="userInsertOrUpdate">
    <q-btn dense flat round icon="arrow_back" @click="$router.go(-1)" class="q-mx-sm q-my-sm"/>
    <q-list bordered padding>
      <q-item-label header>Informações Pessoais</q-item-label>
      <q-item>
        <q-item-section>
          <q-input
            class="col-12 q-pr-sm"
            filled dense
            v-model="user.name"
            label="Nome"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Preencha o nome']"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div class="row">
            <q-input
              class="col-6 q-pr-sm"
              filled dense
              v-model="email" :suffix="suffix"
              label="e-mail/login"
              lazy-rules
              :rules="[ val => !!val || 'Preencha o e-mail corretamente']"
            />
            <q-input
              class="col-6 q-pr-sm"
              filled dense
              label="Senha"
              v-model="user.password" :type="isPwd ? 'password' : 'text'" hint="Preencha caso deseje alterar"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div class="row">
            <q-input
              class="col-6 q-pr-sm"
              filled dense
              v-model="user.cpf"
              label="CPF *"
              mask="###.###.###-##"
              lazy-rules
              :rules="[
                val => val && val.length > 0 || 'Preencha o CPF',
                val => cpfValidation(val) || 'CPF inválido'
              ]"
            />
            <q-input
              class="col-6 q-pr-sm"
              filled dense
              v-model="user.contact"
              label="Telefone *"
              @input="phoneFormat"
              lazy-rules
              :rules="[
                val => val && val.length > 0 || 'Preencha o telefone',
                val => phoneValidation(val) || 'Telefone inválido'
              ]"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-select
            filled dense multiple use-chips
            v-model="userRoleSelected"
            :options="userRoleOptions"
            label="Tipo de usuário"
            emit-value
            map-options
            :rules="[ val => val && val.length > 0 || 'Preencha o tipo de usuário']"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="col-2">
          <q-btn label="Salvar" type="submit" color="primary"/>
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>
<script>
import userService from '../../service/userService'
import helper from '../../utils/util'

export default {
  name: 'userData',
  data () {
    return {
      user: {},
      email: '',
      suffix: '@vouparticipar.com',
      userRoleOptions: [],
      userRoleSelected: [],
      isPwd: true,
      userEmail: []
    }
  },
  async mounted () {
    await userService.getAllUserRole().then(response => {
      this.userRoleOptions = response.data.usersRole.map(e => {
        return {
          label: e.description,
          value: e._id
        }
      })
    })
    userService.getById(this.$route.params._id).then(response => {
      if (response) {
        this.userEmail = response.data.user.email.split('@')
        this.user = response.data.user
        this.user.password = null
        this.email = this.user.email.split('@')[0]
        this.user.userRole.forEach(e => {
          this.userRoleSelected.push(e._id)
        })
      }
    })
  },
  watch: {
    userEmail (val) {
      if (val && val.length > 0 && val[1] !== '@vouparticipar.com') this.suffix = `@${val[1]}`
    }
  },
  methods: {
    userInsertOrUpdate () {
      if (!this.user.password) delete this.user.password
      this.user.userRole = this.userRoleSelected
      this.user.email = this.email + this.suffix
      this.$q.loading.show()
      userService.save(this.user).then(response => {
        this.$q.notify({
          message: `Usuario salvo com sucesso`,
          color: 'positive',
          timeout: 1000
        })
        this.$q.loading.hide()
        this.$router.push('/users')
      })
    },
    emailValidation (val) {
      if (!val || val === '') return true
      return helper.isEmail(val)
    },
    phoneValidation (prop) {
      let re = /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g
      return re.test(prop)
    },
    cpfValidation (cpf) {
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
    phoneFormat () {
      this.user.contact = this.formatarTelefone(this.user.contact)
    },
    formatarTelefone (prop) {
      //  Tira caracteres não númericos da string
      let formatedString = prop.replace(/\D/g, '')
      // Coloca parênteses em volta dos dois primeiros dígitos
      formatedString = formatedString.replace(/^(\d{2})(\d)/g, '($1) $2')
      // Coloca hífen entre o quarto e o quinto dígitos
      return formatedString.replace(/(\d)(\d{4})$/, '$1-$2')
    }
  }
}
</script>
