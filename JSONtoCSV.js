const fs = require('fs');
const path = require('path');
const dateformat = require('./date-format-module.js');

if( process.argv[2] ) {
  fromFile = process.argv[2].replace("data/",'');
  toFile = fromFile.replace('.json', '.csv');
} else { fromFile = "data.json"; toFile = "data.csv"; }

if( process.argv[3] ){
  toFile = process.argv[3].replace("data/",'');
}

fs.readFile( path.join(__dirname, "data", fromFile), (err, json)=>{
  if(err){  throw err }
  json = JSON.parse(json);

  var columns = ""; var keys = Object.keys(json[0]);
  
  keys.forEach((item, i) => {
    i==0 ? columns += item : columns = columns + "," + item;
  });
  columns+="\n";

  fs.writeFile( path.join(__dirname, "data", toFile), columns, (err)=>{
      if(err) { throw err }
    });

  json.forEach( (record)=>{

    var line = record.Name+","+
    record['Phone No']+","+
    record.Age+","+
    record.Sex+","+
    dateformat.ddmonyyyy(record['Treatment Date'])+","+
    record['Provisional Diagnosis']+","+
    record.Investigations+","+
    record['Final Diagnosis']+","+
    record.Treatment+","+
    record.Result+","+
    dateformat.ddmonyyyy(record['Next Appointment'])+","+
    record['Additional Information']+","+
    record['Inital of the Medical Officer']+"\n";

    fs.appendFile( path.join(__dirname, "data", toFile), line, (err)=>{
      if(err) { throw err }
    });
  });
  console.log("--- /data/"+fromFile+" written into /data/"+toFile+" ---");
});
