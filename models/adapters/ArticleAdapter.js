'use strict';

const sanitizeHTML = require('sanitize-html');
const config = require('../../config.js');
const HTMLToEditorJSParagraph = require('./HTMLToEditorJSParagraph.js');

module.exports = class ArticleAdapter {
	constructor(legacyArticle, connection) {

		this.connection = connection;

		this.id = legacyArticle.id;
		this.idArticlePhase = legacyArticle.idArticlePhase;
		this.requireAuth = legacyArticle.requireAuth;
		this.title = legacyArticle.title;
		this.descriptionShort = legacyArticle.descriptionShort;
		this.content = legacyArticle.content;
		this.dateCreate = legacyArticle.dateCreate;
		this.dateModify = legacyArticle.dateModify;
		this.idCherwell = legacyArticle.idCherwell;
		this.dateReviewBy = legacyArticle.dateReviewBy;
		this.timing = legacyArticle.timing;
		this.difficulty = legacyArticle.difficulty;
		this.contentAlt = legacyArticle.contentAlt;
		this.contentInternal = legacyArticle.contentInternal;
	}

	/**
   * ! DANGEROUS do not do this unless you are Chris or Ryan
   */
	static importAllArticles(connection) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT id FROM article', (err, results) => {
				if (err) {
					return reject(err);
				} else {
					const promiseLand = [];
					for (let result of results) {
						promiseLand.push(ArticleAdapter.findById(result.id, connection));
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
   * @fulfill {ArticleAdapter}
   * @reject {Error}
   * @returns {Promise.<ArticleAdapter>}
   */
	static findById(id, connection) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT *
      FROM article
      WHERE article.id = ${id}`, (err, results) => {
				if (err) reject(err);
				if (results && results[0]) {
					resolve(new ArticleAdapter(results[0], connection));
				} else {
					reject('no article found with that id');
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
			const G = require('../../server/_global_logic.js');
			const Article = require('../Article.js');
			const moment = require('moment');
			Article.findByPk(this.id).then(async article => {
				let newArticle;
				if (article) {
					article.idArticlePhase = this.idArticlePhase;
					article.requireAuth = this.requireAuth;
					article.title = sanitizeHTML(this.title, config.sanitizeHTML.allowNone);
					article.descriptionShort = sanitizeHTML(this.descriptionShort, config.sanitizeHTML.allowNone);
					article.idCherwell = this.idCherwell;
					article.dateReviewBy = this.dateReviewBy != '0000-00-00 00:00:00' ? this.dateReviewBy : G.defaultDateReviewByFunction();
					article.timing = this.timing;
					article.difficulty = this.difficulty;
					article.createdAt = this.dateCreate != '0000-00-00 00:00:00' ? this.dateCreate : moment(new Date()).format();
					article.updatedAt = this.dateModify != '0000-00-00 00:00:00' ? this.dateModify : moment(new Date()).format();
					article.createdBy = 1;
					article.modifiedBy = 1;
					article.useLegacy = true;
					article.contentLegacy = this.content;
					article.contentAltLegacy = this.contentAlt;
					article.contentInternalLegacy = this.contentInternal;
					newArticle = await article.save();
				} else {
					newArticle = await Article.create(
						{
							id: this.id,
							idArticlePhase: this.idArticlePhase,
							requireAuth: this.requireAuth,
							title: sanitizeHTML(this.title, config.sanitizeHTML.allowNone),
							descriptionShort: sanitizeHTML(this.descriptionShort, config.sanitizeHTML.allowNone),
							idCherwell: this.idCherwell,
							dateReviewBy: this.dateReviewBy != '0000-00-00 00:00:00' ? this.dateReviewBy : G.defaultDateReviewByFunction(),
							timing: this.timing,
							difficulty: this.difficulty,
							createdAt: this.dateCreate != '0000-00-00 00:00:00' ? this.dateCreate : moment(new Date()).format(),
							updatedAt: this.dateModify != '0000-00-00 00:00:00' ? this.dateModify : moment(new Date()).format(),
							createdBy: 1,
							modifiedBy: 1,
							useLegacy: true,
							contentLegacy: this.content,
							contentAltLegacy: this.contentAlt,
							contentInternalLegacy: this.contentInternal
						}
					);
				}

				// find or create actions


				const actions = await this.getActions();
				const Action = require('../Action.js');
				const actionPromises = [];
				for (let action of actions) {
					actionPromises.push(
						new Promise((resolve, reject) => {
							Action.findByPk(action.id).then(async action_ => {
								if (action_) {
									action_.idActionType = action.idActionType;
									action_.title = sanitizeHTML(action.title, config.sanitizeHTML.allowNone);
									action_.link = action.link;
									action_.descriptionShort = sanitizeHTML(action.descriptionShort, config.sanitizeHTML.allowNone);
									resolve(await action_.save());
									return null;
								} else {
									resolve(
										await Action.create(
											{
												id: action.id,
												idActionType: action.idActionType,
												title: sanitizeHTML(action.title, config.sanitizeHTML.allowNone),
												link: action.link,
												descriptionShort: sanitizeHTML(action.descriptionShort, config.sanitizeHTML.allowNone),
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
									audience_.title = sanitizeHTML(audience.title, config.sanitizeHTML.allowNone);
									audience_.descriptionShort = sanitizeHTML(audience.descriptionShort, config.sanitizeHTML.allowNone);
									resolve(await audience_.save());
									return null;
								} else {
									resolve(
										await Audience.create(
											{
												id: audience.id,
												title: sanitizeHTML(audience.title, config.sanitizeHTML.allowNone),
												descriptionShort: sanitizeHTML(audience.descriptionShort, config.sanitizeHTML.allowNone),
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
									tag_.title = sanitizeHTML(tag.title, config.sanitizeHTML.allowNone);
									tag_.descriptionShort = sanitizeHTML(tag.descriptionShort, config.sanitizeHTML.allowNone);
									resolve(await tag_.save());
									return null;
								} else {
									resolve(
										await Tag.create(
											{
												id: tag.id,
												title: sanitizeHTML(tag.title, config.sanitizeHTML.allowNone),
												descriptionShort: sanitizeHTML(tag.descriptionShort, config.sanitizeHTML.allowNone),
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


				// find or create software


				const softwares = await this.getSoftware();
				const Software = require('../Software.js');
				const softwarePromises = [];
				for (let software of softwares) {
					softwarePromises.push(
						new Promise((resolve, reject) => {
							Software.findByPk(software.id).then(async software_ => {
								if (software_) {
									software_.idSoftwarePhase = software.idSoftwarePhase;
									software_.isAvailable = software.isAvailable;
									software_.title = sanitizeHTML(software.title, config.sanitizeHTML.allowNone);
									software_.version = software.version;
									software_.supported = sanitizeHTML(software.supported, config.sanitizeHTML.allowNone);
									software_.releaseYear = software.releaseYear;
									software_.publisher = sanitizeHTML(software.publisher, config.sanitizeHTML.allowNone);
									software_.publisherShort = sanitizeHTML(software.publisherShort, config.sanitizeHTML.allowNone);
									software_.ownerSoftware = sanitizeHTML(software.ownerSoftware, config.sanitizeHTML.allowNone);
									software_.ownerBusiness = sanitizeHTML(software.ownerBusiness, config.sanitizeHTML.allowNone);
									software_.isLicensed = software.isLicensed;
									software_.isCLA = software.isCLA;
									software_.isSCCM = software.isSCCM;
									software_.useWPI = software.useWPI;
									software_.usePersonal = software.usePersonal;
									software_.installWho = sanitizeHTML(software.installWho, config.sanitizeHTML.allowNone);
									software_.requirements = sanitizeHTML(software.requirements, config.sanitizeHTML.allowNone);
									software_.dependencies = sanitizeHTML(software.dependencies, config.sanitizeHTML.allowNone);
									software_.requesting = sanitizeHTML(software.requesting, config.sanitizeHTML.allowNone);
									software_.installPointAdmin = sanitizeHTML(software.installPointAdmin, config.sanitizeHTML.allowNone);
									software_.installPointPublic = sanitizeHTML(software.installPointPublic, config.sanitizeHTML.allowNone);
									software_.descriptionShort = sanitizeHTML(software.descriptionShort, config.sanitizeHTML.allowNone);
									software_.descriptionLong = new HTMLToEditorJSParagraph(software.descriptionLong).adapt();
									software_.dateReviewBy = software.dateReviewBy || G.defaultDateReviewByFunction();
									software_.createdAt = software.dateCreate || moment(new Date()).format();
									software_.modifiedAt = software.dateModify || moment(new Date()).format();
									resolve(await software_.save());
									return null;
								} else {
									resolve(
										await Software.create(
											{
												id: software.id,
												idSoftwarePhase: software.idSoftwarePhase,
												isAvailable: software.isAvailable,
												title: sanitizeHTML(software.title, config.sanitizeHTML.allowNone),
												version: software.version,
												supported: sanitizeHTML(software.supported, config.sanitizeHTML.allowNone),
												releaseYear: software.releaseYear,
												publisher: sanitizeHTML(software.publisher, config.sanitizeHTML.allowNone),
												publisherShort: sanitizeHTML(software.publisherShort, config.sanitizeHTML.allowNone),
												ownerSoftware: sanitizeHTML(software.ownerSoftware, config.sanitizeHTML.allowNone),
												ownerBusiness: sanitizeHTML(software.ownerBusiness, config.sanitizeHTML.allowNone),
												isLicensed: software.isLicensed,
												isCLA: software.isCLA,
												isSCCM: software.isSCCM,
												useWPI: software.useWPI,
												usePersonal: software.usePersonal,
												installWho: sanitizeHTML(software.installWho, config.sanitizeHTML.allowNone),
												requirements: sanitizeHTML(software.requirements, config.sanitizeHTML.allowNone),
												dependencies: sanitizeHTML(software.dependencies, config.sanitizeHTML.allowNone),
												requesting: sanitizeHTML(software.requesting, config.sanitizeHTML.allowNone),
												installPointAdmin: sanitizeHTML(software.installPointAdmin, config.sanitizeHTML.allowNone),
												installPointPublic: sanitizeHTML(software.installPointPublic, config.sanitizeHTML.allowNone),
												descriptionShort: sanitizeHTML(software.descriptionShort, config.sanitizeHTML.allowNone),
												descriptionLong: new HTMLToEditorJSParagraph(software.descriptionLong).adapt(),
												dateReviewBy: software.dateReviewBy || G.defaultDateReviewByFunction(),
												createdAt: software.dateCreate || moment(new Date()).format(),
												modifiedAt: software.dateModify || moment(new Date()).format()
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


				// find or create services


				const services = await this.getServices();
				const Service = require('../Service.js');
				const servicePromises = [];
				for (let service of services) {
					servicePromises.push(
						new Promise((resolve, reject) => {
							Service.findByPk(service.id).then(async service_ => {
								if (service_) {
									service_.title = service.title;
									service_.icon = service.icon;
									service_.descriptionShort = sanitizeHTML(service.descriptionShort, config.sanitizeHTML.allowNone);
									service_.descriptionLong = service.descriptionLong;
									service_.idCatalogPhase = service.idCatalogPhase;
									service_.idCatalogStatus = service.idCatalogStatus;
									service_.availability = sanitizeHTML(service.availability, config.sanitizeHTML.allowNone);
									service_.cost = sanitizeHTML(service.cost, config.sanitizeHTML.allowNone);
									service_.support = sanitizeHTML(service.support, config.sanitizeHTML.allowNone);
									service_.requirements = sanitizeHTML(service.requirements, config.sanitizeHTML.allowNone);
									service_.requesting = sanitizeHTML(service.requesting, config.sanitizeHTML.allowNone);
									service_.maintenance = sanitizeHTML(service.maintenance, config.sanitizeHTML.allowNone);
									service_.benefits = sanitizeHTML(service.benefits, config.sanitizeHTML.allowNone);
									service_.ownerService = sanitizeHTML(service.ownerService, config.sanitizeHTML.allowNone);
									service_.ownerBusiness = sanitizeHTML(service.ownerBusiness, config.sanitizeHTML.allowNone);
									service_.dateReviewBy = service.dateReviewBy || G.defaultDateReviewByFunction();
									service_.createdAt = service.dateCreate || moment(new Date()).format();
									service_.modifiedAt = service.dateModify || moment(new Date()).format();
									resolve(await service_.save());
									return null;
								} else {
									resolve(
										await Service.create(
											{
												id: service.id,
												title: service.title,
												icon: service.icon,
												descriptionShort: sanitizeHTML(service.descriptionShort, config.sanitizeHTML.allowNone),
												descriptionLong: service.descriptionLong,
												idCatalogPhase: service.idCatalogPhase,
												idCatalogStatus: service.idCatalogStatus,
												availability: sanitizeHTML(service.availability, config.sanitizeHTML.allowNone),
												cost: sanitizeHTML(service.cost, config.sanitizeHTML.allowNone),
												support: sanitizeHTML(service.support, config.sanitizeHTML.allowNone),
												requirements: sanitizeHTML(service.requirements, config.sanitizeHTML.allowNone),
												requesting: sanitizeHTML(service.requesting, config.sanitizeHTML.allowNone),
												maintenance: sanitizeHTML(service.maintenance, config.sanitizeHTML.allowNone),
												benefits: sanitizeHTML(service.benefits, config.sanitizeHTML.allowNone),
												ownerService: sanitizeHTML(service.ownerService, config.sanitizeHTML.allowNone),
												ownerBusiness: sanitizeHTML(service.ownerBusiness, config.sanitizeHTML.allowNone),
												dateReviewBy: service.dateReviewBy || G.defaultDateReviewByFunction(),
												createdAt: service.dateCreate || moment(new Date()).format(),
												modifiedAt: service.dateModify || moment(new Date()).format()
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


				// resolve all those promises created above and add the associations to the new article


				Promise.all(actionPromises).then(async values => {
					for (let value of values) {
						await newArticle.addAction(value);
					}
					Promise.all(audiencePromises).then(async values => {
						for (let value of values) {
							await newArticle.addAudience(value);
						}
						Promise.all(tagPromises).then(async values => {
							for (let value of values) {
								await newArticle.addTag(value);
							}
							Promise.all(softwarePromises).then(async values => {
								for (let value of values) {
									await newArticle.addSoftware(value);
								}
								Promise.all(servicePromises).then(async values => {
									for (let value of values) {
										await newArticle.addService(value);
									}
									resolve(newArticle);
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
							reject(err);
							return null;
						});
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
		});
	}

	getActions() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT action.id, action.idActionType, action.title, action.link, action.descriptionShort
      FROM article, action, articleHasAction
      WHERE action.id = articleHasAction.idAction
      AND article.id = articleHasAction.idArticle
      AND article.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

	getAudiences() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT audience.id, audience.title, audience.descriptionShort, article.id as articleID, articleHasAudience.idArticle, articleHasAudience.idAudience
      FROM audience, article, articleHasAudience
      WHERE audience.id = articleHasAudience.idAudience
      AND article.id = articleHasAudience.idArticle
      AND article.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

	getTags() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT tag.id, tag.title, tag.descriptionShort, article.id as articleID, articleHasTag.idArticle, articleHasTag.idTag
      FROM tag, article, articleHasTag
      WHERE tag.id = articleHasTag.idTag
      AND article.id = articleHasTag.idArticle
      AND article.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});

	}

	getSoftware() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT software.*
      FROM software
      LEFT JOIN softwareHasArticle
      ON software.id = softwareHasArticle.idSoftware
      LEFT JOIN article
      ON article.id = softwareHasArticle.idArticle
      WHERE article.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}

	getServices() {
		return new Promise((resolve, reject) => {
			this.connection.query(`SELECT service.*
       FROM service
       LEFT JOIN serviceHasArticle
       ON service.id = serviceHasArticle.idService
       LEFT JOIN article
       ON article.id = serviceHasArticle.idArticle
       WHERE article.id = ${this.id}`, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}
};