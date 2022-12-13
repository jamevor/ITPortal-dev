'use strict';
const G = require('../server/_global_logic.js');
module.exports = class SubSite extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			titleRoute: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			idImage: DataTypes.INTEGER,
			icon: DataTypes.STRING(30),
			color: DataTypes.STRING(6),
			idSubSitePhase: DataTypes.INTEGER,
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValue: G.defaultDateReviewByFunction
			},
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			accessRestricted: DataTypes.BOOLEAN,
			isPublic: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			isFeatured: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		}, {
			sequelize,
			freezeTableName: false,
			timestamps: true,
			modelName: 'subSite',
			tableName: 'subSite',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.SubSitePhase, { foreignKey: 'idSubSitePhase' });
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage' });
		this.belongsToMany(models.Tag, { through: models.SubSiteHasTag, foreignKey: 'idSubSite' });
		this.belongsToMany(models.Audience, { through: models.SubSiteHasAudience, foreignKey: 'idSubSite' });
		this.belongsToMany(models.Group, { through: models.SubSiteHasGroup, foreignKey: 'idSubSite' });
		this.hasMany(models.Gizmo, { foreignKey: 'idSubSite' });
		this.hasMany(models.SubSiteFeaturedContent, { foreignKey: 'idSubSite' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy' });
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy' });
	}

	getURL() {
		if (this.titleRoute && this.titleRoute.length) {
			return `/s/${this.id}/${this.titleRoute.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
		} else {
			return `/s/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
		}
	}

	getPhaseTitle() {
		return this.subSitePhase.title;
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
		const FileUpload = require('./FileUpload.js');
		const User = require('./User.js');
		const SubSitePhase = require('./SubSitePhase.js');
		const Tag = require('./Tag.js');
		const Audience = require('./Audience.js');
		const Gizmo = require('./Gizmo.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const SubSiteFeaturedContent = require('./SubSiteFeaturedContent.js');
		const SubSiteFeaturedContentPosition = require('./SubSiteFeaturedContentPosition.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return SubSite.findByPk(id,
			{
				include: [
					{
						model: SubSitePhase,
						where: enforcePublished_
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
						model: Tag,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Gizmo,
						include: [
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
								model: Tag,
								include: [
									{
										model: MetadataPhase,
										where: enforcePublishedAssociations_
									}
								]
							},
						]
					},
					{
						model: SubSiteFeaturedContent,
						required: false,
						where: {
							isPublished: true
						},
						include: [
							{
								model: SubSiteFeaturedContentPosition
							},
							{
								model: FileUpload,
								as: 'image'
							}
						]
					},
					{
						model: FileUpload,
						as: 'image'
					},
					{
						model: User,
						as: 'userCreatedBy'
					},
					{
						model: User,
						as: 'userModifiedBy'
					}
				]
			}
		);
	}


};