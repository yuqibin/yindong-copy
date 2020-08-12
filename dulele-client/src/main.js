import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css';
// import {
//   Button,
//   Slider,
//   Popover,
//   Backtop,
//   Input
// } from 'element-ui';
import {
  Button
} from 'element-ui/lib/button';
import {
  Slider
} from 'element-ui/lib/slider';
import {
  Popover
} from 'element-ui/lib/popover';
import {
  Backtop
} from 'element-ui/lib/backtop';
import {
  Input
} from 'element-ui/lib/input';

Vue.component(Backtop.name, Backtop);
Vue.component(Button.name, Button);
Vue.component(Slider.name, Slider);
Vue.component(Popover.name, Popover);
Vue.component(Input.name, Input);
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)

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