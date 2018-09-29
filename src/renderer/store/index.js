import Vue from 'vue'
import Vuex from 'vuex'
import ipc from 'electron-better-ipc'
import dbSync from './dbSyncPlugin'

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
		setOsupath(state, osupath) {
			state.osupath = osupath
		},
		setList(state, list) {
			state.list = list
		},
		setCurrent(state, current) {
			state.current = current
		},
		setModalMusic(state, music) {
			state.modalMusic = music
		}
	},
	actions: {
		async updateOsupath({ commit, dispatch }, osupath) {
			commit('setOsupath', osupath)
			if (osupath) {
				await dispatch('updateListWithPath', osupath)
			}
		},
		async updateListWithPath({ commit }, osupath) {
			const list = await ipc.callMain('getList', osupath)
			commit('setList', list)
			commit('setCurrent', null)
		}
	}
})

export default store
