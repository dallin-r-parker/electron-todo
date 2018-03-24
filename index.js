const electron = require('electron')

const {app, BrowserWindow, Menu} = electron

let mainWindow
let addWindow
const {platform} = process

app.on('ready', () => {
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(`file://${__dirname}/index.html`)

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
}

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