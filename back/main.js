const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const exec = require('child_process').exec;
const fs = require('fs');
var main, loading;

function openMainWindow(installKeyCloak) {
    main = new BrowserWindow({
        width: 1024,
        height: 768,
        nodeIntegration: "iframe",
        webPreferences: { nodeIntegration: true, webviewTag: true, webSecurity: true, additionalArguments: ["--installKeyCloak=" + installKeyCloak] }
        //icon: `file://${_dirname}/dist/assets/logo.png`
    });
    main.loadURL("file://" + __dirname + "/../dist/index.html");
    main.webContents.openDevTools()
    main.setMenuBarVisibility(false);
    main.maximize();
    main.on("closed", function () {
        main = null;
    });
    main.show();
    if (loading !== undefined) {
        loading.destroy();
    }
}


async function openLoadingWindow() {
    loading = new BrowserWindow({ show: false, frame: false, width: 480, height: 270, resizable: false });
    loading.loadURL("file://" + __dirname + "/../dist/assets/loading.gif");
    loading.show();
    exec('chmod +x ./back/init.sh && sh -c "./back/init.sh"', (err, stdout, stderr) => {
        console.error("Stdout to init:" + stdout);
        console.error("Stderr to init:" + stderr);
        console.error("Error: " + err);
        if (err === null) {
            openMainWindow(false);
        } else {
            if (err.code === 1) {
                dialog.showErrorBox("Error", "The file .kube/config not found in home directory");
                app.quit();
                return;
            }
            if (err.code === 2) {
                dialog.showErrorBox("Error", "Unable to access kubernetes");
                app.quit();
                return;
            }
            if (err.code === 3) {
                console.log("Keycloak is not installed");
                openMainWindow(true);
            }
        }
    });
}


app.on("ready", openLoadingWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS specific close process
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (win === null) {
        openLoadingWindow();
    }
});

function execCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) reject(error);
            resolve(stdout ? stdout : stderr);
        });
    });
}

//Get config
ipcMain.handle("get-config", async(event, args)=>{
    return await execCommand('kubectl get configMap --namespace k8s-project k8s-project-config -o json');
});

//install keycloak
ipcMain.handle('keycloak-install', async (event, credentials) => {
    return await execCommand('chmod +x ./back/install_tools.sh && sh -c "./back/install_tools.sh k8s-project-keycloak ' + credentials.username + ' ' + credentials.password + '"');
});

//get installed tools
ipcMain.handle("get-installed-tools", async(event, args)=>{
    return await execCommand('helm ls --namespace k8s-project --output json');
});

//install tool
ipcMain.handle('install-tool', async (event, tool) => {
    return await execCommand('chmod +x ./back/install_tools.sh && sh -c "./back/install_tools.sh ' + tool + '"'); 
});

//uninstall tool
ipcMain.handle('uninstall-tool', async (event, tool) => {
    return await execCommand('chmod +x ./back/uninstall_tools.sh && sh -c "./back/uninstall_tools.sh ' + tool + '"');
});