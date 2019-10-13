const {app, dialog, BrowserWindow, ipcMain} = require("electron");
const exec = require('child_process').exec;

// async function createWindow(){
//     win = new BrowserWindow({
//         width: 1024, 
//         height: 768,
//         webPreferences: {nodeIntegration: true, webviewTag: true}
//         //icon: `file://${_dirname}/dist/assets/logo.png`
//     });
//     win.loadURL("file://"+__dirname+"/front/init.html");
//     win.webContents.openDevTools()
//     //win.setMenuBarVisibility(false);
//     win.maximize();
//     win.on("closed", function(){
//         win = null;
//     });
// };

async function createWindow(){
    let main = null
    let loading = new BrowserWindow({show: false, frame: false, width: 441, height: 291});
    loading.loadURL("file://"+__dirname+"/assets/loading.gif");
    loading.show();
    exec('chmod +x ./back/init.sh && sh -c "./back/init.sh"', (err, stdout, stderr) => {
        console.error("Stdout to init:" +stdout);
        console.error("Stderr to init:" +stderr);
        if (err !== null){
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
        }   
        main = new BrowserWindow({
            width: 1024, 
            height: 768,
            webPreferences: {nodeIntegration: true, webviewTag: true}
            //icon: `file://${_dirname}/dist/assets/logo.png`
        });
        main.loadURL("file://"+__dirname+"/front/dashboard.html");
        main.webContents.openDevTools()
        //main.setMenuBarVisibility(false);
        main.maximize();
        main.on("closed", function(){
            main = null;
        });
        main.show()
        loading.hide()
        loading.close()
    });
}


app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS specific close process
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // macOS specific close process
    if (win === null) {
        createWindow();
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
