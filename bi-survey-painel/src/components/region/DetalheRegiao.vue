<template>
  <div class="column fit no-wrap items-stretch">
    <top-menu
      :titulo="this.$route.params._id !== undefined ? region.name : 'Nova Região'"
      :showGoBack="true" :showExpand="true"
      @go-back="verListaRegioes"
    />

    <q-form ref="formRegion" @submit="save" class="column full-height">
      <div class="row">
        <q-input class="q-px-sm q-py-sm col-12" outlined dense v-model="region.name" label="Nome" :rules="[ val => !!val || 'Campo obrigatório']"/>
        <q-field
          label="Região" ref="geometryField"
          class="q-px-sm q-py-md col-12"
          v-model="region.wkt"
          outlined dense autofocus clearable
          hint="Clique no botão para habilitar o desenho no mapa. Para alterar a localização da área clique e arraste o desenho criado"
          :rules="[ val => !!val || 'Campo obrigatório' ]"
          >
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{region.wkt}}</div>
          </template>
          <template v-slot:append>
            <q-btn round dense flat color="primary" icon="mdi-drawing" @click="activeDrawing()" />
          </template>
        </q-field>
      </div>
      <div class="col-1 q-pt-md bg-grey-3 absolute-bottom" >
        <q-btn type="submit" class="float-right on-left" color="primary" label="Salvar" icon="done" />
      </div>
    </q-form>
  </div>
</template>

<script>

import TopMenu from '@/components/TopMenu'
import regionService from '@/service/regionService'
import { gmapApi } from 'vue2-google-maps'
import { mapState } from 'vuex'
import { LocalStorage } from 'quasar'

function initialState () {
  return {
    region: {
      name: '',
      wkt: ''
    },
    regionPoly: null,
    drawingManager: null,
    user: LocalStorage.getItem('user')
  }
}

export default {
  inject: ['setView'],
  components: {
    TopMenu
  },
  data () {
    return initialState()
  },
  mounted () {
    if (this.$route.params._id) {
      regionService.getById(this.$route.params._id).then(response => {
        this.region = response.data
        this.setDadosArea(this.region)
      })
    } else {
    }
  },
  computed: {
    google: gmapApi,
    ...mapState({
      map: state => state.config.map
    })
  },
  methods: {
    verListaRegioes () {
      if (this.drawingManager !== null) this.drawingManager.setMap(null)
      if (this.regionPoly) this.regionPoly.setMap(null)
      if (this.region._id) {
        this.$router.push('/regions')
      } else {
        this.setView('ListaRegioes')
      }
    },
    resetWindow () {
      Object.assign(this.$data, initialState())
      this.$nextTick(() => {
        this.$refs.formArea.resetValidation()
      })
    },
    setDadosArea (region) {
      if (this.regionPoly) {
        this.regionPoly.setMap(null)
      }
      this.region = region
      this.drawPolygon()
    },
    drawPolygon () {
      let wkt = this.region.wkt.split('((')[1].split('))')[0].split(',')
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
    },
    save () {
      this.$q.loading.show()
      this.region.ownerUser = this.user._id
      regionService.addOrUpdate(this.region).then(response => {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Região salva com sucesso!',
          color: 'positive'
        })
      })
    },
    activeDrawing () {
      let me = this
      if (me.drawingManager === null || me.drawingManager.getMap() === null) {
        this.drawingManager = new me.google.maps.drawing.DrawingManager({
          drawingMode: me.google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: me.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              me.google.maps.drawing.OverlayType.POLYGON
            ]
          },
          polygonOptions: {
            editable: true,
            draggable: true,
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3
          }
        })
        this.drawingManager.setDrawingMode('polygon')
        this.drawingManager.setMap(me.map)
        me.google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (draw) {
          me.drawingManager.setMap(null)
          if (me.regionPoly) me.regionPoly.setMap(null)
          me.regionPoly = draw.overlay
          me.regionPoly.getPaths().forEach(function (path, index) {
            me.google.maps.event.addListener(path, 'insert_at', function (index) {
              // New point
              me.updateGeometry()
            })

            me.google.maps.event.addListener(path, 'remove_at', function () {
              // Point was removed
              me.updateGeometry()
            })

            me.google.maps.event.addListener(path, 'set_at', function () {
              // Point was moved
              me.updateGeometry()
            })
          })
          me.region.wkt = me.regionPoly.ToWKT()
          me.$nextTick(() => {
            setTimeout(() => {
              me.$refs.geometryField.$el.focus()
            }, 20)
          })
        })
      }
      if (this.regionPoly) {
        this.regionPoly.setEditable(true)
        this.regionPoly.setDraggable(true)
        this.drawingManager.setDrawingMode(null)
        this.regionPoly.getPaths().forEach(function (path, index) {
          me.google.maps.event.addListener(path, 'insert_at', function (index) {
            // New point
            me.updateGeometry()
          })

          me.google.maps.event.addListener(path, 'remove_at', function () {
            // Point was removed
            me.updateGeometry()
          })

          me.google.maps.event.addListener(path, 'set_at', function () {
            // Point was moved
            me.updateGeometry()
          })
        })
      }
    },
    updateGeometry () {
      let newGeometry = 'POLYGON(('
      const vertices = this.regionPoly.getPath()
      for (let i = 0; i < vertices.getLength(); i++) {
        const xy = vertices.getAt(i)
        newGeometry += xy.lng() + ' ' + xy.lat()
        if (i !== vertices.length - 1) {
          newGeometry += ','
        } else {
          newGeometry += '))'
        }
      }
      this.region.wkt = newGeometry
    }
  }
}
</script>

<style>
html, body, #q-app, .q-layout, .q-page-container {
  height: 100%;
}
.q-page-container {
    height: 100% !important;
}

#dados .q-table__top{
  border-bottom: 1px solid #004d40;
  padding-bottom: 0px;
  margin-bottom: 12px;
}
#bt-buscar {
  margin-bottom: 10px;
}
.container-box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 640px 1fr;
  grid-template-rows: 50px 1fr 68px;
  grid-template-regions:
    'titulo titulo'
    'dados mapa'
    'rodape mapa';
}
#titulo {
  grid-region: titulo;
}
#dados {
  grid-region: dados;
}
#mapa {
  grid-region: mapa;
}
#rodape {
  grid-region: rodape;
}

</style>
