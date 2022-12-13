$(document).ready(function() {
	const container = '#widget-myApps,#widget-myApps--dashboard';
	$.ajax(
		{
			url: '/api/v1/me/app/get/favorites',
			method: 'GET',
			success: function(apps) {
				renderApps(apps);
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);

	function renderApps(apps) {
		let result = '<div class="app-tray">';
		for (const myApp of apps) {
			result += `<a href="${myApp.link}" target="_blank" class="app-link">
				<div class="app">
					<div class="img" style="background-image:url('${myApp.imageSrc || '/img/ico-intro.svg'}')">
					</div>
					<div class="title">${myApp.title}</div>
				</div>
			</a>`;
		}
		if (apps.length <= 3) {
			result += `<a href="/Me/My-Apps" target="_blank" class="app-link app-more" title="Add More Apps">
				<i class="fas fa-plus-circle"><span class="show-for-sr">Add More Apps</span></i>
			</a>`;
		}
		result += '</div>';
		$(container).append(result);
	}
});
