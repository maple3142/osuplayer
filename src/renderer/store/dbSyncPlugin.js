import ipc from 'electron-better-ipc'

const intersect = (a, b) => {
	if (!(a instanceof Set)) {
		a = new Set(a)
	}
	if (!(b instanceof Set)) {
		b = new Set(b)
	}
	return new Set([...a].filter(x => b.has(x)))
}
const diffKeyShallow = (o1, o2) => {
	const keys = intersect(Object.keys(o1), Object.keys(o2))
	const s = new Set()
	for (const k of keys) {
		if (o1[k] !== o2[k]) {
			s.add(k)
		}
	}
	return s
}
export default (keys = []) => store => {
	let previousState = null
	store.subscribe((mut, state) => {
		const keysToPersist = [...intersect(diffKeyShallow(state, previousState), keys)]
		for (const key of keysToPersist) {
			ipc.callMain('setDb', { key, value: state[key] })
		}
		previousState = { ...state }
	})
	window.ipc=ipc
	ipc.callMain('getDb').then(dbstate => {
		const mergedstate = Object.assign({}, store.state, dbstate)
		store.replaceState(mergedstate)
		previousState = { ...mergedstate }
	})
}
