cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.chariotsolutions.nfc.plugin.NFC",
    "file": "plugins/com.chariotsolutions.nfc.plugin/www/phonegap-nfc.js",
    "pluginId": "com.chariotsolutions.nfc.plugin",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.DirectoryEntry",
    "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.DirectoryEntry"
    ]
  },
  {
    "id": "cordova-plugin-file.DirectoryReader",
    "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.DirectoryReader"
    ]
  },
  {
    "id": "cordova-plugin-file.Entry",
    "file": "plugins/cordova-plugin-file/www/Entry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Entry"
    ]
  },
  {
    "id": "cordova-plugin-file.File",
    "file": "plugins/cordova-plugin-file/www/File.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.File"
    ]
  },
  {
    "id": "cordova-plugin-file.FileEntry",
    "file": "plugins/cordova-plugin-file/www/FileEntry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileEntry"
    ]
  },
  {
    "id": "cordova-plugin-file.FileError",
    "file": "plugins/cordova-plugin-file/www/FileError.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileError"
    ]
  },
  {
    "id": "cordova-plugin-file.FileReader",
    "file": "plugins/cordova-plugin-file/www/FileReader.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileReader"
    ]
  },
  {
    "id": "cordova-plugin-file.FileSystem",
    "file": "plugins/cordova-plugin-file/www/FileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.FileUploadOptions",
    "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileUploadOptions"
    ]
  },
  {
    "id": "cordova-plugin-file.FileUploadResult",
    "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileUploadResult"
    ]
  },
  {
    "id": "cordova-plugin-file.FileWriter",
    "file": "plugins/cordova-plugin-file/www/FileWriter.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileWriter"
    ]
  },
  {
    "id": "cordova-plugin-file.Flags",
    "file": "plugins/cordova-plugin-file/www/Flags.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Flags"
    ]
  },
  {
    "id": "cordova-plugin-file.LocalFileSystem",
    "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.LocalFileSystem"
    ],
    "merges": [
      "window"
    ]
  },
  {
    "id": "cordova-plugin-file.Metadata",
    "file": "plugins/cordova-plugin-file/www/Metadata.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Metadata"
    ]
  },
  {
    "id": "cordova-plugin-file.ProgressEvent",
    "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.ProgressEvent"
    ]
  },
  {
    "id": "cordova-plugin-file.fileSystems",
    "file": "plugins/cordova-plugin-file/www/fileSystems.js",
    "pluginId": "cordova-plugin-file"
  },
  {
    "id": "cordova-plugin-file.requestFileSystem",
    "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.requestFileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.resolveLocalFileSystemURI",
    "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "window"
    ]
  },
  {
    "id": "cordova-plugin-file.isChrome",
    "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
    "pluginId": "cordova-plugin-file",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.androidFileSystem",
    "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "FileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.fileSystems-roots",
    "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
    "pluginId": "cordova-plugin-file",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.fileSystemPaths",
    "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "cordova"
    ],
    "runs": true
  },
  {
    "id": "cordova-plugin-http.CordovaHttpPlugin",
    "file": "plugins/cordova-plugin-http/www/cordovaHTTP.js",
    "pluginId": "cordova-plugin-http",
    "clobbers": [
      "CordovaHttpPlugin"
    ]
  },
  {
    "id": "org.apache.cordova.device.device",
    "file": "plugins/org.apache.cordova.device/www/device.js",
    "pluginId": "org.apache.cordova.device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "org.apache.cordova.dialogs.notification",
    "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
    "pluginId": "org.apache.cordova.dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "org.apache.cordova.dialogs.notification_android",
    "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
    "pluginId": "org.apache.cordova.dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "org.apache.cordova.globalization.GlobalizationError",
    "file": "plugins/org.apache.cordova.globalization/www/GlobalizationError.js",
    "pluginId": "org.apache.cordova.globalization",
    "clobbers": [
      "window.GlobalizationError"
    ]
  },
  {
    "id": "org.apache.cordova.globalization.globalization",
    "file": "plugins/org.apache.cordova.globalization/www/globalization.js",
    "pluginId": "org.apache.cordova.globalization",
    "clobbers": [
      "navigator.globalization"
    ]
  },
  {
    "id": "org.apache.cordova.inappbrowser.inappbrowser",
    "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
    "pluginId": "org.apache.cordova.inappbrowser",
    "clobbers": [
      "window.open"
    ]
  },
  {
    "id": "org.apache.cordova.network-information.network",
    "file": "plugins/org.apache.cordova.network-information/www/network.js",
    "pluginId": "org.apache.cordova.network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "org.apache.cordova.network-information.Connection",
    "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
    "pluginId": "org.apache.cordova.network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "org.apache.cordova.splashscreen.SplashScreen",
    "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
    "pluginId": "org.apache.cordova.splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com.chariotsolutions.nfc.plugin": "0.6.1",
  "cordova-plugin-file": "4.3.0",
  "cordova-plugin-http": "1.2.0",
  "cordova-plugin-whitelist": "1.3.0",
  "org.apache.cordova.device": "0.3.0",
  "org.apache.cordova.dialogs": "0.3.0",
  "org.apache.cordova.globalization": "0.3.4",
  "org.apache.cordova.inappbrowser": "0.6.0",
  "org.apache.cordova.network-information": "0.2.15",
  "org.apache.cordova.splashscreen": "1.0.0"
};
// BOTTOM OF METADATA
});