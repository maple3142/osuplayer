<template>
	<b-row>
		<b-col>
			<b-row align-h="center"
			       class="pt-4">
				<b-col cols="4" class="text-center">
					<b-img src="static/logo.png"></b-img>
				</b-col>
			</b-row>
			<b-row align-h="center"
			       class="pt-4">
				<b-col v-if="!IS_WEB">
					<b-form-file @change="setPath($event.target.files[0].path)"
					             placeholder="Choose your osu! Songs directory."
					             directory></b-form-file>
				</b-col>
				<b-col v-else>
					<b-form-file @change="onDirectory($event.target.files)"
					             placeholder="Choose your osu! Songs directory."
					             directory></b-form-file>
				</b-col>
			</b-row>
		</b-col>
	</b-row>
</template>
<script>
import { actions, mutations } from '../store/ops'
import { mapState } from 'vuex'
import Parser from '../../main/parser'

const readFileAs = wat => file => new Promise((res, rej) => {
	const r = new FileReader()
	r.onload = e => res(e.target.result)
	r.onerror = rej
	r[`readAs${wat}`](file)
})
const readFileAsText = readFileAs('Text')
const readFileAsArrayBuffer = readFileAs('ArrayBuffer')
const buf2url = buf => URL.createObjectURL(new Blob([buf]))

export default {
	data() {
		return {
			pathinput: '',
			files: []
		}
	},
	computed: mapState(['osupath']),
	methods: {
		setPath(path) {
			this.$store.dispatch(actions.updateOsupath, path)
		},
		async onDirectory(files) {
			if (!files || files.length === 0) return
			const ar = [...files]
			const fs = ar.filter(x => x.name.endsWith('.osu') || x.name.endsWith('.png') || x.name.endsWith('.jpg') || x.name.endsWith('.mp3')).reduce((m, cur) => {
				const dir = cur.webkitRelativePath.split('/')[1]
				if (!m.has(dir)) m.set(dir, [])
				m.get(dir).push(cur)
				return m
			}, new Map())
			const result = []
			for (const [dir, files] of fs) {
				const file = files.find(x => x.name.endsWith('.osu'))
				if (!file) continue
				const rgxr = /\/(\d+)/.exec(file.webkitRelativePath)
				const { Metadata, General } = Parser.parse(await readFileAsText(file))
				const mp3file = files.find(x => x.webkitRelativePath.includes(General.AudioFilename))
				const bgfile = files.find(x => x.webkitRelativePath.includes(Metadata.bg))
				const music = {
					title: Metadata.Title,
					titleLower: Metadata.Title.toLowerCase(),
					titleUnicode: Metadata.TitleUnicode,
					artist: Metadata.Artist,
					artistUnicode: Metadata.ArtistUnicode,
					id: rgxr ? rgxr[1] : null
				}
				// lazy load
				let mp3, bg
				Object.defineProperty(music, 'mp3', {
					get: () => mp3
				})
				Object.defineProperty(music, 'bg', {
					get: () => bg
				})
				music.load = async () => {
					console.log('lazyload', { mp3file, bgfile, General, Metadata, files })
					mp3 = mp3file ? buf2url(await readFileAsArrayBuffer(mp3file)) : ''
					bg = bgfile ? buf2url(await readFileAsArrayBuffer(bgfile)) : ''
					music.loaded = true
				}
				result.push(music)
			}
			this.$store.commit(mutations.setList, result)
			this.$store.commit(mutations.setShowpathinput, false)
		}
	}
}
</script>
