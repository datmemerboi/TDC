const { exec } = require('child_process');

// Windows setup
if(process.platform==='win32' || process.platform==='win64'){
  var install = "npm install qckwinsvc";
  const i = exec(install, function (err, res) {
    if (err) {  throw err }
  });

  var command = 'qckwinsvc --name "Server" --description "Running server for TDC"'+
  ' --script "'+__dirname+"/server.js"+'" --startImmediately';

  const c = exec(command, function (err, res) {
    if (err) {  throw err }
  });
}
// Other platforms
else {
  var install = "npm install";
  const i = exec(install, function (err, res) {
    if (err) {  throw err }
  });
}
