/* global algoliasearch, instantsearch, gtag */
$(document).ready(function() {

	const searchClient = algoliasearch('ND7V55YXIV', '31d0312b16520769b2821ada86ee080f');
	const search = instantsearch({
		indexName: $('#algolia-index').val(),
		searchClient,
		routing: true
	});

	search.addWidgets([
		instantsearch.widgets.searchBox({
			container: '#searchbox',
			autofocus: true,
			showSubmit: false,
			placeholder: 'Search the ITS Website...'
		}),
		instantsearch.widgets.infiniteHits({
			container: '#hits',
			templates: {
				item: `
              <a class="cell box card small-12 results-card" style="border-left:6px solid #{{ color}}" href="{{ link }}">
                  <div class="grid-x">
                      <div class="cell small-3 medium-2 large-2 results-card-icon"><i class="fal fa-2x {{ icon }}" style="color:#{{ color }}"></i>  </div>
                      <div class="cell small-9 medium-10 large-10 results-card-details">
                          <p class="results-card-details-type">{{ type }}</p>
                          <h3>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</h3>
						  <ul class="tags">
						  {{#metadata.tags}}
						    <li class="tag">{{.}}</li>
						  {{/metadata.tags}}
						  </ul>					  
                      </div>
                  </div>
              </a>
              `,
			}
		}),
		instantsearch.widgets.voiceSearch({
			container: '#voicesearch',
			templates: {
				status({ isListening, transcript }) {
					const className = isListening ? 'listening' : 'not-listening';
					return `
		<div class="${className}">
		  <span>${transcript ? transcript : ''}</span>
		</div>
	  `;
				},
			}
		}),
		instantsearch.widgets.refinementList({
			container: '#refinement-type',
			attribute: 'type',
			sortBy: ['count:desc', 'name:asc'],
			limit: 15
		}),
		instantsearch.widgets.refinementList({
			container: '#refinement-tag',
			attribute: 'metadata.tags',
			sortBy: ['count:desc', 'name:asc'],
			searchable: true,
			searchablePlaceholder: 'Search tags',
			showSubmit: false,
			showMore: true,
			limit: 5
		}),
		instantsearch.widgets.refinementList({
			container: '#refinement-audience',
			attribute: 'metadata.audiences',
			sortBy: ['count:desc', 'name:asc']
		}),
		instantsearch.widgets.refinementList({
			container: '#refinement-alias',
			attribute: 'metadata.aliases',
			sortBy: ['count:desc', 'name:asc']
		}),
		instantsearch.widgets.currentRefinements({
			container: '#current-refinements'
		}),
		instantsearch.widgets.stats({
			container: '#stats'
		}),

	]
	);
	search.start();

});