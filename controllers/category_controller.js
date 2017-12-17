var fs = require('fs');
var categoryModel = require('../models/category_model.js');
var faker = require('faker');

var category_controller = {

    actionIndex: function(req, res, next) {
        var limit = 10;
        var total = 0;
        var page = parseInt(req.query.page) || 1;
        var offset = (limit * page) - limit;

        var orderParams;
        if (typeof req.query.orderColumn != 'undefined' && req.query.orderColumn != '' && typeof req.query.orderBy != 'undefined' && req.query.orderBy != '') {
            orderParams = {
                orderColumn: req.query.orderColumn,
                orderBy: req.query.orderBy
            };
        }

        var searchParams = {
            id: req.query.id,
            name: req.query.name,
            status: req.query.status
        };

        categoryModel.countCategory(searchParams).then(function(result) {
            total = result[0].total;

            categoryModel.getCategories(limit, offset, searchParams, orderParams).then(function(result) {
                res.render('category/index', {
                    categories: result,
                    current: page,
                    pages: Math.ceil(total / limit),
                    params: req.query
                });
            });
        });
    },

    actionShow: function(req, res, next) {
        var category_id = req.params.category_id;
        var response = { success: false, msg: "Unable to show the Record!" };

        if (typeof category_id != 'undefined' && category_id != '') {
            categoryModel.singleCategory(category_id).then(function(result) {
                if (typeof result != 'undefined' && result != '') {
                    res.render('category/show', { category: result });
                } else {
                    res.redirect('/category/');
                }
            }).catch(function(error) {
                res.redirect('/category/');
            });
        } else {
            res.redirect('/category/');
        }
    },

    actionCreate: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('category/create', { response: response, params: params });
    },

    actionStore: function(req, res, next) {
        var response = { success: false, msg: "" };

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            response.msg = "Please enter category name";
            res.render('category/create', { response: response, params: req.body });
        } else {
            categoryModel.checkCategoryExists(req.body.name).then(function(result) {
                if (result.length > 0) {
                    response.msg = "Category '<b>" + req.body.name + "</b>' already exists!";
                    res.render('category/create', { response: response, params: req.body });
                } else {
                    var currentDate = category_controller.getCurrentDate();
                    var category = { name: req.body.name, created_at: currentDate };
                    categoryModel.addCategory(category).then(function(result) {
                        response.success = true;
                        response.msg = "Category added successfully!";
                        res.redirect('/category/');
                    }).catch(function(error) {
                        response.msg = "Unable to add new Category!";
                        res.render('category/create', { response: response, params: req.body });
                    });
                }
            });
        }
    },

    actionEdit: function(req, res, next) {
        var response = { success: false, msg: "" };
        var category_id = req.params.category_id;

        if (typeof category_id != 'undefined' && category_id != '') {
            categoryModel.singleCategory(category_id).then(function(result) {
                res.render('category/edit', { category: result, response: response });
            });
        } else {
            res.redirect('/category/');
        }
    },

    actionUpdate: function(req, res, next) {
        var response = { success: false, msg: "" };
        var category_id = req.params.category_id;
        var category = {};

        categoryModel.singleCategory(category_id).then(function(result) {
            category = result;
        });

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            response.msg = "Please enter category name";
            res.render('category/edit', { response: response, category: category });
        } else {
            categoryModel.checkCategoryExists(req.body.name, category_id).then(function(result) {
                if (result.length > 0) {
                    response.msg = "Category '<b>" + req.body.name + "</b>' already exists!";
                    res.render('category/edit', { response: response, params: req.body, category: category });
                } else {
                    var currentDate = category_controller.getCurrentDate();
                    var categoryData = { name: req.body.name, status: req.body.status, updated_at: currentDate };
                    categoryModel.updateCategory(categoryData, category_id).then(function(result) {
                        response.success = true;
                        response.msg = "Category updated successfully!";
                        res.redirect('/category/');
                    }).catch(function(error) {
                        response.msg = "Unable to update Category!";
                        res.render('category/edit', { response: response, params: req.body, category: category });
                    });
                }
            });
        }
    },

    actionDelete: function(req, res, next) {
        var response = { success: false, msg: "" };
        var category_id = req.params.category_id;

        categoryModel.deleteCategory(category_id).then(function(result) {
            if (result) {
                response.success = true;
                response.msg = "Category deleted successfully";
                res.json(response);
            } else {
                response.msg = "Unable to delete the category!";
                res.json(response);
            }
        }).catch(function(error) {
            response.msg = "Unable to delete the category!";
            res.json(response);
        });
    },

    getCurrentDate: function() {
        var date = new Date();
        var curmonth = (date.getMonth() + 1);
        if (curmonth < 10)
            curmonth = "0" + curmonth;
        var curDate = date.getDate();
        if (curDate < 10)
            curDate = "0" + curDate;
        var dbdate = date.getFullYear() + "-" + curmonth + "-" + curDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return dbdate;
    },

    actionFakeData: function(req, res, next) {
        for (var i = 0; i < 90; i++) {
            var currentDate = category_controller.getCurrentDate();
            var category = { name: faker.commerce.productName(), created_at: currentDate };

            categoryModel.addCategory(category).then(function(result) {
                console.log('Success:', result);
            }).catch(function(error) {
                console.log('Error:', error);
            });
        }

        res.redirect('/category/');
    }

}

module.exports = category_controller;