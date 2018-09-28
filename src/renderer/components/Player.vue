<template>
	<b-row align-h="center">
		<b-col>
			<aplayer ref="player"
			         autoplay
			         :music="musicobj" />
		</b-col>
	</b-row>
</template>
<script>
import aplayer from 'vue-aplayer'
import fs from 'fs-extra'

export default {
	computed: {
		music() {
			const { list, current } = this.$store.state
			return list[current]
		},
		musicobj() {
			if (this.music == null) {
				return { src: true, title: 'Empty', artist: 'Select a music to start playing' }
			}
			const buf = fs.readFileSync(this.music.bg)
			const bloburl = URL.createObjectURL(new Blob([new Uint8Array(buf).buffer]))
			const o = { title: this.music.title, artist: this.music.artist, src: this.music.mp3, pic: bloburl }
			return o
		}
	},
	watch: {
		music() {
			this.$nextTick(() => {
				// it seems like that player component doesn't exists when music change...
				this.$refs.player.thenPlay()
			})
		}
	},
	components: { aplayer }
}
</script>
