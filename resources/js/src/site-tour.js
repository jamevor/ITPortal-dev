/* global introJs */
$(document).ready(function() {

	const intro = introJs();

	intro.setOptions(
		{
			steps: [
				{
					intro: 'Welcome to the Hüb'
				},
				{
					element: '#userMenuToggle',
					intro: 'This is you'
				},
				{
					intro: 'Thank you for coming to my Ted Talk'
				}
			]
		}
	);

	// intro.start();

});