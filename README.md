# Todoist Linux

The app is just an Electron wrapper on Todoist's web version.

## Installation

Currently only RPM and DEB packages available for x64 arch.

You can download the package on [releases](https://github.com/KryDos/todoist-linux/releases) page or you always can get latest build as:

- [DEB package (Debian/Mint/Ubuntu)](https://www.dropbox.com/s/ldv7uf5dxmerqx8/Todoist.deb?dl=0)
- [RPM package (Fedora/Suse)](https://www.dropbox.com/s/q8m6rxp26bjmfnh/Todoist.rpm?dl=0)
- [Windows portable version](https://www.dropbox.com/s/ve97rxd2i1zhlm1/Todoist.exe?dl=0)

## Shortcuts

- Ctrl+Alt+A - quick add a task
- Ctrl+Alt+Q - show or hide the app window
- Ctrl+Alt+R - refresh content on the page
- All other Todoist's shortcuts exists from inside the app window

Global shortcuts are configurable via `$XDG_CONFIG_HOME/.todoist-linux.json` file (which is `~/.config` by default).
The file is simple JSON with descriptive keys and values that represends shortcuts.
Use this [page from Electron docs](https://electronjs.org/docs/api/accelerator#available-modifiers) to get more understanding on possible modifiers (keys) you can use.

## Why???

The main reason is I don't like to have web version opened since I can't easily ALT+TAB to it.

And I also really wanted to have global shortcuts to quick add a task.

The initial inspiration I got from [this](https://github.com/kamhix/todoist-linux) brilliant package of the same web version.
Unfortunately it doesn't seem maintained at the moment and has some issues with Tray functionality on latest Ubuntu.

## Contribute/Build

The build process is very simple:

- run `npm install` in root folder
- run `npm install` in `src` folder

That's all. Now to run the app you can use `make up` command (in root folder) or `npm start` (in `src` directory).

There is also `make build-all` target. Check it out if you're interesting in building DEB or RPM package.

No rules for contributing. Just sent a pull request.
