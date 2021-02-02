<template>
  <div class="row">
    <q-breadcrumbs class="col-9 text-h5 q-pa-xs text-gray-800">
      <q-breadcrumbs-el v-for="crumb in crumbs" :key="crumb.id" :to="crumb.to" :label="jsUcfirst(crumb.text)" />
    </q-breadcrumbs>
  </div>
</template>

<script>
import store from '../store'

export default {
  computed: {
    crumbs: function () {
      let home = { path: '', to: '/surveys', text: 'Formulários' }
      let pathArray = this.$route.path.split('/')
      pathArray.shift()
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        breadcrumbArray.push({
          path: path,
          to: breadcrumbArray[idx - 1]
            ? '/' + breadcrumbArray[idx - 1].path + '/' + path
            : '/' + path,
          text: path !== '' ? path : 'Formulários'
        })
        if (breadcrumbArray.length > 1) breadcrumbArray[breadcrumbArray.length - 1].text = this.currentPage
        return breadcrumbArray
      }, [])
      return [home].concat(breadcrumbs)
    },
    currentPage: {
      get () { return store.getters['config/getCurrentPage'] }
    }
  },
  methods: {
    jsUcfirst (string) {
      if (string) return string.charAt(0).toUpperCase() + string.slice(1)
      else return ''
    }
  }
}
</script>
