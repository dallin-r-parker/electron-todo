const electron = require('electron')

const {app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow
let addWindow
const {platform} = process



app.on('ready', () => {
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.on('closed', () => app.quit())

    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    })
    addWindow.loadURL(`file://${__dirname}/add.html `)
    // The reason for this event listener is for garbage collection
    // to occur on a window that is ending.
    addWindow.on('closed', () => addWindow = null)
}

ipcMain.on('form:todo', (evt, todo) => {
    mainWindow.webContents.send('add:todo', todo)
    addWindow.close()
})

const menuTemplate = [
    //the first object comes from the name of the project, so giving it an empty obj
    // allows us to see 'File' as it's own top level menu item. set conditionally below
    // {},
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                // accelerator: 'Command+Q', <== this only works for OS X
                accelerator: platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]

if(platform === 'darwin') {
    // adding empty obj at the start because we're on an OSX machine
    menuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {role: 'reload'},
            {
                label: 'Toggle DevTools',
                accelerator: platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Alt+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        ]
    })
}