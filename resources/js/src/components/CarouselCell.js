/* exported CarouselCell */
class CarouselCell {

	constructor(title, imgSrc, action, backgroundPosition) {
		this.title = title;
		this.imgSrc = imgSrc;
		this.action = action;
		this.backgroundPosition = backgroundPosition || 'center';
	}

	render() {
		return `<a href="${this.action}" class="cell carousel-cell small-12 medium-4" style="background: url('${this.imgSrc}'); background-position: ${this.backgroundPosition}; background-size: cover;">
      <div class="featured-title">${this.title}</div>
    </a>`;
	}
}