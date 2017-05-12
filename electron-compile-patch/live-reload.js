'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableLiveReload = enableLiveReload;

var _fileChangeCache = require('./file-change-cache');

var _fileChangeCache2 = _interopRequireDefault(_fileChangeCache);

var _pathwatcherRx = require('./pathwatcher-rx');

var _Observable = require('rxjs/Observable');

require('./custom-operators');

require('rxjs/add/observable/defer');

require('rxjs/add/observable/empty');

require('rxjs/add/observable/fromPromise');

require('rxjs/add/operator/catch');

require('rxjs/add/operator/filter');

require('rxjs/add/operator/mergeMap');

require('rxjs/add/operator/switchMap');

require('rxjs/add/operator/timeout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BrowserWindow = void 0;
if (process.type === 'browser') {
  BrowserWindow = require('electron').BrowserWindow;
}

function reloadAllWindows() {
  var ret = BrowserWindow.getAllWindows().map(function (wnd) {
    if (!wnd.isVisible()) return Promise.resolve(true);

    return new Promise(function (res) {
      wnd.webContents.reloadIgnoringCache();
      wnd.once('ready-to-show', function () {
        return res(true);
      });
    });
  });

  return Promise.all(ret);
}

function triggerHMRInRenderers() {
  BrowserWindow.getAllWindows().forEach(function (window) {
    window.webContents.send('__electron-compile__HMR');
  });

  return Promise.resolve(true);
}

function triggerAssetReloadInRenderers(filePath) {
  BrowserWindow.getAllWindows().forEach(function (window) {
    window.webContents.send('__electron-compile__stylesheet_reload', filePath);
  });

  return Promise.resolve(true);
}

var defaultOptions = {
  'strategy': {
    'text/html': 'naive',
    'text/tsx': 'react-hmr',
    'text/jsx': 'react-hmr',
    'application/javascript': 'react-hmr',
    'text/stylus': 'hot-stylesheets',
    'text/sass': 'hot-stylesheets',
    'text/scss': 'hot-stylesheets',
    'text/css': 'hot-stylesheets'
  }
};

function setupWatchHMR(filePath) {
  (0, _pathwatcherRx.watchPath)(filePath).subscribe(function () {
    return triggerHMRInRenderers();
  });
}

function setWatchHotAssets(filePath) {
  (0, _pathwatcherRx.watchPath)(filePath).subscribe(function () {
    return triggerAssetReloadInRenderers(filePath);
  });
}

function setupWatchNaive(filePath) {
  (0, _pathwatcherRx.watchPath)(filePath).subscribe(function () {
    return reloadAllWindows();
  });
}

function enableLiveReload() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;
  var strategy = options.strategy;


  if (process.type !== 'browser' || !global.globalCompilerHost) throw new Error("Call this from the browser process, right after initializing electron-compile");

  // Just to handle the old case
  var oldsyntax = false;
  if (typeof strategy === 'string') {
    oldsyntax = true;
  }

  // Enable the methods described in the reload strategy
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(strategy)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mime = _step.value;

      switch (oldsyntax ? strategy : strategy[mime]) {
        case 'react-hmr':
          global.__electron_compile_hmr_enabled__ = true;
          break;
        case 'hot-stylesheets':
          global.__electron_compile_stylesheet_reload_enabled__ = true;
          break;
      }
    }

    // Find all the files compiled by electron-compile and setup watchers
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var filesWeCareAbout = global.globalCompilerHost.listenToCompileEvents().filter(function (x) {
    return !_fileChangeCache2.default.isInNodeModules(x.filePath);
  }).subscribe(function (x) {
    switch (oldsyntax ? strategy : strategy[x.mimeType]) {
      case 'react-hmr':
        setupWatchHMR(x.filePath);
        break;
      case 'hot-stylesheets':
        setWatchHotAssets(x.filePath);
        break;
      case 'naive':
      default:
        setupWatchNaive(x.filePath);
    }
  });
}
