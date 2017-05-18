const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const { enableLiveReload } = require('electron-compile');

const rootDir = path.join(__dirname, '..');

require('electron-compile').init(rootDir, './main');

enableLiveReload();

require('electron-debug')({ showDevTools: false });

let window;

createWindow = () => {
  window = new BrowserWindow({ webPreferences: { experimentalFeatures: true } });
  window.maximize();

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
