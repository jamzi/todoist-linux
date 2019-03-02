const { app, BrowserWindow, Tray, Menu, shell } = require("electron");
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

  win.webContents.on("new-window", handleRedirect);

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

function handleRedirect(e, url) {
  // there may be some popups on the same page
  if (url == win.webContents.getURL()) {
    return true;
  }

  // when user is logged in there is link
  // asks to update the page. It should be opened
  // in the app and not in the external browser
  if (url == "https://todoist.com/app") {
    win.reload();
    return true;
  }

  /**
   * In case of google's oauth login
   * let's create another window and listen for
   * its "close" event.
   * As soon as that event fired we can refresh our
   * main window.
   */
  if (/google.+?oauth/.test(url)) {
    e.preventDefault();
    gOauthWindow = new BrowserWindow();
    gOauthWindow.loadURL(url);
    gOauthWindow.on("close", () => {
      win.reload();
    });
    return true;
  }

  e.preventDefault();
  shell.openExternal(url);
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
