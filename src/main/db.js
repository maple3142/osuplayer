import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { app } from 'electron'

const dbpath = path.join(app.getPath('userData'), 'db.json')
const db = low(new FileSync(dbpath))

db.defaults({}).write()

export default db
