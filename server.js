const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/static'));

app.get('/', (request, response)=>{
  if(request.method==="GET") {
    // console.log("New GET request!")
    fs.readFile('./index.html', (err, data)=>{
      if(err){  throw err;  }
      else {
        response.writeHead(200, {'Content-type':'text/html'});
        response.write(data);
        response.end();
      }
    })
  }
})

app.get('/view', (req, res)=>{
  fs.readFile('./view/view.html', (err, html)=>{
    if(err){  throw err; }
    else {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write(html);
      res.end();
      }
  })
});

app.get('/data', (req,res)=>{
  fs.readFile(path.join(__dirname,"/data/data.json"), (err, json)=>{
    if(err){  throw err;  }
    let data = JSON.parse(json);
    res.json(data);
  });
});

app.listen(9090)
console.log("Server currently running...")




// let body
// fs.readFile('./data/data.json', (err,data)=>{
//   if (err) {  throw err; }
//   body = JSON.parse(data);
//   // console.log(body);
//   body.forEach((val, ind) => {
//     console.log(val)
//   });

  // let ins = {"Name":"Andy", "Age":33, "Sex":"Male"}
  // body.push(ins)
  // fs.writeFile('./data/data.json', JSON.stringify(body),(err, writeRes)=>{
  //   if(err){throw err}
  //   console.log("Written!")
  // })
// });
