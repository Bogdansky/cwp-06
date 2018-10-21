const fs = require('fs');
const valid = require("./valid");
const log = require('./log');
let prop;
let asc;
let pageCount;
let haveComments;

module.exports.readall = function readall(req, res, payload, cb){
    if (valid.isValid(req.url, payload)){
        let articles = JSON.parse(fs.readFileSync('articles.json'));
        if (payload.sortField !== 'undefined'){
            prop = payload.sortField;
            asc = payload.sortOrder;
            haveComments = typeof payload.includeDeps === 'undefined' ? false : payload.includeDeps;
            switch(typeof articles[0][payload.sortField]){
                case "number": articles.sort(compareNumber);
                case "string": articles.sort(compareString);
                default: break;
            }
        }
        pageCount = getPageCount(articles.length,payload.limit);
        let result = getPage(articles, payload.page, payload.limit);
        log.log({method:"readall", answer:result});
        cb(null,
           {
                items:result,
                meta:{
                        page:payload.page,
                        pages:pageCount,
                        count:articles.length,
                        limit:payload.limit
                }
           }
        );
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

function getPage(articles, page, limit){
    let result = [];
    if (pageCount === 0 || page > pageCount){
        result.push({article:"nothing", reason:"out of range"});
    }
    else{
        for (let index = limit*(page-1); index < limit*page && index < articles.length; index++){
            if (!haveComments){
                delete articles[index].comments;
            }
            result.push(articles[index]);
        }
    }
    return result;
}

function getPageCount(articleCount, articleLimit){
    return Math.ceil(articleCount/articleLimit);
} 