'use strict';
module.exports = class Glossary extends require('sequelize').Model {
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
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			description: DataTypes.STRING(600),
			abbr: DataTypes.STRING(20),
			isPublished: DataTypes.BOOLEAN,
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			idMetadataPhase: DataTypes.INTEGER
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'glossary',
			tableName: 'glossary',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.MetadataPhase, {foreignKey: 'idMetadataPhase'});
		this.belongsToMany(models.Tag, {through: models.GlossaryHasTag, foreignKey: 'idGlossary'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}

	getURL() {
		return `/glossary/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const MetadataPhase = require('./MetadataPhase.js');
		const Tag = require('./Tag.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Glossary.findByPk(id, {
			include: [
				{
					model: MetadataPhase,
					where: enforcePublished_
				},
				{
					model: Tag,
					include: [
						{
							model: MetadataPhase,
							where: enforcePublishedAssociations_
						}
					]
				}
			]
		}
		);
	}
};