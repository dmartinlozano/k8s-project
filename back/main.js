const {app, dialog, BrowserWindow, ipcMain} = require("electron");
const exec = require('child_process').exec;
var main, loading;

function openMainWindow(installKeyCloak){
    main = new BrowserWindow({
        width: 1024, 
        height: 768,
        nodeIntegration: "iframe",
        webPreferences: {nodeIntegration: true, webviewTag: true, webSecurity: false}
        //icon: `file://${_dirname}/dist/assets/logo.png`
    });
    main.loadURL("file://"+__dirname+"/../dist/index.html?installKeyCloak="+installKeyCloak);
    main.webContents.openDevTools()
    main.setMenuBarVisibility(false);
    main.maximize();
    main.on("closed", function(){
        main = null;
    });
    main.show();
    if (loading !== undefined){
        loading.destroy();
    }
}


async function openLoadingWindow(){
    loading = new BrowserWindow({show: false, frame: false, width: 480, height: 270});
    loading.loadURL("file://"+__dirname+"/../dist/assets/loading.gif");
    loading.show();
    exec('chmod +x ./back/init.sh && sh -c "./back/init.sh"', (err, stdout, stderr) => {
        console.error("Stdout to init:" +stdout);
        console.error("Stderr to init:" +stderr);
        console.error("Error: "+err);
        if (err === null){
            openMainWindow(false);
        }else{
            if (err.code === 1){
                dialog.showErrorBox("Error", "The file .kube/config not found in home directory");
                app.quit();
                return;
            }
            if (err.code === 2){
                dialog.showErrorBox("Error", "Unable to access kubernetes");
                app.quit();
                return;
            }
            if (err.code === 3){
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

//Checking configuration
ipcMain.on('get-ingress-ip-on', async (event, arg) => {
    exec("kubectl get services --namespace k8s-project|grep k8s-project-ingress-nginx-ingress-controller|awk '{print $4}'", (err, stdout, stderr) => {
        if (err) {
            event.sender.send("error", err);  
          return;
        }
        event.sender.send("get-ingress-ip-success", stdout.trim());
    });
});

//install keycloak with a password
ipcMain.on('keycloak-install-on', async (event, credentials) => {
    console.log("Install keycloak with credentials: "+credentials.username+", "+credentials.password)
    exec('helm install codecentric/keycloak --name keycloak --namespace k8s-project --set keycloak.username="'+credentials.username+'" --set keycloak.password="'+credentials.password+'"', (err, stdout, stderr) => {
        if (err) {
            event.sender.send("error", err);  
          return;
        }
        event.sender.send("keycloak-install-success", null);
    });
});