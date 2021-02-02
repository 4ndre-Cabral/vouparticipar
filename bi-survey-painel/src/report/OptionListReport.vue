<template>
  <div class="q-pa-md" :style="showReport ? 'display:inline' : 'display:none'">
    <div style="height: 1200px;"></div>
    <q-card flat id="option-list-report">
       <q-field borderless stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{optionGroup.description}}</div>
          </template>
        </q-field>
      <!-- lista Opção -->
      <q-list bordered class="rounded-borders" >

        <q-item v-ripple
          v-for="(option, index) in optionGroup.options" :key="index"
          class=" q-my-sm q-mx-sm">

          <q-item-section top>
            <q-item-label lines="1" class="q-mt-sm">
              <span class="text-weight-medium text-h6">{{index + 1}}</span>
              <span class="text-grey-8 text-subtitle1"> - {{option.label}}</span>
            </q-item-label>
          </q-item-section>

        </q-item>
      </q-list>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'OptionListReport',
  props: ['optionGroup', 'showReport'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
