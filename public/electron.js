const { app, BrowserWindow } = require("electron");
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
  });

  mainWindow.loadURL(isDev ? "http://localhost:3000" : fileUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => (mainWindow = null));
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
