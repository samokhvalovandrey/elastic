const {elasticConfig} = require('../config');      //Connection config to elastic searche server
const {Client} = require('@elastic/elasticsearch') //Elastic search npm module
const client = new Client(elasticConfig);          //Auth to elastic server

async function run () {
    await client.index({
        index: 'rss_feed',
        body: {
            creator: "Reventlov",
            timestamp: "2020-11-16T16:22:49.000Z",
            title: "Ok Google: please publish your DKIM secret keys",
            comments: 31,
            points: 37,
            link: "https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/"
        }
      })
    
      const { body } = await client.exists({
        index: 'rss_feed'
      })
    
      console.log(body) // true
}
run().catch(console.log)