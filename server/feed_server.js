'use strict';
const News = require('../models/News.js');
const NewsPhase = require('../models/NewsPhase.js');
const NewsType = require('../models/NewsType.js');
const Tag = require('../models/Tag.js');
const Feed = require('feed').Feed;
const ejs = require('ejs');
const path = require('path');

module.exports = {
	getNewsFeed: (req, res, next) => {
		const newsFeed = new Feed(
			{
				title: 'WPI ITS News',
				description: 'This is a feed of WPI ITS News Posts',
				id: `${process.env.SERVER_ROOT}/`,
				link: `${process.env.SERVER_ROOT}/`,
				favicon: `${process.env.SERVER_ROOT}/brand/favicon.ico`,
				language: 'en',
				feedLinks: {
					json: `${process.env.SERVER_ROOT}/news/feed/json`,
					atom: `${process.env.SERVER_ROOT}/news/feed/atom`
				},
			}
		);

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
		).then(async news => {
			for (const newsItem of news) {
				newsFeed.addItem(
					{
						title: newsItem.title,
						id: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
						link: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
						description: newsItem.descriptionShort,
						content: await ejs.renderFile(path.join(__dirname, '../views/partials/api/convertEditorjsToHTML.ejs'), {
							data: newsItem.details
						}),
						date: new Date(newsItem.datePost),
						author: [
							{
								name: 'WPI ITS',
								email: 'its@wpi.edu',
								link: `${process.env.SERVER_ROOT}/`
							}
						]
					}
				);
			}
			switch (req.params.type) {
				case 'rss':
					res.set('Content-Type', 'application/rss+xml');
					res.send(newsFeed.rss2());
					break;
				case 'atom':
					res.set('Content-Type', 'application/atom+xml');
					res.send(newsFeed.atom1());
					break;
				case 'json':
					res.set('Content-Type', 'application/json');
					res.send(newsFeed.json1());
					break;
			}
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getNewsPush: (req, res, next) => {
		const newsFeed = new Feed(
			{
				title: 'WPI Hub News',
				description: 'This is a feed of WPI Hub News Posts',
				id: `${process.env.SERVER_ROOT}/`,
				link: `${process.env.SERVER_ROOT}/`,
				favicon: `${process.env.SERVER_ROOT}/brand/favicon.ico`,
				language: 'en',
				feedLinks: {
					json: `${process.env.SERVER_ROOT}/news/feed/json`,
					atom: `${process.env.SERVER_ROOT}/news/feed/atom`,
					rss: `${process.env.SERVER_ROOT}/news/feed/rss`
				},
			}
		);

		News.findAll(
			{
				include: [
					{
						model: NewsPhase,
						where: {
							title: 'publish'
						},
						
					}
				],
				order: [
					['datePost', 'DESC'],
				],
				limit: 15 
			}
		).then(async news => {
			for (const newsItem of news) {
				newsFeed.addItem(
					{
						title: newsItem.title,
						id: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
						link: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
						description: newsItem.descriptionShort,
						date: new Date(newsItem.datePost),
						author: [
							{
								name: 'WPI Hub',
								email: 'hub@wpi.edu',
								link: `${process.env.SERVER_ROOT}/`
							}
						]
					}
				);
			}
			switch (req.params.type) {
				case 'rss':
					res.set('Content-Type', 'application/rss+xml');
					res.send(newsFeed.rss2());
					break;
				case 'atom':
					res.set('Content-Type', 'application/atom+xml');
					res.send(newsFeed.atom1());
					break;
				case 'json':
					res.set('Content-Type', 'application/json');
					res.send(newsFeed.json1());
					break;
			}
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getCyberNewsFeed: (req, res, next) => {
		const cyberNewsFeed = new Feed(
			{
				title: 'WPI ITS News',
				description: 'This is a feed of WPI ITS CyberNews Posts',
				id: `${process.env.SERVER_ROOT}/`,
				link: `${process.env.SERVER_ROOT}/`,
				favicon: `${process.env.SERVER_ROOT}/brand/favicon.ico`,
				language: 'en',
				feedLinks: {
					json: `${process.env.SERVER_ROOT}/cybernews/feed/json`,
					atom: `${process.env.SERVER_ROOT}/cybernews/feed/atom`
				},
			}
		);

		News.findAll(
			{
				include: [
					{
						model: NewsPhase,
						where: {
							title: 'publish'
						}
					},
					{
						model: Tag,
						where: {
							title: 'Cybersecurity'
						}
					}
				]
			}
		).then(async taggedNews => {
			for (const newsItem of taggedNews) {
				cyberNewsFeed.addItem(
					{
						title: newsItem.title,
						id: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
						link: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
						description: newsItem.descriptionShort,
						content: await ejs.renderFile(path.join(__dirname, '../views/partials/api/convertEditorjsToHTML.ejs'), {
							data: newsItem.details
						}),
						date: new Date(newsItem.datePost),
						author: [
							{
								name: 'WPI ITS',
								email: 'its@wpi.edu',
								link: `${process.env.SERVER_ROOT}/`
							}
						]
					}
				);
			}
			News.findAll(
				{
					include: [
						{
							model: NewsPhase,
							where: {
								title: 'publish'
							}
						},
						{
							model: NewsType,
							where: {
								title: 'cybersecurity'
							}
						}
					]
				}
			).then(async typedNews => {
				for (const newsItem of typedNews) {
					cyberNewsFeed.addItem(
						{
							title: newsItem.title,
							id: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
							link: `${process.env.SERVER_ROOT}${newsItem.getURL()}`,
							description: newsItem.descriptionShort,
							content: await ejs.renderFile(path.join(__dirname, '../views/partials/api/convertEditorjsToHTML.ejs'), {
								data: newsItem.details
							}),
							date: new Date(newsItem.datePost),
							author: [
								{
									name: 'WPI ITS',
									email: 'its@wpi.edu',
									link: `${process.env.SERVER_ROOT}/`
								}
							]
						}
					);
				}
				switch (req.params.type) {
					case 'rss':
						res.set('Content-Type', 'application/rss+xml');
						res.send(cyberNewsFeed.rss2());
						break;
					case 'atom':
						res.set('Content-Type', 'application/atom+xml');
						res.send(cyberNewsFeed.atom1());
						break;
					case 'json':
						res.set('Content-Type', 'application/json');
						res.send(cyberNewsFeed.json1());
						break;
				}
				return null;
			}).catch(err => {
				next(err);
				return null;
			});
		}).catch(err => {
			next(err);
			return null;
		});
	}
};