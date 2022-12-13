"use strict";

/* global algoliasearch, instantsearch, gtag */
$(document).ready(function () {
  var searchClient = algoliasearch('ND7V55YXIV', '31d0312b16520769b2821ada86ee080f');
  var search = instantsearch({
    indexName: $('#algolia-index').val(),
    searchClient: searchClient,
    routing: true
  });
  search.addWidget(instantsearch.widgets.searchBox({
    container: '#searchbox',
    autofocus: true,
    showSubmit: false,
    placeholder: 'Search the ITS Website...'
  }));

  if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && 'mediaDevices' in navigator) {
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(function () {
      search.addWidget(instantsearch.widgets.voiceSearch({
        container: '#voicesearch',
        templates: {
          status: function status(_ref) {
            var isListening = _ref.isListening,
                transcript = _ref.transcript;
            var className = isListening ? 'listening' : 'not-listening';
            return "\n                <div class=\"".concat(className, "\">\n                  <span>").concat(transcript ? transcript : '', "</span>\n                </div>\n              ");
          }
        }
      }));
    }).catch(function () {});
    document.querySelector('#voicesearch').style.display = 'block';
  }

  search.addWidget(instantsearch.widgets.infiniteHits({
    container: '#hits',
    templates: {
      item: "\n              <a class=\"cell box card small-12 results-card\" style=\"border-left:6px solid #{{ color}}\" href=\"{{ link }}\">\n                  <div class=\"grid-x\">\n                      <div class=\"cell small-3 medium-2 large-2 results-card-icon\"><i class=\"fal fa-2x {{ icon }}\" style=\"color:#{{ color }}\"></i>  </div>\n                      <div class=\"cell small-9 medium-10 large-10 results-card-details\">\n                          <p class=\"results-card-details-type\">{{ type }}</p>\n                          <h3>{{#helpers.highlight}}{ \"attribute\": \"title\" }{{/helpers.highlight}}</h3>\n                      </div>\n                  </div>\n              </a>\n              "
    }
  }));
  search.addWidget(instantsearch.widgets.refinementList({
    container: '#refinement-type',
    attribute: 'type',
    sortBy: ['count:desc', 'name:asc'],
    limit: 15
  }));
  search.addWidget(instantsearch.widgets.refinementList({
    container: '#refinement-tag',
    attribute: 'metadata.tags',
    sortBy: ['count:desc', 'name:asc'],
    searchable: true,
    searchablePlaceholder: 'Search tags',
    showSubmit: false,
    showMore: true,
    limit: 5
  }));
  search.addWidget(instantsearch.widgets.refinementList({
    container: '#refinement-audience',
    attribute: 'metadata.audiences',
    sortBy: ['count:desc', 'name:asc']
  }));
  search.addWidget(instantsearch.widgets.refinementList({
    container: '#refinement-alias',
    attribute: 'metadata.aliases',
    sortBy: ['count:desc', 'name:asc']
  }));
  search.addWidget(instantsearch.widgets.currentRefinements({
    container: '#current-refinements'
  }));
  search.addWidget(instantsearch.widgets.stats({
    container: '#stats'
  }));
  search.addWidget(instantsearch.widgets.analytics({
    pushFunction: function pushFunction(formattedParameters, state, results) {
      gtag('event', 'search', {
        'search_term': state.query,
        'facet_params': formattedParameters,
        'hits': results.nbHits
      });
    }
  }));
  search.addWidget(instantsearch.widgets.sortBy({
    container: '#sort-by',
    items: [{
      label: 'Featured',
      value: 'Portal_prod'
    }, {
      label: 'Date Modified',
      value: 'Portal_prod_dateModify'
    }, {
      label: 'Date Created',
      value: 'Portal_prod_dateCreate'
    }]
  }));
  search.start();
});