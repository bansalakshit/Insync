// Native
const { format } = require("url");

// Packages
const { BrowserWindow, app, ipcMain, Menu, Tray, dialog } = require("electron");
const isDev = require("electron-is-dev");
const prepareNext = require("electron-next");
const { resolve } = require("app-root-path");
const desktopIdle = require("desktop-idle");
// const AutoLaunch = require('auto-launch')

const path = require("path");
const assetsDirectory = __dirname.replace("main", "assets");

// const InSyncAppLauncher = new AutoLaunch({
//     name: 'InSync'
// })
let tray = null;
// Prepare the renderer once the app is ready
app.on("ready", async () => {
    tray = new Tray(path.join(assetsDirectory, "offline.png"));
    tray.setToolTip("InSync Team");

    await prepareNext("./renderer");
    const mainWindow = new BrowserWindow({
        // webPreferences: { webSecurity: false },
        x: 0,
        y: 0,
        width: 800,
        height: 700,
        // resizable: false,
        icon: path.join(assetsDirectory, "icons/png/64x64.png")
    });

    const devPath = "http://localhost:8000";

    const prodPath = format({
        pathname: resolve("renderer/out/index.html"),
        protocol: "file:",
        slashes: true
    });

    const url = isDev ? devPath : prodPath;
    mainWindow.loadURL(url);

    ipcMain.on("checkIdleTime", (event, arg) => {
        event.sender.send("idleTime", desktopIdle.getIdleTime());
    });

    ipcMain.on("updateStatus", (event, arg) => {
        if (arg === "tracking")
            tray.setImage(path.join(assetsDirectory, "online.png"));
        else tray.setImage(path.join(assetsDirectory, "offline.png"));
    });

    // InSyncAppLauncher.enable()

    // InSyncAppLauncher.isEnabled()
    //     .then(isEnabled=>{
    //         if(isEnabled){
    //             return
    //         }
    //         InSyncAppLauncher.enable()
    //     })
    //     .catch(err=>{})
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
