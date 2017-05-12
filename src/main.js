const { app, BrowserWindow } = require('electron');
const { enableLiveReload } = require('electron-compile');
const path = require('path');
const url = require('url');
const localShortcut = require('electron-localshortcut');
const root = path.join(__dirname, '..');
require('electron-compile').init(root, './main');
enableLiveReload();
require('electron-debug')({ showDevTools: false });

let window;

createWindow = () => {
  window = new BrowserWindow({ width: 1366, height: 768, webPreferences: { experimentalFeatures: true }});
  window.we

  window.loadURL(`file://${__dirname}/index.html`);
  window.setMenu(null);

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});
