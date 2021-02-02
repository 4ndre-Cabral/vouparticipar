<template>
  <q-layout class="q-pa-md" style="padding-bottom: 5%;">
    <q-table
      :data="surveyList"
      title="Lista de formulários"
      :columns="surveyHead"
      row-key="_id"
      :loading="loadSurvey"
      :filter="filter"
      :filter-method="filterFunction"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr class="cursor-pointer" :props="props" @click.stop="$router.push(`formulario/${props.row._id}`)">
          <q-td key="acao" auto-width align='left'>
            <!-- <q-btn flat round size="sm" icon="file_copy" color="secondary" @click.stop="setSelected(props.row)">
              <q-tooltip>
                Duplicar formulário
              </q-tooltip>
            </q-btn>
            <q-btn flat round size="sm" icon="link" color="primary" @click.stop="getUrl(props.row._id)"
                    v-clipboard:copy="getUrl(props.row._id)"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
            >
              <q-tooltip>Copiar Link da pesquisa</q-tooltip>
            </q-btn> -->
            <q-btn flat round size="sm" icon="more_vert" color="primary" @click.stop="">
              <q-menu>
                <q-list style="min-width: 100px;">
                  <q-item clickable v-close-popup @click="setSelected(props.row)">
                    <q-item-section avatar top>
                      <q-btn flat round size="sm" icon="file_copy" color="secondary"/>
                    </q-item-section>
                    <q-item-section>Duplicar formulário</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup
                    @click="getUrl(props.row._id)"
                    v-clipboard:copy="getUrl(props.row._id)"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                  >
                    <q-item-section avatar top>
                      <q-btn flat round size="sm" icon="link" color="primary"/>
                    </q-item-section>
                    <q-item-section>Copiar Link da pesquisa</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup style="margin-bottom: 0px;" @click="deletar(props.row)">
                    <q-item-section avatar top>
                      <q-btn flat round size="sm" icon="delete" color="negative"/>
                    </q-item-section>
                    <q-item-section>Deletar formulário</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-tooltip>
                Lista de opções
              </q-tooltip>
            </q-btn>
            <q-toggle size="sm" @input="changeSurveyStatus(props.row)" :value="props.row.active" checked-icon="check" color="green"
              unchecked-icon="clear"
            >
              <q-tooltip>
                <span v-if="props.row.active">Desativar Formulário</span>
                <span v-if="!props.row.active">Ativar Formulário</span>
              </q-tooltip>
            </q-toggle>
          </q-td>
          <q-td key="title" :props="props" style="white-space: break-spaces;">{{ props.row.title }}</q-td>
          <q-td key="description" :props="props" style="white-space: break-spaces;">{{ props.row.description }}</q-td>
          <q-td key="user" :props="props" >{{ props.row.user ? props.row.user.name : '' }}</q-td>
          <q-td key="expirationDate" :props="props" >{{ formatDate(props.row.expirationDate) }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Botão Adicionar Formulário -->
    <q-page-sticky :position="addButton.position" :offset="addButton.offset">
      <q-btn fab icon="add" color="primary" to="/formulario"/>
      <q-tooltip anchor="top left" self="top middle">
        Adicionar formulário
      </q-tooltip>
    </q-page-sticky>
    <!-- Duplicate -->
    <q-dialog v-model="duplicate" persistent>
      <q-card >
        <q-card-section class="bg-secondary text-white">
          <span class="text-h6">{{surveySelected.title}}</span>
          <q-card-section class="q-pt-none">
            Preencha os dados corretamente antes de duplicar
          </q-card-section>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="surveyDuplicate"
            class="q-gutter-md"
          >
            <q-input
              dense filled
              v-model="surveySelected.title"
              label="Título*"
              hint="Nome do formulário"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Favor preencha este campo']"
            />
            <q-input
              dense filled
              v-model="surveySelected.description"
              label="Descrição*"
              hint="Descrição do formulário"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Favor preencha este campo']"
            />
            <q-select
              filled dense use-input
              v-model="userSelected"
              :options="userOptions"
              label="Usuário"
              hint="Usuário que receberá o formulário"
              emit-value map-options
              @filter="filterUsers" input-debounce="0"
            >
              <template v-slot:append>
                <q-icon
                  v-if="userSelected !== null"
                  class="cursor-pointer"
                  name="clear"
                  @click.stop="userSelected = null"
                />
              </template>
            </q-select>
            <q-input v-model="surveySelected.expirationDate" filled dense type="date" hint="Data expiração *"
                :rules="[val => dateValidation(val)]"  bg-color="white"/>

            <div align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn label="Duplicar" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import surveyService from '@/service/surveyService'
import userService from '@/service/userService'
import { date, LocalStorage } from 'quasar'
import { parse, parseISO, format } from 'date-fns'

export default {
  name: 'Survey',
  components: {
  },
  data: function () {
    return {
      filter: '',
      loadSurvey: false,
      duplicate: false,
      selected: [],
      surveySelected: {},
      surveyHead: [
        { name: 'acoes', label: 'Ações', field: 'acoes', sortable: false, align: 'center' },
        { name: 'title', label: 'Título', field: 'title', sortable: true, align: 'left' },
        { name: 'description', label: 'Descrição', field: 'description', format: val => `${val}`, sortable: true, align: 'left' },
        { name: 'user', label: 'Usuário', field: 'user', sortable: true, align: 'left' },
        { name: 'expirationDate', label: 'Data expiração', field: 'expirationDate', sortable: true, align: 'left' }
      ],
      surveyList: [],
      addButton: {
        offset: [18, 18],
        position: 'bottom-right'
      },
      userSelected: null,
      userOptions: [],
      allUsers: []
    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
  },
  async beforeMount () {
  },
  mounted () {
    this.surveyListUpdate()
    userService.getAll().then(response => {
      this.allUsers = response.data.users.map(user => {
        return {
          label: user.name,
          value: user._id
        }
      })
    })
  },
  methods: {
    // ...mapActions({
    //   setEvent: 'event/setEvent'
    // }),
    getUrl (id) {
      return `${process.env.TRACKING_URL}/${id}`
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
    surveyListUpdate () {
      this.loadSurvey = true
      surveyService.getAll().then(response => {
        this.surveyList = response.data.surveys
        this.loadSurvey = false
      })
    },
    filterFunction (rows, terms, cols, getCellValue) {
      return rows.filter(r => {
        for (const prop in r) {
          if (typeof r[prop] === 'string' && r[prop].toLowerCase().includes(terms.toLowerCase())) {
            return true
          }
        }
        return false
      })
    },
    setSelected (item) {
      this.surveySelected = { ...item }
      delete this.surveySelected.expirationDate
      delete this.surveySelected.registerDate
      delete this.surveySelected.user
      this.duplicate = true
    },
    changeSurveyStatus (survey) {
      this.$q.loading.show()
      let newSurvey = {
        _id: survey._id,
        active: !survey.active
      }
      surveyService.update(newSurvey).then(response => {
        this.surveyListUpdate()
        this.$q.loading.hide()
        this.$q.notify({
          message: response.data.message,
          color: 'positive'
        })
      }).catch(() => {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Não foi possível atualizar o status',
          color: 'negative'
        })
      })
    },
    surveyDuplicate () {
      this.$q.loading.show()
      this.surveySelected.user = this.userSelected
      let date = parse(`${this.surveySelected.expirationDate} 23:59:59`, 'yyyy-MM-dd HH:mm:ss', new Date())
      this.surveySelected.expirationDate = date
      delete this.surveySelected.active
      delete this.surveySelected._id
      delete this.surveySelected._v
      surveyService.duplicate(this.surveySelected).then(response => {
        this.surveyListUpdate()
        this.$q.loading.hide()
        this.duplicate = false
        this.$q.notify({
          message: response.data.message,
          color: 'positive'
        })
      }).catch(() => {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Não foi possível duplicar o formulario',
          color: 'negative'
        })
      })
    },
    deletar (survey) {
      this.loadSurvey = true
      surveyService.delete(survey._id).then(response => {
        this.$q.notify({
          message: response.data,
          color: 'positive'
        })
        this.surveyListUpdate()
      }).catch(error => {
        this.loadSurvey = false
        console.log(error.response)
        const response = error.response.data
        this.$q.notify({
          message: response.message,
          caption: `Total de repostas: ${response.answers}`,
          color: 'warning'
        })
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
    dateValidation (val) {
      if (val) {
        if (val.length < 10) return 'Data inválida.'
        let isValidDate = date.isValid(date.extractDate(val, 'YYYY-MM-DD'))
        return isValidDate || 'Data inválida.'
      }
      return 'Data inválida.'
    },
    formatDate (date) {
      let data
      if (date) data = parseISO(date)
      return data && date !== undefined ? format(data, 'dd/MM/yyyy HH:mm:ss') : ''
    }
  },
  computed: {
    user () {
      return LocalStorage.getItem(this.$c.USER) ? LocalStorage.getItem(this.$c.USER) : {}
    }
  }
}
</script>
<style>
.q-date--landscape .q-date__content {
  overflow-x: hidden !important;
}
.overflow-auto {
  overflow: auto !important;
}
</style>
<style scoped>
.q-card__section {
  padding: 8px;
}
.q-expansion-item {
  border-top: 1px solid #e0e0e0;
}
.q-item:last-child {
  margin-bottom: 18px;
}
</style>
