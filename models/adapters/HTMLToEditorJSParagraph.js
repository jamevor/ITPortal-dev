'use strict';
const sanitizeHTML = require('sanitize-html');
const config = require('../../config.js');

/**
 * @class HTMLToEditorJSParagraph
 * @description for stripping html tags and formatting as editorjs parargaph block
 */
module.exports = class HTMLToEditorJSParagraph {

	constructor(str) {
		this.str = str;
	}

	adapt() {
		return JSON.stringify({
			'time': '1563904354971',
			'blocks': [
				{
					'type': 'paragraph',
					'data': {
						'text': sanitizeHTML(this.str, config.sanitizeHTML.allowNone)
					}
				}
			],
			'version': '2.15.0'
		});
	}
};