const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const fileUrl = require("url").format({
  protocol: "file",
  slashes: true,
  pathname: path.join(__dirname, "../build/index.html"),
});
const Store = require("./store.js");

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

const store = new Store({
  configName: "chart-settings",
  defaults: {
    dateFomat: "%Y%m%d",
    yAxis: { yMin: 0, yMax: 10, y1Min: 0, y1Max: 10 },
    AxisLabel: {
      yLabel: "Y Axis",
      xLabel: "X Axis",
      secondAxisLabel: "Secondary Axis",
    },
  },
});

const getSettings = () => {
  const settings = {
    dateFormat: store.get("dateFormat"),
    ...store.get("yAxis"),
    ...store.get("AxisLabel"),
  };

  mainWindow.webContents.on("did-finish-load", function () {
    mainWindow.webContents.send("read-settings", settings);
  });
};

// Application events handlers
app.whenReady().then(() => {
  createWindow();
  getSettings();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      getSettings();
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

ipcMain.handle("save-settings", async (_event, ...args) => {
  const [
    [dateFormat, yMin, yMax, yLabel, xLabel, y1Min, y1Max, secondAxisLabel],
  ] = args;
  store.set("dateFormat", dateFormat);
  store.set("yAxis", { yMin, yMax, y1Min, y1Max });
  store.set("AxisLabel", { yLabel, xLabel, secondAxisLabel });

  const settings = {
    dateFormat: store.get("dateFormat"),
    ...store.get("yAxis"),
    ...store.get("AxisLabel"),
  };

  console.log(settings);

  return settings;
});
