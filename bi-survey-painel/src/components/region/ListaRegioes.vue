<template>
    <div class="column fit no-wrap items-stretch">

      <top-menu :titulo="'Regiões'" :showExpand="true"/>

      <div class="col">
        <div class="column full-height q-py-sm">
            <!-- Tabela -->
            <div id="dados" class="col relative-position no-scroll q-pt-sm" >
            <q-table
                :data="edificacoesFiltrado"
                :columns="cabecalhoTabRegiao"
                row-key="_id" flat dense square
                :visible-columns="colunasVisiveis"
                class="dados-table fit absolute no-scroll"
                :loading="loading"
                :pagination.sync="pagination"
            >
                <!-- :filter="filter"
                :loading="loadDados"
                :filter-method="filterFunction" -->
                <template selectable v-slot:body="props">
                <q-tr class="cursor-pointer"
                  :props="props"
                  @click="editarRegiao(props.row)"
                >
                  <q-td key="acoes" :props="props" >
                    <q-btn round flat size="11px"
                        icon="delete" color="negative" @click.stop="deletarRegiao(props.row)">
                        <q-tooltip>Deletar região</q-tooltip>
                    </q-btn>
                    <q-btn round flat size="11px" color="primary" icon="mdi-vector-polygon"
                      @click.stop="setCenterZoomRegionMap(props.row)">
                      <q-tooltip>Ver no mapa</q-tooltip>
                    </q-btn>
                  </q-td>
                  <q-td key="name" :props="props" >{{ props.row.name }}</q-td>
                </q-tr>
                </template>
            </q-table>
            </div>
            <div class="bg-grey-3 q-mt-lg" >
              <q-btn class="float-right on-left q-mt-md q-pr-sm q-mb-sm" color="primary" label="Nova região" icon="add" @click="cadastrarRegiao"/>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
import TopMenu from '@/components/TopMenu'
import regionService from '@/service/regionService'
import { gmapApi } from 'vue2-google-maps'
import { mapState } from 'vuex'

export default {
  inject: ['setView'],
  components: { TopMenu },
  data () {
    return {
      filtroRegiao: '',
      cabecalhoTabRegiao: [
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'left' },
        { name: 'name', label: 'Nome da Região', field: 'descricao', align: 'left' }
      ],
      colunasVisiveis: ['acoes', 'name'],
      regioes: [],
      loading: true,
      pagination: {
        rowsPerPage: 10
      },
      selectedRegion: null
    }
  },
  mounted () {
    if (this.$route.fullPath === '/regions') this.getDadosRegioes()
  },
  methods: {
    getDadosRegioes: function (props) {
      this.regioes = []
      regionService.getAll().then(response => {
        this.regioes = response.data.geometries
        this.loading = false
      })
    },
    cadastrarRegiao () {
      this.setView('DetalheRegiao').then(view => {
        // view.setDadosCadastro()
      })
    },
    editarRegiao: function (regiao) {
      this.$router.push(`/regions/${regiao._id}`)
      if (this.selectedRegion && this.selectedRegion.getMap()) this.selectedRegion.setMap(null)
    },
    deletarRegiao (regiao) {
      this.$q.dialog({
        title: 'Atenção',
        message: `Tem certeza que deseja deletar a área: ${regiao.name}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show()
        regionService.delete(regiao._id).then(res => {
          this.$q.loading.hide()
          this.getDadosRegioes()
          this.$q.notify({
            message: 'Região deletada com sucesso',
            color: 'positive'
          })
        }).catch(res => {
          if (res.response && res.response.status && res.response.status === 409) {
            this.dataIntegrityViolationException('Não é possível excluir a região, pois existem vínculos associados a ela.')
          } else {
            this.genericErrorException()
          }
        })
      })
    },
    setCenterZoomRegionMap (region) {
      if (this.selectedRegion && this.selectedRegion.getMap()) this.selectedRegion.setMap(null)
      let points = region.wkt.split('((')[1].split('))')[0].split(',')
      let bounds = new this.google.maps.LatLngBounds()
      let latLngArray = []
      points.forEach(point => {
        let pointArray = point.split(' ')
        let latLng = new this.google.maps.LatLng(pointArray[1], pointArray[0])
        latLngArray.push(latLng)
        bounds.extend(latLng)
      })
      this.map.fitBounds(bounds)
      this.selectedRegion = new this.google.maps.Polygon({ path: latLngArray })
      this.selectedRegion.setMap(this.map)
    },
    genericErrorException () {
      this.$q.loading.hide()
      this.$q.notify({
        message: 'Ocorreu um erro ao excluir o registro.',
        color: 'negative'
      })
    },
    dataIntegrityViolationException (message) {
      this.$q.loading.hide()
      this.$q.notify({
        message: message,
        color: 'warning'
      })
    }
  },
  computed: {
    google: gmapApi,
    ...mapState({
      map: state => state.config.map
    }),
    edificacoesFiltrado () {
      if (this.filtroRegiao) {
        return this.regioes.filter(e => e.descricao.toLowerCase().includes(this.filtroRegiao.toLowerCase()))
      } else {
        return this.regioes
      }
    }
  }
}
</script>

<style scoped>

</style>

<style lang="sass">
.dados-table
  .q-table__middle
    width: 100% !important
    height: 100% !important

    thead tr th
      position: sticky
      z-index: 1
      background: #ffffff

  thead tr:first-child th
    top: 0
</style>
