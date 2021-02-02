<template>
  <q-layout class="q-pa-md" style="padding-bottom: 5%;">
    <q-table
      :data="optionList"
      title="Lista de opções"
      :columns="optioinHead"
      row-key="_id"
      :loading="loadOption"
      :filter="filter"
      :filter-method="filterFunction"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr class="cursor-pointer" :props="props" @click="$router.push(`optionGroupDetail/${props.row._id}`)">
          <q-td key="acao" auto-width align='left'>
            <q-btn flat round size="sm" icon="delete" color="negative" @click.stop="deletar(props.row._id)">
              <q-tooltip>
                Deletar lista de opções
              </q-tooltip>
            </q-btn>
          </q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="total" :props="props" >{{ props.row.total }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Botão Adicionar Lista de Opções -->
    <q-page-sticky :position="addButton.position" :offset="addButton.offset">
      <q-btn fab icon="add" color="primary" to="/optionGroupDetail"/>
      <q-tooltip anchor="top left" self="top middle">
        Adicionar lista de opções
      </q-tooltip>
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'
import optionGroupService from '@/service/optionGroupService'

export default {
  name: 'OptionGroups',
  components: {
  },
  data: function () {
    return {
      filter: '',
      loadOption: false,
      optioinHead: [
        { name: 'acoes', label: 'Ações', field: 'acoes', sortable: false, align: 'center' },
        { name: 'description', label: 'Descrição', field: 'description', format: val => `${val}`, sortable: true, align: 'left' },
        { name: 'total', label: 'Total de opções', field: 'total', sortable: false, align: 'center' }
      ],
      optionList: [],
      addButton: {
        offset: [18, 18],
        position: 'bottom-right'
      }
    }
  },
  mounted () {
    this.getAll()
  },
  methods: {
    getAll () {
      this.loadOption = true
      this.optionList = []
      optionGroupService.getAll().then(response => {
        response.data.options.forEach(option => {
          const item = {
            _id: option._id,
            description: option.description,
            total: option.options.length
          }
          this.optionList.push(item)
        })
        this.loadOption = false
      })
    },
    deletar (id) {
      let me = this
      this.$q.dialog({
        title: 'Atenção',
        message: 'Tem certeza que deseja deletar essa lista de opções?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        me.$q.loading.show()
        optionGroupService.delete([id]).then(response => {
          this.getAll()
          me.$q.loading.hide()
          this.$q.notify({
            message: 'Lista de opções deletada com sucesso',
            color: 'positive'
          })
        })
      })
    },
    filterFunction (rows, terms, cols, getCellValue) {
      return rows.filter(r => {
        for (const prop in r) {
          if (typeof r[prop] === 'string' && r[prop].toLowerCase().includes(terms.toLowerCase())) {
            return true
          }
        }
        return false
      })
    }
  },
  computed: {
    user () {
      return LocalStorage.getItem(this.$c.USER) ? LocalStorage.getItem(this.$c.USER) : {}
    }
  }
}
</script>
<style>
.q-date--landscape .q-date__content {
  overflow-x: hidden !important;
}
.overflow-auto {
  overflow: auto !important;
}
</style>
<style scoped>
.q-card__section {
  padding: 8px;
}
.q-expansion-item {
  border-top: 1px solid #e0e0e0;
}
.q-item:last-child {
  margin-bottom: 18px;
}
</style>
