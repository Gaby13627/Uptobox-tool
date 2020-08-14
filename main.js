const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 723,
        icon: path.join(__dirname, "src", "uptobox.png"),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true
        },
    })

    mainWindow.loadFile('index.html') //on charge la page principale 
    mainWindow.removeMenu() // on enleve le menu
    mainWindow.setResizable(false) // On desactive le redimensionement 
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})