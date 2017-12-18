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
        var message = "Unable to show the Record!";

        if (typeof category_id != 'undefined' && category_id != '') {
            categoryModel.singleCategory(category_id).then(function(result) {
                if (typeof result != 'undefined' && result != '') {
                    res.render('category/show', { category: result });
                } else {
                    req.flash('icon', 'error');
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.redirect('/category/');
                }
            }).catch(function(error) {
                req.flash('icon', 'error');
                req.flash('type', 'danger');
                req.flash('message', message);
                res.redirect('/category/');
            });
        } else {
            req.flash('icon', 'error');
            req.flash('type', 'danger');
            req.flash('message', message);
            res.redirect('/category/');
        }
    },

    actionCreate: function(req, res, next) {
        var params = req.body;
        req.flash('icon', '');
        req.flash('type', '');
        req.flash('message', '');
        res.render('category/create', { params: params });
    },

    actionStore: function(req, res, next) {
        var message = "";

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            message = "Please enter category name";
            req.flash('icon', 'error');
            req.flash('type', 'danger');
            req.flash('message', message);
            res.render('category/create', { params: req.body });
        } else {
            categoryModel.checkCategoryExists(req.body.name).then(function(result) {
                if (result.length > 0) {
                    message = "Category '<b>" + req.body.name + "</b>' already exists!";
                    req.flash('icon', 'error');
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.render('category/create', { params: req.body });
                } else {
                    var currentDate = category_controller.getCurrentDate();
                    var category = { name: req.body.name, created_at: currentDate };
                    categoryModel.addCategory(category).then(function(result) {
                        message = "Category added successfully!";
                        req.flash('type', 'success');
                        req.flash('icon', 'success');
                        req.flash('message', message);
                        res.redirect('/category/');
                    }).catch(function(error) {
                        message = "Unable to add new Category!";
                        req.flash('type', 'danger');
                        req.flash('icon', 'error');
                        req.flash('message', message);
                        res.render('category/create', { params: req.body });
                    });
                }
            });
        }
    },

    actionEdit: function(req, res, next) {
        var category_id = req.params.category_id;

        if (typeof category_id != 'undefined' && category_id != '') {
            categoryModel.singleCategory(category_id).then(function(result) {
                res.render('category/edit', { category: result });
            });
        } else {
            var message = "Unable to edit Category!";
            req.flash('type', 'danger');
            req.flash('icon', 'error');
            req.flash('message', message);
            res.redirect('/category/');
        }
    },

    actionUpdate: function(req, res, next) {
        var message = "";
        var category_id = req.params.category_id;
        var category = {};

        categoryModel.singleCategory(category_id).then(function(result) {
            category = result;
        });

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            message = "Please enter category name";
            req.flash('type', 'danger');
            req.flash('icon', 'error');
            req.flash('message', message);
            res.render('category/edit', { category: category });
        } else {
            categoryModel.checkCategoryExists(req.body.name, category_id).then(function(result) {
                if (result.length > 0) {
                    message = "Category '<b>" + req.body.name + "</b>' already exists!";
                    req.flash('type', 'danger');
                    req.flash('icon', 'error');
                    req.flash('message', message);
                    res.render('category/edit', { response: response, params: req.body, category: category });
                } else {
                    var currentDate = category_controller.getCurrentDate();
                    var categoryData = { name: req.body.name, status: req.body.status, updated_at: currentDate };
                    categoryModel.updateCategory(categoryData, category_id).then(function(result) {
                        message = "Category updated successfully!";
                        req.flash('type', 'success');
                        req.flash('icon', 'success');
                        req.flash('message', message);
                        res.redirect('/category/');
                    }).catch(function(error) {
                        message = "Unable to update Category!";
                        req.flash('type', 'danger');
                        req.flash('icon', 'error');
                        req.flash('message', message);
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
                response.msg = "Your category record has been deleted.";
                res.json(response);
            } else {
                response.msg = "Unable to delete this category!";
                res.json(response);
            }
        }).catch(function(error) {
            response.msg = "Unable to delete this category!";
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