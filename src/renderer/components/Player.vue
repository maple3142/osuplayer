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
import { setImmediate } from 'timers';

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
		async current() {
			this.aplayer.list.switch(this.current)
			setImmediate(() => this.aplayer.play())
		}
	},
	mounted() {
		let list = this.list.map(m => {
			return {
				name: m.titleUnicode || m.title,
				artist: m.artistUnicode || m.artist,
				url: m.mp3,
				cover: process.env.IS_WEB ? m.bg : 'file://' + m.bg && m.bg.replace(/\\/g, '/')
			}
		})
		this.aplayer = new APlayer({
			container: this.$refs.player,
			listFolded: true,
			order: 'random',
			audio: list
		})
		this.aplayer.on('listswitch', async ({ index }) => {
			this.$store.commit(mutations.setCurrent, index)
		})
		window.aplayer = this.aplayer
	}
}
</script>
