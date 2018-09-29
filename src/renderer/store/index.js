import Vue from 'vue'
import Vuex from 'vuex'
import ipc from 'electron-better-ipc'
import dbSync from './dbSyncPlugin'
import { mutations, actions } from './ops'

Vue.use(Vuex)

const store = new Vuex.Store({
	plugins: [dbSync(['osupath', 'list'])],
	state: {
		osupath: null,
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
		}
	},
	actions: {
		async [actions.updateOsupath]({ commit, dispatch }, osupath) {
			commit('setOsupath', osupath)
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
