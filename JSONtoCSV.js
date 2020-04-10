const fs = require('fs');
const path = require('path');

fs.readFile( path.join(__dirname, "/data/data.json"), async (err, json)=>{
  if(err){  throw err }
  json = JSON.parse(json);

  var columns = ""; var keys = Object.keys(json[0]);
  keys.forEach((item, i) => {
    if(i==0)
      columns += item;
    else
      columns = columns + "," + item;
  });
  columns+="\n";
  fs.writeFile( path.join(__dirname, "/data/data2.csv"), columns, (err)=>{
      if(err) { throw err }
    });

  json.forEach( (record)=>{
    var line = record.Name+","+
    record.Age+","+
    record.Sex+","+
    record['Treatment-Date']+","+
    record['Med-History']+","+
    record.Treatment+","+
    record['Current-Meds']+","+
    record['Next-Treatment']+"\n";

    fs.appendFile( path.join(__dirname, "/data/data2.csv"), line, (err)=>{
      if(err) { throw err }
      else {
        console.log("--- /data/data.json written into /data/data2.csv ---");
      }
    });
  });
});
