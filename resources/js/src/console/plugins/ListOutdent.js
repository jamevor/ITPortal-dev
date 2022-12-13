/* exported ListOutdent */
class ListOutdent {

	static get isInline() {
		return true;
	}

	constructor({data, config, api}) {
		this.data = data;
		this.config = config;
		this.api = api;
		this.button = null;
		this.state = false;
	}

	render() {
		this.button = document.createElement('button');
		this.button.type = 'button';
		this.button.innerHTML = '<i class=\'far fa-outdent\'></i>';
		this.button.classList.add(this.api.styles.inlineToolButton);
		return this.button;
	}

	/**
   * Styles
   * @private
   */
	get CSS() {
		return {
			wrapperNested: 'cdx-list--nested',
			item: 'cdx-list__item'
		};
	}

	surround(range) {
		// console.log(range);
		if (!this.state) {
			return;
		}
		/**
     * @type HTMLElement
     */
		const elt = range.commonAncestorContainer.parentElement;
		const eltWrapper = elt.parentNode; // ul containing items
		/**
     * @type HTMLElement
     */
		const parent = eltWrapper.parentNode;

		const siblings = [];
		for (let cursor = elt.nextSibling; cursor !== null; cursor = cursor.nextSibling) {
			siblings.push(cursor);
		}

		if (siblings.length) {
			const newUL = document.createElement('ul');
			newUL.classList.add(this.CSS.wrapperNested);
			newUL.appendChild.apply(newUL, siblings);
			elt.appendChild(newUL);
		}

		if (parent) {
			parent.after(elt);
		}
	}

	checkState(selection) {
		// console.log(selection);
		const text = selection.anchorNode;
		if (!text) {
			return;
		}
		const anchorElement = text instanceof Element ? text : text.parentElement;
		const state = anchorElement && anchorElement.parentNode && anchorElement.parentNode.tagName
    && (anchorElement.parentNode.tagName.toUpperCase() === 'UL' || anchorElement.parentNode.tagName.toUpperCase() === 'OL')
    && anchorElement.parentNode.classList && [...anchorElement.parentNode.classList].includes(this.CSS.wrapperNested);
		this.state = state;
	}

}