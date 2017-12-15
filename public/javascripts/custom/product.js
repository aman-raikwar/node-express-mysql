var tableProduct = "";
var deleteArrayOfImage = [];
$(function() {
    var object_messages = [];

  /******************************Product form validate ****************************************/
  var validator = $("#prodcut_add_form").validate({
    messages: {
    },
    submitHandler: function(form) {
      var frm = $(form);
      $("#deleteImageArray").val(deleteArrayOfImage.toString());
      var formData = new FormData(frm[0]);
      var images = $("#files").get(0).files;
      $.ajax({
        url: "/product/add",
        type: "POST",
        data: formData,
        contentType: false,
        cache: false,
        processData: false,

        beforeSend: function() {
          $("#myloading").show();
          $('#show-msg').html("");
        },
        success: function(response) {
          $("#myloading").hide();
          if (response.success) {
              $('#show-msg').attr('class', 'alert alert-success');
              $(form)["0"].reset();
          } else {
              $('#show-msg').attr('class', 'alert alert-danger');
          }
          $("#result").empty();
          $('#show-msg').html(response.msg);
          setTimeout(function() {
              $('#show-msg').fadeOut('fast');
          }, 6000);
          tableProduct.fnStandingRedraw();
          $(".quantity-table").hide();
          $(".edit_product_heading").hide();
          $(".add_product_heading").show();
          refreshButton();
          tabSwitchFunction("basicDetails");
        },
        error: function() {
          $("#myloading").hide();
        }
      });
    }
  });
  /***************************************************************************************/
    loadProductCompnies();
  /*******************************Get all Compnies list *************************************/
  function loadProductCompnies() {
    $.ajax({
      url: "/company/get_all",
      type: "GET",
      beforeSend: function() {
        $("#myloading").show();
      },
      success: function(response) {
        $("#myloading").hide();
        if (response.success) {
          $.each(response.data, function(key, company) {
            $("#company").append(
                $('<option></option>').val(company.id).html(company.name)
            );
          });
          if (response.current_company) {
            $("#company").val(response.current_company.id);
          }
        }
        $("#company_dropdown").selectpicker('refresh');
      },
      error: function() {
        $("#myloading").hide();
      }
    });
  }
  /***************************************************************************************/
  
  $('.btnPrevious').click(function() {
    $('.nav-tabs > .active').prev('li').find('a').trigger('click');
  });

  $('#refresh').click(function(event) {
    event.preventDefault();
    refreshButton();
  });

  function refreshButton() {
    $('#prodcut_add_form')[0].reset();
    $("#result").empty();
    $("#product_desc").val("");
    $(".quantity-table").hide();
    $(".add_product_heading").show();
    $(".edit_product_heading").hide();
    tableProduct.fnStandingRedraw();
    $("#basic").text("Add Product");
  }
});


window.onload = function() {
  $(".quantity-table").hide();
  imageView();
  $('#remove_image').hide();

  function imageView() {
    if (window.File && window.FileList && window.FileReader) {
      var filesInput = document.getElementById("files");
      filesInput.addEventListener("change", function(event) {
      var output = document.getElementById("result");
      var files = this.files;
      var i = 0,
      len = files.length;
      (function readFile(n) {
          var reader = new FileReader();
          var f = files[n];
          reader.onload = function(e) {
            var div = document.createElement("div");
            div.className = "col-sm-6";
            div.innerHTML = "<input type=\"checkbox\" class=\"image-id\" value=\"upload\" name=" + f.name + f.size + f.type + "><img class='thumbnail' style= \"width: 100%; height: 100px !important;\" src='" + e.target.result + "'" +
                "title='" + f.name + "'/>";
            output.insertBefore(div, null);

            // if `n` is less than `len` , 
            // call `readFile` with incremented `n` as parameter
            if (n < len - 1) readFile(++n)
          };
          reader.readAsDataURL(f); // `f` : current `File` object
        }(i)); // `i` : `n` within immediately invoked function expression
      });
    }else {
      console.log("Your browser does not support File API");
    } 
  }

  // Initialize Datatables
  App.datatables();
  tableProduct = $('#prodcut-datatable').dataTable({
      "processing": true,
      "serverSide": true,
      language: {
          search: "_INPUT_",
          searchPlaceholder: "Search..."
      },
      "ajax": {
          "dataType": 'json',
          "type": "POST",
          "url": "/product/get-products",
      },
      "createdRow": function(row, data, dataIndex) {
        if (data.v_status == 0) {
            $(row).addClass('redClass');
        } else if (data.status == 0) {
            $(row).addClass('yallowClass');
        }
      },
      "columns": [ 
      {"data": "product_code"}, 
      {"data": "description"}, 
      {"data": "price"}, 
      {"data": "vat"}, 
      {
        "mRender": function(data, type, row) {
          return '<a class="btn btn-primary btn-xs" href="/product/edit/'+row.id+'" title="Edit" data-toggle="tooltip" row-id=' + row.id + ' ><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' + ' ' + '<a class="btn btn-danger btn-xs delete" title="Delete" data-toggle="tooltip" row-id=' + row.id + ' ><i class="fa fa-trash-o" aria-hidden="true"></i></a>'+' '+'<a href="/product/'+row.id+'" class="btn btn-primary btn-xs detail" title="product_detail" data-toggle="tooltip" row-id=' + row.id + ' ><i class="fa fa-list" aria-hidden="true"></i></a>';
      }
    }],
    columnDefs: [{
      orderable: false,
      targets: [0, 3]
    }],
    lengthMenu: [
      [10, 20, 30, -1],
      [10, 20, 30, 'All']
    ],
    'scrollCollapse': true,
    'ordering': true,
    'order': [
        [1, 'DESC']
    ],
    'searching': true,
    'paging': true
  });

  $(document).on("click", ".edit", function() {
    $(".validationError").hide();
    $("tr").removeClass("tr-backcolor");
    $(".quantity-table").show();
    var id = $(this).attr("row-id");
    $(this).closest("tr").addClass("tr-backcolor");
    $.ajax({
      url: "/product/get-product/" + id,
      type: "GET",
      beforeSend: function() {
        $("#myloading").show();
      },
      success: function(response) {
        $("#myloading").hide();
        if (response.success) {
          $(".add_product_heading").hide();
          $(".edit_product_heading").show();
          $("#basic").text("Edit Product");
          qutityListing(response.data.id);
          $('#product_id').val(response.data.id);
          $('#product_code').val(response.data.product_code);
          $('#product_desc').val(response.data.description);
          $('#price').val(response.data.price);
          $('#default_vat').val(response.data.default_vat);
          $('#category').val(response.data.category_id);
          $('#result').html("");
          var images = response.data.images.split(",");
          var imagesIds = response.data.ids.replace(/\s+/g, '');
          imagesIds = imagesIds.split(",");
          var output = document.getElementById("result");
          $('#result').html("");
          for (var i = 0; i < images.length; i++) {
            var div = document.createElement("div");
            div.className = "col-sm-6 image_" + imagesIds[i];
            div.innerHTML = "<input type=\"checkbox\" class=\"image-id\" value=" + imagesIds[i] + "><img class='thumbnail' style= \"width: 100%; height: 100px !important;\" src='/uploads/companies/"+response.data.company+"/products/"+response.data.id+'/images/thumb/'+ $.trim(images[i]) + "'" + "title=''/>";
            output.insertBefore(div, null);
          }
        }
      },
      error: function() {
        $("#myloading").hide();
      }
    });
  });

  function qutityListing(product_id) {
      App.datatables();
      $("#quantity_datatable").dataTable().fnDestroy();
      $('#quantity_datatable').dataTable({
          //"processing": true,
          "serverSide": true,
          language: {
              search: "_INPUT_",
              searchPlaceholder: "Search..."
          },
          "ajax": {
              "dataType": 'json',
              "type": "POST",
              "url": "/product/get-product-quantity/" + product_id,
          },
          "columns": [{
              "data": "action_type"
          }, {
              "data": "name"
          }, {
              "data": "quantity"
          }, ],
          'scrollCollapse': true,
          'ordering': true,
          'order': [
              [1, 'DESC']
          ],
          'searching': true,
          'paging': true
      });
  }

  $(document).on("click", "#remove_image", function() {
      
    var deleteConfirmMess = $("message#delete_confirm_mess").html(),
    labelYes = $("message#label_yes").html(),
    labelNo = $("message#label_no").html();
    bootbox.confirm({
      message: deleteConfirmMess,
      buttons: {
        confirm: {
          label: labelYes,
          className: 'btn-success'
        },
        cancel: {
          label: labelNo,
          className: 'btn-danger'
        }
      },
      callback: function(result) {
        if (result) {
          var image_id = "",i = 0;
          $('.image-id:checked').each(function() {
            var checkboxValue = $(this).val();
            if (checkboxValue == "upload") {
              deleteArrayOfImage.push($(this).attr("name"));
              $(this).closest(".col-sm-6").remove();
            } else {
              if (i == 0)
                image_id += checkboxValue;
              else
                image_id += "," + checkboxValue;
              i++;
            }
          });
          var ids = JSON.parse("[" + image_id + "]");
          $.each(ids, function(index, value) {
            $.ajax({
              url: "/product/image-delete/" + value,
              type: "DELETE",
              beforeSend: function() {
                $("#myloading").show();
                $('#show-msg').html("");
              },
              success: function(response) {
                $("#myloading").hide();
                if (response.success) {
                  $(".image_" + value).remove();
                  $("#remove_image").hide();
                } else {
                  var try_message = $("message#try_message").html();
                  bootbox.alert(try_message);
                }
              },
              error: function() {
                $("#myloading").hide();
              }
            });
          });
          $("#remove_image").css("display", "none");
        }
      }
      });
  });

  $(document).on("click", ".delete", function() {
      var product_id = $(this).attr("row-id");
      var deleteConfirmMess = $("message#delete_confirm_mess").html(),
      labelYes = $("message#label_yes").html(),
      labelNo = $("message#label_no").html();

      bootbox.confirm({
          message: deleteConfirmMess,
          buttons: {
            confirm: {
              label: labelYes,
              className: 'btn-success'
            },
            cancel: {
              label:labelNo,
              className: 'btn-danger'
            }
          },
          callback: function(result) {

              if (result) {
                  $.ajax({
                      url: "/product/delete/" + product_id,
                      type: "DELETE",
                      beforeSend: function() {
                          $("#myloading").show();
                          $('#show-msg').html("");
                      },
                      success: function(response) {
                          $("#myloading").hide();
                          if (response.success) {
                              tableProduct.fnStandingRedraw();
                              $("#refresh").trigger("click");
                          } else {
                              tableProduct.fnStandingRedraw();
                              var try_message = $("message#try_message").html();
                              bootbox.alert(try_message);
                          }
                      },
                      error: function() {
                          $("#myloading").hide();
                      }
                  });
              }
          }
      });
  });

  $(document).on("change", ".image-id", function() {
      $('#remove_image').hide();
      if ($('#result div:visible .image-id:checkbox:checked').length == 0) {
          $('#remove_image').hide();
      } else {
          $('#remove_image').show();
      }
  });

}

  $(document).on("focusout", ".firstTabInput", function() {

    if($( this ).val() == ""){
       $( this ).next('span').remove();
       var errorMessage = $("message#error_message").html();
       $( this ).after('<span class="validationError">'+$(this).attr('placeholder')+errorMessage+'</span>')
       returnValue = false;
    } else {
      $( this ).next('span').remove();
    }
  });

  function checkValidationForFirstTab() {
      var returnValue = true;
      $( ".firstTabInput" ).each(function( index ) {
        if($( this ).val() == ""){
          if($(this).prop('id') == "category" || $(this).prop('id') == "product_code"){
            return true;
          } 
          $( this ).next('span').remove();
          var errorMessage = $("message#error_message").html();
          $( this ).after('<span class="validationError">'+$(this).attr('placeholder')+errorMessage+'</span>')
         returnValue = false;
        } else {
          $( this ).next('span').remove();
        }
      });
      if(returnValue){
        //$('.nav-tabs a[href="#addAttachments"]').tab('show');
        tabSwitchFunction("addAttachments");
        return true;        
      }
      return false;
  }
  
  function checkValidationForSecondTab(){
    tabSwitchFunction("warehouse");
    return true;
    $(".fileError").hide();
    if ($('#result div:visible').length > 0) {
      // $('.nav-tabs a[href="#warehouse"]').tab('show');
      tabSwitchFunction("warehouse");
      return true;
    } else {
      $(".fileError").show();
      return false;
    }     
   }

  function saveForm(){
    var returnValue = true;
    $( ".thirdTabInput" ).each(function( index ) {
      if($( this ).val() == ""){
         $( this ).next('span').remove();
         var errorMessage = $("message#error_message").html();
         $( this ).after('<span class="validationError">'+$(this).attr('placeholder')+errorMessage+'</span>')
         returnValue = false;
      } else {
        $( this ).next('span').remove();
      }
    });
    if(returnValue){
      $( "#prodcut_add_form" ).submit();
      //refreshButton();
      tabSwitchFunction("basicDetails");
      //$('.nav-tabs a[href="#basicDetails"]').tab('show');  
      return true;  
    }
    return false;
  }

  function tabSwitchFunction(toTab){
    $(".nav li").removeClass("active");
    $("#"+toTab+"LI").addClass("active");
    $(".tabForPanel").css("display", "none");
    $("#"+toTab).css("display", "block");
  }

  function changeTab(tab){
    if(checkValidationForFirstTab() == true){
      if(tab == 'warehouse' && checkValidationForSecondTab() == true){            
        tabSwitchFunction(tab);
      }else {
        tabSwitchFunction("addAttachments");
      }
    }else {
      tabSwitchFunction("basicDetails");
    }
  }