/*
	exported Note
*/
/**
 * @class Warning
 * @classdesc Warning Tool for Editor.js
 * @property {WarningData} data - Warning Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Warning Tool`s input and output data
 * @property {string} title - warning`s title
 * @property {string} message - warning`s message
 * @property {string} type - warning`s message
 * @property {string} color - warning`s message
 *
 * @typedef {object} WarningConfig
 * @description Warning Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in warning`s title input
 * @property {string} messagePlaceholder - placeholder to show in warning`s message input
 */
class Note {
	/**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
	static get toolbox() {
		return {
			icon: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="sticky-note" class="fa-sticky-note" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="16" width="16"><path fill="currentColor" d="M448 348.106V80c0-26.51-21.49-48-48-48H48C21.49 32 0 53.49 0 80v351.988c0 26.51 21.49 48 48 48h268.118a48 48 0 0 0 33.941-14.059l83.882-83.882A48 48 0 0 0 448 348.106zm-128 80v-76.118h76.118L320 428.106zM400 80v223.988H296c-13.255 0-24 10.745-24 24v104H48V80h352z"></path></svg>',
			title: 'Note'
		};
	}

	/**
   * Allow to press Enter inside the Warning
   * @public
   * @returns {boolean}
   */
	static get enableLineBreaks() {
		return true;
	}

	/**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
	static get DEFAULT_TITLE_PLACEHOLDER() {
		return 'Title';
	}

	/**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
	static get DEFAULT_MESSAGE_PLACEHOLDER() {
		return 'Message';
	}

	/**
   * Warning Tool`s styles
   *
   * @returns {Object}
   */
	get CSS() {
		return {
			baseClass: this.api.styles.block,
			wrapper: 'cdx-warning',
			title: 'cdx-warning__title',
			input: this.api.styles.input,
			message: 'cdx-warning__message'
		};
	}

	/**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {WarningData} data — previously saved data
   * @param {WarningConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
	constructor({data, config, api}) {
		this.api = api;

		this.titlePlaceholder = config.titlePlaceholder || Note.DEFAULT_TITLE_PLACEHOLDER;
		this.messagePlaceholder = config.messagePlaceholder || Note.DEFAULT_MESSAGE_PLACEHOLDER;

		this.data = {
			title: data.title || '',
			message: data.message || '',
			type: data.type || 'info',
			color: data.color || '9193fa'
		};
	}

	/**
   * Create Warning Tool container with inputs
   *
   * @returns {Element}
   */
	render() {
		const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
		const title = this._make('div', [this.CSS.input, this.CSS.title], {
			contentEditable: true,
			innerHTML: this.data.title
		});
		const message = this._make('div', [this.CSS.input, this.CSS.message], {
			contentEditable: true,
			innerHTML: this.data.message
		});

		title.dataset.placeholder = this.titlePlaceholder;
		message.dataset.placeholder = this.messagePlaceholder;

		container.appendChild(title);
		container.appendChild(message);

		return container;
	}

	/**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
	save(warningElement) {
		const title = warningElement.querySelector(`.${this.CSS.title}`);
		const message = warningElement.querySelector(`.${this.CSS.message}`);

		return Object.assign(this.data, {
			title: title.innerHTML,
			message: message.innerHTML,
			type: 'info',
			color: '9193fa'
		});
	}

	/**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
	_make(tagName, classNames = null, attributes = {}) {
		let el = document.createElement(tagName);

		if (Array.isArray(classNames)) {
			el.classList.add(...classNames);
		} else if(classNames) {
			el.classList.add(classNames);
		}

		for (let attrName in attributes) {
			el[attrName] = attributes[attrName];
		}

		return el;
	}

	/**
   * Sanitizer config for Warning Tool saved data
   * @return {Object}
   */
	static get sanitize() {
		return {
			title: {},
			message: {},
			type: {},
			color: {}
		};
	}
}
