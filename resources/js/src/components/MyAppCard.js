/* exported MyAppCard */
class MyAppCard {
	constructor(app, installed, isFavorite, isUserLoggedIn) {
		this.app = app;
		this.installed = installed;
		this.isFavorite = isFavorite;
		this.isUserLoggedIn = typeof isUserLoggedIn !== 'undefined' ? isUserLoggedIn : true;
	}
	render() {
		let buttons = '';
		let heartStart = '';
		let heartEnd = '';
		if (this.installed) {
			buttons = `<div class="secondary-group">
          <a class="action secondary button" href="/App/${this.app.id}"><i class="fas fa-info-circle"></i><br>Info</a>
          <a class="action secondary button button-remove-app" href="#"><i class="fas fa-minus-circle"></i><br>Remove</a>
        </div>`;
			heartStart = `<div class="favoriteMe">
          <input class="toggle-heart${!this.isFavorite ? ' checkable' : ''}" id="toggle-heart-${this.app.guid}" type="checkbox"${this.isFavorite ? ' checked=\'true\'' : ''}>
          <label class="toggle-heart-label" for="toggle-heart-${this.app.guid}" aria-label="like"><i class="fas fa-heart"></i></label>
        </div>
        <a href="${this.app.link}" target="_blank">`;
			heartEnd = '</a>';
		} else if (this.isUserLoggedIn) {
			buttons = `<a class="action button expanded button-add-app" href="#"><i class="fas fa-plus-circle"></i> Add</a>
      <a class="action button secondary expanded" href="/App/${this.app.id}"><i class="fas fa-info-circle"></i> Info</a>`;
		} else {
			buttons = `<a class="action button secondary expanded" href="/App/${this.app.id}"><i class="fas fa-info-circle"></i> Info</a>`;
		}
		return `<div class="cell medium-3 box card app" data-appid="${this.app.id}">
      ${heartStart}
        <div class="img" style="background-image:url('${this.app.imageSrc || '/img/ico-intro.svg'}')"></div>
        <div class="title">${this.app.title}</div>
      ${heartEnd}
      ${buttons}
    </div>`;
	}

	static renderSpinner() {
		return '<i class="fas fa-circle-notch fa-3x fa-spin"></i>';
	}

	static renderProgressBar(id) {
		return `<div id="install-progress-${id}" class="progress" role="progressbar" tabindex="0" aria-valuenow="0" aria-valuemin="0"
        aria-valuetext="0 percent" aria-valuemax="100">
        <div class="progress-meter" style="width: 0%"></div>
      </div>`;
	}
}