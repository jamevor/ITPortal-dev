/*
	exported ListIndent
*/
class ListIndent {

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
		this.button.innerHTML = '<i class=\'far fa-indent\'></i>';
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
		const elt = range.commonAncestorContainer.parentElement;
		const listItemText = elt.innerHTML;
		const prev = elt.previousSibling;
		const prevUL = [...prev.childNodes].filter(n => n.tagName && n.tagName.toUpperCase() === 'UL');
		const listToAdd = prevUL.length ? prevUL[0] : document.createElement('UL');
		listToAdd.classList = this.CSS.wrapperNested;
		const newListItem = document.createElement('LI');
		newListItem.classList = this.CSS.item;
		newListItem.innerHTML = listItemText;
		listToAdd.appendChild(newListItem);
		if (!prevUL.length)
			prev.appendChild(listToAdd);
		elt.parentElement.removeChild(elt);
	}

	checkState(selection) {
		// console.log(selection);
		const text = selection.anchorNode;
		if (!text) {
			return;
		}
		const anchorElement = text instanceof Element ? text : text.parentElement;
		const state = anchorElement && anchorElement.previousSibling && anchorElement.previousSibling.tagName && anchorElement.previousSibling.tagName.toUpperCase() === 'LI';
		this.state = state;
	}

}