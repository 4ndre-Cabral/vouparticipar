<template>
  <q-form class="q-pa-md" @submit.prevent="login">
    <q-list padding style="max-width:500px; margin: auto;">
      <q-item class="justify-center">
        <div id="logo-fsm" ><img src="statics/vouparticipar.png" style="width: 200px"/></div>
      </q-item>
      <q-item-label header class="row justify-center text-h5">Login</q-item-label>
      <q-item>
        <q-item-section>
          <q-input
            dense outlined
            v-model="credentials.email"
            label="Email *"
            type="email" stack-label
            :rules="[val => !!val || 'Email ausente', isValidEmail]" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-input
            id="idpassword_"
            dense outlined
            v-model="credentials.password"
            label="Senha *"
            stack-label
            :type="isPwd ? 'password' : 'text'"
            :rules="[val => !!val || '* Campo Obrigatório']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-btn type="submit" no-caps :loading="submitting" label="Login" color="primary">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
          <!-- <q-btn
            outline class="q-mt-md" color="blue-7" label="Logar com Google"
            icon="img:statics/icons/google-icon.svg" @click="googleLogin()">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn> -->
          <!-- <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" /> -->
          <div class="row justify-center">
            <div class="google-btn q-mt-md" @click="googleLogin()">
              <div class="google-icon-wrapper">
                <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
              </div>
              <p class="btn-text"><b>Logar com google</b></p>
            </div>
          </div>
        </q-item-section>
      </q-item>

    </q-list>
    <div class="row q-gutter-sm justify-end">
    </div>
  </q-form>
</template>

<script>
import { LocalStorage } from 'quasar'
import userService from '../../service/userService'

export default {
  name: 'Login',
  data () {
    return {
      isPwd: true,
      status: '',
      desconectado: false,
      credentials: {
        email: '',
        password: ''
      },
      submitting: false
    }
  },
  methods: {
    login () {
      let self = this
      this.$q.loading.show()
      userService.login(this.credentials, this.$auth).then((response) => {
        if (response) {
          // Authentication - Grava token no local storage da aplicação
          self.$auth.token(null, response.token)
          this.$auth.refresh({
            success () {
              self.$auth.watch.data = response.user
              self.$router.push('/')
              console.log('success ')
            },
            error () {
              console.log('error')
            }
          })

          let userData = response.user
          userData.password = self.credentials.password
          delete userData.password
          LocalStorage.set(this.$c.USER, userData)
        }
        this.$q.loading.hide()
      }).catch((error) => {
        console.log(error)
        this.$q.notify({
          message: error.response.data.message,
          color: 'negative'
        })
        this.$q.loading.hide()
      })
    },
    async googleLogin () {
      const googleUser = await this.$gAuth.signIn()
      const idToken = googleUser.Bc ? googleUser.Bc.id_token : googleUser.uc.id_token
      this.$q.loading.show()
      let self = this
      userService.loginGoogle(idToken).then(response => {
        window.Auth = self.$auth
        self.$auth.token(null, response.data.token)
        this.$auth.refresh({
          success () {
            self.$auth.watch.data = response.data.user
            self.$router.push('/')
            console.log('success ')
          },
          error () {
            console.log('error')
          }
        })

        LocalStorage.set(this.$c.USER, response.data.user)
        this.$q.loading.hide()
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: 'Não foi possível fazer o login para este usuário. Tente novamente.',
          color: 'negative'
        })
        this.$q.loading.hide()
      })
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Email inválido'
    }
  }
}

</script>

<style>
#customBtn {
  display: inline-block;
  background: #4285f4;
  color: white;
  width: 250px;
  border-radius: 5px;
  white-space: nowrap;
}
#customBtn:hover {
  cursor: pointer;
}
span.label {
  font-weight: bold;
}
span.icon {
  background: url('../../statics/icons/google-icon.svg') transparent 5px 50% no-repeat;
  display: inline-block;
  vertical-align: middle;
  width: 57px;
  height: 57px;
  border-right: #2265d4 1px solid;
}
span.buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-left: 42px;
  padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: 'Roboto', sans-serif;
}

@import url(https://fonts.googleapis.com/css?family=Roboto:500);
.google-btn {
  width: 184px;
  height: 42px;
  background-color: #4285f4;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .25);
  cursor: pointer;
}
.google-btn .google-icon-wrapper {
  position: absolute;
  margin-top: 1px;
  margin-left: 1px;
  width: 40px;
  height: 40px;
  border-radius: 2px;
  background-color: #fff;
}
.google-btn .google-icon {
  position: absolute;
  margin-top: 11px;
  margin-left: 11px;
  width: 18px;
  height: 18px;
}
.google-btn .btn-text {
  float: right;
  margin: 11px 11px 0 0;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.2px;
  font-family: "Roboto";
}
.google-btn:hover {
  box-shadow: 0 0 6px #4285f4;
}
.google-btn:active {
  background: #1669f2;
}
</style>
