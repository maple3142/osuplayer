import { app, Menu, BrowserWindow } from 'electron'
import ipc from 'electron-better-ipc'

const menu = Menu.buildFromTemplate([
	{
		label: 'App',
		submenu: [
			{
				label: 'Set osu! songs path',
				role: 'setOsupath',
				click: () => ipc.callRenderer(BrowserWindow.getFocusedWindow(), 'setOsupath')
			},
			{ label: 'Exit', role: 'exit', click: app.quit.bind(app) }
		]
	}
])
Menu.setApplicationMenu(menu)
