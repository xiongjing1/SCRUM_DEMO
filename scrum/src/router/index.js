import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from "@/views/HomeView";
//import HomeView from '../views/document.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/user/:uid',
    name: 'user',
    meta:{
      title:'home',
    },
    component: () => import( '../views/TeamManage.vue')
  },

  {
    path: '/TeamManage/:tid',
    name: 'TeamManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TeamManage')
  },
  {
    path: '/ProjectManage/:tid',
    name: 'ProjectManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views//ProjectManage')
  },
  {
    path: '/TrashManage/:pid',
    name: 'TrashManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views//TrashManage')
  },{
    path: '/documentManage/:pid',
    name: 'documentManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/documentManage'),
  },
  {
    path: '/designManage/:pid',
    name: 'designManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/designManage')
  },
  {
    path: '/ProjectTrash/:tid',
    name: 'ProjectTrash',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ProjectTrash')
  },
  {
    path: '/document',
    name: 'document',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/document')
  },
  {
    path: '/ProtoTypeView/:pid',
    name: 'ProtoTypeView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ProtoTypeView')
  },
]

const router = new VueRouter({
  mode:"hash",
  routes
})

export default router
