$(document).ready(function() {

	const form = $('#form').conversationalForm({
		context: document.getElementById('conversation-context'),
		userImage: 'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJ1c2VyLWFsdCIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLXVzZXItYWx0IGZhLXctMTYiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMjU2IDI4OGM3OS41IDAgMTQ0LTY0LjUgMTQ0LTE0NFMzMzUuNSAwIDI1NiAwIDExMiA2NC41IDExMiAxNDRzNjQuNSAxNDQgMTQ0IDE0NHptMTI4IDMyaC01NS4xYy0yMi4yIDEwLjItNDYuOSAxNi03Mi45IDE2cy01MC42LTUuOC03Mi45LTE2SDEyOEM1Ny4zIDMyMCAwIDM3Ny4zIDAgNDQ4djE2YzAgMjYuNSAyMS41IDQ4IDQ4IDQ4aDQxNmMyNi41IDAgNDgtMjEuNSA0OC00OHYtMTZjMC03MC43LTU3LjMtMTI4LTEyOC0xMjh6Ij48L3BhdGg+PC9zdmc+',
		robotImage: '/img/ico-intro.svg',
		showProgressBar: true,
		loadExternalStyleSheet: false,
		userInterfaceOptions: {
			controlElementsInAnimationDelay: 250,
			robot: {
				robotResponseTime: 100,
				chainedResponseTime: 400
			},
		},
		submitCallback: function() {
			const data = form.getFormData(true);
			form.addRobotChatResponse('Thanks! Give me just a moment while I submit your {cfc-confirm-issue}.');
			$.ajax(
				{
					url: '/api/v0/convo/submit',
					method: 'POST',
					data,
					beforeSend: function() {
						setTimeout(function() {
							form.addRobotChatResponse('<span class="typing-indicator"><span></span><span></span><span></span></span>');
						}, 400);
					},
					success: function() {
						setTimeout(function() {
							$('cf-chat-response.robot').last().remove();
							form.addRobotChatResponse('Your ticket number is <strong>123456</strong>');
						}, 2000);
					},
					error: function(resp) {
						setTimeout(function() {
							console.error(resp);
							$('cf-chat-response.robot').last().remove();
							form.addRobotChatResponse('Sorry! Something went wrong and I was unable to submit your {cfc-confirm-issue}.');
						}, 2000);
					}
				}
			);
		}
	});

});