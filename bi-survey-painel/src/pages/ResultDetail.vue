<template>
  <div>
    <q-list bordered class="rounded-borders" >
      <!-- Implementando o serviço na api para filtrar por data ainda -->
      <q-item>
        <q-item-section class="row full-width col-12">
          <q-item-label>Filtrar respostas por período:</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="q-gutter-md q-px-lg">
        <q-input dense filled v-model="initialDate" class="col" label="Data inicial" clearable >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="initialDate" transition-show="scale" transition-hide="scale">
                <q-date mask="DD/MM/YYYY" :locale="myLocale" v-model="initialDate" @input="() => $refs.initialDate.hide()" :options="compareDate" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input dense filled v-model="finalDate" class="col" label="Data final" clearable >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="finalDate" transition-show="scale" transition-hide="scale">
                <q-date mask="DD/MM/YYYY" :locale="myLocale" v-model="finalDate" @input="() => $refs.finalDate.hide()" :options="compareDate" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      <q-item
        v-for="(question, index) in questions" :key="question._id"
        class=" column q-my-sm q-mx-sm">

        <div class="row q-mb-md">
          <div class="col-12 q-pa-xs">
            <Card>
              <template v-slot:header>{{index + 1}} - {{survey.description}}</template>
              <template v-slot:body>
                <BarChart style="height: 20em" :data="question.respostas" :title="question.description"> </BarChart>
              </template>
            </Card>
          </div>
        </div>
      </q-item>
    </q-list>
    <!-- <div class="col-12 q-pa-xs">
      <Card>
        <template v-slot:header>{{index + 1}} - {{questions[0].description}}</template>
        <template v-slot:body>
          {{questions[0].options}}
          <BarChart style="height: 20em" :data="respostas" :title="questions[0].description"> </BarChart>
        </template>
      </Card>
    </div> -->
    <div class="row q-mb-md">
      <q-item>
        <q-item-section class="row full-width col-12">
          <q-item-label>Filtrar respostas no mapa:</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="survey" class="row full-width q-gutter-sm">
        <q-select v-for="question in survey.questions" :key="question._id"
          class="col"
          clearable
          v-model="answersFilters[question._id]"
          :label="question.label"
          :options="question.options"
          option-label="label"
          option-value="_id"
        />
      </q-item>
      <div class="row full-width q-gutter-sm">
        <q-select
          v-if="regions.length > 0"
          v-model="region"
          :options="regions"
          option-value="wkt"
          option-label="name"
          emit-value use-chips
          map-options label="Regiões" :hint="totalByRegion > 0 || region ? 'Essa região possui ' + totalByRegion + ' votos.' : ''"
          class="col q-ml-lg q-mr-md q-mb-sm" @input="drawPolygon()"
        />
      </div>
      <div class="col-12 q-pa-xs">
        <google-map ref="googleMap" :markers="markersFiltered" :relativePosition="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'
import BarChart from '@/components/charts/BarChart'
import GoogleMap from '@/components/GoogleMap'
import surveyService from '@/service/surveyService'
import answerService from '@/service/answerService'
import regionService from '@/service/regionService'
import { gmapApi } from 'vue2-google-maps'
import { mapState } from 'vuex'

export default {
  name: 'Resultado',
  components: {
    Card, BarChart, GoogleMap
  },
  data: function () {
    return {
      survey: {},
      respostas: [],
      questions: [],
      totalAnswers: 0,
      markers: [],
      marker: null,
      heatmapData: [],
      initialDate: null,
      finalDate: null,
      answersFilters: {},
      myLocale: {
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: ['Janeiro', 'Feveiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        firstDayOfWeek: 1
      },
      regions: [],
      region: null,
      regionPoly: null,
      totalByRegion: 0
    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
  },
  async created () {
    await surveyService.getById(this.$route.params._id).then(response => {
      this.survey = response.data.Survey
      this.questions = response.data.Survey.questions
      this.finalDate = new Date(response.data.Survey.expirationDate).toLocaleDateString('pt-br')
      if (this.survey.geometries) this.getRegionsById(this.survey.geometries)
    })
  },
  mounted () {
    this.markers.forEach(marker => {
      marker.setMap(null)
    })
  },
  methods: {
    // ...mapActions({
    //   setEvent: 'event/setEvent'
    // }),
    getRegionsById (geometries) {
      regionService.getAllById(geometries.join(',')).then(response => {
        this.regions = response.data
      })
    },
    async carregarRespostas () {
      let me = this
      this.$q.loading.show()
      if (me.questions) {
        for (let i = 0; i < me.questions.length; i++) {
          const question = me.questions[i]
          for (let j = 0; j < question.options.length; j++) {
            question.options[j].total = 0
            question.total = 0
          }
        }
        me.totalAnswers = 0
        me.markers = []
      }
      await answerService.getBySurveyId(this.$route.params._id, this.initialDate, this.finalDate).then(response => {
        me.questions.map(question => {
          this.totalAnswers = response.data.count
          response.data.Answer.forEach(answer => {
            answer.answerQuestions.forEach(answerQuestions => {
              if (answerQuestions.question === question._id) {
                answerQuestions.options.forEach(opt => {
                  question.options.map(option => {
                    if (option.total === undefined) option.total = 0
                    if (option._id === opt) {
                      option.total += 1
                      question.total += 1
                    }
                  })
                })
              }
            })
          })
        })
        for (let x = 0; x < me.questions.length; x++) {
          const question = me.questions[x]
          let respostas = []
          for (let y = 0; y < question.options.length; y++) {
            const option = question.options[y]
            const total = (option.total * 100) / question.total
            respostas.push({
              id: option._id,
              label: option.label,
              total: Math.round((total + Number.EPSILON) * 100) / 100
            })
          }
          if (!me.questions[x].label) {
            me.questions[x].label = me.questions[x].description
          }
          me.questions[x].description = `${this.totalAnswers} votos computados`
          me.questions[x].respostas = respostas
        }
        let bounds = new me.google.maps.LatLngBounds()
        response.data.Answer.forEach(answer => {
          if (answer.lat && answer.lng) {
            let lat = parseFloat(answer.lat.$numberDecimal)
            let lng = parseFloat(answer.lng.$numberDecimal)
            bounds.extend(new me.google.maps.LatLng(lat, lng))
            let marker = {
              map: me.map,
              position: {
                lat: lat,
                lng: lng
              },
              data: answer
            }
            me.markers.push(marker)
          }
        })
        if (response.data.Answer.length > 0) me.map.fitBounds(bounds)
      })
      this.$q.loading.hide()
    },
    drawPolygon () {
      this.totalByRegion = 0
      if (this.regionPoly) this.regionPoly.setMap(null)
      if (this.region) {
        let wkt = this.region.split('((')[1].split('))')[0].split(',')
        let coordsRegion = []
        let bounds = new this.google.maps.LatLngBounds()
        for (let i in wkt) {
          let latLng = {
            lat: parseFloat(wkt[i].split(' ')[1]),
            lng: parseFloat(wkt[i].split(' ')[0])
          }
          coordsRegion.push(latLng)
          bounds.extend(latLng)
        }
        this.map.fitBounds(bounds)
        // Construct the polygon.
        this.regionPoly = new this.google.maps.Polygon({
          paths: coordsRegion
        })
        this.regionPoly.setMap(this.map)
        this.markersFiltered.forEach(marker => {
          const point = new this.google.maps.LatLng(marker.position.lat, marker.position.lng)
          if (this.regionPoly.ContainsLatLng(point)) {
            this.totalByRegion++
          }
        })
      }
    },
    updateResposta () {
      let voto = Math.floor(Math.random() * 4)
      this.respostas.map(item => {
        if (item.id === voto + 1) item.total += 1
      })
    },
    createMarker (map, point) {
      var marker = new this.google.maps.Marker({
        position: point,
        map: map
      })
      return marker
    },
    compareDate (date) {
      return date <= this.today
    }
  },
  computed: {
    google: gmapApi,
    ...mapState({
      getResposta: state => state.event.resposta,
      map: state => state.config.map
    }),
    today () {
      return Object.freeze(new Date().toLocaleDateString('pt-br').split('/').reverse().join('/'))
    },
    markersFiltered () {
      if (Object.keys(this.answersFilters).length === 0) {
        return this.markers
      }
      return this.markers.filter(m => {
        for (let i in this.answersFilters) {
          if (this.answersFilters[i] && !m.data.answerQuestions.find(a => a.question === i && a.options[0] === this.answersFilters[i]._id)) {
            return false
          }
        }
        return true
      })
    }
  },
  watch: {
    getResposta: function (novo, velho) {
      let me = this
      if (me.heatmap) {
        me.heatmap.setMap(null)
        me.heatmapData = []
      }
      let bounds = new me.google.maps.LatLngBounds()
      bounds.extend(new me.google.maps.LatLng(-21.197255, -43.748229))
      bounds.extend(new me.google.maps.LatLng(-21.239284, -43.776937))
      bounds.extend(new me.google.maps.LatLng(-21.211117, -43.789169))

      me.map2.fitBounds(bounds)
      var sw = bounds.getSouthWest()
      var ne = bounds.getNorthEast()
      for (let i = 0; i < 80; i++) {
        var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat()
        var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng()
        var point = new me.google.maps.LatLng(ptLat, ptLng)
        me.heatmapData.push(point)
      }
      me.heatmap = new me.google.maps.visualization.HeatmapLayer({
        data: me.heatmapData,
        map: me.map2
      })
    },
    finalDate: function (val, oldVal) {
      this.carregarRespostas()
    },
    initialDate: function (val, oldVal) {
      this.carregarRespostas()
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
