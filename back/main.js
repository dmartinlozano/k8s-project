const {app, dialog, BrowserWindow, ipcMain} = require("electron");
const exec = require('child_process').exec;
var main, root, loading;

function openMainWindow(){
    main = new BrowserWindow({
        width: 1024, 
        height: 768,
        webPreferences: {nodeIntegration: true, webviewTag: true}
        //icon: `file://${_dirname}/dist/assets/logo.png`
    });
    main.loadURL("file://"+__dirname+"/front/dashboard.html");
    main.webContents.openDevTools()
    main.setMenuBarVisibility(false);
    main.maximize();
    main.on("closed", function(){
        main = null;
    });
    main.show();
    if (root !== undefined){
        root.hide();
        root.destroy();
    }
    if (loading !== undefined){
        loading.destroy();
    }
}

function openRootModal(root){
    root = new BrowserWindow({show: false, frame: false, width: 480, height: 370, webPreferences: {nodeIntegration: true, webviewTag: true}});
    root.loadURL("file://"+__dirname+"/front/root_password.html");
    root.on("closed", function(){
        root = null;
    });
    root.show();
}


async function openLoadingWindow(){
    loading = new BrowserWindow({show: false, frame: false, width: 441, height: 291});
    loading.loadURL("file://"+__dirname+"/assets/loading.gif");
    loading.show();
    exec('chmod +x ./back/init.sh && sh -c "./back/init.sh"', (err, stdout, stderr) => {
        console.error("Stdout to init:" +stdout);
        console.error("Stderr to init:" +stderr);
        console.error("Error: "+err);
        if (err === null){
            openMainWindow();
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
                openRootModal(root);
                loading.hide();
                loading.destroy();
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

//install keycloak with an password
ipcMain.on('set-root-password-on', async (event, credentials) => {
    console.log("Install keycloak with credentials: "+credentials.username+", "+credentials.password)
    exec('helm install codecentric/keycloak --name keycloak --namespace k8s-project --set keycloak.username="'+credentials.username+'" --set keycloak.password="'+credentials.password+'"', (err, stdout, stderr) => {
        console.error(err);
        console.error(stdout);
        console.error(stderr);
        if (err) {
            event.sender.send("error", err);  
          return;
        }
        openMainWindow();
    });
});