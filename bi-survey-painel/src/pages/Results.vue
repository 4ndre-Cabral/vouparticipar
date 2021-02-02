<template>
  <q-layout class="q-pa-md" style="padding-bottom: 5%;">
    <q-table
      :data="surveyList"
      title="Lista de Resultados"
      :columns="surveyHead"
      row-key="_id"
      :loading="loadSurvey"
      :filter="filter"
      :filter-method="filterFunction"
    >
      <template v-slot:top-right>
        <q-btn dense outline color="primary" label="Exportar" icon="mdi-file-pdf-outline" @click.stop="exportar" class="q-mr-sm"/>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template selectable v-slot:body="props">
        <q-tr class="cursor-pointer" :props="props" @click="$router.push(`resultados/${props.row._id}`)">
          <q-td key="title" :props="props" style="white-space: break-spaces;">{{ props.row.title }}</q-td>
          <q-td key="description" :props="props" style="white-space: break-spaces;">{{ props.row.description }}</q-td>
          <q-td key="user" :props="props" >{{ props.row.user ? props.row.user.name : ''}}</q-td>
          <q-td key="expirationDate" :props="props" >{{ formatDate(props.row.expirationDate) }}</q-td>
          <q-td key="active" :props="props" >
            {{ isExpireted(props.row.expirationDate) }}
          </q-td>
          <q-td key="total" :props="props" >
            {{ props.row.total }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <result-report :results="surveyList" :columns="surveyHead" :showReport="showReport"/>
  </q-layout>
</template>

<script>
import surveyService from '@/service/surveyService'
import { parseISO, format, compareAsc } from 'date-fns'
import { LocalStorage } from 'quasar'
import ResultReport from 'src/report/ResultReport.vue'
import html2pdf from 'html2pdf.js'
import loading from '@/boot/loading'

export default {
  name: 'Resultados',
  components: {
    ResultReport
  },
  data: function () {
    return {
      filter: '',
      loadSurvey: false,
      duplicate: false,
      selected: [],
      surveySelected: {},
      surveyHead: [
        { name: 'title', label: 'Título', field: 'title', format: val => `${val}`, sortable: true, align: 'left' },
        { name: 'description', label: 'Descrição', field: 'description', format: val => `${val}`, sortable: true, align: 'left' },
        { name: 'user', label: 'Usuário', field: 'user', sortable: true, align: 'left' },
        { name: 'expirationDate', label: 'Data expiração', field: 'expirationDate', sortable: true, align: 'left' },
        { name: 'active', label: 'Status', field: 'active', sortable: true, align: 'left' },
        { name: 'total', label: 'Total de Respostas', field: 'total', sortable: true, align: 'center' }
      ],
      surveyList: [],
      addButton: {
        offset: [18, 18],
        position: 'bottom-right'
      },
      dupButton: {
        offset: [90, 18],
        position: 'bottom-right'
      },
      userSelected: null,
      userOptions: [],
      allUsers: [],
      showReport: false
    }
  },
  mounted () {
    this.loadSurvey = true
    surveyService.getAll().then(response => {
      const totalList = response.data.totalList
      this.surveyList = response.data.surveys
      if (totalList) {
        this.surveyList.map(survey => {
          const item = totalList.filter(e => e.surveyId === survey._id)[0]
          survey.total = item.total
        })
      }
      this.loadSurvey = false
    })
  },
  methods: {
    // ...mapActions({
    //   setEvent: 'event/setEvent'
    // }),
    // getVotos (item) {
    //   answerService.getTotalBySurveyId(item._id).then(result => {
    //     return result.data.total
    //   })
    // },
    exportar () {
      loading.show('Gerando relatório...')
      let me = this
      let element = document.getElementById('result-list')
      let opt = {
        margin: [0.5, 0, 0.5, 0],
        filename: `Lista de Resultados.pdf`,
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
    formatDate (date) {
      let data = parseISO(date)
      return data && date !== undefined ? format(data, 'dd/MM/yyyy HH:mm:ss') : ''
    },
    isExpireted (date) {
      let compare = compareAsc(parseISO(date), new Date())
      return compare === 1 ? 'Em andamento' : 'Finalizado'
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
