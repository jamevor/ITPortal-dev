const { createSitemap} = require('sitemap');
const moment = require('moment');

const Article = require('../../models/Article.js');
const ArticlePhase = require('../../models/ArticlePhase.js');
const Spread = require('../../models/Spread.js');
const SpreadPhase = require('../../models/SpreadPhase.js');
const News = require('../../models/News.js');
const NewsPhase = require('../../models/NewsPhase.js');
const CatalogPhase = require('../../models/CatalogPhase.js');
const Service = require('../../models/Service.js');
const Portfolio = require('../../models/Portfolio.js');
const Component = require('../../models/Component.js');
const Location = require('../../models/Location.js');
const Building = require('../../models/Building.js');
const Software = require('../../models/Software.js');
const SoftwarePhase = require('../../models/SoftwarePhase.js');

module.exports = class Sitemap {

	constructor(options) {
		this.map = createSitemap(options);
	}

	get xml() {
		return new Promise((resolve, reject) => {

			if (this.map.isCacheValid()) {
				resolve(this.map.toXML());
				return null;
			}

			const XMLBuilderPromises = [];

			// Article

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Article.findAll(
						{
							where: {
								requireAuth: false
							},
							include: [
								{
									model: ArticlePhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(articles => {
						resolve(
							articles.map(a => {
								return {
									url: a.getURL(),
									changefreq: 'weekly',
									priority: 0.7,
									lastmod: moment(a.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Spread

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Spread.findAll(
						{
							include: [
								{
									model: SpreadPhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(spreads => {
						resolve(
							spreads.map(s => {
								return {
									url: s.getURL(),
									changefreq: 'weekly',
									priority: 0.7,
									lastmod: moment(s.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Software

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Software.findAll(
						{
							include: [
								{
									model: SoftwarePhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(software => {
						resolve(
							software.map(s => {
								return {
									url: s.getURL(),
									changefreq: 'weekly',
									priority: 0.5,
									lastmod: moment(s.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// News

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					News.findAll(
						{
							include: [
								{
									model: NewsPhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(news => {
						resolve(
							news.map(n => {
								return {
									url: n.getURL(),
									changefreq: 'daily',
									priority: 0.8,
									lastmod: moment(n.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Portfolio

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Portfolio.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(portfolios => {
						resolve(
							portfolios.map(p => {
								return {
									url: p.getURL(),
									changefreq: 'monthly',
									priority: 0.5,
									lastmod: moment(p.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Service

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Service.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(services => {
						resolve(
							services.map(s => {
								return {
									url: s.getURL(),
									changefreq: 'monthly',
									priority: 0.6,
									lastmod: moment(s.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Component

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Component.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								}
							]
						}
					).then(components => {
						resolve(
							components.map(c => {
								return {
									url: c.getURL(),
									changefreq: 'monthly',
									priority: 0.5,
									lastmod: moment(c.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Building

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Building.findAll().then(buildings => {
						resolve(
							buildings.map(b => {
								return {
									url: b.getURL(),
									changefreq: 'yearly',
									priority: 0.5,
									lastmod: moment(b.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Location

			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					Location.findAll().then(locations => {
						resolve(
							locations.map(l => {
								return {
									url: l.getURL(),
									changefreq: 'monthly',
									priority: 0.5,
									lastmod: moment(l.updatedAt).format()
								};
							})
						);
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);

			// Pages
			XMLBuilderPromises.push(
				new Promise((resolve, reject) => {
					try {
						const objects = [
							{
								url: '/Help',
								changefreq: 'monthly',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/Service-Catalog',
								changefreq: 'daily',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/Software-Library',
								changefreq: 'daily',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/News-and-Events',
								changefreq: 'daily',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/Admin',
								changefreq: 'monthly',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/Accounts',
								changefreq: 'monthly',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/Site-Map',
								changefreq: 'daily',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							},
							{
								url: '/Knowledge-Base',
								changefreq: 'daily',
								priority: 0.5,
								lastmod: moment(new Date()).format()
							}
						];
						return resolve(objects);
					} catch(err) {
						return reject(err);
					}
				})
			);

			Promise.all(XMLBuilderPromises).then(values => {
				for (let sitemapItem of Array.prototype.concat.apply([], values)) {
					this.map.add(sitemapItem);
				}
				resolve(this.map.toXML());
				return null;
			}).catch(err => {
				reject(err);
				return null;
			});


		});
	}
};