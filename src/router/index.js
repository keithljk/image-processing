import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import BlockUI from 'vue-blockui'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(BlockUI);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/perspective",
    name: "Perspective",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Perspective.vue"),
  },
  {
    path: "/unsharp",
    name: "UnsharpMarking",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UnsharpMarking.vue"),
  },
  {
    path: "/boundary",
    name: "BoundaryExtraction",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/BoundaryExtraction.vue"),
  },
  {
    path: "/region",
    name: "RegionFilling",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RegionFilling.vue"),
  },
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
