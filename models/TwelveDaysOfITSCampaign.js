'use strict';
module.exports = class TwelveDaysOfITSCampaign extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			idUser: DataTypes.INTEGER,
			hasViewedNews: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedMasterSpread: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread1: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread2: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread3: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread4: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread5: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread6: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread7: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread8: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread9: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread10: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread11: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hasViewedSpread12: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'twelveDaysOfITSCampaign',
			tableName: 'twelveDaysOfITSCampaign',
			indexes: [
				{
					unique: true,
					fields: ['idUser']
				},
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'idUser' });
	}

	static updateUserProgress(idUser, pageVisit) {
		return new Promise((resolve, reject) => {
			TwelveDaysOfITSCampaign.findOrCreate(
				{
					where: {
						idUser
					}
				}
			).then(async([row, created]) => {
				if (pageVisit) {
					row[pageVisit] = true;
				}
				row = await row.save();
				resolve([row, created]);
				return null;
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	// /**
	//  * @author Ryan LaMarche
	//  * @description Record a view / page visit for a user.
	//  * @param {Number} idUser the user's id.
	//  * @param {String} entity the entity to record for `['article', 'news', ...]`.
	//  * @param {Number} entityID the id of the entity.
	//  * @param {String} entityTitle the title of the entity.
	//  * @return {Promise} that will resolve with the userViewHistory object.
	//  */
	// static recordView(idUser, entity, entityID, entityTitle) {
	//   return new Promise((resolve, reject) => {
	//     UserViewHistory.create(
	//       {
	//         idUser,
	//         entity,
	//         entityID,
	//         entityTitle
	//       }
	//     ).then(userViewHistory => {
	//       resolve(userViewHistory);
	//       return null;
	//     }).catch(err => {
	//       reject(err);
	//       return null;
	//     });
	//   });
	// }

	// /**
	//  * @author Ryan LaMarche
	//  * @description get user's history by `user.id`.
	//  * @param {Number} id `user.id`.
	//  * @return {Promise<any>} a promise that will resolve with all of user's history.
	//  */
	// static findByUserId(id) {
	//   return new Promise((globalResolve, globalReject) => {
	//     UserViewHistory.findAll(
	//       {
	//         where: {
	//           idUser: id
	//         },
	//         order: [
	//           ['createdAt', 'DESC'] // most recent first
	//         ]
	//       }
	//     ).then(userViewHistory => {
	//       const result = [];
	//       for (const userViewHistoryItem of userViewHistory) {
	//         const item = userViewHistoryItem.toJSON();
	//         switch (userViewHistoryItem.entity) {
	//           case 'article':
	//             item.href = `/article/${item.entityID}`;
	//             item.color = '9193fa';
	//             item.icon = 'fa-file-alt';
	//             break;
	//           case 'spread':
	//             item.href = `/spread/${item.entityID}`;
	//             item.color = '9193fa';
	//             item.icon = 'fa-columns';
	//             break;
	//           case 'portfolio':
	//             item.href = `/portfolio/${item.entityID}`;
	//             item.color = '36d657';
	//             item.icon = 'fa-book';
	//             break;
	//           case 'service':
	//             item.href = `/service/${item.entityID}`;
	//             item.color = '36d657';
	//             item.icon = 'fa-book';
	//             break;
	//           case 'component':
	//             item.href = `/component/${item.entityID}`;
	//             item.color = '36d657';
	//             item.icon = 'fa-book';
	//             break;
	//           case 'news':
	//             item.href = `/news/${item.entityID}`;
	//             item.color = 'c1272d';
	//             item.icon = 'fa-newspaper';
	//             break;
	//           case 'software':
	//             item.href = `/software/${item.entityID}`;
	//             item.color = 'ff921f';
	//             item.icon = 'fa-arrow-alt-to-bottom';
	//             break;
	//           case 'building':
	//             item.href = `/building/${item.entityID}`;
	//             item.color = 'f3553d';
	//             item.icon = 'fa-building';
	//             break;
	//           case 'location':
	//             item.href = `/location/${item.entityID}`;
	//             item.color = 'f3553d';
	//             item.icon = 'fa-map-marker-alt';
	//             break;
	//           default:
	//             break;
	//         }
	//         result.push(item);
	//       }
	//       globalResolve(result);
	//       return null;
	//     }).catch(err => {
	//       globalReject(err);
	//       return null;
	//     });
	//   });
	// }

};