import Vue from 'vue/dist/vue.esm'
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

const app = new Vue({
	store,
	render: h => h(App)
}).$mount(document.getElementById('app'))
window.app = app

if (!process.env.IS_WEB) {
	const ipc = require('electron-better-ipc')
	ipc.answerMain('setOsupath', () => {
		if (window.aplayer && !aplayer.paused) {
			aplayer.pause()
		}
		store.dispatch(actions.updateOsupath, '')
	})
}
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true
