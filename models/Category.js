var striptags = require('striptags');
var mysql = require('mysql');
var db = require('../config/database.js');
var Q = require("q");

var Category = {

    checkCategoryExists: function(name, id) {
        var deferred = Q.defer();
        var query = "SELECT id, name FROM tbl_categories WHERE ";
        var where = "";

        if (typeof name != 'undefined' && name != '') {
            where += " name = '" + striptags(name) + "'";
        }

        if (typeof id != 'undefined' && id != '' && id != 0) {
            where += " AND id != " + striptags(id);
        }

        where += " AND is_deleted = 0";

        query += where;
        query = mysql.format(query, where);
        console.log(query);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

    addCategory: function(data) {
        var deferred = Q.defer();
        var query = "INSERT INTO tbl_categories SET ?";
        data.name = striptags(data.name);

        db.connection.query(query, data, function(error, result, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            if (result) {
                deferred.resolve(result.insertId);
            }
        });
        return deferred.promise;
    },

    getCategories: function(limit = 10, offset = 0, searchParams = {}, orderParams = { orderColumn: 'created_at', orderBy: 'DESC' }) {
        var deferred = Q.defer();
        var query = "SELECT id, name, status FROM tbl_categories WHERE is_deleted = 0";
        var orderBy = " ORDER BY " + orderParams.orderColumn + " " + orderParams.orderBy + " ";
        var where = "";

        if (typeof searchParams.id != 'undefined' && searchParams.id != '') {
            where += " AND id = " + searchParams.id;
        }

        if (typeof searchParams.name != 'undefined' && searchParams.name != '') {
            where += " AND name LIKE '%" + striptags(searchParams.name) + "%' ";
        }

        if (typeof searchParams.status != 'undefined' && searchParams.status != '') {
            where += " AND status = " + searchParams.status;
        }

        query += where;

        query += orderBy + " LIMIT " + offset + ", " + limit;
        query = mysql.format(query, where);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

    singleCategory: function(category_id) {
        var deferred = Q.defer();
        var query = "SELECT id, name, status, created_at, updated_at FROM tbl_categories WHERE ? AND is_deleted = 0";
        db.connection.query(query, { id: striptags(category_id) }, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows[0]);
        });
        return deferred.promise;
    },

    updateCategory: function(category, category_id) {
        var deferred = Q.defer();
        var query = 'UPDATE tbl_categories SET ? WHERE ?';
        category.name = striptags(category.name);
        category.status = striptags(category.status);

        db.connection.query(query, [category, { id: striptags(category_id) }], function(error, result, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    },

    deleteCategory: function(category_id) {
        var deferred = Q.defer();
        var query = "UPDATE tbl_categories SET is_deleted = 1 WHERE ?";
        db.connection.query(query, { id: striptags(category_id) }, function(error, results, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    },

    countCategory: function(searchParams = {}) {
        var deferred = Q.defer();
        var query = "SELECT COUNT(id) as total FROM tbl_categories WHERE is_deleted = 0";
        var where = "";

        if (typeof searchParams.name != 'undefined' && searchParams.name != '') {
            where += " AND name LIKE '%" + striptags(searchParams.name) + "%' ";
        }

        if (typeof searchParams.status != 'undefined' && searchParams.status != '') {
            where += " AND status = " + searchParams.status;
        }

        query += where;
        query = mysql.format(query, where);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }

            if (rows) {
                deferred.resolve(rows);
            } else {
                deferred.reject(new Error("Not category found!"));
            }
        });
        return deferred.promise;
    },

    getAllCategories: function() {
        var deferred = Q.defer();
        var query = "SELECT id, name FROM tbl_categories WHERE is_deleted = 0 AND status = 1 ORDER BY name;";
        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

};

module.exports = Category;