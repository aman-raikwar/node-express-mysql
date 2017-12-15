$(function(){	 

  var object_messages = {};

  $('#company_add_form, #company_edit_form').on('reset', function(e) {
    if($('#canvas').length > 0){
      var JcropAPI = $('#canvas').data('Jcrop');
      JcropAPI.destroy();
    }    
  });
    
  /** For Delete Company code **/   
  $("#delete_company_btn").click(function(e){
    e.preventDefault();
    bootbox.confirm({
      message: $("message#company_deleted_confirmation_msg").html(),
      buttons: {
        confirm: {
          label: $("message#label_yes_text").html(),
          className: 'btn-success'
        },
        cancel: {
          label: $("message#label_no_text").html(),
          className: 'btn-danger'
        }
      },
      callback: function (result) {                  
        if(result){
          $.ajax({
            url: "/company/delete/"+$("input#id").val(),
            type: "DELETE",            
            beforeSend: function(){
              $("#myloading").show();
              $('#show-msg').html("");
            },
            success: function(response) {
              $("#myloading").hide();            
              if(response.success){
                bootbox.alert($("message#company_deleted_success_msg").html(),function(){
                  window.location = "/dashboard";
                });
              } else {
                bootbox.alert($("message#general_error_try_again_msg").html());
              }              
            },
            error: function(){
              $("#myloading").hide();
            }
          });
        }          
      }
    });
  });

  /** For Edit Company code **/ 

  $("#change_company_logo").click(function(e){
    e.preventDefault();
    $("#logo").trigger("click");
  });

  $("#company_edit_form").validate({
    rules: {
      name: {
        required: true
      },        
      business_sector: {
        required: true,              
      },
      logo:{        
        filesize: 2097152
      }
    },
    messages: {
      name: $("message#company_name_required_msg").html(),
      business_sector: $("message#business_sector_required_msg").html(),
      logo: {
        filesize: $("message#image_size_limit_msg").html()
      }
    },
    submitHandler: function(form) {
      var formData = new FormData($("#company_edit_form")["0"]);
      
      if(canvas && canvas.toDataURL('image/png')){                
        var blob = dataURLtoBlob(canvas.toDataURL('image/png'));
        //---Add file blob to the form data
        formData.append("cropped_logo", blob);  
      }      

      $.ajax({
        url: "/company/update/"+$("input#id").val(),
        type: "POST",      
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function(){
          $("#myloading").show();
          $('#show-msg').html("");
        },
        success: function(response) {
          $("#myloading").hide();          
          if(response.success){
            $('#show-msg').attr('class','alert alert-success');
            $("#company_dropdown option:selected").text(response.data.name);
            //update current company changes to session
            setupCurrentCompany();
          } else {
            $('#show-msg').attr('class','alert alert-danger');
          }
          $('#show-msg').html(response.msg); 
          getFocusOn("#show-msg");
        },
        error: function(){
          $("#myloading").hide();
        }
      });      
    }
  });   

  /** For Add Company code **/ 

  $.validator.addMethod('filesize', function(value, element, param) {
    return this.optional(element) || (element.files[0].size <= param) 
  });

	$("#company_add_form").validate({
		rules: {
      name: {
        required: true
      },        
      business_sector: {
        required: true,              
      },
      logo:{
        required: true,                      
        filesize: 2097152
      }
    },
    messages: {
      name: object_messages["Company name is required"]? object_messages["Company name is required"] : "Company name is required",
      business_sector: object_messages["Company business sector is required"]? object_messages["Company business sector is required"] :  "Company business sector is required",
      logo: {
        required: object_messages["Please choose a image for logo"]? object_messages["Please choose a image for logo"] :  "Please choose a image for logo",        
        filesize: object_messages["File size could not ne more than 2 MB"]? object_messages["File size could not ne more than 2 MB"] :  "File size could not ne more than 2 MB"
      }      
    },
    submitHandler: function(form) {
      var formData = new FormData($("#company_add_form")["0"]);
      var blob = dataURLtoBlob(canvas.toDataURL('image/png'));
  
      //---Add file blob to the form data
      formData.append("cropped_logo", blob);
      $.ajax({
        url: "/company/add",
        type: "POST",      
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function(){
          $("#myloading").show();
          $('#show-msg').html("");
        },
        success: function(response) {
          $("#myloading").hide();        	
          if(response.success){
            $("#company_dropdown").append(
              $('<option></option>').val(response.data.insertId).html(response.data.name)
            );
            $('#show-msg').attr('class','alert alert-success');
            $("#company_add_form")["0"].reset();            
          } else {
            $('#show-msg').attr('class','alert alert-danger');
          }
          $('#show-msg').html(response.msg); 
          getFocusOn("#show-msg");
        },
        error: function(){
          $("#myloading").hide();
        }
      });      
		}
	});		

  var crop_max_width = 300;
  var crop_max_height = 300;
  var jcrop_api;
  var canvas;
  var context;
  var image;

  var prefsize;

  $("#logo").change(function() {
    loadImage(this);
  });  

  $("#cropbutton").click(function(e) {
    applyCrop();
  });
  $("#scalebutton").click(function(e) {
    var scale = prompt("Scale Factor:", "1");
    applyScale(scale);
  });
  $("#rotatebutton").click(function(e) {
    applyRotate();
  });
  $("#hflipbutton").click(function(e) {
    applyHflip();
  });
  $("#vflipbutton").click(function(e) {
    applyVflip();
  });  

  function loadImage(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      canvas = null;
      reader.onload = function(e) {
        image = new Image();
        image.onload = validateImage;
        image.src = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
      $("#image-btn-group").show();
    }   
  }

  function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {
        type: contentType
      });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
      type: contentType
    });
  }

  function validateImage() {
    if (canvas != null) {
      image = new Image();
      image.onload = restartJcrop;
      image.src = canvas.toDataURL('image/png');
    } else restartJcrop();
  }

  function restartJcrop() {
    if (jcrop_api != null) {
      jcrop_api.destroy();
    }
    $("#views").empty();
    $("#views").append("<canvas id=\"canvas\">");
    canvas = $("#canvas")[0];
    context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    $("#canvas").Jcrop({      
      onSelect: selectcanvas,
      onRelease: clearcanvas,
      boxWidth: crop_max_width,
      boxHeight: crop_max_height
    }, function() {
      jcrop_api = this;
    });
    clearcanvas();
  }

  function clearcanvas() {    
    prefsize = {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
    };
  }

  function selectcanvas(coords) {
    prefsize = {
      x: Math.round(coords.x),
      y: Math.round(coords.y),
      w: Math.round(coords.w),
      h: Math.round(coords.h)
    };
  }

  function applyCrop() {
    canvas.width = prefsize.w;
    canvas.height = prefsize.h;
    context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
    validateImage();
  } 


  //If update company page is opened than show image for corp directly
  if(window.location.pathname.indexOf('/company/update/') !== -1) {
    loadCompanyLogoImageForEdit($("input#id").val());
  }
  //End if update company page is opened than show image for corp directly

  function loadCompanyLogoImageForEdit(company_id){
    if($("message#company_logo_uri").length > 0){
      setCanvasImageByUrl($("message#company_logo_uri").html());  
    }       
  }

  /*  Set canvas image on update company */
  function setCanvasImageByUrl(url){
    image = new Image();
    image.onload = validateImage;
    image.src = url; 
  }

  //setup company function in session
  function setupCurrentCompany(cid = null) {
    if($("#company_dropdown").val()) {
      $.ajax({
        url: "/company/set_company/"+$("select#company_dropdown").val(),
        type: "GET",      
        beforeSend: function(){
          $("#myloading").show();        
        },
        success: function(response) {
          $("#myloading").hide();        
          if(response.success){            
            if( cid ){ //if cid is given call loadCompanyLogoImageForEdit func
              loadCompanyLogoImageForEdit(cid)
            } else {
              //check if the current url path for update company, if yes redirect to currently company
              var company_id = 0;
              if(window.location.pathname.indexOf('/company/update/') !== -1){
                company_id = window.location.pathname.replace('/company/update/','');            
                if(company_id != $("#company_dropdown").val()){
                  window.location = '/company/update/'+$("#company_dropdown").val();   
                }              
              }
            }            
          } else {
            console.log("company has not been settled successfully",response.errors);
          }
        },
        error: function(){
          $("#myloading").hide();
        }
      });
    }    
  } 

  function getFocusOn(selector){
    $('html, body').animate({
        scrollTop: $(selector).offset().top
    }, 1000);
  }
});