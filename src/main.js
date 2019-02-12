const { app, BrowserWindow, Tray, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");

let mainWindow;
let tray = null;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      icon: path.join(__dirname, "icons/icon.png"),
      nodeIntegration: true
    }
  });

  mainWindow.loadURL("https://todoist.com/app");

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, "icons/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function() {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: "Quit",
      click: function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip("Todoist");
  tray.setContextMenu(contextMenu);
}

app.on("ready", () => {
  createWindow();
  createTray();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
