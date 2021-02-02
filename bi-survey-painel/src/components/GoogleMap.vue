<template>
  <div id="divMap" class="">
    <gmap-map
      ref="googleMap"
      :center="center"
      :zoom="zoom"
      :style="mapStyle + (relativePosition ? 'position: relative;' : 'position: initial;')"
      :position="google && new google.maps.LatLng(1.38, 103.8)"
      :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        styles: [{
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' }
          ]
        }]
      }"
    >
      <google-map-cluster :zoomOnClick="true">
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          @click="clickMarker(m)"
        ></gmap-marker>
      </google-map-cluster>
    </gmap-map>
  </div>
</template>

<script>
// /* global google */
/* eslint-disable no-new */
import { gmapApi } from 'vue2-google-maps'
import { mapActions } from 'vuex'
import GoogleMapCluster from 'vue2-google-maps/dist/components/cluster'

export default {
  name: 'GoogleMap',
  components: { GoogleMapCluster },
  props: [ 'markers', 'relativePosition' ],
  data () {
    return {
      center: { lat: -20.658884, lng: -43.785943 },
      zoom: 13,
      map: null,
      mapStyle: 'width:100%; height: 30em;'
    }
  },
  computed: {
    google: gmapApi
  },
  mounted () {
    if (navigator.geolocation) {
      let me = this
      navigator.geolocation.getCurrentPosition(function (position) {
        me.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    }
    this.$refs.googleMap.$mapPromise.then((map) => {
      this.$emit('mapaRenderizado')
      this.map = map
      this.setMap(map)
      this.configGoogleMapAPI()
    })
  },
  methods: {
    ...mapActions({
      setMap: 'config/setMap'
    }),
    clickMarker (marker) {
      debugger
    },
    configGoogleMapAPI () {
      // Método que verifica se um determinado ponto está dentro de uma região no mapa
      if (typeof this.google.maps.Polygon.prototype.ContainsLatLng !== 'function') {
        this.google.maps.Polygon.prototype.ContainsLatLng = function (point) {
          var crossings = 0
          var path = this.getPath()

          // for each edge
          for (var i = 0; i < path.getLength(); i++) {
            var a = path.getAt(i),
              j = i + 1
            if (j >= path.getLength()) {
              j = 0
            }
            var b = path.getAt(j)
            if (rayCrossesSegment(point, a, b)) {
              crossings++
            }
          }

          // odd number of crossings?
          return (crossings % 2 === 1)

          function rayCrossesSegment (point, a, b) {
            var px = point.lng(),
              py = point.lat(),
              ax = a.lng(),
              ay = a.lat(),
              bx = b.lng(),
              by = b.lat()
            if (ay > by) {
              ax = b.lng()
              ay = b.lat()
              bx = a.lng()
              by = a.lat()
            }
            // alter longitude to cater for 180 degree crossings
            if (px < 0) {
              px += 360
            }
            if (ax < 0) {
              ax += 360
            }
            if (bx < 0) {
              bx += 360
            }

            if (py === ay || py === by) py += 0.00000001
            if ((py > by || py < ay) || (px > Math.max(ax, bx))) return false
            if (px < Math.min(ax, bx)) return true

            var red = (ax !== bx) ? ((by - ay) / (bx - ax)) : Infinity
            var blue = (ax !== px) ? ((py - ay) / (px - ax)) : Infinity
            return (blue >= red)
          }
        }
      }
      // Método que converte um poligono em WKT
      if (typeof this.google.maps.Polygon.prototype.ToWKT !== 'function') {
        this.google.maps.Polygon.prototype.ToWKT = function () {
          var poly = this
          var wkt = 'POLYGON('

          var paths = poly.getPaths()
          for (let i = 0; i < paths.getLength(); i++) {
            var path = paths.getAt(i)

            wkt += '('
            for (var j = 0; j < path.getLength(); j++) {
              wkt += path.getAt(j).lng().toString() + ' ' + path.getAt(j).lat().toString() + ','
            }

            wkt += path.getAt(0).lng().toString() + ' ' + path.getAt(0).lat().toString() + '),'
          }

          wkt = wkt.substring(0, wkt.length - 1) + ')'

          return wkt
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
