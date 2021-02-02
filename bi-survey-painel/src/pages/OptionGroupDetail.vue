<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-10 justify-between">
        <q-btn class="q-mb-sm" flat dense round icon="keyboard_arrow_left" @click="$router.go(-1)"/>
        <span class="text-h6 q-ml-sm">Lista de Opções</span>
      </div>
      <q-btn class="col-2 q-mb-sm" dense outline color="primary" label="Exportar" icon="mdi-file-pdf-outline" @click.stop="exportar"/>
    </div>
    <q-card class="">
      <q-input
        class="q-px-sm q-py-md col-12" label="Descição *"
        v-model="optionGroup.description" filled dense
        :rules="[ val => !!val|| 'Campo obrigatório']"/>
      <div class="row justify-end q-mr-sm">
        <q-btn
          :disable="!optionGroup.description"
          outline class="q-my-md" style="margin-right: 0px;"
          label="Adicionar" @click="showOptonCard()">
          <q-tooltip v-if="optionGroup.description" anchor="top left" self="top middle">
            Adicionar opção
          </q-tooltip>
        </q-btn>
        <q-tooltip v-if="!optionGroup.description" anchor="top right">
          Necessário adicionar uma descrição antes de adicionar uma opção
        </q-tooltip>
      </div>
      <!-- lista Opção -->
      <q-list bordered class="rounded-borders" >

        <q-item v-ripple
          v-for="(option, index) in optionGroup.options" :key="index"
          class=" q-my-sm q-mx-sm">
          <q-item-section avatar top>
            <q-avatar v-if="option.photoUrl" size="43px">
              <img :src="option.photoUrl">
            </q-avatar>
            <q-btn v-else round color="primary" icon="image" />
          </q-item-section>

          <q-item-section top>
            <q-item-label lines="1" class="q-mt-sm">
              <span class="text-weight-medium text-h6">{{index + 1}}</span>
              <span class="text-grey-8 text-subtitle1"> - {{option.label}}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section top side class="q-mt-sm">
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="deleteOption(option)"/>
              <q-btn class="gt-xs" size="12px" flat dense round icon="create" @click="showOptonCard(option)"/>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <!-- Option Card -->
    <q-dialog v-model="optionCard" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Opção</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input label="Descrição *" filled dense v-model="optionSelected.label" autofocus @keyup.enter="addOption" />
        </q-card-section>

        <q-card-section v-show="optionSelected.label.length > 0" class="q-py-none">
          <q-uploader
            label="Selecione uma imagem"
            auto-upload batch
            accept=".jpg, image/*"
            :factory="factoryFn"
            @pickFiles="chageImage"
          />
        </q-card-section>

        <q-skeleton class="q-ml-md" v-show="optionSelected.label.length === 0" height="112px" width="320px" />

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn outline color="primary" label="Salvar" v-close-popup @click="addOption"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row justify-end q-mt-sm">
      <q-btn label="Salvar" color="primary" @click="salvar()"/>
    </div>
    <option-list-report :optionGroup="optionGroup" :showReport="showReport"/>
  </div>
</template>
<script>
import optionGroupService from '@/service/optionGroupService'
import optionService from '@/service/optionService'
import { LocalStorage } from 'quasar'
import html2pdf from 'html2pdf.js'
import loading from '@/boot/loading'
import OptionListReport from '@/report/OptionListReport.vue'

export default {
  components: { OptionListReport },
  name: 'OptionGroupDetail',
  data: function () {
    return {
      optionGroup: {
        options: [],
        ownerUser: LocalStorage.getItem('user')._id
      },
      optionCard: false,
      optionSelected: {
        label: ''
      },
      showReport: false
    }
  },
  mounted () {
    this.getOptionGroupById()
  },
  methods: {
    exportar () {
      loading.show('Gerando relatório...')
      let me = this
      let element = document.getElementById('option-list-report')
      let opt = {
        margin: [0.5, 0, 0.5, 0],
        filename: `${this.optionGroup.description}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      }
      this.showReport = true
      this.$nextTick(() => {
        html2pdf().from(element).set(opt).save().then(() => {
          loading.hide()
          me.showReport = false
        })
      })
    },
    getOptionGroupById () {
      if (this.$route.params._id) {
        optionGroupService.getById(this.$route.params._id).then(response => {
          this.optionGroup = response.data.OptionGroup
        })
      }
    },
    addOption () {
      optionService.addOrUpdate(this.optionSelected).then(response => {
        if (response.data.createdOption) {
          this.optionGroup.options.push(response.data.createdOption)
          optionGroupService.addOrUpdate(this.optionGroup).then(response => {
            if (!this.$route.params._id) this.$router.push(`optionGroupDetail/${response.data.createdOption._id}`)
            this.addOptionMsg()
          })
        }
        this.addOptionMsg()
      })
    },
    addOptionMsg () {
      this.$q.loading.hide()
      this.optionCard = false
      this.$q.notify({
        message: 'Opção salva com sucesso!',
        color: 'positive'
      })
      this.getOptionGroupById()
    },
    salvar () {
      this.$q.loading.show()
      optionGroupService.addOrUpdate(this.optionGroup).then(response => {
        if (!this.$route.params._id) this.$router.push(`optionGroupDetail/${response.data.createdOption._id}`)
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Lista salva com sucesso!',
          color: 'positive'
        })
      })
    },
    showOptonCard (option) {
      if (option) {
        this.optionSelected = option
      } else {
        this.optionSelected._id = null
        this.optionSelected.label = ''
        this.optionSelected.photoUrl = ''
      }
      this.optionCard = true
    },
    deleteOption (option) {
      this.$q.dialog({
        title: 'Atenção',
        message: `Tem certeza que deseja deletar essa opção: ${option.label}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show()
        optionService.delete([option._id]).then(response => {
          this.getOptionGroupById()
          this.$q.notify({
            message: 'Opção deletada com sucesso',
            color: 'positive'
          })
          this.$q.loading.hide()
        })
      })
    },
    chageImage () {
      this.optionCard = false
    },
    factoryFn (files) {
      let me = this
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', files[0])
        let optionPhoto = ''
        if (me.optionSelected.photoUrl) optionPhoto = me.optionSelected.photoUrl.split('/')
        optionService.uploadOptionPicture(formData, optionPhoto[optionPhoto.length - 1]).then(response => {
          me.optionSelected.photoUrl = response.data.url
          // TODO: salvar opção com id questionario na api
          optionService.addOrUpdate(me.optionSelected).then(response => {
            if (response.data.createdOption) {
              this.optionGroup.options.push(response.data.createdOption)
              optionGroupService.addOrUpdate(this.optionGroup).then(response => {
                this.optionUpdateMsg()
              })
            } else {
              this.optionUpdateMsg()
            }
          })
        }).catch(err => {
          reject()
          console.error(err)
        })
      })
    },
    optionUpdateMsg () {
      this.$q.loading.hide()
      this.optionCard = false
      this.$q.notify({
        message: 'Opção salva com sucesso!',
        color: 'positive'
      })
      this.getOptionGroupById()
    }
  }
}
</script>
