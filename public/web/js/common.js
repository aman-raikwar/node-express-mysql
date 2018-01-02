$(function() {

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
                html += '<option value="">Select Category</option>';
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