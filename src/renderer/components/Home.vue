<template>
	<b-container fluid
	             class="h-100">
		<b-row class="h-100">
			<b-col>
				<osu-path-input v-if="showpathinput" />
				<div v-else-if="list.length===0">
					<h1>No songs are found, maybe your osu! songs path is incorrect.</h1>
				</div>
				<div class="h-100 d-flex flex-column"
				     v-else>
					<music-list class="flex-grow-1" />
					<player class="pt-1 pb-1 player" />
				</div>
			</b-col>
			<img-modal />
		</b-row>
	</b-container>
</template>

<script>
import { mapState } from 'vuex'
import OsuPathInput from './OsuPathInput'
import MusicList from './MusicList'
import Player from './Player'
import ImgModal from './ImgModal'

export default {
	data() {
		return {
			pathinput: ''
		}
	},
	computed: mapState(['osupath', 'list', 'showpathinput']),
	components: { OsuPathInput, MusicList, Player, ImgModal }
}
</script>
<style scoped>
.player {
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 10;
}
</style>
