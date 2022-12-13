'use strict';
const moment = require('moment');

module.exports = class Gizmo extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			idSubSite: DataTypes.INTEGER,
			title: DataTypes.STRING(200),
			gizmoType: {
				type: DataTypes.STRING,
				values: ['text', 'article', 'spread', 'news', 'service', 'component', 'location', 'server', 'software', 'app', 'action']
			},
			content: DataTypes.STRING(5000),
			widthPct: {
				type: DataTypes.STRING(100),
				values: ['25', '33', '50', '66', '75', '100', 'auto']
			},
			maxHeightPx: {
				type: DataTypes.STRING(100),
				values: ['200px', '350px', '500px', '650px', '800px', 'auto', '100%', 'fit-content']
			},
			displayMode: {
				type: DataTypes.STRING,
				values: ['component', 'list']
			},
			limit: DataTypes.INTEGER, // 0 = dont limit
			orderResults: {
				type: DataTypes.STRING,
				values: ['id', 'title', 'updatedAt', 'createdAt']
			},
			orderResultsIsAsc: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isOr: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			orderPage: DataTypes.INTEGER
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'gizmo',
			tableName: 'gizmo',
			indexes: [
				{
					unique: true,
					fields: ['id', 'title']
				},
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.SubSite, { foreignKey: 'idSubSite' });
		this.belongsToMany(models.Tag, { through: models.GizmoHasTag, foreignKey: 'idGizmo' });
		this.belongsToMany(models.Audience, { through: models.GizmoHasAudience, foreignKey: 'idGizmo' });
	}

	static getGizmoData(id) {
		const Tag = require('./Tag.js');
		const Audience = require('./Audience.js');
		const NewsType = require('./NewsType.js');
		const NewsStatus = require('./NewsStatus.js');
		const NewsSub = require('./NewsSub.js');
		const FileUpload = require('./FileUpload.js');
		const LocationType = require('./LocationType.js');
		const SoftwareOS = require('./SoftwareOS.js');
		const { Op } = require('sequelize');
		return new Promise((resolve, reject) => {
			Gizmo.findByPk(id,
				{
					include: [
						{
							model: Tag
						},
						{
							model: Audience
						}
					]
				}
			).then(gizmo => {
				if (!gizmo) {
					resolve({data: []});
					return null;
				}
				if (gizmo.gizmoType === 'text') {
					resolve(
						{
							gizmoType: gizmo.gizmoType,
							widthPct: gizmo.widthPct,
							maxHeightPx: gizmo.maxHeightPx,
							displayMode: gizmo.displayMode,
							orderPage: gizmo.orderPage,
							content: gizmo.content
						}
					);
					return null;
				}
				const tagsRequired = gizmo.tags && gizmo.tags.length;
				const audiencesRequired = gizmo.audiences && gizmo.audiences.length;
				let Model = null, PhaseModel = null;
				let otherIncludes = [];
				switch (gizmo.gizmoType) {
					case 'article':
						Model = require('./Article.js');
						PhaseModel = require('./ArticlePhase.js');
						break;
					case 'spread':
						Model = require('./Spread.js');
						PhaseModel = require('./SpreadPhase.js');
						otherIncludes = [
							{
								model: FileUpload,
								as: 'image',
								required: false
							}
						];
						break;
					case 'news':
						Model = require('./News.js');
						PhaseModel = require('./NewsPhase.js');
						otherIncludes = [
							{
								model: NewsType,
								required: true
							},
							{
								model: NewsStatus,
								required: true
							},
							{
								model: NewsSub,
								required: false
							},
							{
								model: FileUpload,
								as: 'image',
								required: false
							}
						];
						break;
					case 'service':
						Model = require('./Service.js');
						PhaseModel = require('./CatalogPhase.js');
						break;
					case 'component':
						Model = require('./Component.js');
						PhaseModel = require('./CatalogPhase.js');
						break;
					case 'location':
						Model = require('./Location.js');
						PhaseModel = require('./SpacePhase.js');
						otherIncludes = [
							{
								model: LocationType,
								required: true
							}
						];
						break;
					case 'server':
						Model = require('./Server.js');
						PhaseModel = require('./ServerPhase.js');
						break;
					case 'software':
						Model = require('./Software.js');
						PhaseModel = require('./SoftwarePhase.js');
						otherIncludes = [
							{
								model: SoftwareOS,
								required: false
							}
						];
						break;
					// case 'app':
					// 	Model = require('./MyApp.js');
					// 	PhaseModel = require('./MyAppPhase.js');
					// 	break;
					// case 'action':
					// 	Model = require('./Action.js');
					// 	PhaseModel = require('./MetadataPhase.js');
					// 	break;
					default:
						resolve({});
						return null;
				}

				let whereTags = {};
				if (tagsRequired) {
					whereTags = {
						id: {
							[Op.in]: gizmo.tags.map(tag => tag.id)
						}
					};
				}
				let whereAudiences = {};
				if (audiencesRequired) {
					whereAudiences = {
						id: {
							[Op.in]: gizmo.audiences.map(audience => audience.id)
						}
					};
				}
				return Model.findAll(
					{
						include: [
							...otherIncludes,
							{
								model: PhaseModel,
								where: {
									title: 'publish'
								}
							},
							{
								model: Tag,
								required: tagsRequired,
								where: whereTags
							},
							{
								model: Audience,
								required: audiencesRequired,
								where: whereAudiences
							}
						]
					}
				).then(models => {
					let result = [];
					for (let model of models) {
						// let imageSrc = null;
						// if ('image' in model) {
						// 	imageSrc = model.image.getURL();
						// }
						// if (imageSrc) {
						// 	model = model.toJSON();
						// 	model.image.src = imageSrc;
						// }
						if (tagsRequired) {
							if (model.tags.length === gizmo.tags.length) { // allowed
								result.push(model);
							} // else not allowed
						} else {
							result.push(model);
						}
					}

					result.sort((a, b) => {
						switch (gizmo.orderResults) {
							case 'id':
								if (gizmo.orderResultsIsAsc) {
									return a.id - b.id;
								} else {
									return b.id - a.id;
								}
							case 'title':
								if (gizmo.orderResultsIsAsc) {
									return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1;
								} else {
									return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
								}
							case 'updatedAt':
							case 'createdAt':
								if (gizmo.orderResultsIsAsc) {
									return moment(a[gizmo.orderResults]).isAfter(moment(b[gizmo.orderResults])) ? 1 : -1;
								} else {
									return moment(a[gizmo.orderResults]).isAfter(moment(b[gizmo.orderResults])) ? -1 : 1;
								}
						}
					});
					if (gizmo.limit != 0) {
						result = result.slice(0, gizmo.limit);
					}
					resolve(
						{
							gizmoType: gizmo.gizmoType,
							widthPct: gizmo.widthPct,
							maxHeightPx: gizmo.maxHeightPx,
							displayMode: gizmo.displayMode,
							orderPage: gizmo.orderPage,
							content: gizmo.content,
							data: result
						}
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

};