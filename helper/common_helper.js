var moment = require('moment');
var base64 = require('base-64');

var common_helper = {};

common_helper.getCurrentDateTime = function() {
    var date = new Date();
    var curmonth = (date.getMonth() + 1);
    if (curmonth < 10)
        curmonth = "0" + curmonth;
    var curDate = date.getDate();
    if (curDate < 10)
        curDate = "0" + curDate;
    var dbdate = date.getFullYear() + "-" + curmonth + "-" + curDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return dbdate;
}

//moment date check if valid 
common_helper.sanitization = function(req, fields) {
    fields.forEach(function(val) {
        if (val.constructor !== Array || val[1] === false) {
            req.sanitize(val).escape();
        }
        req.sanitize(val).trim();
    });
}

//moment date check if valid 
common_helper.isValidDate = function(str, format) {
    if (!format) {
        format = 'DD-MM-YYYY'
    }
    var d = moment(str, format);
    if (d === null || !d.isValid())
        return false;

    return true;
}


common_helper.sendResponse = function(res, header, status, data) {
    if (header) {
        res.set(header);
    }

    res.status(status).send(data);
    return false;
}

common_helper.isNumber = function(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

common_helper.encodeId = function(id) {
    var encoded = base64.encode(id);
    var count = (encoded.match(/=/g) || []).length;
    if (count > 0) {
        var newId = encoded.replace(/=/g, "")
    } else {
        var newId = encoded;
    }
    return newId;
}

common_helper.setImagePath = function(userId, fileName, type) {
    var path = '';
    if (type == 'thumb') {
        path = '/uploads/users/' + userId + '/profile-image/' + type + '/' + fileName;
    } else {
        path = '/uploads/users/' + userId + '/profile-image/' + fileName;
    }
    return path;
}

common_helper.setProductImagePath = function(companyId, productId, fileName, type) {
    var path = '';
    if (type == 'thumb') {
        path = '/uploads/companies/' + companyId + '/products/' + productId + '/images/' + type + '/' + fileName;
    } else {
        path = '/uploads/companies/' + companyId + '/products/' + productId + '/images/' + fileName;
    }
    return path;
}

common_helper.getSession = function(req, session_key) {
    var value = req.cookies[session_key];
    if (typeof value !== undefined) {
        return value;
    }
    return false;
}

common_helper.setProductImagePath = function(companyId, productId, fileName, type) {
    var path = '';
    if (type == 'thumb') {
        path = '/uploads/companies/' + companyId + '/products/' + productId + '/images/' + type + '/' + fileName;
    } else {
        path = '/uploads/companies/' + companyId + '/products/' + productId + '/images/' + fileName;
    }
    return path;
}

module.exports = common_helper;