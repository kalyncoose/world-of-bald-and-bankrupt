import Vue from 'vue'
import Vuetify from "vuetify";
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueLayers)
Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
