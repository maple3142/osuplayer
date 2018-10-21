import Vue from 'vue'
import Vuex from 'vuex'
import { mutations, actions } from './ops'

Vue.use(Vuex)

const plugins = []
let ipc

if (!process.env.IS_WEB) {
	ipc = require('electron-better-ipc')
	const dbSync = require('./dbSyncPlugin')
	plugins.push(dbSync.default(['osupath', 'list', 'showpathinput']))
}

const store = new Vuex.Store({
	plugins,
	state: {
		osupath: null,
		showpathinput: true,
		list: [],
		current: null,
		modalMusic: {}
	},
	mutations: {
		[mutations.setOsupath](state, osupath) {
			state.osupath = osupath
		},
		[mutations.setList](state, list) {
			state.list = list
		},
		[mutations.setCurrent](state, current) {
			state.current = current
		},
		[mutations.setModalMusic](state, music) {
			state.modalMusic = music
		},
		[mutations.setShowpathinput](state, showpathinput) {
			state.showpathinput = showpathinput
		}
	},
	actions: {
		async [actions.updateOsupath]({ commit, dispatch }, osupath) {
			commit(mutations.setOsupath, osupath)
			commit(mutations.setShowpathinput, !osupath)
			if (osupath) {
				await dispatch(actions.updateListWithPath, osupath)
			}
		},
		async [actions.updateListWithPath]({ commit }, osupath) {
			const list = await ipc.callMain('getList', osupath)
			commit(mutations.setList, list)
			commit(mutations.setCurrent, null)
		}
	}
})

export default store

// title updater
store.subscribe(() => {
	const { state } = store
	if (state.list && typeof state.current === 'number') {
		const m = state.list[state.current]
		document.title = m.titleUnicode || m.title
	}
})
