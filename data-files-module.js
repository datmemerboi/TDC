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
  NeverEmptyJSON : function() {
    fs.readFile('./data/data.json', (err, open)=>{
      if(err){ throw err  }
      if( open=="" || open=="\n" ){
        fs.writeFile('./data/data.json', "[]", (err, written)=>{
          if(err){  throw err }
          console.log("Written '[]' into data.json");
        });
      }
    });
  }
}

module.exports = methods;
