<template>
  <div class="q-pa-md" :style="showReport ? 'display:inline' : 'display:none'">
    <div style="height: 1200px;"></div>
    <q-table
      id="result-list"
      title="Lista de Resultados"
      :data="results" hide-bottom flat
      :columns="columns"
      row-key="name"
      :pagination="initialPagination"
    >
      <template selectable v-slot:body="props">
        <q-tr class="cursor-pointer" :props="props">
          <q-td key="title" :props="props" style="white-space: break-spaces;">{{ props.row.title }}</q-td>
          <q-td key="description" :props="props" style="white-space: break-spaces;">{{ props.row.description }}</q-td>
          <q-td key="user" :props="props" >{{ props.row.user.name }}</q-td>
          <q-td key="expirationDate" :props="props" >{{ formatDate(props.row.expirationDate) }}</q-td>
          <q-td key="active" :props="props" >
            {{ isExpireted(props.row.expirationDate) }}
          </q-td>
          <q-td key="total" :props="props" >
            {{ props.row.total }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { parseISO, format, compareAsc } from 'date-fns'
export default {
  name: 'ResultReport',
  props: ['results', 'columns', 'showReport'],
  data () {
    return {
      initialPagination: {
        page: 1,
        rowsPerPage: 0
      }
    }
  },
  methods: {
    formatDate (date) {
      let data = parseISO(date)
      return data && date !== undefined ? format(data, 'dd/MM/yyyy HH:mm:ss') : ''
    },
    isExpireted (date) {
      let compare = compareAsc(parseISO(date), new Date())
      return compare === 1 ? 'Em andamento' : 'Finalizado'
    }
  }
}
</script>
