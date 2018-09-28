import Vue from 'vue'
import Vuex from 'vuex'
import ipc from 'electron-better-ipc'

Vue.use(Vuex)

const store = new Vuex.Store({
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
		updateCurrent(state, current) {
			state.current = current
		},
		setModalMusic(state, music) {
			state.modalMusic = music
		}
	},
	actions: {
		async updateOsupath({ commit, dispatch }, osupath) {
			commit('setOsupath', osupath)
			await ipc.callMain('setDb', { key: 'osupath', value: osupath })
			if (osupath) {
				await dispatch('updateListWithPath', osupath)
			}
		},
		async updateListWithPath({ commit }, osupath) {
			const list = await ipc.callMain('getList', osupath)
			commit('setList', list)
			commit('updateCurrent', null)
		}
	}
})

export default store
