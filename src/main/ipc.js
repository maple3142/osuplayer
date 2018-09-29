import ipc from 'electron-better-ipc'
import generateList from './listgen'
import db from './db'

export default () => {
	ipc.answerRenderer('getList', osupath => generateList(osupath))
	ipc.answerRenderer('setDb', ({ key, value }) => db.set(key, value).write())
	ipc.answerRenderer('getDb', o => (o && o.key ? db.get(o.key).value() : db.value()))
}
