const express = require('express');
const fs = require('fs');
const elasticsearch = require('elasticsearch');
const verify = require('./verify');
const search = require('./search');
const app = express();

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});
const bulkIndex = function bulkIndex(index, type, data) {
    let bulkBody = [];

    data.forEach(item => {
        bulkBody.push({
            index: {
                _index: index,
                _type: type,
                _id: item.id
            }
        });

        bulkBody.push(item);
    });

    esClient.bulk({body: bulkBody})
        .then(response => {
            console.log('here');
            let errorCount = 0;
            response.items.forEach(item => {
                if (item.index && item.index.error) {
                    console.log(++errorCount, item.index.error);
                }
            });
            console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
        })
        .catch(console.err);
};

const test = function test() {
    const articles = fs.readFileSync('data.json', 'utf-8');
    bulkIndex('library', 'article', JSON.parse(articles));
};
// test();
// verify();
search();


const port = 5000;
app.listen(port, ()=>{
    console.log("server listen on port "+port);
});