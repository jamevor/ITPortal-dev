/* global grecaptcha */
$(document).ready(function() {
	var scroller = new SimpleBar($('.tos-terms-column')[0]);
	var element= scroller.getScrollElement();

	$(".simplebar-scrollbar").addClass("waiting");
	
	$('#nameSetter').foundation('open');

	const formUser = {};
	$('#setName').click(function(event) {
		event.preventDefault();
		
		if((!$('#name-first').val() || $('#name-first').val() == "") && (!$('#name-last').val() || $('#name-last').val() == "")){
			$('.name-error').fadeIn();
		}else{
		$('.name-error').hide();
		formUser.full = $('#name-first').val() + " " + $('#name-middle').val() + " " + $('#name-last').val();
		formUser.first = $('#name-first').val();
		formUser.middle = $('#name-middle').val();
		formUser.last = $('#name-last').val();
		setNameEverywhere(formUser);
		$('#nameSetter').foundation('close');
		return formUser;
		}
	});
	
	$("#agree").change(function() {

		if(this.checked) {
			$('.signed').text(formUser.full);
			$('.dated').text(moment().format("MMM D, YYYY, h:mm a"));
			formUser.signedDate = moment().toISOString();
			
			$('#sigBlock').fadeIn();
			$('#button-submit').prop('disabled', false);
		}else{
			$('.signed').text(null);
			$('.dated').text(null);
			
			$('#sigBlock').hide();
			$('#button-submit').prop('disabled', true);
		}
	});

	

	element.addEventListener('scroll', function(){
		
		$(".simplebar-scrollbar").removeClass("waiting");
		if($(element).scrollTop() + $(element).innerHeight() >= $(element)[0].scrollHeight -5) {
			$("#readySign").fadeIn();
			$(".tos-terms-column").addClass("scrolled");

		}else{
			$(".tos-terms-column").removeClass("scrolled");
		}
		
	})
	
	
	function setNameEverywhere(formUser){
		$('.signed').text(formUser.full);
		$('.name-drop').text(formUser.full);
		$('#name-print').val(formUser.full);
	}

	$('.name-drop').click(function(event) {
		event.preventDefault();
		$('#nameSetter').foundation('open');
	});


	$('#button-submit').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/covid-log',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									type: 'Vendor',
									name: formUser.full,
									phone: $('#phone').val() || "",
									email:$('#email').val() || "",
									isSigned: $('#agree').prop("checked"),
									dateSigned:formUser.signedDate || "",
									company: $('#company').val() || "",
									details: $('#details').val() || ""
								}
							},
							beforeSend: function(data) {
								$('#button-submit').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
								$('#readySign :input').prop('disabled', true);
							},
							success: function() {
								$('#toast-save-success').addClass('show');
								$('#button-submit').html('Submit Acknowledgement');
								$('#button-submit').prop('disabled', true);
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit').html('Submit Acknowledgement');
								$('#readySign :input').prop('disabled', false);
							}
						}
					);
				});
			});
		}
	});

});