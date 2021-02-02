<template>
    <div class="col-auto" id="menu_lateral">
      <q-toolbar class="menu-lateral-toolbar">
        <q-btn v-if="showGoBack" dense flat round icon="arrow_back" @click="$emit('go-back')" />
        <q-toolbar-title>{{titulo}}</q-toolbar-title>
        <q-btn dense flat round @click="expandLeftMenu" v-if="showExpand">
          <q-icon size="xs" :name="!isExpandLeftMenu ? 'mdi-arrow-expand-right' : 'mdi-arrow-expand-left'"/>
          <q-tooltip v-if="!isExpandLeftMenu" :delay="650" :offset="[0, 2]">Expandir</q-tooltip>
          <q-tooltip v-else :delay="650" :offset="[0, 2]">Minimizar</q-tooltip>
        </q-btn>
        <!-- <q-btn dense flat round icon="mdi-close" @click="toggleLeftMenu">
          <q-tooltip :delay="650" :offset="[0, 2]">Esconder</q-tooltip>
        </q-btn> -->
      </q-toolbar>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['titulo', 'showGoBack', 'showExpand'],
  methods: {
    ...mapActions({
      toggleLeftMenu: 'config/toggleLeftMenu',
      expandLeftMenu: 'config/expandLeftMenu'
    })
  },
  computed: {
    ...mapGetters({
      isExpandLeftMenu: 'config/getIsExpandLeftMenu'
    })
  }
}
</script>
<style lang="stylus" scoped>
</style>
