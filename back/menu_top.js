const { Menu, BrowserWindow } = require('electron');

var softwareWindow = null;


let menu = Menu.buildFromTemplate([
    {
        label: 'Software',
        submenu: [
            { label: 'Manage software', click() { openManageSoftware() } },
            { label: 'Manage projects', click() { } },
            { label: 'Manage users', click() { } },
            { label: 'Manage permissions', click() { } }
        ]
    }
])
Menu.setApplicationMenu(menu);

function openManageSoftware() {
    if (softwareWindow) {
        softwareWindow.focus()
        return
    }

    softwareWindow = new BrowserWindow({
        height: 600,
        resizable: false,
        width: 800,
        title: 'Admin software',
        minimizable: false,
        fullscreenable: false,
        webPreferences: {nodeIntegration: true, webviewTag: true}
    })

    softwareWindow.loadURL('file://' + __dirname + '/../front/software.html');
    softwareWindow.setMenuBarVisibility(false);
    softwareWindow.webContents.openDevTools();

    softwareWindow.on('closed', function () {
        softwareWindow = null
    })
}