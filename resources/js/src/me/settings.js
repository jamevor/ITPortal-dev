$(document).ready(function() {
	$('input[name="theme"]').change(function() {
		const allThemes = $('input[name="theme"]').map((index, elt) => $(elt).val()).toArray();
		$('body').removeClass(allThemes);
		const selectedTheme = $('input[name="theme"]:checked').val();
		$('body').addClass(selectedTheme);
		updateSettings();
	});
	$('input[name="me-labels"]').change(function() {
		$('#meHeaderNav').toggleClass('show-labels');
		updateSettings();
	});
	$('input[name="textDisplay"],input[name="seasonalTheme"],input[name="user-color"]').change(function() {
		updateSettings();
	});
});

function updateSettings() {
	$.ajax({
		url: '/api/v1/user/settings/update',
		method: 'PATCH',
		data: {
			themePreference: $('input[name="theme"]:checked').val(),
			textDisplay: $('input[name="textDisplay"]:checked').val(),
			seasonalTheme: $('input[name="seasonalTheme"]:checked').val(),
			userPreferenceHue: $('input[name="user-color"]:checked').val(),
			meLabels: $('input[name="me-labels"]:checked').val()
		},
		success: function() {
			window.location.reload();
		}
	});
}