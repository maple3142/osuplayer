<template>
	<b-row>
		<b-col>
			<div class="d-flex flex-column h-100">
				<b-form-input class="mt-2"
				              v-model="search"
				              placeholder="Search"></b-form-input>
				<b-list-group class="mt-2 music-list">
					<music-item v-for="music in filteredList"
					            :key="music.id+music.title"
					            :music="music"
					            @play="play(music)"
					            :active="music===currentMusic"></music-item>
				</b-list-group>
			</div>
		</b-col>
	</b-row>
</template>
<script>
import MusicItem from './MusicItem'
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState(['list', 'current']),
		filteredList() {
			return this.list.filter(m => m.titleLower.includes(this.search.toLowerCase()))
		},
		currentMusic() {
			return this.list[this.current]
		}
	},
	components: { MusicItem },
	data() {
		return {
			search: ''
		}
	},
	methods: {
		play(music) {
			this.$store.commit('updateCurrent', this.list.indexOf(music))
		}
	}
}
</script>
<style scoped>
.music-list {
	overflow-x: hidden;
	overflow-y: scroll;
	max-height: 100%;
}
</style>
