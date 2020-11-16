const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const  logger = require('sane-node-logger');         // Advanced Logger
const  {Deamon}  = require('./app/deamon');

const deamon = new Deamon();
      deamon.start()
 
app.get('/', function (req, res) {
  res.send('<h1>TEST APP FOR RESEND DATA FROM RSS ENDPOINTS TO ELASTICSEARCH SERVER</h1>')
})
 
app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));


