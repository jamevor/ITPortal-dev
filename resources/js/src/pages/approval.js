/* global grecaptcha */
let buttonReopenAddUpdateText;
$(document).ready(function() {

	$('.approval-buttons a').click(function(event) {
		event.preventDefault();

		let dataStatus = $(this).data("value");
		let dataRecID = $("#recID").text();
		let dataPublicID = $("#publicID").text();
		const formData = {
			status: dataStatus,
			note: $("#notes").val(),
			busObRecId: dataRecID,
			busObPublicId: dataPublicID
		};
		console.log(dataStatus)
		grecaptcha.ready(function() {
			grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_add_ticket_update'}).then(function(token) {

				$.ajax(
					{
						url: '/api/v1/cherwell/Approval/update/one/',
						method: 'POST',
						data: {
							token,
							formData
						},
						beforeSend: function() {
							$("#approvalBox").fadeOut()
						},
						success: function() {

						},
						error: function() {
							$("#approvalBox").show()
						}
					}
				);
			})
		})

	});
});
