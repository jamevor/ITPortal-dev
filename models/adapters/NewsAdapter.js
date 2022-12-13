'use strict';
const sanitizeHTML = require('sanitize-html');
const config = require('../../config.js');
const HTMLToEditorJSParagraph = require('./HTMLToEditorJSParagraph.js');
const logger = require('../../server/logger.js');

module.exports = class NewsAdapter {
	constructor(legacyNews, connection) {

		this.connection = connection;

		this.id = legacyNews.id;
		this.idNewsType = legacyNews.idNewsType;
		this.idNewsPhase = legacyNews.idNewsPhase;
		this.idNewsStatus = legacyNews.idNewsStatus;
		this.title = legacyNews.title;
		this.descriptionShort = legacyNews.descriptionShort;
		this.why = legacyNews.why;
		this.impact = legacyNews.impact;
		this.benefits = legacyNews.benefits;
		this.actionDescription = legacyNews.actionDescription;
		this.details = legacyNews.details;
		this.dateStart = legacyNews.dateStart;
		this.dateEnd = legacyNews.dateEnd;
		this.datePost = legacyNews.datePost;
		this.showAlert = legacyNews.showAlert;
		this.isWPIToday = legacyNews.isWPIToday;
		this.isPinned = legacyNews.isPinned;
		this.isHome = legacyNews.isHome;
		this.createdAt = legacyNews.dateCreate;
		this.updatedAt = legacyNews.dateModify;
	}

	/**
   * ! DANGEROUS do not do this unless you are Chris or Ryan
   */
	static importAllNews(connection) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT id FROM news', (err, results) => {
				if (err) {
					return reject(err);
				} else {
					const promiseLand = [];
					for (let result of results) {
						promiseLand.push(NewsAdapter.findById(result.id, connection));
					}
					Promise.all(promiseLand).then(values => {
						const nestedPromiseLand = [];
						for (let value of values) {
							nestedPromiseLand.push(value.adapt());
						}
						Promise.all(nestedPromiseLand).then(values_ => {
							return resolve(values_);
						}).catch(err => {
							return reject(err);
						});
					}).catch(err => {
						return reject(err);
					});
				}
			});
		});
	}

	/**
   * @promise fPromise
   * @fulfill {NewsAdapter}
   * @reject {Error}
   * @returns {Promise.<NewsAdapter>}
   */
	static findById(id, connection) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT *
      FROM news
      WHERE news.id = ${id}`, (err, results) => {
				if (err) reject(err);
				if (results && results[0]) {
					resolve(new NewsAdapter(results[0], connection));
				} else {
					reject('no news found with that id');
				}
			});
		});
	}

	/**
   * @author Ryan LaMarche
   * @description Please see Ryan LaMarche...
   * @seriously This function is uncommentable.
   */
	adapt() {
		return new Promise((resolve, reject) => {
			const News = require('../News.js');
			const moment = require('moment');
			News.findByPk(this.id).then(async news => {
				let newNews;
				if (news) {
					news.idNewsType = this.idNewsType;
					news.idNewsPhase = this.idNewsPhase;
					news.idNewsStatus = this.idNewsStatus;
					news.title = this.title !== null ? sanitizeHTML(this.title, config.sanitizeHTML.allowNone) : null;
					news.descriptionShort = this.descriptionShort !== null ? sanitizeHTML(this.descriptionShort, config.sanitizeHTML.allowNone) : null;
					news.why = this.why !== null ? sanitizeHTML(this.why, config.sanitizeHTML.allowNone) : null;
					news.impact = this.impact !== null ? sanitizeHTML(this.impact, config.sanitizeHTML.allowNone) : null;
					news.benefits = this.benefits !== null ? sanitizeHTML(this.benefits, config.sanitizeHTML.allowNone) : null;
					news.actionDescription = this.actionDescription !== null ? sanitizeHTML(this.actionDescription, config.sanitizeHTML.allowNone) : null;
					news.details = this.details !== null ? new HTMLToEditorJSParagraph(this.details).adapt() : null;
					news.dateStart = this.dateStart != '0000-00-00 00:00:00' ? this.dateStart : null;
					news.dateEnd = this.dateEnd != '0000-00-00 00:00:00' ? this.dateEnd : null;
					news.datePost = this.datePost != '0000-00-00 00:00:00' ? this.datePost : null;
					news.showAlert = this.showAlert;
					news.isWPIToday = this.isWPIToday;
					news.isPinned = this.isPinned;
					news.isHome = this.isHome;
					news.createdAt = this.createdAt;
					news.updatedAt = this.updatedAt;
					news.createdBy = 1;
					news.modifiedBy = 1;
					newNews = await news.save({silent: true});
				} else {
					newNews = await News.create(
						{
							id: this.id,
							idNewsType: this.idNewsType,
							idNewsPhase: this.idNewsPhase,
							idNewsStatus: this.idNewsStatus,
							title: this.title !== null ? sanitizeHTML(this.title, config.sanitizeHTML.allowNone) : null,
							descriptionShort: this.descriptionShort !== null ? sanitizeHTML(this.descriptionShort, config.sanitizeHTML.allowNone) : null,
							why: this.why !== null ? sanitizeHTML(this.why, config.sanitizeHTML.allowNone) : null,
							impact: this.impact !== null ? sanitizeHTML(this.impact, config.sanitizeHTML.allowNone) : null,
							benefits: this.benefits !== null ? sanitizeHTML(this.benefits, config.sanitizeHTML.allowNone) : null,
							actionDescription: this.actionDescription !== null ? sanitizeHTML(this.actionDescription, config.sanitizeHTML.allowNone) : null,
							details: this.details !== null ? new HTMLToEditorJSParagraph(this.details).adapt() : null,
							dateStart: this.dateStart != '0000-00-00 00:00:00' ? this.dateStart : null,
							dateEnd: this.dateEnd != '0000-00-00 00:00:00' ? this.dateEnd : null,
							datePost: this.datePost != '0000-00-00 00:00:00' ? this.datePost : null,
							showAlert: this.showAlert,
							isWPIToday: this.isWPIToday,
							isPinned: this.isPinned,
							isHome: this.isHome,
							createdAt: this.createdAt || moment(new Date()).format(),
							updatedAt: this.updatedAt || moment(new Date()).format(),
							createdBy: 1,
							modifiedBy: 1
						},
						{
							silent: true
						}
					);
				}



				// find or create news subs


				const newsSubs = await this.getNewsSubs();
				const NewsSub = require('../NewsSub.js');
				const newsSubPromises = [];
				for (let newsSub of newsSubs) {
					newsSubPromises.push(
						new Promise((resolve, reject) => {
							NewsSub.findByPk(newsSub.id).then(async newsSub_ => {
								if (newsSub_) {
									newsSub_.idNews = newsSub.idNews;
									newsSub_.idNewsSubType = newsSub.idNewsSubType;
									newsSub_.title = newsSub.title !== null ? sanitizeHTML(newsSub.title, config.sanitizeHTML.allowNone) : null;
									newsSub_.descriptionShort = newsSub.descriptionShort !== null ? sanitizeHTML(newsSub.descriptionShort, config.sanitizeHTML.allowNone) : null;
									newsSub_.datePost = newsSub.datePost;
									resolve(await newsSub_.save());
									return null;
								} else {
									resolve(
										await NewsSub.create(
											{
												id: newsSub.id,
												idNews: newsSub.idNews,
												idNewsSubType: newsSub.idNewsSubType,
												title: newsSub.title !== null ? sanitizeHTML(newsSub.title, config.sanitizeHTML.allowNone) : null,
												descriptionShort: newsSub.descriptionShort !== null ? sanitizeHTML(newsSub.descriptionShort, config.sanitizeHTML.allowNone) : null,
												datePost: newsSub.datePost
											}
										)
									);
									return null;
								}
							}).catch(err => {
								reject(err);
								return null;
							});
						})
					);
				}


				// find or create tags


				const tags = await this.getTags();
				const Tag = require('../Tag.js');
				const tagPromises = [];
				for (let tag of tags) {
					tagPromises.push(
						new Promise((resolve, reject) => {
							Tag.findByPk(tag.id).then(async tag_ => {
								if (tag_) {
									tag_.title = tag.title;
									tag_.descriptionShort = tag.descriptionShort;
									resolve(await tag_.save());
									return null;
								} else {
									resolve(
										await Tag.create(
											{
												id: tag.id,
												title: tag.title,
												descriptionShort: tag.descriptionShort
											}
										)
									);
									return null;
								}
							}).catch(err => {
								reject(err);
								return null;
							});
						})
					);
				}



				// find or create audiences


				const audiences = await this.getAudiences();
				const Audience = require('../Audience.js');
				const audiencePromises = [];
				for (let audience of audiences) {
					audiencePromises.push(
						new Promise((resolve, reject) => {
							Audience.findByPk(audience.id).then(async audience_ => {
								if (audience_) {
									audience_.title = audience.title;
									audience_.descriptionShort = audience.descriptionShort;
									resolve(await audience_.save());
									return null;
								} else {
									resolve(
										await Audience.create(
											{
												id: audience.id,
												title: audience.title,
												descriptionShort: audience.descriptionShort
											}
										)
									);
									return null;
								}
							}).catch(err => {
								reject(err);
								return null;
							});
						})
					);
				}



				// resolve all those promises created above and add the associations to the new news


				Promise.all(newsSubPromises).then(async values => {
					const Action = require('../Action.js');
					try {
						newNews.updatedAt = moment.max([moment(newNews.updatedAt), ...values.map(v => moment(v.datePost))]).format();
						await newNews.save({silent: true});
					} catch (err) {
						logger.err(err);
					}
					for (let value of values) {
						this.getNewsSubActions(value.id).then(async newsSubActions => {
							for (let action of newsSubActions) {
								await value.addAction(
									await new Promise((resolve, reject) => {
										Action.findByPk(action.id).then(async action_ => {
											if (action_) {
												action_.idActionType = action.idActionType;
												action_.title = action.title;
												action_.link = action.link;
												action_.descriptionShort = action.descriptionShort;
												resolve(await action_.save());
												return null;
											} else {
												resolve(
													await Action.create(
														{
															id: action.id,
															idActionType: action.idActionType,
															title: action.title,
															link: action.link,
															descriptionShort: action.descriptionShort
														}
													)
												);
												return null;
											}
										}).catch(err => {
											reject(err);
											return null;
										});
									})
								);
							}
						}).catch(err => {
							reject(err);
							return null;
						});
						await newNews.addNewsSub(value);
					}

					Promise.all(tagPromises).then(async values => {
						for (let value of values) {
							await newNews.addTag(value);
						}
						Promise.all(audiencePromises).then(async values => {
							for (let value of values) {
								await newNews.addAudience(value);
							}
							resolve(newNews);
							return null;
						}).catch(err => {
							reject(err);
							return null;
						});
					}).catch(err => {
						reject(err);
						return null;
					});
				}).catch(err => {
					if (err) {
						reject(err);
						return null;
					}
				});
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	getNewsSubs() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT *
      FROM newsSub
      WHERE newsSub.idNews = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

	getNewsSubActions(newsSubID) {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT action.id, action.idActionType, action.title, action.link, action.descriptionShort, newsSub.id as newsSubID, newsSubHasAction.idNewsSub, newsSubHasAction.idAction
      FROM newsSub, action, newsSubHasAction
      WHERE action.id = newsSubHasAction.idAction
      AND newsSub.id = newsSubHasAction.idNewsSub
      AND newsSub.id = ${newsSubID}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

	getTags() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT tag.id, tag.title, tag.descriptionShort, news.id as newsID, newsHasTag.idNews, newsHasTag.idTag
      FROM tag, news, newsHasTag
      WHERE tag.id = newsHasTag.idTag
      AND news.id = newsHasTag.idNews
      AND news.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

	getAudiences() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT audience.id, audience.title, audience.descriptionShort, news.id as newsID, newsHasAudience.idNews, newsHasAudience.idAudience
      FROM audience, news, newsHasAudience
      WHERE audience.id = newsHasAudience.idAudience
      AND news.id = newsHasAudience.idNews
      AND news.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

};