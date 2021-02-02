<template>
  <q-page>
    <q-page-container>
      <div class="row justify-center" >
        <div class="col-12 col-md-6">
          <q-card bordered class="my-card q-mt-sm q-mx-sm" style="max-width: 50em;">
            <q-card-section>
              <div class="text-h3">Eleições 2020</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              Sondagem Eleitoral sem referenciamento científico
            </q-card-section>
          </q-card>
          <q-list v-if="mostrarPerguntas" class="my-list q-mt-sm q-mx-sm" style="max-width: 50em;">
            <div v-for="(question, index) in questions" :key="question._id">
              <single-option
                v-if="question.type === 'single_option'"
                @answerUpdate="answerUpdate"
                :question="question"
                :index="index"/>
              <multiple-option
                v-if="question.type === 'multiple_option'"
                @answerUpdate="answerUpdate"
                :question="question"
                :index="index"/>
            </div>
          </q-list>
          <div v-else class="">
            <img src="logo-survey.png" alt="Vou participar" style="width: 23em" class="q-my-md q-ml-sm"/>
            <q-item
              clickable class=""
              tag="a"
              target="_blank"
              href="https://vouparticipar.com/"
            >
              <q-item-section
                avatar
              >
                <img src="vouparticiparIcon.png" style="width: 32px"/>
              </q-item-section>

              <q-item-section>
                <q-item-label> Contato </q-item-label>
                <q-item-label caption>
                  Clique aqui para mais informações
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <q-btn
            v-if="mostrarPerguntas && answer.answerQuestions.length > 0"
            :disable="questions.length !== answer.answerQuestions.length"
            class="q-mb-xl q-ml-sm"
            style="background: goldenrod; color: white"
            label="Enviar" @click="votar"/>
        </div>
      </div>
    </q-page-container>
    <!-- Mensagem de finalização -->
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="row">
            <div id="logo-fsm" class="q-pt-xs q-mr-sm" ><img src="vouparticiparIcon.png" style="width: 32px"/></div>
            <div class="text-h6 q-pt-sm">Obrigado por Participar</div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Seu voto foi computado com sucesso
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="OK" style="background: goldenrod; color: white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Rodapé -->
    <q-footer bordered class="bg-white text-secondary">
      <q-toolbar style="display: block">
        <div class="text-caption">
          * a presente verificação de opinião não se trata de pesquisa eleitoral nos termos da legislação eleitoral
          - Resolução nr 23.600 de dezembro de 1999, art. 22, §1º, §2º e §3º ,
          tratando-se tão somente de ferramenta de trabalho para instruir ações específicas de consultoria.
        </div>
        <div class="text-caption">
          * a presente verificação de opinião não terá seu resultado divulgado/apresentado em nenhuma hipótese.
        </div>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import surveyService from '@/services/surveyService'
import answerService from '@/services/answerService'
import SingleOption from '@/components/Questions/SingleOption'
import MultipleOption from '@/components/Questions/MultipleOption'
import SimpleCrypto from 'simple-crypto-js'
import { LocalStorage, Dialog } from 'quasar'
const { v4: uuidV4 } = require('uuid')

export default {
  name: 'PageSurvey',
  inject: ['setTitle'],
  components: { SingleOption, MultipleOption },
  data () {
    return {
      title: '',
      alert: false,
      mostrarPerguntas: false,
      questions: [],
      answer: {
        survey: null,
        lat: '',
        lng: '',
        date: new Date(),
        answerQuestions: [],
        userIp: '',
        userId: uuidV4()
      }
    }
  },
  methods: {
    answerUpdate (val) {
      const question = this.answer.answerQuestions.filter(a => a.question === val.question)
      if (question.length > 0) {
        this.answer.answerQuestions.map(e => {
          if (e.question === val.question) e.options = val.options
        })
      } else {
        this.answer.answerQuestions.push(val)
      }
    },
    votar () {
      this.$q.loading.show()
      this.mostrarPerguntas = false
      const me = this
      if (this.answer.lat === '' || this.answer.lng === '') {
        delete this.answer.lat
        delete this.answer.lng
      }
      const simpleCrypto = new SimpleCrypto(process.env.SIMPLE_CRYPTO_KEY)
      const encryptAnswer = {
        content: simpleCrypto.encrypt(this.answer)
      }
      answerService.add(encryptAnswer).then(response => {
        me.alert = true
        me.$q.loading.hide()
      }).catch(error => {
        console.error(error)
        me.$q.loading.hide()
        me.$q.notify({
          message: 'Algum erro ocorreu durante o processamento da sua resposta.',
          caption: 'Tente novamente mais tarde',
          color: 'negative'
        })
      })
    },
    parseFormat (strArg) {
      const output = {}
      const str = strArg.trim()

      str.split('\n').forEach(function (line) {
        var item = line.split('=')
        Object.defineProperty(output, item[0], { value: item[1] })
      })
      return output
    },
    shuffle (array) {
      var currentIndex = array.length, temporaryValue, randomIndex

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    }
  },
  async beforeMount () {
    this.$q.loading.show({
      message: 'Carregamento do <b>formulário</b> em progresso.<br/><span class="text-primary">Aguarde...</span>'
    })
    await answerService.getUserIp().then(response => {
      const resposta = this.parseFormat(response.data)
      this.answer.userIp = resposta.ip
    })
    if (LocalStorage.getItem('userId')) {
      this.answer.userId = LocalStorage.getItem('userId')
    } else {
      LocalStorage.set('userId', this.answer.userId)
    }
    const filter = {
      id: this.$route.params._id,
      userIp: this.answer.userIp,
      userId: this.answer.userId
    }
    await answerService.getIfAlredyExist(filter).then(response => {
      if (response.data.Answer.length > 0) {
        this.$q.loading.hide()
        Dialog.create({
          title: 'Questionário respondido',
          message: 'Esse questionário já foi respondido, obrigado por participar.',
          cancel: false,
          persistent: true,
          ok: {
            color: 'primary'
          }
        })
      } else {
        this.mostrarPerguntas = true
      }
    })
  },
  mounted () {
    if (navigator.geolocation) {
      const me = this
      navigator.geolocation.getCurrentPosition(function (position) {
        me.answer.lat = position.coords.latitude
        me.answer.lng = position.coords.longitude
      })
    }
    const me = this
    surveyService.getById(this.$route.params._id).then(response => {
      me.$q.loading.hide()
      const survey = response.data.Survey
      this.setTitle(survey.description)
      if (survey && survey.active) {
        me.title = survey.description
        me.answer.survey = survey._id
        me.questions = me.shuffle(survey.questions)
        me.questions.map(question => {
          if (question.lastQuestionId) {
            const lastOption = question.options.filter(o => o._id === question.lastQuestionId)[0]
            const novaOpcao = question.options.filter(o => o._id !== question.lastQuestionId)
            question.options = me.shuffle(novaOpcao)
            question.options.push(lastOption)
          } else {
            question.options = me.shuffle(question.options)
          }
          question.answer = null
        })
      } else {
        this.mostrarPerguntas = false
        Dialog.create({
          title: 'Questionário inválido',
          message: 'Esse questionário não é mais válido.',
          cancel: false,
          persistent: true,
          ok: {
            color: 'primary'
          }
        })
      }
    })
  }
}
</script>
<style lang="stylus" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
