<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div id="logo-fsm" class="q-pt-xs" ><img src="vouparticiparIcon.png" style="width: 32px"/></div>

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container style="padding-top: 10px">
      <router-view  ref="view"/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  components: {},
  provide () {
    return {
      setTitle: this.setTitle
    }
  },
  data () {
    return {
      title: '',
      leftDrawerOpen: false
    }
  },
  methods: {
    setTitle (title) {
      this.title = title
      return new Promise(resolve => {
        this.$nextTick(() => {
          resolve(this.$refs.title)
        })
      })
    }
  }
}
</script>
