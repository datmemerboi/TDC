const fs = require('fs');
const path = require('path');
const dateformat = require('./date-format-module.js');

process.argv[2] ? toFile = process.argv[2].replace("data/",'') : toFile = dateformat.MonthsYYYY( new Date() )+".csv" ;

fs.readFile( path.join(__dirname, "data", "data.json"), (err, json)=>{
  if(err){  throw err }
  json = JSON.parse(json);

  // To Month YYYY.json
  fs.writeFile(path.join(__dirname, "data", toFile.replace('.csv', '.json')), JSON.stringify(json),(err)=>{
    if(err){  throw err }
  });
  console.log("--- /data/data.json written into /data/"+toFile.replace('.csv', '.json')+" ---");

  // To Month YYYY.csv
  var preData = ",,,,,,PART D,,,,,,"+"\n"+
  ",System of Medicine,,,,,Clinical consulting,,,,,Tamilnadu Clinic Establishment,,"+"\n"+
  ",Name of Doctor,,,,,,,,,,Regulation Act Registration No,"+"\n"+
  ",Registration of patients,,,,,,,,,,,"+"\n"+
  ",Date:,,,,,,,,,,,"+"\n";

  var columns = ""; var keys = Object.keys(json[0]);
  keys.forEach((item, i) => {
    i==0 ? columns += item : columns = columns + "," + item ;
  });
  preData+=columns + "\n";

  fs.writeFile( path.join(__dirname, "data", toFile), preData, (err)=>{
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
  console.log("--- /data/data.json written into /data/"+toFile+" ---");

  fs.writeFile( path.join(__dirname, "data", "data.json"), "[]", (err)=>{
      if(err) { throw err }
    });
});
