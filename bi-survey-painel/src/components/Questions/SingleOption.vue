<template>
    <div>
      <q-expansion-item :class="$q.platform.is.desktop ? 'text-h6' : 'text-h8'"
        popup default-opened disable
        :label="`${index + 1} - ${question.description}`"
        caption="Selecione apenas uma opção">
        <q-separator />
        <q-card>
            <q-list class="q-pa-md">
                <q-item
                v-for="opcao in question.options" :key="opcao._id"
                tag="label" v-ripple >
                <q-item-section avatar v-if="opcao.photoUrl">
                    <q-avatar size="70px">
                    <img :src="opcao.photoUrl">
                    </q-avatar>
                </q-item-section>

                <q-item-section side top class="q-mt-md">
                    <q-radio :label="opcao.label" :val="opcao._id" v-model="selected" @click.native="salvarResposta(opcao)"/>
                </q-item-section>
                </q-item>
            </q-list>
        </q-card>
        </q-expansion-item>
    </div>
</template>

<script>
export default {
  props: ['question', 'index'],
  data () {
    return {
      selected: null
    }
  },
  methods: {
    salvarResposta (opcao) {
      let answer = {
        question: this.question._id,
        options: [this.selected]
      }
      this.$emit('answerUpdate', answer)
    }
  }
}
</script>

<style scoped>

</style>
