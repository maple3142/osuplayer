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
			this.aplayer.play()
		}
	},
	mounted() {
		let list = this.list.map(m => {
			const cover = process.env.IS_WEB ? '' : 'file://' + m.bg && m.bg.replace(/\\/g, '/')
			return {
				name: m.titleUnicode || m.title,
				artist: m.artistUnicode || m.artist,
				url: m.mp3,
				cover
			}
		})
		this.aplayer = new APlayer({
			container: this.$refs.player,
			listFolded: true,
			order: 'random',
			audio: list
		})
		this.aplayer.on('listswitch', async ({ index }) => {
			if (process.env.IS_WEB) {
				const m = this.list[index]
				if (m.loaded) return
				this.aplayer.pause()
				await m.load()
				this.aplayer.list.audios[index] = {
					name: m.titleUnicode || m.title,
					artist: m.artistUnicode || m.artist,
					url: m.mp3,
					cover: m.bg
				}
				this.aplayer.list.switch(index)
				this.aplayer.play()
			}
			this.$store.commit(mutations.setCurrent, index)
		})
		this.aplayer.events.events.error = null // suppress error messages
	}
}
</script>
