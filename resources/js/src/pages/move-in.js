jQuery(function() {

	function updateItems(data){
		$.each(data, function(index,value){
			let newCount = $('#item-'+ index + ' .limit').text() - value;

			$('#item-'+ index + ' .qty span').text(newCount);

			if(newCount > 0){
				$('#item-'+ index + 'input').prop("disabled", false);
				$('#item-'+ index).removeClass('disabled');
			}
			if(newCount <= 0){
				$('#item-'+ index + 'input').prop("disabled", true);
				$('#item-'+ index).addClass('disabled');
			}
		})
	}


	// setInterval(function(){

	// 	$.ajax(
	// 		{
	// 			url: '/api/v1/cherwell/move-in/get/all',
	// 			method: 'GET',
	// 			beforeSend: function() {
	// 				$('#update i').addClass('fa-pulse fa-spinner');
	// 				$('#update i').removeClass('fa-check-circle');
	// 			},
	// 			success: function(resp) {
	// 				$('#update i').removeClass('fa-pulse fa-spinner');
	// 				$('#update i').addClass('fa-check-circle');
	// 				updateItems(resp);
	// 			},
	// 			error: function(resp) {
	// 				$('#update i').removeClass('fa-pulse fa-spinner');
	// 				$('#update i').addClass('fa-times-circle');
	// 			}
	// 		}
	// 	);
	// }, 30000);
	$('#removeConfirm').on("click",function(event) {
		const formData = {
			source: window.location.href,
			type: 'Void Move-In',
			busObPublicId: $('#busObPublicId').text(),
			busObRecId: $('#busObRecId').text(),
			intentBusObPublicId: $('#intentBusObPublicId').text(),
			intentBusObRecId: $('#intentBusObRecId').text(),
		};

		$.ajax(
			{
				url: '/api/v1/cherwell/move-in/remove/one/',
				method: 'POST',
				data: {
					formData
				},
				beforeSend: function() {

				},
				success: function() {
					location.reload();
				},
				error: function(resp) {
					$('#toast-save-error').addClass('show');

				}
			}
		);
	})

	$('#button-submit-help-form').on("click",function(event) {
		event.preventDefault();

			if (!$('#button-submit-help-form').hasClass('disabled')) {
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {

						const formData = {
							source: window.location.href,
							type: 'Move-in',
							timeID: $('input[name=slots]:checked').val()
						};

						$.ajax(
							{
								url: '/api/v1/cherwell/move-in/create/one/',
								method: 'POST',
								data: {
									token,
									formData
								},
								beforeSend: function() {
									$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
									$('#submitError').hide();
								},
								success: function() {
									$('#toast-save-success').addClass('show');
									$('#button-submit-help-form').html('<i class=\'fas fa-check-circle\'></i>');
									setTimeout(() => {
										window.location = "/";
									}, 3000);
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').html('Submit Move-in Time');
									$('#button-submit-help-form').removeClass('disabled');
									$('#submitError').fadeIn();
									setTimeout(() => {
										location.reload();
									}, 3000);
								}
							}
						);
						
					});
				});
			}
		})
	})