let fs, readline
if (!process.env.IS_WEB) {
	fs = require('fs')
	readline = require('readline')
}
const tryDecodeURIComponent = s => {
	try {
		return decodeURIComponent(s)
	} catch (e) {
		return s
	}
}
const tryParseNum = num => {
	const n = Number(num)
	return isNaN(n) ? num : n
}
class ParseError extends Error {
	constructor(content, e) {
		super()
		this.content = content
		this.originalStack = e.stack
	}
}

class Parser {
	constructor() {
		this.obj = {}
		this.mode = ''
	}
	eat(line) {
		if (/^\[\w+\]$/.test(line)) {
			// match [Difficulty] [Metadata]...
			this.mode = /^\[(\w+)\]$/.exec(line)[1]
			// ignore Events
			if (this.mode !== 'Events' || this.mode !== 'TimingPoints') this.obj[this.mode] = {}
		} else if (line.includes(':')) {
			const [k, v] = line.split(':').map(chk => chk.trim())
			this.obj[this.mode][k] = tryParseNum(v)
		} else if (this.mode === 'Events' && line.startsWith('0,0,"')) {
			// get bg file and break
			this.obj.Metadata.bg = /"(.+?)"/.exec(line)[1]
			this.postProcess()
			return true
		} else if (this.mode === 'TimingPoints') {
			// no be
			this.postProcess()
			return true
		}
		return false
		// return false means not complete
	}
	postProcess() {
		if (typeof this.obj.Metadata.Title === 'number') {
			this.obj.Metadata.Title = this.obj.Metadata.Title.toString()
		}
		if (!this.obj.Metadata.TitleUnicode) {
			this.obj.Metadata.TitleUnicode = ''
		} else {
			this.obj.Metadata.TitleUnicode = this.obj.Metadata.TitleUnicode.toString()
		}
		if (!this.obj.Metadata.ArtistUnicode) {
			this.obj.Metadata.ArtistUnicode = ''
		} else {
			this.obj.Metadata.ArtistUnicode = this.obj.Metadata.ArtistUnicode.toString()
		}
		if (this.obj.Metadata.Tags) {
			this.obj.Metadata.Tags = this.obj.Metadata.Tags.split('s')
				.filter(x => x)
				.map(chk => chk.trim())
		}
		if (this.obj.General.AudioFilename) {
			this.obj.General.AudioFilename = tryDecodeURIComponent(this.obj.General.AudioFilename)
		}
		if (this.obj.Metadata.bg) {
			this.obj.Metadata.bg = tryDecodeURIComponent(this.obj.Metadata.bg)
		}
	}
	get() {
		return this.obj
	}
	static parse(ct) {
		const parser = new Parser()
		for (const line of ct.split(/(\n|\r\n)/)) {
			try {
				const end = parser.eat(line)
				if (end) {
					break
				}
			} catch (e) {
				throw new ParseError(ct, e)
			}
		}
		return parser.get()
	}
	static parseFromFile(filepath) {
		const is = fs.createReadStream(filepath)
		const st = readline.createInterface({ input: is, crlfDelay: Infinity })
		return new Promise((res, rej) => {
			const parser = new Parser()
			let end = false
			st.on('line', line => {
				if (end) {
					return
				}
				try {
					end = parser.eat(line)
					if (end) {
						st.close()
						is.close()
						res(parser.get())
					}
				} catch (e) {
					rej(new ParseError(line, e))
				}
			})
			st.on('close', e => {
				st.close()
				is.close()
				if (e) rej(e)
			})
		})
	}
}
Parser.ParseError = ParseError
export default Parser
