const sortOrders = ['asc','desc'];

module.exports.isValid = function isValid(url,payload){
    const method = getLastFromPos(url, 1);
    if (method === 'create'){
      if (getLastFromPos(url, 2) === 'articles'){
        return checkCreateArticle(payload);
      }
      if (getLastFromPos(url, 2) === 'comments'){
        return checkCreateComment(payload);
      }
    }
    else if (method === 'delete' || method === 'read'){
      if (payload.length !== 1 &&
          !payload.id &&
          (typeof payload !== 'number' || typeof payload !== 'string')){
        return false;
      }
      if (typeof payload !== 'number' || typeof payload !== 'string'){
        return false;
      }
    }
    else if (method === 'readall'){
        return isValidSort(payload) & isValidMeta(payload) & isValidDeps(payload);
    }
    return true;
}
  
function getLastFromPos(url, pos){
    let partsOfUrl = url.split('/');
    return partsOfUrl[partsOfUrl.length-pos];
}

function checkCreateArticle(payload){
    if (payload.length != 5 &&
        typeof payload.title !== 'string' &&
        typeof payload.text !== 'string' && 
        typeof payload.date !== 'number' && 
        typeof payload.author !== 'string' &&
        typeof payload.comments !== 'object'){
        return false;
    }
    if (payload.comments === '[]'){
        return true;
    }
    else{
        return checkCreateComment(payload.comments);
    }
}

function checkCreateComment(payload){
    if (payload==='undefined' &&
        (typeof payload.articleId !== 'number' || typeof payload.articleId !== 'string') && 
        typeof payload.text !== 'string' &&
        typeof payload.date !== 'number'&&
        typeof payload.author !== 'string'){
        return false;
    }
    return true;
}

function isValidSort(payload){
    if((payload.sortField !== 'undefined' && typeof payload.sortField !== 'string') &&
           (payload.sortOrder !== 'undefined' && typeof payload.sortOrder !== 'string' &&
            sortOrders.indexOf(payload.sortOrder) != -1)) {
            return false;
    }
    return true;
}

function isValidMeta(payload){
    return (typeof payload.page === 'number') && (typeof payload.limit === 'number');
}

function isValidDeps(payload){
    return typeof payload.includeDeps === 'undefined' || typeof payload.includeDeps === 'boolean';
}