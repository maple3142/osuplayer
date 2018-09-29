<template>
	<b-row align-h="center">
		<b-col>
			<div ref="player" />
		</b-col>
	</b-row>
</template>
<script>
import { mapState } from 'vuex'
import { mutations } from '../store/ops'
import APlayer from 'aplayer'
import 'APlayer/dist/APlayer.min.css'
import fs from 'fs-extra'

export default {
	computed: {
		music() {
			return this.list[this.current]
		},
		...mapState(['current', 'list'])
	},
	data() {
		return {
			aplayer: null
		}
	},
	watch: {
		current() {
			this.aplayer.list.switch(this.current)
			this.aplayer.play()
		}
	},
	mounted() {
		window.p = this
		this.aplayer = new APlayer({
			container: this.$refs.player,
			listFolded: true,
			order: 'random',
			audio: this.list.map(m => ({
				name: m.titleUnicode || m.title,
				artist: m.artistUnicode || m.artist,
				url: m.mp3,
				cover: 'file://' + m.bg && m.bg.replace(/\\/g, '/')
			}))
		})
		this.aplayer.on('listswitch', ({ index }) => {
			this.$store.commit(mutations.setCurrent, index)
		})
	}
}
</script>
