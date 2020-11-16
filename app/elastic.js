const {elasticConfig} = require('../config');      //Connection config to elastic searche server
require('array.prototype.flatmap').shim()          //Flat map for array treatmnet
const {Client} = require('@elastic/elasticsearch') //Elastic search npm module
const client = new Client(elasticConfig);          //Auth to elastic server
const logger = require('sane-node-logger')         // Advanced Logger

class Elastic{
  constructor(index, map){
    this.index = index;
    this.map = map;
  }

  async putRssFeed (data) {
    //console.log(data);
    await client.indices.create({
      index: this.index,
      body: {
        mappings: {
          properties: this.map
        }
      }
    }, { ignore: [400] })
    let dataset = data
    const body = dataset.flatMap(doc => [{ index: { _index: this.index } }, doc])
    const { body: bulkResponse } = await client.bulk({ refresh: true, body })
    if (bulkResponse.errors) {
      const erroredDocuments = []
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1]
          })
        }
      })
      logger.log(erroredDocuments)
    }

    const { body: count } = await client.count({ index: this.index })
    logger.log(count)
  }
}

module.exports = {
  Elastic
}