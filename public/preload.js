// preload with contextIsolation enabled
const { ipcRenderer, contextBridge } = require("electron");

const WINDOW_API = {
  loadFile: () => ipcRenderer.invoke("load-file"),
  saveSettings: (...args) => ipcRenderer.invoke("save-settings", args),
  onReadSettings: (callback) => ipcRenderer.on("read-settings", callback),
};

contextBridge.exposeInMainWorld("electronApi", WINDOW_API);
