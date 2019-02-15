const { app, BrowserWindow, Tray, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");

const createMainMenu = require("./menu");
const Shortcuts = require("./shortcuts/shortcuts");

let win;
let tray = null;
let shortcutsInstance;

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

  win["currentWindowState"] = "shown";

  win.on("closed", function() {
    win = null;
  });

  win.on("hide", function() {
    win["currentWindowState"] = "hidden";
  });

  win.on("show", function() {
    win["currentWindowState"] = "shown";
  });

  // manage size/positiod of the window
  // so it can be restored next time
  mainWindowState.manage(win);

  createMainMenu();

  shortcutsInstance = new Shortcuts(win);
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
  shortcutsInstance.registerAllShortcuts();
});

app.on("window-all-closed", function() {
  shortcutsInstance.unregisterAllShortcuts();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (win === null) {
    createWindow();
  }
});
