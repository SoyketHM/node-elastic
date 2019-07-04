const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});

module.exports = function indices() {
    console.log(`elasticsearch indices information`)
    return esClient.cat.indices({v: true})
        .then(console.log)
        .catch(err => console.error(`Error connecting to the es client: ${err}`));
};

