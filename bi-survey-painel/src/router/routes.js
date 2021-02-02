
const routes = [
  {
    path: '/',
    name: 'default',
    meta: { auth: true },
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/formularios',
    children: [
      {
        path: '/formularios',
        name: 'Questionários',
        meta: { auth: true },
        component: () => import('pages/Surveys.vue')
        // children: [
        //   { path: 'ebd', name: 'EDB', meta: { auth: true }, component: () => import('pages/Ebd.vue') }
        // ]
      },
      { path: '/formulario/:_id?', name: 'Dados do questionário', meta: { auth: true }, component: () => import('pages/SurveyDetail.vue') },
      { path: '/optionGroups', name: 'Lista de Opções', meta: { auth: true }, component: () => import('pages/OptionGroups.vue') },
      { path: '/optionGroupDetail/:_id?', name: 'Dados lista de opções', meta: { auth: true }, component: () => import('pages/OptionGroupDetail.vue') },
      { path: '/regions/:_id?', name: 'Regiões', meta: { auth: true }, component: () => import('pages/MenuRegions.vue') },
      { path: '/resultados', name: 'Resultados', meta: { auth: true }, component: () => import('pages/Results.vue') },
      { path: '/resultados/:_id?', name: 'Resultado', meta: { auth: true }, component: () => import('pages/ResultDetail.vue') },
      { path: '/users', name: 'Lista de usuários', meta: { auth: true }, component: () => import('pages/user/Users.vue') },
      { path: '/users/:_id?', name: 'Dados do usuário', meta: { auth: true }, component: () => import('pages/user/UserDetail.vue') }
    ]
  },
  // Rotas de controle ou erro
  {
    name: 'Track',
    path: '/track/:_id',
    component: () => import('layouts/Track.vue'),
    meta: {
      auth: false
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/autentication/login.vue'),
    meta: {
      auth: false
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
