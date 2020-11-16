const  rssList = require('./data/source');           // Date of RSS sources
const  cron = require('node-cron');                  // Module for Deamon
const  {Rss_adapter} = require('./js/rss_adapter');  // CLASS of RSS parser and adapter
const  {Proxy}=require('./js/proxy');                // CLASS of connection to Elastic server with proxy 

rssList.forEach(element => {                         //Itarate all source of RSS feed
  element.rssObject = new Rss_adapter(element);      //SET adapter to connect with RSS
  element.Proxy = new Proxy(element);                //SET proxy for put to Elastic Server
  (async ()=>{
    element.Proxy.getLastDate();
  })();
});
cron.schedule('*/5 * * * *', () => {                    // START DEAMON
  rssList.forEach(element => {
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
          console.log('error',err);
        }
      })();
    }
  })
});
