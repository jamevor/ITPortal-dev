'use strict';

/**
 * @class HTMLToEditorJSParagraph
 * @description for stripping html tags and formatting as editorjs parargaph block
 */
module.exports = class HTMLToEditorJSList {

	/**
   * @param {String} str the string to adapt.
   */
	constructor(str) {
		this.str = str;
	}

	adapt() {
		const items = [];
		const arr = this.str.split('<li>');
		arr.shift(); // remove first blank item

		for (let item of arr) {
			item = item.replace('</li>', '').trim();
			if (!item.includes('</a>')) {
				items.push(
					{
						'text': item,
						'children': {
							'style': 'unordered'
						}
					}
				);
			}
		}


		return JSON.stringify({
			'time': '1563904354971',
			'blocks': [
				{
					'type': 'list',
					'data': {
						'style': 'unordered',
						'items': items
					}
				}
			],
			'version': '2.15.0'
		});
	}
};