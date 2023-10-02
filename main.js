// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const userDataPath = path.join(app.getPath("userData"), "userdata.json");
var userdata = {};
var setIndexes = {};

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1600,
        webPreferences: {
            // eslint-disable-next-line no-undef
            preload: path.join(__dirname, "preload.js")
        },
        minWidth: 900,
        minHeight: 800,
        titleBarStyle: "hidden",
        trafficLightPosition: {x: 10, y: 7}
    });

    // and load the index.html of the app.
    mainWindow.loadFile("public/views/index.html");

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    userdata = fs.existsSync(userDataPath) ?
        require(userDataPath) :
        require("./inituserdata.json");

    for (let i in userdata.sets) {
        setIndexes[userdata.sets[i].metadata.name] = i;
    }

    ipcMain.handle("request-userdata", () => {
        return userdata;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS, it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on("last-opened", (e, setName) => {
        userdata.metadata["last-opened"] = setName;
    });

    ipcMain.on("study-term", (e, set, term) => {
        delete userdata.sets[setIndexes[set]].cards.notStudied[term[0]];
        userdata.sets[setIndexes[set]].cards.studying[term[0]] = term[1];
    });

    ipcMain.on("master-term", (e, set, term) => {
        delete userdata.sets[setIndexes[set]].cards.studying[term[0]];
        userdata.sets[setIndexes[set]].cards.mastered[term[0]] = term[1];
    });

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    /*if (process.platform !== 'darwin')*/ app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on("before-quit", () => {
    // fs.writeFileSync(userDataPath, JSON.stringify(userdata));
});