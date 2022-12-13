/*
	exported ListStyleToggle
*/
class ListStyleToggle {

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
		this.button.innerHTML = '<i id=\'cdx-list-style-toggle\' class=\'far fa-list-ul\'></i>';
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
		const elt = range.commonAncestorContainer.parentNode.parentNode;
		// console.log(elt);


		let newTagName = elt.tagName.toUpperCase() === 'UL' ? 'ol' : 'ul';
		let newElt = document.createElement(newTagName);
		while (elt.firstChild) {
			newElt.appendChild(elt.firstChild);
		}
		for (let i = elt.attributes.length - 1; i >= 0; --i) {
			newElt.attributes.setNamedItem(elt.attributes[i].cloneNode());
		}
		elt.parentNode.replaceChild(newElt, elt);

		document.getElementsByClassName('ce-inline-toolbar')[0].classList.remove('ce-inline-toolbar--showed');
	}

	checkState(selection) {
		const text = selection.anchorNode;
		if (!text) {
			return;
		}
		const anchorElement = text instanceof Element ? text : text.parentNode;

		if (anchorElement && anchorElement.parentNode && anchorElement.parentNode.tagName && anchorElement.parentNode.tagName.toUpperCase() === 'UL') {
			document.getElementById('cdx-list-style-toggle').classList.remove('fa-list-ul');
			document.getElementById('cdx-list-style-toggle').classList.add('fa-list-ol');
		} else {
			document.getElementById('cdx-list-style-toggle').classList.add('fa-list-ul');
			document.getElementById('cdx-list-style-toggle').classList.remove('fa-list-ol');
		}
		this.state = anchorElement && anchorElement.parentNode && anchorElement.parentNode.tagName
		&& (anchorElement.parentNode.tagName.toUpperCase() === 'UL' || anchorElement.parentNode.tagName.toUpperCase() === 'OL')
		&& !anchorElement.parentNode.classList.contains('cdx-list');
	}

}