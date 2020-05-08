const fs = require('fs');
const path = require('path');
const neatcsv = require('neat-csv');

if( process.argv[2] ) {
  fromFile = process.argv[2].replace("data/",'');
  toFile = fromFile.replace('.csv', '.json');
} else { fromFile = "data.csv"; toFile = "data.json"; }

if( process.argv[3] ){
  toFile = process.argv[3].replace("data/",'');
}

fs.readFile( path.join(__dirname, "data", fromFile), async (err, data)=>{
  if(err){  throw err }
  fs.writeFile( path.join(__dirname, "data", toFile), JSON.stringify(await neatcsv(data) ), (err)=>{
    if(err){ throw err  }
    else {
      console.log("--- /data/"+fromFile+" written into /data/"+toFile+" ---");
    }
  } );
});
