// Website Url
var path = window.location.origin + window.location.pathname;

// Search Params
var idParam = params.id;
var nameParam = params.name;
var statusParam = params.status;

// Order Column and Order By
var orderColumnParam = params.orderColumn;
var orderByParam = params.orderBy;

$(function() {

    $(document).on('click', '.sort', function() {
        orderColumnParam = $(this).data('type');
        orderByParam = $(this).data('sort');
        window.location.href = path + getParams();
    });

    $(document).on('click', '.reset-search', function() {
        window.location.href = path;
    });

    $(document).on('click', '.delete-category', function() {
        var category_id = $(this).data('category');
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
                url: '/category/delete/' + category_id,
                type: 'DELETE',
                success: function(response) {
                    if (response.success) {
                        swal("Deleted!", response.msg, "success");
                        $('.row-' + category_id).remove();
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

});

function getParams() {
    var pathParams = '';

    if (typeof idParam != 'undefined' && idParam != '') {
        pathParams += ((pathParams != '') ? '&id=' : '?id=') + idParam;
    }

    if (typeof nameParam != 'undefined' && nameParam != '') {
        pathParams += ((pathParams != '') ? '&name=' : '?name=') + nameParam;
    }

    if (typeof statusParam != 'undefined' && statusParam != '') {
        pathParams += ((pathParams != '') ? '&status=' : '?status=') + statusParam;
    }

    if (typeof orderColumnParam != 'undefined' && orderColumnParam != '' && typeof orderByParam != 'undefined' && orderByParam != '') {
        pathParams += (pathParams != '') ? "&orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam : "?orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
    }

    return pathParams;
}