$(document).ready(function() {

	// get 5 recently created articles
	$.ajax(
		{
			url: '/api/v1/article/get/many',
			method: 'GET',
			data: {
				sort: ['createdAt', 'desc'],
				limit: 5,
				attributes: ['id', 'title']
			},
			success: function(data) {
				for (const datum of data) {
					$('#recentlyCreatedArticles').append(renderArticleCard(datum));
				}

				// get 5 recently updated articles
				$.ajax(
					{
						url: '/api/v1/article/get/many',
						method: 'GET',
						data: {
							sort: ['updatedAt', 'desc'],
							limit: 5,
							attributes: ['id', 'title'],
							filterByColumn: [
								['updatedAt', 'ne', 'createdAt']
							],
							filterByValue: [
								['id', 'notIn', data.map(d => d.id)]
							]
						},
						success: function(data_) {
							for (const datum_ of data_) {
								$('#recentlyUpdatedArticles').append(renderArticleCard(datum_));
							}
						},
						error: function(resp_) {
							console.error({resp: resp_});
						}
					}
				);

			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);

	// get all articles A-Z
	$.ajax(
		{
			url: '/api/v1/article/get/many',
			method: 'GET',
			data: {
				sort: ['title', 'asc']
			},
			success: function(data) {
				for (const datum of data) {
					$('#allArticles').append(renderArticleCard(datum));
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

const renderArticleCard = article => {
	return `
    <li class="cell">
      <a class="article-card" href="/article/${article.id}">
        <h3 class="article-card-title">${article.title}</h3>
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