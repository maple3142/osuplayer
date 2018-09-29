import ipc from 'electron-better-ipc'

const copyKeys = keys => o => {
	const tmp = {}
	for (const k of keys) {
		tmp[k] = o[k]
	}
	return tmp
}
export default (keys = []) => store => {
	const copy = copyKeys(keys)
	store.subscribe((mut, state) => {
		ipc.callMain('setDb', { key: 'store', value: copy(state) })
	})
	ipc.callMain('getDb', { key: 'store' }).then(dbstate => {
		store.replaceState(Object.assign({}, store.state, dbstate))
	})
}
