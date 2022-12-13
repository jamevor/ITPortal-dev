$(document).ready(function() {
	// Extend Jquery to allow for containsi selector, for filtering case-insensitive
	$.extend($.expr[':'], {
		'containsi': function(elem, i, match) {
			return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
		}
	});

	const servicesFilterCallback = debounce(function(event) {
		event.preventDefault();
		doneTyping();
	}, 400);

	$('#filter-services').on('keyup', servicesFilterCallback);
});

const filterServices = () => {
	const catFilter = $('#filter-services').val().toLowerCase();
	if (typeof catFilter === 'string' && catFilter.length) {
		$('.service-catalog-portfolio').find('.cell').not(`:containsi("${catFilter}")`).hide();
		$('.service-catalog-portfolio').find('.cell').filter(`:containsi("${catFilter}")`).addClass('filtered');
		$('.service-catalog-portfolio').find('.service-catalog-box-list-item').filter(`:containsi("${catFilter}")`).addClass('filtered');
	}
};

const doneTyping = () => {
	resetServicesFilter();
	filterServices();
};

const resetServicesFilter = () => {
	$('.service-catalog-portfolio').find('.grid-x, .cell').show();
	$('.service-catalog-portfolio').find('.filtered').removeClass('filtered');
};

const debounce = (fn, time) => {
	let timeout;
	return function() {
		const functionCall = () => fn.apply(this, arguments);
		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};