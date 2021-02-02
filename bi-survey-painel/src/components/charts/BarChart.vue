<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'
import { mapActions } from 'vuex'

export default {
  name: 'BarChart',
  props: { data: Array, entity: String, title: String },
  components: {
    highcharts: Chart
  },
  watch: {
    data: function (newData, oldData) {
      this.chartOptions.xAxis.categories = []
      this.chartOptions.series[0].data = this.data.map((elem) => {
        this.chartOptions.xAxis.categories.push(elem.label)
        return {
          drilldown: elem.id,
          name: elem.label,
          y: elem.total
        }
      })
    },
    title: function (val) {
      this.chartOptions.title.text = val
    }
  },
  methods: {
    ...mapActions({
      setResposta: 'event/setResposta'
    })
  },
  data () {
    return {
      chartOptions: {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        exporting: {
          chartOptions: {
          }
        },
        chart: {
          type: 'column'
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: 'Número de votos (%)'
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            point: {
              events: {
                click: ({ point }) => {
                  this.setResposta(Math.floor(Math.random() * 2))
                }
              }
            },
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}'
            }
          }
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} %</b><br/>'
        },

        series: [{
          name: 'Total de Votos',
          colorByPoint: true,
          data: []
        }]
      }
    }
  }
}
</script>

<style scoped>
</style>
