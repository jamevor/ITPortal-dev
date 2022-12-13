'use strict';

const { Op } = require('sequelize');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const Permission = require('../models/Permission.js');
const User = require('../models/User.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const G = require('./_global_logic.js');

module.exports = {
	// VIEWS
	render: async(req, res, next) => {
		Group.findByPk(req.params.id,
			{
				include: [
					{
						model: GroupPermissionLevel,
						include: [
							{
								model: Permission
							},
							{
								model: PermissionLevel
							}
						]
					},
					{
						model: User,
						attributes: ['id', 'guidPublic', 'givenname', 'surname', 'username']
					}
				]
			}
		).then(async group => {
			res.render('group/view.ejs',
				{
					group,
					permissions: await Permission.findAll(),
					permissionLevels: await PermissionLevel.findAll()
				}
			);
			return null;
		});
	},
	new: async(req, res, next) => {
		res.render('group/view.ejs',
			{
				group: null,
				permissions: await Permission.findAll(),
				permissionLevels: await PermissionLevel.findAll(),
				edit: true
			}
		);
		return null;
	},
	edit: (req, res, next) => {
		Group.findByPk(req.params.id,
			{
				include: [
					{
						model: GroupPermissionLevel,
						include: [
							{
								model: Permission
							},
							{
								model: PermissionLevel
							}
						]
					},
					{
						model: User,
						attributes: ['id', 'guidPublic', 'givenname', 'surname', 'username']
					}
				]
			}
		).then(async group => {
			res.render('group/view.ejs',
				{
					group,
					permissions: await Permission.findAll(),
					permissionLevels: await PermissionLevel.findAll(),
					edit: true
				}
			);
			return null;
		});
	},
	// API
	createOne: async(req, res, next) => {
		const group = await Group.create(
			{
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				isSuper: req.body.isSuper === 'true'
			}
		);
		if (Array.isArray(req.body.users) && req.body.users.length) {
			group.setUsers(req.body.users.filter((value, index, self) => self.indexOf(value) === index));
		} else {
			group.setUsers([]);
		}
		await group.save();

		const groupID = group.id;
		const updatePermissionsPromises = [];
		for (const permission of req.body.permissions) {
			const permissionID = permission.permissionID;
			const permissionLevelID = permission.permissionLevelID;
			updatePermissionsPromises.push(
				new Promise((resolve, reject) => {
					return Permission.findByPk(permissionID).then(permission => {
						if (permission) {
							return PermissionLevel.findByPk(permissionLevelID).then(permissionLevel => {
								if (permissionLevel) {
									return GroupPermissionLevel.findOne(
										{
											where: {
												idGroup: groupID,
												idPermission: permission.id
											}
										}
									).then(async groupPermissionLevel => {
										if (groupPermissionLevel) {
											groupPermissionLevel.idPermissionLevel = permissionLevel.id;
											await groupPermissionLevel.save();
											resolve(true);
											return null;
										} else {
											await GroupPermissionLevel.create(
												{
													idGroup: groupID,
													idPermission: permission.id,
													idPermissionLevel: permissionLevel.id
												}
											);
											resolve(true);
											return null;
										}
									}).catch(err => {
										reject(err);
										return null;
									});
								} else {
									return GroupPermissionLevel.findOne(
										{
											where: {
												idGroup: groupID,
												idPermission: permission.id
											}
										}
									).then(async groupPermissionLevel => {
										if (groupPermissionLevel) {
											await groupPermissionLevel.destroy();
										}
										resolve(true);
										return null;
									}).catch(err => {
										reject(err);
										return null;
									});
								}
							}).catch(err => {
								reject(err);
								return null;
							});
						} else { // no permission with that id
							reject(400);
							return null;
						}
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);
		}
		Promise.all(updatePermissionsPromises).then(() => {
			res.json({success: true, created: true, group});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		const updatePermissionsPromises = [];
		const groupID = req.params.id;
		for (const permission of req.body.permissions) {
			const permissionID = permission.permissionID;
			const permissionLevelID = permission.permissionLevelID;
			updatePermissionsPromises.push(
				new Promise((resolve, reject) => {
					return Permission.findByPk(permissionID).then(permission => {
						if (permission) {
							return PermissionLevel.findByPk(permissionLevelID).then(permissionLevel => {
								if (permissionLevel) {
									return GroupPermissionLevel.findOne(
										{
											where: {
												idGroup: groupID,
												idPermission: permission.id
											}
										}
									).then(async groupPermissionLevel => {
										if (groupPermissionLevel) {
											groupPermissionLevel.idPermissionLevel = permissionLevel.id;
											await groupPermissionLevel.save();
											resolve(true);
											return null;
										} else {
											await GroupPermissionLevel.create(
												{
													idGroup: groupID,
													idPermission: permission.id,
													idPermissionLevel: permissionLevel.id
												}
											);
											resolve(true);
											return null;
										}
									}).catch(err => {
										reject(err);
										return null;
									});
								} else {
									return GroupPermissionLevel.findOne(
										{
											where: {
												idGroup: groupID,
												idPermission: permission.id
											}
										}
									).then(async groupPermissionLevel => {
										if (groupPermissionLevel) {
											await groupPermissionLevel.destroy();
										}
										resolve(true);
										return null;
									}).catch(err => {
										reject(err);
										return null;
									});
								}
							}).catch(err => {
								reject(err);
								return null;
							});
						} else { // no permission with that id
							reject(400);
							return null;
						}
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);
		}
		Promise.all(updatePermissionsPromises).then(() => {
			Group.findByPk(groupID).then(async group => {
				group.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
				group.isSuper = req.body.isSuper === 'true';
				if (Array.isArray(req.body.users) && req.body.users.length) {
					group.setUsers(req.body.users.filter((value, index, self) => self.indexOf(value) === index));
				} else {
					group.setUsers([]);
				}
				await group.save();
				res.json({success: true});
				return null;
			}).catch(err => {
				next(err);
				return null;
			});
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAll: (req, res, next) => {
		let where = { isSuper: false };
		if (G.isAdminUser(req)) {
			where = {};
		}
		Group.findAll(
			{
				where,
				attributes: ['id', 'title']
			}
		).then(groups => {
			res.json(groups);
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAllWithContext: async(req, res, next) => {
		const { entity } = req.query;

		Group.findAll(
			{
				attributes: ['id', 'title'],
				include: [
					{
						model: GroupPermissionLevel,
						required: false,
						attributes: ['idGroup', 'idPermission', 'idPermissionLevel'],
						include: [
							{
								model: PermissionLevel,
								required: false,
								attributes: ['id', 'title']
							},
							{
								model: Permission,
								required: false,
								where: {
									title: entity
								},
								attributes: ['id', 'title']
							}
						]
					}
				]
			}
		).then(groups => {
			res.json(
				{
					count: groups.length,
					context: {
						entity
					},
					groups
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getMyGroups: async(req, res, next) => {
		const { entity, level, isdefault } = req.query;

		const filterIsDefault = typeof isdefault === 'string'  && isdefault === 'true' ? { isDefault: true } : {};

		const permissionLevel = await PermissionLevel.findOne(
			{
				where: {
					title: level
				}
			}
		);

		if (!permissionLevel) {
			next(400);
			return null;
		}

		Group.findAll(
			{
				attributes: ['id', 'title'],
				include: [
					{
						model: GroupPermissionLevel,
						required: true,
						attributes: ['idGroup', 'idPermission', 'idPermissionLevel'],
						include: [
							{
								model: PermissionLevel,
								required: true,
								where: {
									id: { [Op.gte]: permissionLevel.id }
								},
								attributes: ['id', 'title']
							},
							{
								model: Permission,
								required: true,
								where: {
									title: entity
								},
								attributes: ['id', 'title']
							}
						]
					},
					{
						model: User,
						required: true,
						through: {
							where: filterIsDefault
						},
						where: {
							id: req.user.id
						},
						attributes: []
					}
				]
			}
		).then(groups => {
			res.json(
				{
					count: groups.length,
					context: {
						entity,
						level
					},
					groups
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAllMyGroups: (req, res, next) => {
		Group.findAll(
			{
				attributes: ['id', 'title'],
				include: [
					{
						model: GroupPermissionLevel,
						required: false,
						attributes: ['idGroup', 'idPermission', 'idPermissionLevel'],
						include: [
							{
								model: PermissionLevel,
								required: false,
								attributes: ['id', 'title']
							},
							{
								model: Permission,
								required: false,
								attributes: ['id', 'title']
							},
						]
					},
					{
						model: User,
						required: true,
						where: {
							id: req.user.id
						},
						attributes: []
					}
				]
			}
		).then(groups => {
			res.json(
				{
					count: groups.length,
					context: {
						entity: 'all',
						level: 'all'
					},
					groups
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};
