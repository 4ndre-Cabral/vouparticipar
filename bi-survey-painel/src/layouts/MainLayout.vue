<template>
  <!-- <q-layout view="hhh LpR fff"> -->
  <q-layout view="hHh Lpr lff">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <a style="margin-top: 10px;" href="#" @click="goHome" class="navbar-logo">
          <img style="max-width:254;max-height:35px;margin-left: 8px;" alt="Vou participar Logo" :src="logoImage">
        </a>
        <q-space />

        <q-btn-dropdown stretch flat :label="user.name">
          <q-list>
            <!-- <div class="q-pa-md row justify-center" style="background-color: primary">
              <div>
                <q-avatar @click="chageImage" size="100px">
                  <q-avatar @click="chageImage" size="100px" font-size="100px" color="primary" text-color="white" icon="account_circle" />
                  <q-badge floating color="teal">Add imagem</q-badge>
                </q-avatar>
              </div>
            </div> -->
            <q-item clickable @click.native="logout" v-close-popup>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Menu -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="500"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <div class="q-pa-md row justify-center" style="background-color: primary">
          <div v-if="user.profilePicture">
            <q-avatar size="100px">
              <img :src="user.profilePicture">
            </q-avatar>
          </div>
        </div>
        <div v-if="user.profilePicture">
          <q-item-section>
            <q-item-label class="row justify-center">{{ user.name }}</q-item-label>
            <!-- <q-item-label caption class="row justify-center">{{user.email}}</q-item-label> -->
          </q-item-section>
        </div>
        <q-item-label header>Menu</q-item-label>
        <q-item v-for="(item, index) in menu" v-bind:key="index" clickable :to="item.ref" @click="setTitle(item)">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{item.label}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="logout()">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sair</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div>
        <!-- <bread-crumb></bread-crumb> -->
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'MainLayout',
  components: {
    // BreadCrumb
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      title: '',
      profilePicture: null,
      selectProfilePicture: false,
      menuItens: [
        { disable: !this.$ability.can('read', 'surveys'), canRead: 'surveys', ref: '/formularios', label: 'Questionários', icon: 'speaker_notes' },
        { disable: !this.$ability.can('read', 'options'), canRead: 'options', ref: `/optionGroups`, label: 'Lista de Opções', icon: 'list' },
        { disable: !this.$ability.can('read', 'regions'), canRead: 'regions', ref: `/regions`, label: 'Regiões', icon: 'mdi-vector-polygon' },
        { disable: !this.$ability.can('read', 'results'), canRead: 'results', ref: `/resultados`, label: 'Resultados', icon: 'assessment' },
        { disable: !this.$ability.can('read', 'users'), canRead: 'users', ref: '/users', label: 'Lista de usuários', icon: 'supervised_user_circle' }
      ]
    }
  },
  computed: {
    menu: function () {
      return this.menuItens.filter(el => el.disable !== true)
    },
    logoImage () {
      return 'statics/logo-survey.png'
    },
    user () {
      return LocalStorage.getItem(this.$c.USER) ? LocalStorage.getItem(this.$c.USER) : {}
    }
  },
  methods: {
    setTitle (item) {
      this.title = item.label
    },
    logout () {
      LocalStorage.set(this.$c.USER, null)
      this.$auth.logout({ makeRequest: false })
    },
    login () {
      this.$router.push({ path: '/login' })
    },
    goHome () {
      this.$router.push({ path: '/calendar' })
    },
    updateAbility () {
      this.menuItens.forEach(item => {
        if (item.canRead) item.disable = !this.$ability.can('read', item.canRead)
      })
    }
  },
  async mounted () {
    await this.updateAbility()
    this.title = this.$route.name
  }
}
</script>

<style>
.q-header {
  background-image: linear-gradient(-45deg, #22a6b3, #22a6b3);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
}
</style>
