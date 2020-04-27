const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dateformat = require('./date-format-module.js');

app.use(express.urlencoded({extended:true})); app.use(express.json());
app.use(express.static( __dirname + '/static' ));
app.use('/modules', express.static(__dirname + '/node_modules/jquery/dist/'));

app.get('/', (request, response)=>{
  if(request.method==="GET") {
    fs.readFile( './index.html' , (err, data)=>{
      if(err){  throw err;  }
      else {
        response.writeHead(200, {'Content-type':'text/html'});
        response.write(data);
        response.end();
      }
    })
  }
});

app.get('/view', (req, res)=>{
  fs.readFile( path.join( __dirname, "/view/view.html"), (err, html)=>{
    if(err){  throw err; }
    else {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write(html);
      res.end();
    }
  })
});

app.post('/showdata', (req,res)=>{
  fs.readFile( path.join( __dirname, "/data/data.json"), (err, json)=>{
    if(err){  throw err;  }
    let data = JSON.parse(json);
    res.json(data);
  });
});

app.get('/add', (req,res)=>{
  fs.readFile( path.join( __dirname, "/add/add.html"), (err, html)=>{
    if(err){  throw err }
    else if(req.method==='GET'){
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write(html);
      res.end();
    }
  })
});

app.post('/posted', (req, res)=>{
  if(req.method==='POST'){
    fs.readFile( path.join( __dirname, "/data/data.json"), (err, json)=>{
      if(err){ throw err }
      json = JSON.parse(json);

      req.body.patient['Treatment Date'] = dateformat.ddmonyyyy(req.body.patient['Treatment Date']);
      req.body.patient['Next Appointment'] = dateformat.ddmonyyyy(req.body.patient['Next Appointment']);

      json.push(req.body.patient);
      fs.writeFile( path.join( __dirname, "/data/data.json"), JSON.stringify(json), (err)=>{
        if(err){  throw err }
      });
      res.writeHead(201, {'Content-Type':'text/plain'});
      res.write("Added..")
      res.end();
    });
  }
});

app.get('/search', (req, res)=>{
  if(req.method==='GET'){
    fs.readFile( path.join( __dirname, "/search/search.html"), (err, html)=>{
      if(err){  throw err }
      else {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(html);
        res.end();
      }
    });
  }
});

app.get('/update', (req, res)=>{
  if(req.method==='GET'){
    fs.readFile( path.join( __dirname, "/update/update.html"), (err,html)=>{
      if(err){  throw err }
      else {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(html);
        res.end();
      }
    });
  }
});

app.post('/updation', (req, res)=>{
  if(req.method==='POST'){
    fromRecord = req.body.FromRecord; toRecord = req.body.ToRecord;
    toKey = Object.keys(toRecord)[0];

    if( toKey =='Treatment Date' || toKey=='Next Appointment' ) {
      toRecord[toKey] = dateformat.ddmonyyyy( toRecord[toKey] );
      console.log( toRecord[toKey] );
    }

    fs.readFile( path.join( __dirname, "/data/data.json"), (err, json)=>{
      if(err){  throw err }
      json = JSON.parse(json);
      json.forEach((record) => {
        if(record.Name == fromRecord.Name){
          record[toKey] = toRecord[toKey];
        }
      });
      fs.writeFile( path.join( __dirname, "/data/data.json"), JSON.stringify(json), (err)=>{
        if(err){ throw err  }
        else {
          res.sendStatus(202);
        }
      });
    });
  }
})

app.get('/import', (req, res)=>{
  command = "node "+ path.join( __dirname, 'CSVtoJSON.js');
  const ls = exec(command, function (err, result) {
    if (err) {  throw err }
    else
      res.sendStatus(201);
  });
});

app.get('/export', (req, res)=>{
  command = "node "+ path.join( __dirname, 'JSONtoCSV.js');
  const ls = exec(command, function (err, result) {
    if (err) {  throw err }
    else
      res.sendStatus(201);
  });
});

app.get('/json', (req, res)=>{
  fs.readFile( path.join(__dirname, '/data/data.json'), (err, json)=>{
    if(err) { throw err }
    res.json( JSON.parse(json) );
    res.end();
  })
})

app.listen(9090);
console.log("Server currently running @ 9090...");
