const fs = require('fs');
const path = require('path');
const neatcsv = require('neat-csv');

fs.readFile( path.join(__dirname, "/data/data.csv"), async (err, data)=>{
  if(err){  throw err }
  console.log( await neatcsv(data) );
  fs.writeFile( path.join(__dirname, "/data/data.json"), JSON.stringify(await neatcsv(data) ), (err)=>{
    if(err){ throw err  }
    else {
      console.log("Done! Go check /data/data.json");
    }
  } );
});
