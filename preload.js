// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')
const fs = require("fs");
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld("dataLoader", {
  getUserData: () => ipcRenderer.invoke('request-userdata'),
  setLastOpened: (setName) => {
    ipcRenderer.send('last-opened', setName);
  }
});