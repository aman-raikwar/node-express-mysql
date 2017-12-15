$(function(){	 
	
	function checkIsEmailExist(){
		$.ajax({
      url: "/invitees/check_email/",
      type: "POST",
      data: "email="+$("#register_email").val,      
      beforeSend: function(){
        $("#myloading").show();
        $('#show-msg').html("");        
      },
      success: function(response) {
        $("#myloading").hide();
        if(response.success){          
          $("button#submit").removeClass("disabled");
        } else {
          $('#show-msg').attr('class','alert alert-danger');
          $('#show-msg').html(response.msg);
          if(response.no_email_exists){
          	$('div.hide-first').show();          	
          }
        }                
      },
      error: function(){
        $("#myloading").hide();
      }
    });      
	}
});