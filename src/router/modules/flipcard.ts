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
  {
    name: 'form-demo',
    path: '/form-demo',
    component: () => import('@/views/FormDemo.vue'),
  },
  {
    name: 'style-test',
    path: '/style-test',
    component: () => import('@/views/StyleTest.vue'),
  },
]

export default routes 