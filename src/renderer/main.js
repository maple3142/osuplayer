import Vue from 'vue/dist/vue.runtime.esm.js'
import './bvimporter'
import './style'

import App from './App'
import store from './store'
import { actions } from './store/ops'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, 'IS_WEB', {
	get: () => process.env.IS_WEB
})

window.app = new Vue({
	store,
	render: h => h(App)
}).$mount('#app')

if (!process.env.IS_WEB) {
	const ipc = require('electron-better-ipc')
	ipc.answerMain('setOsupath', () => {
		store.dispatch(actions.updateOsupath, '')
	})
}
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true
