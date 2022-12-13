/*
 global NewsCard Foundation
*/
var ALL_NEWS;
var CURSOR;

$(document).ready(function() {

	$.ajax({
		url: '/api/v1/news/get/all',
		method: 'GET',
		success: function(data) {
			if (data && data.length) {
				init(data);
			}
		},
		error: function(resp) {
			console.error(resp);
		}
	});


	$(window).scroll(function() {
		if (ALL_NEWS && ALL_NEWS.length && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
			if (CURSOR < ALL_NEWS.length) {
				// TODO debounce this and do something cute $('#newsCardsWrapper').append(`<div class='spintro'></div>`);
				// setTimeout(function() {
				$('.spintro').remove();
				const CURSOR_ = Math.min(ALL_NEWS.length, CURSOR + 20);
				for (let i = CURSOR; i < CURSOR_; i++) {
					const newsCard = new NewsCard(ALL_NEWS[i], false, 'small-12');
					$('#newsCardsWrapper').append(newsCard.render());
				}
				CURSOR = CURSOR_;
				// }, 3000);
			}
		}
	});


	// Extend Jquery to allow for containsi selector, for filtering case-insensitive
	$.extend($.expr[':'], {
		'containsi': function(elem, i, match) {
			return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
		}
	});

	const newsFilterCallback = debounce(function(event) {
		event.preventDefault();
		doneTyping();
	}, 400);

	$('#filter-news').on('keyup', newsFilterCallback);

});

const init = data => {

	ALL_NEWS = data; // store for later use on scroll

	const newsCard_1 = new NewsCard(data[0], true, 'auto');
	$('#featuredNewsCard1').append(newsCard_1.render());
	if (data.length >= 2) {
		const newsCard_2 = new NewsCard(data[1], true, 'auto');
		$('#featuredNewsCard2').append(newsCard_2.render());
	}
	new Foundation.Interchange($('#featuredNewsCard1 .news-card, #featuredNewsCard2 .news-card'));

	CURSOR = Math.min(data.length, 20);

	for (let i = 2; i < CURSOR; i++) {
		const newsCard = new NewsCard(data[i], false, 'small-12');
		$('#newsCardsWrapper').append(newsCard.render());
	}

};

const filterNews = (catFilter) => {
	if (ALL_NEWS && ALL_NEWS.length) {
		if (CURSOR < ALL_NEWS.length) {
			const CURSOR_ = ALL_NEWS.length;
			for (let i = CURSOR; i < CURSOR_; i++) {
				const newsCard = new NewsCard(ALL_NEWS[i], false, 'small-12');
				$('#newsCardsWrapper').append(newsCard.render());
			}
			CURSOR = CURSOR_;
		}
	}
	$('.service-catalog-portfolio').find('.news-card.small-12').not(`:containsi("${catFilter}")`).hide();
	$('.service-catalog-portfolio').find('.news-card.auto').not(`:containsi("${catFilter}")`).parents('.cell').hide();
};

const doneTyping = () => {
	resetNewsFilter();
	const catFilter = $('#filter-news').val().toLowerCase();
	if (typeof catFilter === 'string' && catFilter.length) {
		filterNews(catFilter);
	}
};

const resetNewsFilter = () => {
	$('.service-catalog-portfolio').find('.news-card.auto').parents('.cell').show();
	$('#featuredNewsCard1, #featuredNewsCard2, #newsCardsWrapper').children().remove();
	init(ALL_NEWS);
};

const debounce = (fn, time) => {
	let timeout;
	return function() {
		const functionCall = () => fn.apply(this, arguments);
		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};














