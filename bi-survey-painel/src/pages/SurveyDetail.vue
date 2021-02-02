<template>
    <div class="q-pa-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="data" label="Dados" />
        <q-tab v-if="$route.params._id" name="questions" label="Perguntas" />
        <q-tab v-if="$route.params._id" name="config" label="Configuração" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="data">
          <q-form class="column" @submit="surveyUpdate">
            <q-list bordered class="col rounded-borders">
              <q-expansion-item
                expand-separator default-opened
                icon="assignment"
                label="Dados do formulário" class="text-h5"
                caption="Preencha os campos obrigatórios"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon name="assignment" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Dados do formulário</q-item-label>
                    <q-item-label caption>
                      Preencha os campos obrigatórios
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center">
                      <q-btn dense outline color="primary" label="Exportar" icon="mdi-file-pdf-outline" @click.stop="exportar"/>
                    </div>
                  </q-item-section>
                </template>
                <q-separator />
                <q-card>
                  <q-input
                    class="q-px-sm q-py-md col-12" label="Título *"
                    v-model="survey.title" filled dense
                    :rules="[ val => !!val|| 'Campo obrigatório']"/>
                  <q-input
                    class="q-px-sm q-py-md col-12" label="Descrição *"
                    v-model="survey.description" filled dense
                    :rules="[ val => val && val.length > 0 || 'Favor preencha este campo']"/>
                  <q-select
                    v-if="user.userRole[0].description === 'Super Administrador'"
                    class="q-px-sm q-py-md col-12 col-md-6"
                    filled dense clearable
                    v-model="survey.user"
                    :options="userOptions"
                    label="Usuário"
                    emit-value @filter="filterUsers" use-input
                    map-options options-dense/>
                  <q-input
                    class="q-px-sm q-py-md col-12 col-md-6"
                    v-model="survey.expirationDate" filled dense type="date" hint="Data expiração *"
                    :rules="[val => dateValidation(val)]"/>
                  <q-input
                    readonly
                    class="q-px-sm q-py-md col-12" label="Link da pesquisa"
                    v-model="url" outlined dense>
                    <template v-slot:append>
                      <q-btn  round size="sm" icon="link" color="primary"
                        v-clipboard:copy="url"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"><q-tooltip>Copiar Link da pesquisa</q-tooltip></q-btn>
                    </template>
                  </q-input>
                </q-card>
              </q-expansion-item>
            </q-list>
            <div class="col q-px-sm q-py-sm row justify-end">
              <q-btn label="Salvar" type="submit" color="primary" class=""/>
            </div>
          </q-form>
          <!-- Report -->
          <survey-report :survey="survey" :url="url" :showReport="showReport"/>
        </q-tab-panel>

        <q-tab-panel name="questions">
          <q-list bordered class="rounded-borders q-mt-md" >
            <q-expansion-item
              expand-separator default-opened
              icon="speaker_notes"
              label="Perguntas" class="text-h5 "
              caption="Cadastre ou edite as perguntas aqui (salvamento automático)"
            >
              <q-separator />
              <q-card class="">
                <div class="row justify-end">
                  <q-btn
                    :disable="survey._id === null" dense
                    outline class="q-my-md q-mx-lg" color="primary"
                    label="Adicionar Questão" @click="showQuestionCard()">
                    <q-tooltip anchor="top left" self="top middle">
                      Adicionar pergunta
                    </q-tooltip>
                  </q-btn>
                  <q-tooltip v-if="survey._id === null" anchor="top right">
                    Salve o formulário antes de adicionar perguntas
                  </q-tooltip>
                </div>
                <!-- Lista Questao -->
                <q-list bordered class="rounded-borders" >

                  <q-item
                    v-for="(question, index) in survey.questions" :key="question._id"
                    class=" column q-my-sm q-mx-sm">
                    <div class="row justify-between">
                      <div class="col-12 col-md-9">
                        <q-item-label lines="1">
                          <span class="text-weight-medium text-h6">{{index + 1}}</span>
                          <span class="text-grey-8 text-subtitle1"> - {{question.description}}</span>
                        </q-item-label>
                        <q-item-label caption lines="1">
                          {{question.type === 'single_option' ? 'Opção única' : 'Múltipla opção'}}
                        </q-item-label>
                      </div>
                      <div class="col-12 col-md-3" style="text-align: end;">
                        <div class="column">
                          <q-select
                            class="col-12 col-sm-6"
                            outlined dense emit-value map-options
                            v-model="question.lastQuestionId"
                            :options="question.options" label="Última opção" @input="updateQuestion(question.lastQuestionId, question)"
                          >
                            <template v-slot:append>
                              <q-icon v-if="question.lastQuestionId" name="close" @click.stop="cleanLasQuestionOption(question.lastQuestionId, question)" class="cursor-pointer" />
                            </template>
                          </q-select>
                          <div class="col-12 col-sm-6">
                            <q-btn class="gt-xs " size="12px" flat dense round icon="delete" style="display: initial !important;" @click="deleteQuestion(question)"/>
                            <!-- <q-btn class="gt-xs " size="12px" flat dense round icon="content_copy" style="display: initial !important;" @click="duplicarQuestao(question)"/> -->
                            <q-btn class="gt-xs " size="12px" flat dense round icon="create" style="display: initial !important;" @click="showQuestionCard(question)"/>
                            <q-btn
                              :disable="survey._id === null" dense
                              outline class="q-my-md q-mx-md" style="margin-right: 0px; display: initial !important;"
                              label="Adicionar opção" @click="showOptonCard(question)">
                              <q-tooltip anchor="top left" self="top middle">
                                Adicionar opção
                              </q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <!-- lista Opção -->
                      <q-list bordered class="rounded-borders" >
                        <div v-for="(option, index) in question.options" :key="option._id" class="row justify-between">
                          <div class="col-12 col-sm-9 row justify-start">
                            <div class="col-12 col-sm-2">
                              <q-avatar v-if="option.photoUrl" size="43px" class="q-mx-sm q-my-xs">
                                <img :src="option.photoUrl">
                              </q-avatar>
                              <q-btn v-else round color="primary" icon="image" class="q-mx-sm q-my-xs"/>
                            </div>
                            <div class="col-12 col-sm-10">
                              <q-item-label lines="1" class="q-mt-sm q-ml-sm">
                                <span class="text-weight-medium text-h6">{{index + 1}}</span>
                                <span class="text-grey-8 text-subtitle1"> - {{option.label}}</span>
                              </q-item-label>
                            </div>
                          </div>
                          <div class="col-12 col-sm-3" style="text-align: end;">
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn class="gt-xs" size="12px" flat dense round icon="delete" style="display: initial !important;" @click="deleteOption(option)"/>
                              <q-btn class="gt-xs" size="12px" flat dense round icon="create" style="display: initial !important;" @click="showOptonCard(question, option)"/>
                            </div>
                          </div>
                        </div>
                        <!-- <q-item v-ripple
                          v-for="(option, index) in question.options" :key="option._id"
                          class=" q-my-sm q-mx-sm">
                          <q-item-section avatar top>
                            <q-avatar v-if="option.photoUrl" size="43px">
                              <img :src="option.photoUrl">
                            </q-avatar>
                            <q-btn v-else round color="primary" icon="image" />
                          </q-item-section>

                          <q-item-section top>
                            <q-item-label lines="1" class="q-mt-sm">
                              <span class="text-weight-medium text-h6">{{index + 1}}</span>
                              <span class="text-grey-8 text-subtitle1"> - {{option.label}}</span>
                            </q-item-label>
                          </q-item-section>

                          <q-item-section top side class="q-mt-sm">
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="deleteOption(option)"/>
                              <q-btn class="gt-xs" size="12px" flat dense round icon="create" @click="showOptonCard(question, option)"/>
                            </div>
                          </q-item-section>
                        </q-item> -->
                      </q-list>
                    </div>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="config">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator default-opened
              icon="mdi-image"
              label="Imagem"
              caption="Imagem a ser exibida no meta-tag ao compartilhar pesquisa"
            >
              <q-card>
                <q-card-section class="row justify-center">
                  <q-img
                    v-if="survey.photoUrl"
                    :src="survey.photoUrl"
                    spinner-color="white" :ratio="16/9"
                    style="height: 140px; max-width: 150px"
                  >
                    <q-tooltip>Clique na imagem para troca-la</q-tooltip>
                  </q-img>
                  <q-avatar v-else square size="100px" font-size="100px" color="primary" text-color="white" icon="mdi-image" />
                </q-card-section>
                <q-card-section class="row justify-end">
                  <q-btn :label="survey.photoUrl ? 'Editar' : 'Adicionar'" color="primary" @click="surveyPickFile = true"/>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              expand-separator default-opened
              icon="mdi-vector-polygon"
              label="Região"
              caption="Caso seja selecionado uma região o resultado da pesquisa poderá ser validado de acordo com esta região"
            >
              <q-card>
                <q-card-section>
                  <div class="row">
                    <q-select
                      class="col-12"
                      filled dense multiple use-chips
                      v-model="regions"
                      :options="regionOptions"
                      option-value="_id"
                      option-label="name"
                      emit-value
                      map-options
                      use-input @filter="filterRegioes"
                    />
                  </div>
                </q-card-section>
                <q-card-section class="row justify-end">
                  <q-btn v-if="!compareArrays(regions, survey.geometries)" label="Salvar" color="primary" @click="atualizarRegioes()"/>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
      <!-- Upload Card -->
      <q-dialog v-model="surveyPickFile">
        <q-card>
          <q-card-section>
            <q-uploader
              class="col"
              label="Clique para selecionar uma imagem ou arraste e solte aqui"
              auto-upload batch
              accept=".jpg, image/*"
              :factory="surveyImageFactoryFn"
              @pickFiles="chageImage"
            />
          </q-card-section>
          <q-card-section>
            <q-btn class="col" label="Cancelar" color="primary" @click="surveyPickFile = false"/>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Question Card -->
      <q-dialog v-model="questionCard" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Pergunta</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input label="Descrição *" filled dense v-model="question.description" autofocus @keyup.enter="addQuestion" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              class=""
              filled dense clearable
              v-model="question.type"
              :options="questionTypeOptions"
              label="Tipo de questão *"
              emit-value
              map-options options-dense
              :rules="[ val => !!val|| 'Campo obrigatório']"/>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              class=""  @filter="filterListaOpcoes" use-input
              filled dense clearable
              v-model="optionGroup"
              :options="optionGroupList"
              option-value="_id"
              option-label="description"
              label="Lista de opções"
              hint="Selecione esta opção caso queira iniciar a pergunta com uma lista pré definida de opções"
              options-dense/>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn outline color="primary" label="Salvar" v-close-popup @click="addQuestion"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Option Card -->
      <q-dialog v-model="optionCard" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Opção</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input label="Descrição *" filled dense v-model="option.label" autofocus @keyup.enter="addOption" />
          </q-card-section>

          <q-card-section v-show="option.label.length > 0" class="q-pt-none">
            <q-uploader
              label="Selecione uma imagem"
              auto-upload batch
              accept=".jpg, image/*"
              :factory="factoryFn"
              @pickFiles="chageImage"
            />
          </q-card-section>

        <q-skeleton class="q-ml-md" v-show="option.label.length === 0" height="112px" width="320px" />

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn outline color="primary" label="Salvar" v-close-popup @click="addOption"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import userService from '@/service/userService'
import questionService from '@/service/questionService'
import surveyService from '@/service/surveyService'
import optionService from '@/service/optionService'
import optionGroupService from '@/service/optionGroupService'
import regionService from '@/service/regionService'
import { date, LocalStorage } from 'quasar'
import { format, parse, endOfDay, parseISO } from 'date-fns'
import SurveyReport from 'src/report/SurveyReport.vue'
import html2pdf from 'html2pdf.js'
import loading from '@/boot/loading'

export default {
  components: { SurveyReport },
  data () {
    return {
      tab: 'data',
      userOptions: [],
      allUsers: [],
      questionTypeOptions: [
        { label: 'Opção única', value: 'single_option' },
        { label: 'Múltipla escolha', value: 'multiple_option' }
      ],
      survey: {
        _id: null,
        user: null,
        ownerUser: LocalStorage.getItem('user')._id,
        active: true,
        expirationDate: '',
        description: '',
        questions: [],
        photoUrl: '',
        geometries: []
      },
      user: LocalStorage.getItem('user'),
      questionCard: false,
      question: {
        _id: null,
        description: '',
        type: 'single_option',
        options: []
      },
      questaoDuplicada: {},
      optionCard: false,
      option: {
        _id: null,
        label: '',
        photoUrl: ''
      },
      surveyPickFile: false,
      optionGroup: null,
      optionGroupList: [],
      optionGroupListBKP: [],
      regions: [],
      regionOptions: [],
      regionOptionsBKP: [],
      showReport: true
    }
  },
  async mounted () {
    this.$q.loading.show()
    this.findAllOptionGroups()
    this.findAllRegions()
    await userService.getAll().then(response => {
      this.allUsers = response.data.users.map(user => {
        let userOp = {
          label: user.name,
          value: user._id
        }
        return userOp
      })
      this.userOptions = this.allUsers
    })
    if (this.$route.params._id) {
      this.getSurveyById()
    } else {
      this.$q.loading.hide()
    }
  },
  computed: {
    url: function () {
      if (!this.survey._id) return 'Sem link ainda'
      return `${process.env.TRACKING_URL}/${this.survey._id}`
    }
  },
  methods: {
    filterListaOpcoes (val, update) {
      if (val === '') {
        update(() => {
          this.optionGroupList = this.optionGroupListBKP
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.optionGroupList = this.optionGroupListBKP.filter(v => v.description.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterRegioes (val, update) {
      if (val === '') {
        update(() => {
          this.regionOptions = this.regionOptionsBKP
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.regionOptions = this.regionOptionsBKP.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterUsers (val, update) {
      if (val === '') {
        update(() => {
          this.userOptions = this.allUsers
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.userOptions = this.allUsers.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    exportar () {
      loading.show('Gerando relatório...')
      let me = this
      let element = document.getElementById('survey-report')
      let opt = {
        margin: [0.5, 0, 0.5, 0],
        filename: `${this.survey.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      }
      this.showReport = true
      this.$nextTick(() => {
        html2pdf().from(element).set(opt).save().then(() => {
          loading.hide()
          me.showReport = false
        })
      })
    },
    findAllOptionGroups () {
      optionGroupService.getAll().then(result => {
        this.optionGroupList = result.data.options
        this.optionGroupListBKP = result.data.options
      })
    },
    findAllRegions () {
      regionService.getAll().then(result => {
        this.regionOptions = result.data.geometries
        this.regionOptionsBKP = result.data.geometries
      })
    },
    onCopy: function (e) {
      this.$q.notify({
        message: `Link copiado: ${e.text}`,
        color: 'positive',
        timeout: 1000
      })
    },
    onError: function (e) {
      this.$q.notify({
        message: `Erro ao copiar link: ${e.text}`,
        color: 'negative',
        timeout: 1000
      })
    },
    getSurveyById () {
      surveyService.getById(this.$route.params._id).then(response => {
        this.$q.loading.hide()
        // let owner = this.survey.ownerUser
        this.survey = response.data.Survey
        if (this.survey.questions.length > 0) {
          this.survey.questions.map(questao => {
            if (questao.lastQuestionId) {
              questao.lastQuestionId = questao.options.filter(o => o._id === questao.lastQuestionId)[0]
            }
          })
        }
        this.regions = this.survey.geometries
        let expirationDate = parseISO(this.survey.expirationDate)
        let registerDate = parseISO(this.survey.registerDate)
        this.survey.expirationDate = !this.survey.expirationDate ? '' : format(expirationDate, 'yyyy-MM-dd')
        this.survey.registerDate = !this.survey.registerDate ? '' : format(registerDate, 'yyyy-MM-dd')
        // this.survey.ownerUser = owner
      })
    },
    dateValidation (val) {
      if (val.length < 10) return 'Data inválida.'
      let isValidDate = date.isValid(date.extractDate(val, 'YYYY-MM-DD'))
      return isValidDate || 'Data inválida.'
    },
    surveyUpdate () {
      this.$q.loading.show()
      this.survey.expirationDate = endOfDay(parse(this.survey.expirationDate, 'yyyy-MM-dd', new Date()))
      surveyService.addOrUpdate(this.survey).then(response => {
        if (response.data.createdSurvey) this.survey = response.data.createdSurvey
        if (response.data.Survey) this.survey = response.data.Survey
        let date = parseISO(this.survey.expirationDate)
        this.survey.expirationDate = format(date, 'yyyy-MM-dd')
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Formulário salvo com sucesso',
          color: 'positive'
        })
        if (!this.$route.params._id) {
          this.$router.push(`/formulario/${this.survey._id}`)
          this.redirect2Question()
        }
      })
    },
    redirect2Question () {
      this.$q.dialog({
        title: 'Salvo com sucesso',
        message: 'Gostaria de ser redirecionado para a aba Perguntas?',
        persistent: true,
        ok: {
          label: 'Sim'
        },
        cancel: true
      }).onOk(() => {
        this.tab = 'questions'
      })
    },
    addQuestion () {
      this.$q.loading.show()
      // TODO: Salvar questão com id da pesquisa direto na api
      let questao
      if (this.questaoDuplicada.description) {
        this.questaoDuplicada.description = this.question.description
        this.questaoDuplicada.type = this.question.type
        questao = this.questaoDuplicada
      } else {
        questao = this.question
      }
      if (this.optionGroup && this.optionGroup.options.length > 0) {
        let options = []
        this.optionGroup.options.forEach(option => {
          options.push({
            label: option.label,
            photoUrl: option.photoUrl
          })
        })
        optionService.duplicate(options).then(result => {
          questao.options = result.data.createdOption
          this.processQuestion(questao)
        })
      } else {
        this.processQuestion(questao)
      }
    },
    processQuestion (questao) {
      let me = this
      let textResposta = this.question._id ? 'Pergunta atualizada com sucesso' : 'Pergunta cadastrada com sucesso'
      questionService.addOrUpdate(questao).then(response => {
        me.survey.questions.push(response.data.createdQuestion)
        surveyService.update(this.survey).then(response => {
          this.getSurveyById()
          this.$q.notify({
            message: textResposta,
            color: 'positive'
          })
        })
      })
    },
    cleanLasQuestionOption (opcao, question) {
      question.lastQuestionId = null
      if (opcao) this.updateQuestion(opcao, question)
    },
    updateQuestion  (opcao, questao) {
      questao.lastQuestionId = questao.lastQuestionId ? questao.lastQuestionId._id : null
      this.$q.loading.show()
      let me = this
      questionService.addOrUpdate(questao).then(response => {
        me.survey.questions.map(question => {
          if (question.lastQuestionId === opcao._id) question.lastQuestionId = opcao
        })
        this.$q.loading.hide()
      })
    },
    duplicarQuestao (question) {
      this.questaoDuplicada = { ...question }
      delete this.questaoDuplicada._id
      this.questionCard = true
    },
    showQuestionCard (question) {
      this.questaoDuplicada = {}
      if (question) {
        this.question = question
      } else {
        this.question.description = ''
        this.question._id = null
        this.question.options = []
      }
      this.questionCard = true
    },
    showOptonCard (question, option) {
      this.question = question
      if (option) {
        this.option = option
      } else {
        this.option._id = null
        this.option.label = ''
        this.option.photoUrl = ''
      }
      this.optionCard = true
    },
    deleteQuestion (question) {
      let me = this
      this.$q.dialog({
        title: 'Atenção',
        message: 'Tem certeza que deseja deletar essa pergunta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        me.$q.loading.show()
        questionService.delete([question._id]).then(response => {
          this.getSurveyById()
          this.$q.notify({
            message: 'Pergunta deletada com sucesso',
            color: 'positive'
          })
        })
      })
    },
    deleteOption (option) {
      let me = this
      this.$q.dialog({
        title: 'Atenção',
        message: 'Tem certeza que deseja deletar essa opção?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        me.$q.loading.show()
        optionService.delete([option._id]).then(response => {
          this.getSurveyById()
          this.$q.notify({
            message: 'Opção deletada com sucesso',
            color: 'positive'
          })
        })
      })
    },
    addOption () {
      optionService.addOrUpdate(this.option).then(response => {
        this.question.options.push(response.data.createdOption)
        questionService.addOrUpdate(this.question).then(response => {
          this.$q.loading.hide()
          this.optionCard = false
          this.$q.notify({
            message: 'Opção salva com sucesso!',
            color: 'positive'
          })
          this.getSurveyById()
        })
      })
    },
    chageImage () {
      this.optionCard = false
    },
    factoryFn (files) {
      let me = this
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', files[0])
        let optionPhoto = ''
        if (me.option.photoUrl) optionPhoto = me.option.photoUrl.split('/')
        optionService.uploadOptionPicture(formData, optionPhoto[optionPhoto.length - 1]).then(response => {
          me.option.photoUrl = response.data.url
          // TODO: salvar opção com id questionario na api
          optionService.addOrUpdate(me.option).then(response => {
            this.question.options.push(response.data.createdOption)
            questionService.addOrUpdate(this.question).then(response => {
              this.$q.loading.hide()
              this.optionCard = false
              this.$q.notify({
                message: 'Opção salva com sucesso!',
                color: 'positive'
              })
              this.getSurveyById()
            })
          })
        }).catch(err => {
          reject()
          console.error(err)
        })
      })
    },
    surveyImageFactoryFn (files) {
      let me = this
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', files[0])
        let optionPhoto = ''
        if (me.survey.photoUrl) optionPhoto = me.survey.photoUrl.split('/')
        surveyService.uploadSurveyPicture(formData, optionPhoto[optionPhoto.length - 1]).then(response => {
          me.survey.photoUrl = response.data.url
          // TODO: salvar na api
          surveyService.addOrUpdate(me.survey).then(response => {
            this.$q.loading.hide()
            this.surveyPickFile = false
            this.$q.notify({
              message: 'Imagem salva com sucesso!',
              color: 'positive'
            })
            this.$forceUpdate()
          })
        }).catch(err => {
          reject()
          console.error(err)
        })
      })
    },
    atualizarRegioes () {
      this.$q.loading.show()
      let survey = {
        _id: this.survey._id,
        geometries: this.regions
      }
      surveyService.addOrUpdate(survey).then(response => {
        this.$q.loading.hide()
        this.getSurveyById()
        this.$q.notify({
          message: 'Lista de região salva com sucesso!',
          color: 'positive'
        })
      })
    },
    /**
     * Check if two arrays of strings or numbers have the same values regardless of the order
     * @param {string[]|number[]} arr1
     * @param {string[]|number[]} arr2
     * @return {boolean}
     */
    compareArrays (arr1, arr2) {
      if (arr1.length !== arr2.length) return false
      const lk1 = {}
      const lk2 = {}
      let i = arr1.length
      while (--i >= 0) {
        lk1[arr1[i]] = true
        lk2[arr2[i]] = true
      }
      i = arr1.length
      while (--i >= 0) {
        const v = arr1[i]
        if (lk1[v] !== lk2[v]) return false
      }
      return true
    }
  }
}
</script>
<style scoped>

</style>
