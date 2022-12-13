/*
	global NewsCard Foundation CarouselCell Flickity
*/

$(document).ready(function() {
	$.ajax({
		url: '/api/v1/meta-home/news/get',
		method: 'GET',
		success: function(data) {
			if (data && data.length) {
				let newsCard = new NewsCard(data[0], true);
				// $('.featured-news-card-wrapper').append(newsCard.render());
				// new Foundation.Interchange($('.featured-news-card-wrapper .news-card'));
				for (let i = 0; i < data.length; i++) {
					let newsCard = new NewsCard(data[i], false);
					$('.news-cards-wrapper').append(newsCard.render());
				}
			} else {
				// $('.featured-news-card-wrapper').parents('.swim-lane').first().hide();
			}
		},
		error: function(resp) {
			// $('.featured-news-card-wrapper').parents('.swim-lane').first().hide();
		}
	});

	$.ajax({
		url: '/api/v1/meta-home/featured-content/get',
		method: 'GET',
		success: function(data) {
			if (data && data.length) {
				for (let datum of data) {
					let backgroundPosition = datum.meta_home_featuredContentPosition ? datum.meta_home_featuredContentPosition.title : 'center';
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

	$.ajax({
		url: '/api/v1/meta-home/wpinews/get',
		method: 'GET',
		success: function(data) {
			if (data && data.rss && data.rss.channel && data.rss.channel.item) {

				const newsItems = data.rss.channel.item;

					var counterLimit = 0;
					for(let newsItem of newsItems){
						let dateStart = moment.utc(newsItem.pubDate, 'YYYY-MM-DD HH:mm:ss').format('ll');

						if(counterLimit < 4){
							const template = `

							<a class="wpi-news-item" href="${newsItem['link']}" target="_blank" rel="noopener">
								<div class="wpi-news-item-img" style="background-image:url('${newsItem['media:content']['@_url']}')"></div>
								<div class="wpi-news-item-content">
									<h3 class="wpi-news-item-title">${newsItem['title']}</h3>
									<p class="wpi-news-item-date">${dateStart}</p>
								</div>
							</a>
							`;
		
							$('.wpinews-cards-wrapper').append(template);
							counterLimit++
						}
					}

			} else {
				
			}
		},
		error: function(resp) {
			console.log("error");
			console.log(resp);

		}
	});

	$('.alert .close-button').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.alert').slideUp();
		$.ajax(
			{
				url: '/api/v1/session/update',
				method: 'PATCH',
				data: {
					alertClosed: true
				}
			}
		);
	});

});