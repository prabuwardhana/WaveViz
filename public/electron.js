const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const fileUrl = require("url").format({
  protocol: "file",
  slashes: true,
  pathname: path.join(__dirname, "../build/index.html"),
});

// Global
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 780,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(isDev ? "http://localhost:3000" : fileUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => (mainWindow = null));
};

const getFileFromUser = async () => {
  const files = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Comma Separated File", extensions: ["csv"] }],
  });

  if (!files || files.canceled) {
    return;
  }

  const filePath = files.filePaths[0];
  const content = fs.readFileSync(filePath, "utf8");

  return content;
};

// Application events handlers
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Inter-Process Communication handler
ipcMain.handle("load-file", async (_event, _args) => {
  // the eventual result of the promise will be returned as a reply to the remote caller
  const result = await getFileFromUser().catch((err) => err);

  return result;
});
