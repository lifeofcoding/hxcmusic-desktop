const {ipcRenderer} = require("electron");
// injection technique borrowed from http://stackoverflow.com/questions/840240/injecting-jquery-into-a-page-fails-when-using-google-ajax-libraries-api
window.onload = function() {
  window.downloadFile = function(url) {
    ipcRenderer.send("download", url);
  }
};
