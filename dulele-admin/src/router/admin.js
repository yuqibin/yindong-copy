export default [{
  path: '/index',
  name: 'Index',
  component: () => import('../views/index/Index.vue')
}, {
  path: '/new',
  name: 'New',
  alias: '/edit',
  component: () => import('../views/new-acticle/NewActicle.vue')
}]