// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require('electron')
const fs = require("fs");
userdata = require("./userdata.json");

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
  getUserData: () => { return userdata },
  setLastOpened: (setName) => {
    userdata.metadata["last-opened"] = setName;
    fs.writeFileSync("./userdata.json", JSON.stringify(userdata));
  }
})