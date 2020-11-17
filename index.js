const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const  logger = require('sane-node-logger');         // Advanced Logger
const  {Deamon}  = require('./app/deamon');

const deamon = new Deamon();
      deamon.start()
 
app.get('/', function (req, res) {
  res.send('<!doctype html> <html lang="en"> <head> <meta charset="utf-8"> <title>The HTML5 Herald</title> <meta name="description" content="The HTML5 Herald"> <meta name="author" content="SitePoint"> <link rel="stylesheet" href="css/styles.css?v=1.0"> </head> <body> <header></header> <main style="margin:0 auto; max-width:800px; margin-top:30px;"> <h2>Backend Test Assignment</h2> <div><b>Author:</b> Samokhvalov Andrey</div> <div><b>Date:</b> 2020-11-17</div> <div><b>Lang:</b> Node.js</div> <div class="github"> <div>Link to GitHub: <a href="" target="_blank"></a></div> </div> <div class="dashbord"> <h3>Line timestamp</h3> <div> <iframe src="https://d3fc072959084cce8dcaf2eeaf3bd96e.us-central1.gcp.cloud.es.io:9243/app/dashboards#/create?embed=true&_g=(filters:!(),query:(language:kuery,query:""),refreshInterval:(pause:!t,value:0),time:(from:now-24h,to:now))&_a=(description:"",filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(),gridData:(h:15,i:b34f957b-4635-4d01-9de7-f96167879069,w:24,x:0,y:0),id:"5b396ea0-2874-11eb-89b8-bfd93a0e7099",panelIndex:b34f957b-4635-4d01-9de7-f96167879069,type:lens,version:"7.10.0")),query:(language:kuery,query:""),timeRestore:!f,title:"",viewMode:edit)" height="600" width="800"></iframe> </div> </div> <div class="dashbord"> <h3>comments vs points</h3> <div> <iframe src="https://d3fc072959084cce8dcaf2eeaf3bd96e.us-central1.gcp.cloud.es.io:9243/app/dashboards#/view/037f4b80-2879-11eb-89b8-bfd93a0e7099?embed=true&_g=(filters:!(),refreshInterval:(pause:!f,value:300000),time:(from:now-12h,to:now))&_a=(description:"",filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:""),timeRestore:!f,title:HITMAP,viewMode:view)&hide-filter-bar=true" height="600" width="800"></iframe>		</div> </div> </main> <footer></footer> </body> </html>');
})
 
app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));


