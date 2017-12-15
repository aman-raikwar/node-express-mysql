var striptags = require('striptags');
var mysql = require('mysql');
var db = require('../config/database.js');
var Q = require("q");

var categoryModel = {

    /*********** check if category with same name exists ****************/
    checkCategoryExists: function(name, parent) {
        var deferred = Q.defer();
        var query = "SELECT id,name FROM categories WHERE name = '" + name + "' AND is_deleted = 0 AND parent_id = " + parent;
        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

    /*********** Add Category ****************/
    addCategory: function(data) {
        var deferred = Q.defer();
        db.connection.query('INSERT INTO categories SET ?', data, function(error, result, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            if (result) {
                deferred.resolve(result.insertId);
            }
        });
        return deferred.promise;
    },

    /*********** get all parent categories ****************/
    getParentCategories: function(id) {
        var deferred = Q.defer();
        var query = "SELECT id, name, status FROM tbl_categories WHERE parent_id = " + id + " AND is_deleted = 0";
        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

    /*********** update category ****************/
    updateCategory: function(id, name) {
        var deferred = Q.defer();
        var query = 'UPDATE categories SET name = "' + name + '" WHERE id = ' + id;
        db.connection.query(query, function(error, result, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    },

    /*********** delete primary category ****************/
    deleteCategory: function(id) {
        var deferred = Q.defer();
        var sql = "UPDATE categories SET is_deleted = 1 WHERE id = " + id;
        db.connection.query(sql, function(error, results, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    },

    /*********** delete sub category ****************/
    deleteSubCategory: function(id) {
        var deferred = Q.defer();
        var sql = "UPDATE categories SET is_deleted = 1 WHERE parent_id = " + id;
        db.connection.query(sql, function(error, results, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    },

};
module.exports = categoryModel;