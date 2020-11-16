const  logger = require('sane-node-logger')          // Advanced Logger
const  rssList = require('../data/source');           // Date of RSS sources
const  cron = require('node-cron');                  // Module for Deamon
const  {Rss_adapter} = require('./rss_adapter');  // CLASS of RSS parser and adapter
const  {Proxy}=require('./proxy');                // CLASS of connection to Elastic server with proxy 

class Deamon{
  constructor(){}
  start(){
    rssList.forEach(element => {                         //Iterate all source of RSS feed
      element.rssObject = new Rss_adapter(element);      //SET adapter to connect with RSS
      element.Proxy = new Proxy(element);                //SET proxy for put to Elastic Server
      (async ()=>{
        await element.Proxy.getLastDate();
        startDeamon(element);
      })();
    });

    function startDeamon(element){                         // START DEAMON
    cron.schedule('* * * * *', () => {                  
      if(element.active == true){                        //Check active link for RSS
        (async ()=>{
          try{
            element.data = await element.rssObject.getRssNews();  // recieve RSS FEED
            if(element.data.result == 'success'){  
              element.Proxy.putRssPut(element.data.RSS_FEED);     //Send data to Proxy for Elastic
              element.Proxy.putRssLog(element.data.RSS_LOGS);     //Send logs to Proxy for Elastic
            }else{
              element.Proxy.putRssLog(element.data.RSS_LOGS);      //Send logs to Proxy for Elastic
            }
          }catch(err){
            logger.log('error',err);
          }
        })();
      }
    });
    }
  }
}

module.exports = {
  Deamon
}

