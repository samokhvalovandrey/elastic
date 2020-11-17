const  logger = require('sane-node-logger')           // Advanced Logger
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require("fs");

class Rss_adapter{
    constructor(data){
        this.data = data;
        this.props = data.rss.props;
    }
    temp(item,i){  // Method to ajust responce structure
        let responce = new Object;
        this.props.forEach(prop=>{
            responce[prop.name]=null;
            if(prop.rss_prop){
                if(item[prop.rss_prop]){
                    responce[prop.name]=item[prop.rss_prop];
                }
            }
            if(prop.type == 'integer'){
                responce[prop.name] = Math.round(Math.random()*100);
            }
            responce[prop.name]
        });
        return responce;
    }
    async getRssNews(){                                     // COMMON Method to return responce
        let responce ={                                     //Object for responce data
            RSS_FEED:[],
            RSS_LOGS:[{
                url: this.data.url, 
                request_time: new Date(),  
                amount_returned: 0,
                status: "success"
            }],
            result:"success"
        };
        try{                                                     //Start process 
            let feed = await parser.parseURL(this.data.url);
            logger.log(feed.title);
            feed.items.forEach((item,i)=>{
                let newItem = this.temp(item,i)
                responce.RSS_FEED.push(newItem);
            });
            responce.RSS_LOGS[0].amount_returned = feed.items.length;
            return responce;
        }catch(err){
            console.log('adpter ERROR',err);
            responce.RSS_LOGS[0].status = 'failure';
            responce.result = 'failure'
            return responce;
        }
        
    }
    
}

module.exports = {
    Rss_adapter
}