const routes = [
  {
    path: '/',
    redirect: '/flipcard',
  },
  {
    name: 'flipcard',
    path: '/flipcard',
    component: () => import('@/views/FlipCardGame.vue'),
  },
]

export default routes 