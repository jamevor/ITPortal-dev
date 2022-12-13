/* global NewsCard, SimpleBar, CarouselCell, Flickity */
$(document).ready(function() {

	$.ajax({
		url: `/api/v1/subsite/${$('#subsite-id').val()}/featured-content/get`,
		method: 'GET',
		success: function(data) {
			if (data && data.length) {
				for (let datum of data) {
					let backgroundPosition = datum.subSiteFeaturedContentPosition ? datum.subSiteFeaturedContentPosition.title : 'center';
					let f = new CarouselCell(datum.title, datum.fileUploadURL, datum.link, backgroundPosition);
					$('.featured-content').append(f.render());
				}
				if (data.length > 2) {
					new Flickity('.featured-content', {
						wrapAround: true,
						pageDots: false,
						accessibility: false
					});
				} else {
					$('.featured-content').css({'opacity': 1, 'height': 'auto'});
				}
			} else {
				$('.featured-content').parents('.swim-lane').first().hide();
			}
		},
		error: function(resp) {
			$('.featured-content').parents('.swim-lane').first().hide();
		}
	});

	$('.gizzy-data').each(function() {
		const URI = $(this).data('gizmouri');
		loadGizzy(this, URI);
	});

});

const renderArticles = (el, data) => {
	for (const article of data.data) {
		$(el).append(`<a class="gizzy-data-item" href="/article/${article.id}" target="_blank">
			<div class="gizzy-data-title">${article.title}</div>
		</a>`);
	}
};

const renderSpreads = (el, data) => {
	for (const spread of data.data) {

		let backgroundImg = (spread.image && spread.image.guidPublic) ? `background-image:url('/file-upload/${spread.image.guidPublic}')` : ""
		$(el).append(`<a class="gizzy-data-item" style="${backgroundImg}" href="/spread/${spread.id}" target="_blank">
			<div class="gizzy-data-title">${spread.title}</div>
		</a>`);
	}
};

const renderNews = (el, data) => {
	let firstNewsClassList = 'auto gizzy-data-item';
	if (data.data.length % 2 === 1) {
		firstNewsClassList += ' oddNumber';
	}
	$(el).append(new NewsCard(data.data[0], false, firstNewsClassList).render());
	for (let i = 1; i < data.data.length; i++) {
		const news = data.data[i];
		$(el).append(new NewsCard(news, false, 'auto gizzy-data-item').render());
	}
};

const renderServices = (el, data) => {
	$(el).append('<ul class="card-list no-indent grid-x grid-margin-x small-up-2 medium-up-2 large-up-3 component-cards-wrapper"></ul>');
	for (const service of data.data) {
		$(el).children('ul').append(`<li class="cell component-card-item">
			<a class="service-card" href="/service/${service.id}" target="_blank">
				<i class="service-card-icon fas ${service.icon}"></i>
				<h3 class="service-card-title">${service.title}</h3>
			</a>
		</li>`);
	}
};

const renderComponents = (el, data) => {
	$(el).append('<ul class="card-list no-indent grid-x grid-margin-x small-up-2 medium-up-2 large-up-3 component-cards-wrapper"></ul>');
	for (const component of data.data) {
		$(el).children('ul').append(`<li class="cell component-card-item">
			<a class="service-card" href="/component/${component.id}" target="_blank">
				<i class="service-card-icon fas ${component.icon}"></i>
				<h3 class="service-card-title">${component.title}</h3>
			</a>
		</li>`);
	}
};

const renderLocations = (el, data) => {
	$(el).append('<ul class="card-list no-indent grid-x grid-margin-x small-up-2 medium-up-2 large-up-3 locations-wrapper"></ul>');
	for (const location of data.data) {
		$(el).children('ul').append(`<li class="cell location-item">
			<a class="location-card" href="/location/${location.id}" target="_blank">
				<i class="location-card-icon fas ${location.locationType.icon}"></i>
				<h3 class="location-card-title">${location.title}</h3>
				<p class="location-card-room">${location.room}</p>
			</a>
		</li>`);
	}
};

const renderServers = (el, data) => {
	$(el).append('<ul class="card-list no-indent grid-x grid-margin-x small-up-2 medium-up-2 large-up-3 locations-wrapper"></ul>');
	for (const server of data.data) {
		$(el).children('ul').append(`<li class="cell location-item">
			<a class="location-card" href="/server/${server.id}" target="_blank">
				<i class="location-card-icon fas fa-server"></i>
				<h3 class="location-card-title">${server.title}</h3>
				<p class="location-card-room">${server.host}</p>
			</a>
		</li>`);
	}
};

const renderSoftware = (el, data) => {
	for (const software of data.data) {
		$(el).append(`<a class="gizzy-data-item" href="/software/${software.id}" target="_blank">
			<div class="gizzy-data-title">${software.title}</div>
			<div class="gizzy-data-sub">${software.version}</div>
			<div class="gizzy-data-icons">${software.softwareOs.map(os => `<i class="fab ${os.icon}"><span class="show-for-sr">${os.title}</span></i>`).join('')}</div>
		</a>`);
	}
};

const renderList = (el, data) => {
	$(el).append('<ul class="card-list compact"></ul>');
	for (const listItem of data.data) {
		$(el).children('ul').append(`<li>
			<a class="article-card" href="/${data.gizmoType}/${listItem.id}" target="_blank">
				<p class="article-card-title">${listItem.title}</p>
			</a>
		</li>`);
	}
};

const loadGizzy = (el, URI) => {
	$.ajax(
		{
			url: URI,
			method: 'GET',
			success: function(data) {
				if (data.displayMode === 'list') {
					renderList(el, data);
				} else {
					switch (data.gizmoType) {
					case 'article':
						renderArticles(el, data);
						break;
					case 'spread':
						renderSpreads(el, data);
						break;
					case 'news':
						renderNews(el, data);
						break;
					case 'service':
						renderServices(el, data);
						break;
					case 'component':
						renderComponents(el, data);
						break;
					case 'location':
						renderLocations(el, data);
						break;
					case 'server':
						renderServers(el, data);
						break;
					case 'software':
						renderSoftware(el, data);
						break;
					// case 'app':
					// 	renderApp(el, data);
					// 	break;
					// case 'action':
					// 	renderAction(el, data);
					// 	break;
					}
				}
				setTimeout(function() {
					let height = $(el).closest('.gizzy').outerHeight() - $(el).siblings('.gizzy-content').outerHeight();
					$(el).css('height', height + 'px');
					new SimpleBar(el);
				}, 0);
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);
};
