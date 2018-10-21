import Parser from '../main/parser'

const readFileAs = wat => file => new Promise((res, rej) => {
	const r = new FileReader()
	r.onload = e => res(e.target.result)
	r.onerror = rej
	r[`readAs${wat}`](file)
})
const readFileAsText = readFileAs('Text')
const readFileAsArrayBuffer = readFileAs('ArrayBuffer')
const buf2url = buf => URL.createObjectURL(new Blob([buf]))

export default async files => {
	const ar = [...files]
	const fs = ar
		.filter(
			x =>
				x.name.endsWith('.osu') || x.name.endsWith('.png') || x.name.endsWith('.jpg') || x.name.endsWith('.mp3')
		)
		.reduce((m, cur) => {
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
	return result
}
