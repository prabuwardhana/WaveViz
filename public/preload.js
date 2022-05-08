// preload with contextIsolation enabled
const { ipcRenderer, contextBridge } = require("electron");

const WINDOW_API = {
  loadFile: () => ipcRenderer.invoke("load-file"),
};

contextBridge.exposeInMainWorld("electronApi", WINDOW_API);
