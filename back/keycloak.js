const {app, dialog, BrowserWindow, ipcMain} = require("electron");
const exec = require('child_process').exec;


//Return true if keycloak is already installed
ipcMain.on('check-keycloak-installed-on', async (event) => {
    exec('helm ls --namespace k8s-project|grep keycloak|wc -l', (err, stdout, stderr) => {
        console.error(err);
        console.error(stdout);
        console.error(stderr);
        if (err) {
            event.sender.send("error", err);  
          return;
        }
        if (stdout.trim() === "0"){
            event.sender.send("check-keycloak-installed-success", false);
        }else{
            event.sender.send("check-keycloak-installed-success", true);
        }
    });
});

//install keycloak with an password
ipcMain.on('install-keycloak-on', async (event, credentials) => {
    console.log("Install keycloak with credentials: "+credentials.username+", "+credentials.password)
    exec('helm install codecentric/keycloak --name keycloak --namespace k8s-project --set keycloak.username="'+credentials.username+'" --set keycloak.password="'+credentials.password+'"', (err, stdout, stderr) => {
        console.error(err);
        console.error(stdout);
        console.error(stderr);
        if (err) {
            event.sender.send("error", err);  
          return;
        }
        event.sender.send("install-keycloak-success", stdout.trim());
    });
});