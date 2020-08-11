import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

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