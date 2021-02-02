<template>
  <div :style="showReport ? 'display:inline' : 'display:none'">
    <div style="height: 1200px;"></div>
    <div id="survey-report" class="q-mr-lg q-ml-sm">
      <q-list bordered class="col rounded-borders">
        <q-expansion-item
          expand-separator default-opened
          icon="assignment"
          label="Dados do formulário"
          caption="Preencha os campos obrigatórios"
        >
          <q-separator />
          <q-card class="q-mx-sm">
            <q-field borderless label="Título" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{survey.title}}</div>
              </template>
            </q-field>
            <q-field borderless label="Descrição" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{survey.description}}</div>
              </template>
            </q-field>
            <div class="row">
              <q-field class="col-6" borderless label="Data criação" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{formataData(survey.registerDate)}}</div>
                </template>
              </q-field>
              <q-field class="col-6" borderless label="Data expiração" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{formataData(survey.expirationDate)}}</div>
                </template>
              </q-field>
            </div>
            <q-field borderless label="Link da pesquisa" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{url}}</div>
              </template>
            </q-field>
          </q-card>
        </q-expansion-item>
      </q-list>
      <q-list bordered class="rounded-borders q-mt-md" >
        <q-expansion-item
          expand-separator default-opened
          icon="speaker_notes"
          label="Perguntas"
          caption="Cadastre ou edite as perguntas aqui (salvamento automático)"
        >
          <q-separator />
          <q-card class="">
            <!-- Lista Questao -->
            <q-list bordered class="rounded-borders" >

              <q-item
                v-for="(question, index) in survey.questions" :key="question._id"
                class=" column q-my-sm q-mx-sm">
                <div class="col-12 col-md-9">
                  <q-item-label lines="1">
                    <span class="text-weight-medium text-h6">{{index + 1}}</span>
                    <span class="text-grey-8 text-subtitle1"> - {{question.description}}</span>
                  </q-item-label>
                  <q-item-label caption lines="1">
                    {{question.type === 'single_option' ? 'Opção única' : 'Múltipla opção'}}
                  </q-item-label>
                </div>
                <div>
                  <!-- lista Opção -->
                  <q-list bordered class="rounded-borders" >
                    <div v-for="(option, index) in question.options" :key="option._id" class="row justify-between">
                      <div class="col-12 col-sm-9 row justify-start">
                        <q-item-label lines="1" class="q-mt-sm q-ml-sm">
                          <span class="text-weight-medium text-h6">{{index + 1}}</span>
                          <span class="text-grey-8 text-subtitle1"> - {{option.label}}</span>
                        </q-item-label>
                      </div>
                    </div>
                  </q-list>
                </div>
              </q-item>
            </q-list>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>
<script>
import { parse, format } from 'date-fns'
export default {
  name: 'SurveyReport',
  props: ['survey', 'url', 'showReport'],
  data: function () {
    return {
    }
  },
  methods: {
    formataData (date) {
      if (date && date.length === 10) {
        return format(parse(date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
      }
      return ''
    }
  }
}
</script>
