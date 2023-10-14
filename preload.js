// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dataLoader", {
    getUserData: () => ipcRenderer.invoke("request-userdata"),
    setLastOpened: (setName) => {
        ipcRenderer.send("last-opened", setName);
    },
    study: (setName, term) => ipcRenderer.send("study-term", setName, term),
    master: (setName, term) => ipcRenderer.send("master-term", setName, term),
    reset: (setName) => ipcRenderer.send("reset", setName)
});