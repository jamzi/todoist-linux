const { app, BrowserWindow, Tray, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");

const createMainMenu = require("./menu");

let win;
let tray = null;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  win = new BrowserWindow({
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

  win.loadURL("https://todoist.com/app");

  win.on("closed", function() {
    win = null;
  });

  // manage size/positiod of the window
  // so it can be restored next time
  mainWindowState.manage(win);

  createMainMenu();
}

function createTray() {
  tray = new Tray(path.join(__dirname, "icons/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function() {
        win.show();
        win.focus();
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
  if (win === null) {
    createWindow();
  }
});
