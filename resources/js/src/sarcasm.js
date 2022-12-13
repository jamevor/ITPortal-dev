const sarcasm = str => {
	return [...str].map((char, i) => char[`to${i % (Math.floor(Math.random() * 6)) ? 'Upper' : 'Lower'}Case`]()).join('');
};

const textNodesUnder = el => {
	let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
	const blackListNodes = ['SVG', 'PATTERN', 'PATH', 'DEFS', 'RECT', 'STYLE', 'SCRIPT'];
	n = walk.nextNode();
	while (n) {
		if (!(blackListNodes.includes(n.parentNode.nodeName.toUpperCase()) || blackListNodes.includes(n.nodeName.toUpperCase()))) {
			a.push(n);
		}
		n = walk.nextNode();
	}
	return a;
};

window.addEventListener('load', function() {
	for (let elt of textNodesUnder(document.querySelector('body'))) {
		elt.textContent = sarcasm(elt.textContent);
	}
});