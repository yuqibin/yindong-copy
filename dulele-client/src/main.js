import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css';
// 异步加载element-ui 组件
Vue.component('el-backtop', () => import("element-ui/lib/backtop"));
Vue.component('el-slider', () => import("element-ui/lib/slider"));
Vue.component('el-button', () => import("element-ui/lib/button"));
Vue.component('el-popover', () => import("element-ui/lib/popover"));
Vue.component('el-input', () => import("element-ui/lib/input"));
Vue.component('el-icon', () => import("element-ui/lib/icon"));
Vue.prototype.$message = () => import("element-ui/lib/message");
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)

// markdown组件
const Showdown = require("showdown");
const keys = Object.keys(Showdown.getDefaultOptions());
Showdown.setFlavor("github");
const markdowner = new Showdown.Converter();
for (let key of keys) {
  markdowner.setOption(key, true);
}
Vue.prototype.$markdowner = markdowner

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')