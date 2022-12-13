//! ColorConverter

/**
 * @author Ryan LaMarche
 */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.ColorConverter = factory();
	}

}(this, function() {
	'use strict';

	return (color, type) => {
		return {
			_color: color,
			_type: type,
			color,
			type,

			getTypes: function() {
				return ['hex', 'hsl', 'rgb'];
			},

			toHSL: function() {
				switch(this.type) {
					case 'hex':
						return this.toRGB().toHSL();
					case 'rgb': {
						let r = this.color[0] / 255, g = this.color[1] / 255, b = this.color[2] / 255;

						let max = Math.max(r, g, b), min = Math.min(r, g, b);

						let h, s, l = (max + min) / 2;

						if (max === min) {
							h = s = 0; // achromatic
						} else {
							let d = max - min;
							s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
							switch(max) {
								case r:
									h = (g - b) / d + (g < b ? 6 : 0);
									break;
								case g:
									h = (b - r) / d + 2;
									break;
								case b:
									h = (r - g) / d + 4;
									break;
							}
							h /= 6;
						}

						s = s * 100;
						s = Math.round(s);
						l = l * 100;
						l = Math.round(l);
						h = Math.round(360 * h);

						this.color = [h, s, l];
						this.type = 'hsl';

						break;
					}
					default:
						console.warn('default toHSL');
				}
				return this;
			},

			toRGB: function() {
				switch (this.type) {
					case 'hex':
						this.type = 'rgb';
						this.color = this.color.replace('#', ' ').trim();
						this.color = [
							parseInt(this.color.substring(0,2), 16),
							parseInt(this.color.substring(2,4), 16),
							parseInt(this.color.substring(4,6), 16)
						];
						break;
					default:
						console.warn('default toRGB');
						break;
				}
				return this;
			},

			toHex: function() {
				switch (this.type) {
					case 'hsl': {
						this.type = 'hex';
						let h = this.color[0] / 360, s = this.color[1] / 100, l = this.color[2] / 100;
						let r, g, b;
						if (s === 0) {
							r = g = b = l; // achromatic
						} else {
							const hue2rgb = (p, q, t) => {
								if (t < 0) t += 1;
								if (t > 1) t -= 1;
								if (t < 1 / 6) return p + (q - p) * 6 * t;
								if (t < 1 / 2) return q;
								if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
								return p;
							};
							const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
							const p = 2 * l - q;
							r = hue2rgb(p, q, h + 1 / 3);
							g = hue2rgb(p, q, h);
							b = hue2rgb(p, q, h - 1 / 3);
						}
						const toHex = x => {
							const hex = Math.round(x * 255).toString(16);
							return hex.length === 1 ? '0' + hex : hex;
						};
						this.color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
						break;
					}
					default:
						console.warn('default toRGB');
						break;
				}
				return this;
			},

			toHSLA: function() {
				switch (this.type) {
					case 'hsl': {
						this.type = 'hsla';
						this.color.push(1);
						break;
					}
					default:
						console.warn('default toHSLA()');
						break;
				}
				return this;
			},

			/**
       * @return {string} string representation of css for the color.
       */
			toCSS: function() {
				switch(this.type) {
					case 'hex':
						return `${this.color}`;
					case 'rgb':
						return `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
					case 'hsl':
						return `hsl(${this.color[0]}, ${this.color[1]}%, ${this.color[2]}%)`;
					case 'hsla':
						return `hsla(${this.color[0]}, ${this.color[1]}%, ${this.color[2]}%, ${this.color[3]})`;
					default:
						return null;
				}
			},

			/**
       * @return {string} string representation of the object.
       */
			toString: function() {
				return `{ type: ${this.type}, color: ${this.color} }`;
			},

			/**
       * @return {Object} this for chaining
       * @param {Number} amount amount you want to enlighten by
       */
			lighten: function(amount) {
				switch(this.type) {
					case 'hsl':
						this.color[2] = Math.min(Math.max(Math.round(this.color[2] + amount), 0), 100);
						break;
					default:
						console.warn('Whoops! I can only lighten hsl colors. Try calling `.toHSL()` first!');
				}
				return this;
			},

			/**
       * @return {Object} this for chaining
       * @param {Number} amount amount you want to endarken by
       */
			darken: function(amount) {
				switch(this.type) {
					case 'hsl':
						this.color[2] = Math.min(Math.max(Math.round(this.color[2] - amount), 0), 100);
						break;
					default:
						console.warn('Whoops! I can only darken hsl colors. Try calling `.toHSL()` first!');
				}
				return this;
			},

			/**
       * @return {Object} this for chaning.
       * @param {string} key the key of the value you want to set (ex. HSL - 'h', 'H', 's', 'S', 'l', 'L').
       * @param {string||number} value the value you want to set.
       */
			set: function(key, value) {
				switch(this.type) {
					case 'hex':
						switch(key) {
							case 'r':
							case 'R':
								this.color = `#${value}${this.color.replace('#', ' ').trim().substring(2)}`;
								break;
							case 'g':
							case 'G':
								this.color = `#${this.color.replace('#', ' ').trim().substring(0, 2)}${value}${this.color.replace('#', ' ').trim().substring(4)}`;
								break;
							case 'b':
							case 'B':
								this.color = `#${this.color.replace('#', ' ').trim().substring(0, 4)}${value}}`;
								break;
						}
						break;
					case 'rgb':
						switch(key) {
							case 'r':
							case 'R':
								this.color[0] = Math.round(parseInt(value));
								break;
							case 'g':
							case 'G':
								this.color[1] = Math.round(parseInt(value));
								break;
							case 'b':
							case 'B':
								this.color[2] = Math.round(parseInt(value));
								break;
						}
						break;
					case 'hsl':
						switch(key) {
							case 'h':
							case 'H':
								this.color[0] = Math.round(parseInt(value));
								break;
							case 's':
							case 'S':
								this.color[1] = Math.round(parseInt(value));
								break;
							case 'l':
							case 'L':
								this.color[2] = Math.round(parseInt(value));
								break;
						}
						break;
					case 'hsla':
						switch(key) {
							case 'h':
							case 'H':
								this.color[0] = Math.round(parseInt(value));
								break;
							case 's':
							case 'S':
								this.color[1] = Math.round(parseInt(value));
								break;
							case 'l':
							case 'L':
								this.color[2] = Math.round(parseInt(value));
								break;
							case 'a':
							case 'A':
								this.color[3] = parseFloat(value);
								break;
						}
						break;
				}
				return this;
			}


		};
	};
}
));



