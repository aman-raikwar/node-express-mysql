$(function() {

    $(document).on('click', '.sort', function() {
        var type = $(this).data('type');
        var sort = $(this).data('sort');

        var path = window.location.origin + window.location.pathname;
        var pathParams = '';

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

        if (pathParams != '') {
            pathParams += "&orderColumn=" + type + "&orderBy=" + sort;
        } else {
            pathParams += "?&orderColumn=" + type + "&orderBy=" + sort;
        }


        window.location.href = path + pathParams;
    });

    $(document).on('click', '.reset-search', function() {
        window.location.href = window.location.origin + window.location.pathname;
    });

    $(document).on('click', '.delete-category', function() {
        if (confirm("Are you sure you want to delete this Category?")) {
            var category_id = $(this).data('category');
            $.ajax({
                url: '/category/delete/' + category_id,
                type: 'DELETE',
                success: function(response) {
                    if (response.success) {
                        alert(response.msg);
                        $('.row-' + category_id).remove();
                    } else {
                        alert(response.msg);
                    }
                }
            });
        }
    });

    $(document).on('keypress', '.id-change', function(e) {
        if (e.keyCode == 13) {
            var id = $(this).val();

            var path = window.location.origin + window.location.pathname;
            var pathParams = '';

            if (typeof id != 'undefined' && id != '') {
                if (pathParams != '') {
                    pathParams += '&id=' + id;
                } else {
                    pathParams += '?id=' + id;
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

            window.location.href = path + pathParams;
        }
    });

    $(document).on('keypress', '.name-change', function(e) {
        if (e.keyCode == 13) {
            var name = $(this).val();

            var path = window.location.origin + window.location.pathname;
            var pathParams = '';

            if (typeof name != 'undefined' && name != '') {
                if (pathParams != '') {
                    pathParams += '&name=' + name;
                } else {
                    pathParams += '?name=' + name;
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

            window.location.href = path + pathParams;
        }
    });

    $(document).on('change', '.status-change', function() {
        var status = $(this).val();

        var path = window.location.origin + window.location.pathname;
        var pathParams = '';

        if (typeof nameParam != 'undefined' && nameParam != '') {
            if (pathParams != '') {
                pathParams += '&name=' + nameParam;
            } else {
                pathParams += '?name=' + nameParam;
            }
        }

        if (typeof status != 'undefined' && status != '') {
            if (pathParams != '') {
                pathParams += '&status=' + status;
            } else {
                pathParams += '?status=' + status;
            }
        }

        if (typeof orderColumnParam != 'undefined' && orderColumnParam != '' && typeof orderByParam != 'undefined' && orderByParam != '') {
            if (pathParams != '') {
                pathParams += "&orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
            } else {
                pathParams += "?orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
            }
        }

        window.location.href = path + pathParams;
    });

});