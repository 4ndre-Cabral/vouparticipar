<template>
  <div class="q-pa-md">
    <q-list bordered>
      <q-item-label header>Lista de usuários</q-item-label>
      <q-item v-on:click="edituser(user)" v-for="user in users" :key="user._id"
        class="q-mb-sm" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ user.name[0] }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
          <q-item-label caption>{{user.email}}</q-item-label>
        </q-item-section>

      </q-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[30, 30]">
      <div class="q-gutter-md">
        <q-btn v-show="registerAvaliable" fab icon="add" color="primary" @click="add" />
      </div>
    </q-page-sticky>

  </div>
</template>
<script>
import userService from '../../service/userService'

export default {
  name: 'userList',
  data () {
    return {
      users: [],
      registerAvaliable: true
    }
  },
  mounted () {
    this.getAll()
  },
  methods: {
    edituser (user) {
      this.$router.push({ path: `/users/${user._id}` })
    },
    getAll () {
      this.$q.loading.show()
      userService.getAll().then(response => {
        this.users = response.data.users
        this.$q.loading.hide()
      })
    },
    add () {
      this.$router.push('/users/register')
    }
  }
}
</script>
