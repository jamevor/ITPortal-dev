$(document).ready(function() {


	var uploadField = document.getElementById("photoFile");
	uploadField.onchange = function() {

		if(uploadField.files[0].size > 2097152){
			$('#photoError').text("Your file is too Large").show();
			this.value = "";
		}else{
			if(uploadField.files[0].type != "image/png" && uploadField.files[0].type != "image/jpeg" ){
				$('#photoError').text("Your file must be a JPG or PNG").show();
				uploadField.value = "";
			}else{
				$('#photoError').hide();
				document.getElementById('imagePreview').src = window.URL.createObjectURL(uploadField.files[0])
				$('#imagePreview').fadeIn();
			}
		};
	};

	$('#quote').on("input", function(){
		var maxlength = $(this).attr("maxlength");
		var currentLength = $(this).val().length;
	
		if( currentLength >= maxlength ){
			$('#lenCounter').text("You have reached the maximum number of characters.");
		}else{
			$('#lenCounter').text(currentLength + "/260 chars");
		}
	});
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;

		var formData = new FormData();
		formData.append('file', $('#photoFile')[0].files[0]);

		if( error == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
						const formDataFields = {	
							source: window.location.href,
							type: 'Commencement Virtual Upload',
							status: $("#status").val(),
							busObRecId: $("#busObRecId").val(),
							busObPublicId: $("#busObPublicId").val(),
							fileSize: $('#photoFile')[0].files[0].size || "",
							quote: $("#quote").val(),
							WPIID: $('#wpi-id').text(),
						};
						formData.append('fields',JSON.stringify(formDataFields))
						$.ajax(
							{
								url: '/api/v1/cherwell/commencementVirtual/update/one/',
								method: 'POST',
								processData: false,
        						contentType: false,
								data: formData,
								beforeSend: function() {
									$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
								},
								success: function() {
									$('#toast-save-success').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Submit Commencement Virtual Participant Form');
									setTimeout(function(){
										window.location.replace("https://hub.wpi.edu");
									},400)
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Submit Commencement  Virtual Participant Form');
								}
							}
						);
			}
		};

		
	});
})