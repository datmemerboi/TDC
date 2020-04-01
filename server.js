const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(express.urlencoded({extended:true})); app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/', (request, response)=>{
  if(request.method==="GET") {
    fs.readFile('./index.html', (err, data)=>{
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
  fs.readFile(path.join(__dirname, '/view/view.html'), (err, html)=>{
    if(err){  throw err; }
    else {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write(html);
      res.end();
    }
  })
});

app.post('/showdata', (req,res)=>{
  fs.readFile(path.join(__dirname,"/data/data.json"), (err, json)=>{
    if(err){  throw err;  }
    let data = JSON.parse(json);
    res.json(data);
  });
});

app.get('/add', (req,res)=>{
  fs.readFile(path.join(__dirname,"/add/add.html"), (err, html)=>{
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
    console.log(req.body.patient);
    fs.readFile(path.join(__dirname, "/data/data.json"), (err, json)=>{
      if(err){ throw err }
      json = JSON.parse(json);
      json.push(req.body.patient);
      fs.writeFile(path.join(__dirname, "/data/data.json"), JSON.stringify(json), (err)=>{
        if(err){  throw err }
      });
      res.writeHead(200, {'Content-Type':'text/plain'});
      res.write("Added..")
      res.end();
    });
  }
});
app.get('/search', (req, res)=>{
  if(req.method==='GET'){
    fs.readFile(path.join(__dirname, "/search/search.html"), (err, html)=>{
      if(err){  throw err }
      else {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(html);
        res.end();
      }
    });
  }
});
app.listen(9090);
console.log("Server currently running...");
