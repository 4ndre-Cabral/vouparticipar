export const eventList = [
  {
    _id: 1,
    name: 'Oração',
    days: 'Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
    daysNumber: '1_2_3_4_5_6'.split('_'),
    initialHour: '7:00',
    finalHour: '16:00',
    frequency: 1, // em horas
    peoplePerInterval: '5',
    bgcolor: '#ff7979',
    agendas: []
  },
  {
    _id: 2,
    name: 'Culto',
    days: 'Terça_Sexta'.split('_'),
    daysNumber: '2_5'.split('_'),
    initialHour: '19:00',
    finalHour: '20:00',
    frequency: 1,
    peoplePerInterval: '30',
    bgcolor: '#686de0',
    agendas: []
  },
  {
    _id: 3,
    name: 'Culto',
    days: 'Domingo'.split('_'),
    daysNumber: '0'.split('_'),
    initialHour: '18:00',
    finalHour: '20:00',
    frequency: 1,
    peoplePerInterval: '30',
    bgcolor: '#686de0',
    agendas: []
  },
  {
    _id: 4,
    name: 'Ceia',
    days: 'Sábado_Domingo'.split('_'),
    daysNumber: '6_0'.split('_'),
    initialHour: '18:00',
    finalHour: '20:00',
    frequency: 1,
    peoplePerInterval: '30',
    bgcolor: '#ffbe76',
    agendas: []
  }
]
