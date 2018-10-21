const fs = require('fs');
const logger = fs.createWriteStream('log.txt');
const valid = require("./valid")
let prop;
let asc;


module.exports.readall = function readall(req, res, payload, cb){
    if (valid.isValid(req.url, payload)){
        let articles = JSON.parse(fs.readFileSync('articles.json'));
        if (payload.sortField !== 'undefined'){
            prop = payload.sortField;
            asc = payload.sortOrder;
            switch(typeof articles[0][payload.sortField]){
                case "number": articles.sort(compareNumber);
                case "string": articles.sort(compareString);
                default: break;
            }
        }
        let result = getPage(articles, payload.page, payload.limit);
        cb(null, {items:articles, meta:{}});
    }
    else{
        cb({ code: 404, message: 'Not found'});
    }
}

function compareNumber(obj1, obj2){
    if(asc === 'asc'){
        return obj1[prop] - obj2[prop];
    } 
    else{
        return obj2[prop] - obj1[prop];
    }
}

function compareString(obj1, obj2){
    let result = obj1[prop] < obj2[prop] ? -1 : obj1[prop] > obj2[prop] ? 1 : 0;
    if (asc === 'asc'){
        return result;
    } 
    else {
        return !result;
    }
}