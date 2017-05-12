'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerRequireExtension;
var mimeTypes = require('@paulcbetts/mime-types');

var HMR = false;
var stylesheetReload = false;

var d = require('debug')('electron-compile:require-hook');
var electron = null;

if (process.type === 'renderer') {
  window.__hot = [];
  electron = require('electron');
  HMR = electron.remote.getGlobal('__electron_compile_hmr_enabled__');
  stylesheetReload = electron.remote.getGlobal('__electron_compile_stylesheet_reload_enabled__');

  if (HMR) {
    electron.ipcRenderer.on('__electron-compile__HMR', function () {
      d("Got HMR signal!");

      // Reset the module cache
      var cache = require('module')._cache;
      var toEject = Object.keys(cache).filter(function (x) {
        return x && !x.match(/[\\\/](node_modules|.*\.asar)[\\\/]/i);
      });
      toEject.forEach(function (x) {
        d('Removing node module entry for ' + x);
        delete cache[x];
      });

      window.__hot.forEach(function (fn) {
        return fn();
      });
    });
  }

  if (stylesheetReload) {
    electron.ipcRenderer.on('__electron-compile__stylesheet_reload', function (e, path) {
      var links = document.getElementsByTagName('link');

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          var uri = link.href;
          if (uri.includes(path)) {
            link.href = link.href; // trigger a reload for this stylesheet
          }
        }
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
    });
  }
}

/**
 * Initializes the node.js hook that allows us to intercept files loaded by
 * node.js and rewrite them. This method along with {@link initializeProtocolHook}
 * are the top-level methods that electron-compile actually uses to intercept
 * code that Electron loads.
 *
 * @param  {CompilerHost} compilerHost  The compiler host to use for compilation.
 */
function registerRequireExtension(compilerHost) {
  if (HMR) {
    try {
      require('module').prototype.hot = {
        accept: function accept(cb) {
          return window.__hot.push(cb);
        }
      };

      require.main.require('react-hot-loader/patch');
    } catch (e) {
      console.error('Couldn\'t require react-hot-loader/patch, you need to add react-hot-loader@3 as a dependency! ' + e.message);
    }
  }

  Object.keys(compilerHost.compilersByMimeType).forEach(function (mimeType) {
    var ext = mimeTypes.extension(mimeType);

    require.extensions['.' + ext] = function (module, filename) {
      var _compilerHost$compile = compilerHost.compileSync(filename),
          code = _compilerHost$compile.code;

      if (code === null) {
        console.error('null code returned for "' + filename + '".  Please raise an issue on \'electron-compile\' with the contents of this file.');
      }

      module._compile(code, filename);
    };
  });
}
