import Vue from 'vue'
import ipc from 'electron-better-ipc'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(BootstrapVue)

window.app = new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

ipc.callMain('getDb', { key: 'osupath' }).then(p => {
	if (p) {
		store.dispatch('updateOsupath', p)
	}
})
ipc.answerMain('setOsupath', () => {
	store.dispatch('updateOsupath', '')
})
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true
