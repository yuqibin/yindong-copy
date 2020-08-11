import Vue from 'vue'
import VueRouter from 'vue-router'

// component: () => import('../views/About.vue')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  alias: '/home',
  name: 'Home',
  component: () => import('../views/home/Home.vue')
}, {
  path: '/flirt',
  name: 'Flirt',
  component: () => import('../views/liao/Liso.vue')
}, {
  path: '/funny',
  name: 'Funny',
  component: () => import('../views/pi/Pi.vue')
}, {
  path: '/story',
  name: 'Story',
  component: () => import('../views/story/Story.vue')
}, {
  path: '/complain',
  name: 'Complain',
  component: () => import('../views/tc/Tc.vue')
}, {
  path: '/a/:aid',
  name: 'ArticleDetail',
  component: () => import('../views/art-detail/ArtDetail.vue')
}, {
  path: '/author-list',
  name: 'AuthorList',
  component: () => import('../views/author/AuthorList.vue')
}, {
  path: '/author/:auid',
  name: 'AuthorInfo',
  component: () => import('../views/author/AuthorInfo.vue')
}, {
  path: '/search/:keyword',
  name: 'Search',
  component: () => import('../views/search/Search.vue')
}]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router