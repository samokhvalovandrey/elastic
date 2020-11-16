const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const  logger = require('sane-node-logger');         // Advanced Logger
const  {Deamon}  = require('./app/deamon');

const deamon = new Deamon();
      deamon.start()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));


