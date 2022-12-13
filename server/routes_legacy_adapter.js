const express = require('express');
const ArticleAdapter = require('../models/adapters/ArticleAdapter.js');
const NewsAdapter = require('../models/adapters/NewsAdapter.js');
const G = require('./_global_logic.js');

const router = express.Router();

// Article
router.get('/api/v1/article/import/one/:id', G.nextIfAdmin, (req, res, next) => {
	const connection = getConnection();

	ArticleAdapter.findById(req.params.id, connection).then(article => {
		article.adapt().then(adaptedArticle => {
			connection.end();
			return res.json(adaptedArticle);
		}).catch(err => {
			return next(err);
		});
	}).catch(err => {
		return next(err);
	});
});

router.get('/api/v1/article/import/all', G.nextIfAdmin, (req, res, next) => {
	const connection = getConnection();

	ArticleAdapter.importAllArticles(connection).then(result => {
		connection.end();
		return res.json(result);
	}).catch(err => {
		return next(err);
	});
});

// News
router.get('/api/v1/news/import/one/:id', G.nextIfAdmin, (req, res, next) => {
	const connection = getConnection();

	NewsAdapter.findById(req.params.id, connection).then(news => {
		news.adapt().then(adaptedNews => {
			connection.end();
			return res.json(adaptedNews);
		}).catch(err => {
			return next(err);
		});
	}).catch(err => {
		return next(err);
	});
});

router.get('/api/v1/news/import/all', G.nextIfAdmin, (req, res, next) => {
	const connection = getConnection();

	NewsAdapter.importAllNews(connection).then(result => {
		connection.end();
		return res.json(result);
	}).catch(err => {
		return next(err);
	});
});

module.exports = router;

// helpers
function getConnection() {
	const config = require('../config.js');
	const mysql = require('mysql');
	const connection = mysql.createConnection({
		host: config.adapterDatabase.host,
		user: config.adapterDatabase.user,
		password: config.adapterDatabase.password,
		database: config.adapterDatabase.database
	});
	connection.connect();
	return connection;
}