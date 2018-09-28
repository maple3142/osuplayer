import path from 'path'
import fs from 'fs-extra'
import Parser from './parser'

export default async osupath => {
	if (!(await fs.exists(osupath))) {
		throw new Error('invalid path')
	}
	const result = []
	const list = (await fs.readdir(osupath)).map(dir => path.join(osupath, dir))
	for (const entry of list) {
		if (!(await fs.stat(entry)).isDirectory()) {
			continue
		}
		const osufiles = (await fs.readdir(entry))
			.filter(file => file.endsWith('.osu'))
			.map(file => path.join(entry, file))
		if (osufiles.length < 1) {
			// no .osu files
			continue
		}
		try {
			const data = await Parser.parseFromFile(osufiles[0])
			const regr = /\d+/.exec(entry)
			result.push({
				title: data.Metadata.Title,
				titleLower: data.Metadata.Title.toLowerCase(),
				mp3: path.join(entry, data.General.AudioFilename),
				artist: data.Metadata.Artist,
				id: regr ? regr[0] : null,
				bg: data.Metadata.bg ? path.join(entry, data.Metadata.bg) : null
			})
		} catch (e) {
			console.error(e)
			if (e instanceof Parser.ParseError) {
				throw new Error('invalid-content')
			} else {
				throw e
			}
		}
	}
	return result
}
if (require.main === module) {
	const osupath = process.argv[2]
	if (osupath) {
		module
			.exports(osupath)
			.then(JSON.stringify)
			.then(console.log)
			.catch(console.error)
	}
}
