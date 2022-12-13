const Preview = require('../models/Preview.js');
const Article = require('../models/Article.js');
const Portfolio = require('../models/Portfolio.js');
const Service = require('../models/Service.js');
const Component = require('../models/Component.js');
const News = require('../models/News.js');
const Software = require('../models/Software.js');
const Building = require('../models/Building.js');
const Location = require('../models/Location.js');
const MyApp = require('../models/MyApp.js');
const Spread = require('../models/Spread.js');
const Server = require('../models/Server.js');
const Package = require('../models/Package.js');
const SubSite = require('../models/SubSite.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');

module.exports = {
	create: (req, res, next) => {
		Preview.create(
			{
				entity: sanitizeHTML(req.body.entity, config.sanitizeHTML.allowNone).toLowerCase(),
				entityID: sanitizeHTML(req.body.entityID, config.sanitizeHTML.allowNone)
			}
		).then(preview => {
			res.json(
				{
					preview,
					link: preview.getURL()
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	view: (req, res, next) => {
		Preview.findOne(
			{
				where: {
					guid: sanitizeHTML(req.params.guid, config.sanitizeHTML.allowNone)
				}
			}
		).then(preview => {
			if (!preview) {
				next(404);
				return null;
			}
			switch(preview.entity) {
				case 'subsite':
					getSubSite(preview).then(subsite => {
						res.locals.tabs = res.locals.tabs || {};
						res.render('subsite/view.ejs', {
							subsite,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'article':
					getArticle(preview).then(article => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['knowledgeBase'] = 'active';
						res.render('article/view.ejs', {
							article,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'portfolio':
					getPortfolio(preview).then(portfolio => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['serviceCatalog'] = 'active';
						res.render('portfolio/view.ejs', {
							portfolio,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'service':
					getService(preview).then(service => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['serviceCatalog'] = 'active';
						res.render('service/view.ejs', {
							service,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'component':
					getComponent(preview).then(component => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['serviceCatalog'] = 'active';
						res.render('component/view.ejs', {
							component,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'news':
					getNews(preview).then(news => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['newsAndEvents'] = 'active';
						res.render('news/view.ejs', {
							news,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'software':
					getSoftware(preview).then(software => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['softwareLibrary'] = 'active';
						res.render('software/view.ejs', {
							software,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'building':
					getBuilding(preview).then(building => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['locations'] = 'active';
						res.render('building/view.ejs', {
							building,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'location':
					getLocation(preview).then(location => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['locations'] = 'active';
						res.render('location/view.ejs', {
							location,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'package':
					getPackage(preview).then(package_ => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['locations'] = 'active';
						res.render('package/view.ejs', {
							package: package_,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'app':
					getApp(preview).then(app => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['apps'] = 'active';
						res.render('app/view.ejs', {
							app,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'spread':
					getSpread(preview).then(spread => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['knowledgeBase'] = 'active';
						res.render('spread/view.ejs', {
							spread,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				case 'server':
					getServer(preview).then(server => {
						res.locals.tabs = res.locals.tabs || {};
						res.locals.tabs['locations'] = 'active';
						res.render('server/view.ejs', {
							server,
							robots: 'noindex, nofollow',
							preview: true
						});
						return null;
					}).catch(err => {
						next(err);
						return null;
					});
					return null;
				default:
					next(404);
					return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	}
};

const getArticle = async preview => {
	return Article.findById(preview.entityID, false, true).then(article => {
		let imageSrc;
		if (article && article.image) {
			imageSrc = article.image.getURL();
		}
		article = article.toJSON();
		if (imageSrc) {
			article.image.src = imageSrc;
		}
		return article;
	}).catch(err => {
		throw err;
	});
};

const getPortfolio = async preview => {
	return Portfolio.findById(preview.entityID, false, true).then(portfolio => {
		return portfolio;
	}).catch(err => {
		throw err;
	});
};

const getService = async preview => {
	return Service.findById(preview.entityID, false, true).then(service => {
		return service;
	}).catch(err => {
		throw err;
	});
};

const getComponent = async preview => {
	return Component.findById(preview.entityID, false, true).then(component => {
		return component;
	}).catch(err => {
		throw err;
	});
};

const getNews = async preview => {
	return News.findById(preview.entityID, false, true).then(news => {
		let imageSrc;
		if (news && news.image) {
			imageSrc = news.image.getURL();
		}
		news = news.toJSON();
		if (imageSrc) {
			news.image.src = imageSrc;
		}
		return news;
	}).catch(err => {
		throw err;
	});
};

const getSoftware = async preview => {
	return Software.findById(preview.entityID, false, true).then(software => {
		return software;
	}).catch(err => {
		throw err;
	});
};

const getServer = async preview => {
	return Server.findById(preview.entityID, false, true).then(server => {
		return server;
	}).catch(err => {
		throw err;
	});
};

const getBuilding = async preview => {
	return Building.findById(preview.entityID, false, true).then(building => {
		return building;
	}).catch(err => {
		throw err;
	});
};

const getLocation = async preview => {
	return Location.findById(preview.entityID, false, true).then(location => {
		let imageSrc;
		if (location && location.image) {
			imageSrc = location.image.getURL();
		}
		location = location.toJSON();
		if (imageSrc) {
			location.image.src = imageSrc;
		}
		return location;
	}).catch(err => {
		throw err;
	});
};

const getPackage = async preview => {
	return Package.findById(preview.entityID, false, true).then(package_ => {
		return package_;
	}).catch(err => {
		throw err;
	});
};

const getApp = async preview => {
	return MyApp.findById(preview.entityID, false, true).then(app => {
		return app;
	}).catch(err => {
		throw err;
	});
};

const getSpread = async preview => {
	return Spread.findById(preview.entityID, false, true).then(spread => {
		let imageSrc;
		if (spread && spread.image) {
			imageSrc = spread.image.getURL();
		}
		spread = spread.toJSON();
		if (imageSrc) {
			spread.image.src = imageSrc;
		}
		return spread;
	}).catch(err => {
		throw err;
	});
};

const getSubSite = async preview => {
	return SubSite.findById(preview.entityID, false, true).then(subsite => {
		let imageSrc;
		if (subsite && subsite.image) {
			imageSrc = subsite.image.getURL();
		}
		subsite = subsite.toJSON();
		if (imageSrc) {
			subsite.image.src = imageSrc;
		}
		return subsite;
	}).catch(err => {
		throw err;
	});
};