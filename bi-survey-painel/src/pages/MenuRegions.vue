<template>
  <q-page class="">
    <q-splitter v-if="$route.name === 'Regiões'" reverse v-model="splitterModel" class="fit absolute" :limits="limites">
      <template v-if="isMapaRenderizado" v-slot:before>
        <component :is="view" ref="view"/>
      </template>

      <template v-slot:after>
        <google-map @mapaRenderizado="mapaRenderizado"/>
      </template>

    </q-splitter>
    <div v-else id="q-app">
      <router-view />
    </div>
  </q-page>
</template>
<script>

import GoogleMap from '@/components/GoogleMap.vue'
import ListaRegioes from '@/components/region/ListaRegioes'
import DetalheRegiao from '@/components/region/DetalheRegiao'
import { mapState } from 'vuex'

export default {
  components: {
    GoogleMap, ListaRegioes, DetalheRegiao
  },
  provide () {
    return {
      setView: this.setView
    }
  },
  data () {
    return {
      splitterModel: 60,
      limites: [30, 70],
      view: 'ListaRegioes',
      isMapaRenderizado: false
    }
  },
  mounted () {
    console.log(this.expandLeftMenu)
    if (this.$route.params._id) this.setView('DetalheRegiao')
    var me = this
    this.$router.beforeEach((to, from, next) => {
      me.setView(to.fullPath === '/regions' ? 'ListaRegioes' : 'DetalheRegiao')
      next()
    })
  },
  computed: {
    ...mapState({
      expandLeftMenu: state => state.config.expandLeftMenu
    })
  },
  watch: {
    expandLeftMenu () {
      if (this.expandLeftMenu) this.splitterModel = 40
      else this.splitterModel = 70
    }
  },
  methods: {
    setView (view) {
      this.view = view
      return new Promise(resolve => {
        this.$nextTick(() => {
          resolve(this.$refs.view)
        })
      })
    },
    mapaRenderizado () {
      this.isMapaRenderizado = true
    }
  }
}
</script>

<style>
html, body, #q-app, .q-layout, .q-page-container {
  height: 100%;
}

#dados .q-table__top{
  border-bottom: 1px solid #004d40;
  padding-bottom: 0px;
  margin-bottom: 12px;
}
#busca {
  border-bottom: 1px solid #004d40;
}
#paginacao {
  border-top: 1px solid #e0e0e0
}
#bt-buscar {
  margin-bottom: 10px;
}
</style>
<style scoped>
.vue-map-container {
  position: initial;
}
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
