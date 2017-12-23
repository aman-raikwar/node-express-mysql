var path = window.location.origin + window.location.pathname;
var idParam = params.id;
var categoryParam = params.category;
var nameParam = params.name;
var statusParam = params.status;
var orderColumnParam = params.orderColumn;
var orderByParam = params.orderBy;

$(function() {

    $(document).on('click', '.sort', function() {
        orderColumnParam = $(this).data('type');
        orderByParam = $(this).data('sort');
        window.location.href = path + getParams();
    });

    $(document).on('click', '.reset-search', function() {
        window.location.href = window.location.origin + window.location.pathname;
    });

    $(document).on('click', '.delete-skill', function() {
        var skill_id = $(this).data('skill');
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this record!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {
            $.ajax({
                url: '/skill/delete/' + skill_id,
                type: 'DELETE',
                success: function(response) {
                    if (response.success) {
                        swal("Deleted!", response.msg, "success");
                        $('.row-' + skill_id).remove();
                    } else {
                        swal("Deleted!", response.msg, "error");
                    }
                }
            });
        });
    });

    $(document).on('keypress', '.id-change', function(e) {
        if (e.keyCode == 13) {
            idParam = $(this).val();
            window.location.href = path + getParams();
        }
    });

    $(document).on('change', '.category-change', function(e) {
        categoryParam = $(this).val();
        window.location.href = path + getParams();
    });

    $(document).on('keypress', '.name-change', function(e) {
        if (e.keyCode == 13) {
            nameParam = $(this).val();
            window.location.href = path + getParams();
        }
    });

    $(document).on('change', '.status-change', function() {
        statusParam = $(this).val();
        window.location.href = path + getParams();
    });

    getAllCategories();

});

function getAllCategories() {
    $.ajax({
        url: '/category/all-categories/',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                var html = '';
                var category = $('#category').data('category');
                html += '<option value="0">Select Category</option>';
                $.each(response.data, function(index, item) {
                    var selected = category == item.id ? 'selected="selected"' : '';
                    html += '<option value="' + item.id + '" ' + selected + '>' + item.name + '</option>';
                });
                console.log(html);
                $('#category').html(html);
            }
        }
    });
}

function getParams() {
    var pathParams = '';

    if (typeof idParam != 'undefined' && idParam != '') {
        if (pathParams != '') {
            pathParams += '&name=' + idParam;
        } else {
            pathParams += '?name=' + idParam;
        }
    }

    if (typeof categoryParam != 'undefined' && categoryParam != '') {
        if (categoryParam != 0) {
            if (pathParams != '') {
                pathParams += '&category=' + categoryParam;
            } else {
                pathParams += '?category=' + categoryParam;
            }
        }
    }

    if (typeof nameParam != 'undefined' && nameParam != '') {
        if (pathParams != '') {
            pathParams += '&name=' + nameParam;
        } else {
            pathParams += '?name=' + nameParam;
        }
    }

    if (typeof statusParam != 'undefined' && statusParam != '') {
        if (pathParams != '') {
            pathParams += '&status=' + statusParam;
        } else {
            pathParams += '?status=' + statusParam;
        }
    }

    if (typeof orderColumnParam != 'undefined' && orderColumnParam != '' && typeof orderByParam != 'undefined' && orderByParam != '') {
        if (pathParams != '') {
            pathParams += "&orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
        } else {
            pathParams += "?orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
        }
    }

    return pathParams;
}