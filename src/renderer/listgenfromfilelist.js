import Parser from '../main/parser'

const readFileAsText = file =>
	new Promise((res, rej) => {
		const r = new FileReader()
		r.onload = e => res(e.target.result)
		r.onerror = rej
		r.readAsText(file)
	})

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
			id: rgxr ? rgxr[1] : null,
			mp3: mp3file ? URL.createObjectURL(mp3file) : '',
			bg: bgfile ? URL.createObjectURL(bgfile) : ''
		}
		result.push(music)
	}
	return result
}
