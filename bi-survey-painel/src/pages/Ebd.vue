<template>
  <div class="absolute-center">
    EBD
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Ebd',
  components: { },
  data () {
    return {
      eventList: [],
      eventSelected: null,
      opened: false
    }
  },
  computed: {
    ...mapGetters({
      event: 'event/getEvent'
    })
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      setEvent: 'event/setEvent'
    })
  }
}
</script>
