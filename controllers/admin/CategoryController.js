var fs = require('fs');
var Category = require('../../models/Category');
var commonHelper = require('../../helper/common_helper.js');

var CategoryController = {

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

        Category.countCategory(searchParams).then(function(result) {
            total = result[0].total;

            Category.getCategories(limit, offset, searchParams, orderParams).then(function(result) {
                res.render('admin/category/index', {
                    categories: result,
                    current: page,
                    pages: Math.ceil(total / limit),
                    params: req.query,
                    user: req.user
                });
            });
        });
    },

    actionShow: function(req, res, next) {
        var category_id = req.params.category_id;
        var message = "Unable to show the Record!";

        if (typeof category_id != 'undefined' && category_id != '') {
            Category.singleCategory(category_id).then(function(result) {
                if (typeof result != 'undefined' && result != '') {
                    res.render('admin/category/show', { category: result, params: req.body, user: req.user });
                } else {
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.redirect('/admin/category/');
                }
            }).catch(function(error) {
                req.flash('type', 'danger');
                req.flash('message', message);
                res.redirect('/admin/category/');
            });
        } else {
            req.flash('type', 'danger');
            req.flash('message', message);
            res.redirect('/admin/category/');
        }
    },

    actionCreate: function(req, res, next) {
        var category = { name: '', status: '' };
        res.render('admin/category/create', { category: category, user: req.user });
    },

    actionStore: function(req, res, next) {
        var currentDate = commonHelper.getCurrentDateTime();
        var category = { name: req.body.name, status: parseInt(req.body.status), created_at: currentDate };
        Category.checkCategoryExists(category.name).then(function(result) {
            if (result.length > 0) {
                req.flash('type', 'danger');
                req.flash('message', "Category '<b>" + req.body.name + "</b>' already exists!");
                res.render('admin/category/create', { category: category, user: req.user });
            } else {
                Category.addCategory(category).then(function(result) {
                    req.flash('type', 'success');
                    req.flash('message', "Category added successfully!");
                    res.redirect('/admin/category/');
                }).catch(function(error) {
                    req.flash('type', 'danger');
                    req.flash('message', "Unable to add new Category!");
                    res.render('admin/category/create', { category: category, user: req.user });
                });
            }
        });
    },

    actionEdit: function(req, res, next) {
        var category_id = req.params.category_id;

        if (typeof category_id != 'undefined' && category_id != '') {
            Category.singleCategory(category_id).then(function(result) {
                res.render('admin/category/edit', { category: result, user: req.user });
            });
        } else {
            req.flash('type', "danger");
            req.flash('message', "Unable to edit Category!");
            res.redirect('/admin/category/');
        }
    },

    actionUpdate: function(req, res, next) {
        var category_id = req.params.category_id;
        var currentDate = commonHelper.getCurrentDateTime();
        var category = { name: req.body.name, status: req.body.status, updated_at: currentDate };

        Category.checkCategoryExists(req.body.name, category_id).then(function(result) {
            if (result.length > 0) {
                req.flash('type', 'danger');
                req.flash('message', "Category '<b>" + req.body.name + "</b>' already exists!");
                res.render('admin/category/edit', { category: category, user: req.user });
            } else {
                Category.updateCategory(category, category_id).then(function(result) {
                    req.flash('type', 'success');
                    req.flash('message', "Category updated successfully!");
                    res.redirect('/admin/category/');
                }).catch(function(error) {
                    req.flash('type', 'danger');
                    req.flash('message', "Unable to update Category!");
                    res.render('admin/category/edit', { category: category, user: req.user });
                });
            }
        });
    },

    actionDelete: function(req, res, next) {
        var response = { success: false, msg: "Unable to delete this category!" };
        var category_id = req.params.category_id;

        Category.deleteCategory(category_id).then(function(result) {
            if (result) {
                response = { success: true, msg: "Your category record has been deleted." };
            }
            res.json(response);
        }).catch(function(error) {
            res.json(response);
        });
    },

    actionAllCategories: function(req, res, next) {
        var response = { success: false, msg: "Unable to get categories!", data: [] };
        Category.getAllCategories().then(function(result) {
            if (result) {
                response = { success: true, msg: "Categories found!", data: result };
            }
            res.json(response);
        }).catch(function(error) {
            res.json(response);
        });
    }

}

module.exports = CategoryController;