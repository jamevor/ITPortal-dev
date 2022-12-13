$(document).ready(function() {

	$.ajax(
		{
			url: '/api/v1/subsite/get/public',
			method: 'GET',
			success: function(data) {
				for (const datum of data) {
					$('#allArticles').append(renderSubsiteCard(datum));
				}
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);

	// Extend Jquery to allow for containsi selector, for filtering case-insensitive
	$.extend($.expr[':'], {
		'containsi': function(elem, i, match) {
			return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
		}
	});


	const articlesFilterCallback = debounce(function(event) {
		event.preventDefault();
		doneTyping();
	}, 400);

	$('#filter-articles').on('keyup', articlesFilterCallback);

});

const renderSubsiteCard = subsite => {
	return `
    <li class="cell">
      <a class="article-card" href="/s/${subsite.id}">
        <h3 class="article-card-title">${subsite.title}</h3>
      </a>
    </li>
  `;
};

const filterArticles = () => {
	const catFilter = $('#filter-articles').val().toLowerCase();
	if (typeof catFilter === 'string' && catFilter.length) {
		$('#allArticles').find('.cell').not(`:containsi("${catFilter}")`).hide();
	}
};

const doneTyping = () => {
	resetArticlesFilter();
	filterArticles();
};

const resetArticlesFilter = () => {
	$('#allArticles').find('.cell').show();
};

const debounce = (fn, time) => {
	let timeout;
	return function() {
		const functionCall = () => fn.apply(this, arguments);
		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};