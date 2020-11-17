const  logger = require('sane-node-logger')           // Advanced Logger
const  rssList = require('../data/source');           // Date of RSS sources
const  cron = require('node-cron');                   // Module for Deamon
const  {Rss_adapter} = require('./rss_adapter');      // CLASS of RSS parser and adapter
const  {Proxy}=require('./proxy');                    // CLASS of connection to Elastic server with proxy 

function timeout(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
class Deamon{
  constructor(){}
  start(){
    rssList.forEach(element => {                         //Iterate all source of RSS feed
      element.rssObject = new Rss_adapter(element);      //SET adapter object to connect with RSS
      element.Proxy = new Proxy(element);                //SET proxy object for put data to Elastic Server
      (async ()=>{
        try{
          await element.Proxy.getLastDate();
          startDeamon(element);
        }catch(err){
          logger('startDeamon getLastDate err',err);
          startDeamon(element);
        }
      })();
    });

    function startDeamon(element){                         // START DEAMON
      cron.schedule('* * * * *', () => {              
      if(element.active == true){                        //Check active link for RSS
        let count =0; let t=[400,1000,2000]; 
        fetchData();
        async function fetchData(){
          try{
            element.data = await element.rssObject.getRssNews();  // recieve RSS FEED
            if(element.data.result == 'success'){  
              element.Proxy.putRssPut(element.data.RSS_FEED);     //Send data to Proxy for Elastic
              element.Proxy.putRssLog(element.data.RSS_LOGS);     //Send logs to Proxy for Elastic
            }else{
              if(count<3){
                await timeout(t[count]);
                count++;
                fetchData();
              }else{
                 element.Proxy.putRssLog(element.data.RSS_LOGS);   //Send logs to Proxy for Elastic
              }    
            }
          }catch(err){
            logger.log(err);
          }
        }
      }
    });
    }
  }
}

module.exports = {
  Deamon
}

