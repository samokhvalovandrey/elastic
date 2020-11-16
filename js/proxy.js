//Flat map for array treatmnet
const {Elastic} = require('./elastic') //Elastic search npm module
const fs = require('fs');
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const lastDateFileName ='./data/lastDate.json'; 

class Proxy{                                    //Class Proxy Pattern with aim pretreat data
  constructor(rssSource){
    this.rssSource = rssSource;
    this.rss_index = rssSource.rss.index;
    this.rss_props = rssSource.rss.props;
    this.log_index = rssSource.log.index;
    this.log_props = rssSource.log.props;
  }
  async getLastDate(){                          //Get the latest date after restarting
      let obj = this;
      try{
        let lastDate = await readFileAsync('./data/lastDate.json');
            lastDate = JSON.parse(lastDate);
            lastDate =lastDate.lastDate
            obj.lastDate = new Date(lastDate);
      }catch(err){
          console.log(err);
      }
  }
  async putRssPut (data) {                      //Post latest data to elastic server
      let map=new Object;
      this.rss_props.forEach(prop => {
          map[prop.name]={
              "type":prop.type
          }
      });
    
    let newData =[];
    if(this.lastDate){                          // Treatment of date publishing
        data.forEach(d=>{
            let date = new Date(d.timestamp);
            if(date > this.lastDate){
                newData.push(d);
            }
        });
        if(newData[0]){
            let json = {"lastDate":newData[0].timestamp};
                json =JSON.stringify(json);
            this.lastDate = new Date(newData[0].timestamp);
            fs.writeFile(lastDateFileName, json, function (err) {
                if (err) throw err;
            });
        }
    }else{
        newData = data;
    }
    if (newData.length>0){
        let elasticInstance = new Elastic(this.rss_index, map, data);
        (async ()=>{
            await elasticInstance.putRssFeed();
        })();
    }else{
        console.log('RSS Data is OLD');
    }
  }
  async putRssLog (data) {                      //Post logs to elastic server
    let map=new Object;
    this.log_props.forEach(prop => {
        map[prop.name]={
            "type":prop.type
        }
    });
    let elasticInstance = new Elastic(this.log_index, map, data);
    (async ()=>{
        await elasticInstance.putRssFeed();
    })();
    
  }
}

module.exports = {
  Proxy
}