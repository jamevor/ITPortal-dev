'use strict';
const G = require('../server/_global_logic.js');
const DayOfWeek = require('./DayOfWeek.js');
const StandardHours = require('./StandardHours.js');
const SpecialHours = require('./SpecialHours.js');
const { Op } = require('sequelize');
const moment = require('moment');

module.exports = class Location extends require('sequelize').Model {
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
			idSpacePhase: DataTypes.INTEGER,
			idLocationType: {
				type: DataTypes.INTEGER
			},
			idBuilding: {
				type: DataTypes.INTEGER
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			room: DataTypes.STRING(60),
			hostname: DataTypes.STRING(63),
			descriptionShort: DataTypes.STRING(500),
			roomNotes: DataTypes.STRING(1000),
			seats: DataTypes.INTEGER,
			computers: DataTypes.INTEGER,
			hasPrinter: DataTypes.BOOLEAN,
			hasColorPrinter: DataTypes.BOOLEAN,
			hasPharos: DataTypes.BOOLEAN,
			hasProjection: DataTypes.BOOLEAN,
			hasDualProjection: DataTypes.BOOLEAN,
			hasDocCamera: DataTypes.BOOLEAN,
			hasLectureCap: DataTypes.BOOLEAN,
			hasVoiceAmp: DataTypes.BOOLEAN,
			hasWirelessVoiceAmp: DataTypes.BOOLEAN,
			hasPOD: DataTypes.BOOLEAN,
			hasDisplay: DataTypes.BOOLEAN,
			hasHostPC: DataTypes.BOOLEAN,
			hasWacomTouchscreen: DataTypes.BOOLEAN,
			hasHDMILaptopCable: DataTypes.BOOLEAN,
			hasUSBCLaptopCable: DataTypes.BOOLEAN,
			hasBlurayPlayer: DataTypes.BOOLEAN,
			hasZoomCapable: DataTypes.BOOLEAN,
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValie: G.defaultDateReviewByFunction
			},
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasHours: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			idImage: DataTypes.INTEGER,
			accessRestricted: DataTypes.BOOLEAN
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'location',
			tableName: 'location',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.SpacePhase, {foreignKey: 'idSpacePhase'});
		this.belongsTo(models.LocationType, {foreignKey: 'idLocationType'});
		this.belongsTo(models.Building, {foreignKey: 'idBuilding'});
		this.belongsToMany(models.Alias, {through: models.LocationHasAlias, foreignKey: 'idLocation'});
		this.belongsToMany(models.Audience, {through: models.LocationHasAudience, foreignKey: 'idLocation'});
		this.belongsToMany(models.Package, {through: models.LocationHasPackage, foreignKey: 'idLocation'});
		this.belongsToMany(models.Tag, {through: models.LocationHasTag, foreignKey: 'idLocation'});
		this.belongsToMany(models.Software, {through: models.SoftwareHasLocation, foreignKey: 'idLocation'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.hasMany(models.StandardHours, { foreignKey: 'idLocation'});
		this.hasMany(models.SpecialHours, { foreignKey: 'idLocation'});
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage'});
		this.belongsToMany(models.Group, { through: models.LocationHasGroup, foreignKey: 'idLocation' });
		this.belongsToMany(models.Article, {through: models.LocationHasArticle, foreignKey: 'idLocation'});
	}

	getURL() {
		return `/location/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.spacePhase.title;
	}

	isAccessRestricted() {
		return this.accessRestricted;
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const LocationType = require('./LocationType.js');
		const Building = require('./Building.js');
		const Alias = require('./Alias.js');
		const Audience = require('./Audience.js');
		const Package = require('./Package.js');
		const PackagePhase = require('./PackagePhase.js');
		const Tag = require('./Tag.js');
		const Software = require('./Software.js');
		const SoftwarePhase = require('./SoftwarePhase.js');
		const SpacePhase = require('./SpacePhase.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const User = require('./User.js');
		const FileUpload = require('./FileUpload.js');
		const Article = require('./Article.js');
		const ArticlePhase = require('./ArticlePhase.js');


		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};


		return Location.findByPk(id,
			{
				include: [
					{
						model: SpacePhase,
						where: enforcePublished_
					},
					{
						model: LocationType
					},
					{
						model: Building,
						include: [
							{
								model: SpacePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Alias,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Audience,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Package,
						include: [
							{
								model: Software,
								include: [
									{
										model: SoftwarePhase,
										where: enforcePublishedAssociations_
									}
								]
							},
							{
								model: PackagePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Tag,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Software,
						include: [
							{
								model: SoftwarePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Article,
						indluce: [
							{
								model: ArticlePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: User,
						as: 'userCreatedBy'
					},
					{
						model: User,
						as: 'userModifiedBy'
					},
					{
						model: FileUpload,
						as: 'image'
					}
				]
			}
		);
	}

	/**
	 * @description Get open hours for current week [M-Sun].
	 */
	async getOpenTimesForThisWeek() {
		const standardHours = await StandardHours.findAll(
			{
				where: {
					idLocation: this.id
				},
				include: [
					{
						model: DayOfWeek
					}
				],
				order: [
					['idDayOfWeek', 'ASC']
				]
			}
		);

		const result = [];

		for (const standardHour of standardHours) {
			result.push(
				{
					isSpecial: false,
					weekday: standardHour.dayOfWeek.title,
					isClosed: standardHour.isClosed,
					timeOpen: standardHour.timeOpen,
					timeClosed: standardHour.timeClosed,
					reason: null
				}
			);
		}

		const specialHours = await SpecialHours.findAll(
			{
				where: {
					idLocation: this.id,
					date: {
						[Op.between]: [moment().startOf('isoWeek'), moment().endOf('isoWeek')]
					}
				}
			}
		);

		for (const specialHour of specialHours) {
			const isoWeekday = moment(specialHour.date, 'YYYY-MM-DD').isoWeekday() - 1; // 1=monday => 7=sunday, subtract 1 to shift left for array index
			result[isoWeekday] = {
				isSpecial: true,
				weekday: result[isoWeekday].weekday,
				isClosed: specialHour.isClosed,
				timeOpen: specialHour.timeOpen,
				timeClosed: specialHour.timeClosed,
				reason: specialHour.reason
			};
		}

		return result;
	}

	/**
	 * @description Get open hours for yesterday through today + 6 days.
	 * @param {Number} weekdayOrder - 1=Monday, 7=Sunday. Defaults to today.
	 */
	async getOpenTimesFromDay(weekdayOrder) {

		weekdayOrder = typeof weekdayOrder !== 'undefined' ? weekdayOrder : moment().local().isoWeekday(); // 1=Monday, 7=Sunday

		const standardHours = await StandardHours.findAll(
			{
				where: {
					idLocation: this.id
				},
				include: [
					{
						model: DayOfWeek
					}
				],
				order: [
					['idDayOfWeek', 'ASC']
				]
			}
		);

		const result = [];
		const storedParts = []; // if today is Wed (3), 1 and 2 should go to the end
		for (const standardHour of standardHours) {
			const item = {
				idDayOfWeek: standardHour.idDayOfWeek,
				isToday: weekdayOrder === standardHour.idDayOfWeek,
				isSpecial: false,
				weekday: standardHour.dayOfWeek.titleShort,
				isClosed: standardHour.isClosed,
				timeOpen: standardHour.timeOpen,
				timeClosed: standardHour.timeClosed,
				reason: null
			};
			if (standardHour.dayOfWeek.order < weekdayOrder) {
				storedParts.push(item);
			} else {
				result.push(item);
			}
		}
		result.push(...storedParts);

		const specialHours = await SpecialHours.findAll(
			{
				where: {
					idLocation: this.id,
					date: {
						[Op.between]: [moment().isoWeekday(weekdayOrder).startOf('day').format(), moment().isoWeekday(weekdayOrder).add(6, 'days').endOf('day').format()]
					}
				}
			}
		);

		for (const specialHour of specialHours) {
			const isoWeekday = moment(specialHour.date, 'YYYY-MM-DD').isoWeekday(); // 1=monday => 7=sunday
			const index = result.findIndex(item => item.idDayOfWeek === isoWeekday);
			if (index !== -1) {
				result[index] = {
					idDayOfWeek: result[index].idDayOfWeek,
					isToday: result[index].isToday,
					isSpecial: true,
					weekday: result[index].weekday,
					isClosed: specialHour.isClosed,
					timeOpen: specialHour.timeOpen,
					timeClosed: specialHour.timeClosed,
					reason: specialHour.reason
				};
			}
		}

		return result;
	}
};
