//Flat map for array treatmnet
const  logger = require('sane-node-logger')          // Advanced Logger
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
        let lastDate = await readFileAsync(lastDateFileName);
            lastDate = JSON.parse(lastDate);
            lastDate = lastDate[this.rssSource.name]['time'];
            obj.lastDate = new Date(lastDate);
      }catch(err){
          logger.log(err);
      }
  }
  async setLastDate(){
    let obj = this;
      try{
        let lastDate = await readFileAsync(lastDateFileName);
            lastDate = JSON.parse(lastDate);
            if(lastDate[this.rssSource.name]['time']){
                lastDate[this.rssSource.name]['time'] = obj.lastDate;
            }else{
                lastDate[this.rssSource.name]=new Object;
                lastDate[this.rssSource.name]['time'] = obj.lastDate;
            }
           let json =JSON.stringify(lastDate);
            fs.writeFile(lastDateFileName, json, function (err) {
                if (err) throw err;
            });
      }catch(err){
          console.log(err);
          if(obj.lastDate){
          let json = new Object;
              json[obj.rssSource.name]['time'] = obj.lastDate;
              json =JSON.stringify(json);
              fs.writeFile(lastDateFileName, json, function (err) {
                 if (err) throw err;
              });
          }
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
    let revData =[];
    if(this.lastDate){                          // Treatment of date publishing
        let lastDate= this.lastDate;
        data.forEach(d=>{
            let date = new Date(d.timestamp);
            if(date > this.lastDate){
                newData.push(d);
            }
            if(lastDate<date){
                lastDate = date;
            }
        });
        this.lastDate = lastDate;
        revData = newData.reverse();
        this.setLastDate();
    }else{
        revData = data.reverse();
    }
    if (revData.length>0){
        let elasticInstance = new Elastic(this.rss_index, map);
        (async ()=>{
            await elasticInstance.putRssFeed(revData);
        })();
    }else{
        logger.log('RSS Data is OLD');
    }
  }
  async putRssLog (data) {                      //Post logs to elastic server
    let map=new Object;
    this.log_props.forEach(prop => {
        map[prop.name]={
            "type":prop.type
        }
    });
    let elasticInstance = new Elastic(this.log_index, map);
    (async ()=>{
        await elasticInstance.putRssFeed(data);
    })();
    
  }
}

module.exports = {
  Proxy
}