const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

var methods = {
  AllFiles : function() {
    var filesArray = []
    fs.readdirSync('./data/').forEach(file=>{
        filesArray.push(file);
      });
      return filesArray;
  },
  JSONFiles : function() {
    var filesArray = []
    fs.readdirSync('./data/').forEach(file=>{
      if( path.extname(file)==='.json' )
        filesArray.push(file);
    });
    return filesArray;
  },
  ImportBeforehand : function() {
    fs.readFile('./data/data.json', (err, res)=>{
      if( res==""){
        const imp = exec("node CSVtoJSON.js", function (err) {
          if (err) {  throw err }
        });
      }
    });
  },
}

module.exports = methods;
