var striptags = require('striptags');
var mysql = require('mysql');
var db = require('../config/database.js');
var Q = require("q");

var authModel = {

    getUserBy: function(data) {
        var deferred = Q.defer();
        var query = "SELECT * FROM tbl_users WHERE is_deleted = 0 AND status = 1";
        var where = "";

        if (typeof data.username != 'undefined' && data.username != '') {
            where += " AND username='" + data.username + "'";
        }

        query += where;
        query = mysql.format(query, where);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows[0]);
        });
        return deferred.promise;
    },

    setUserInfo: function(request) {
        return {
            id: request.id,
            username: request.username,
            email: request.email
        };
    },

};

module.exports = authModel;