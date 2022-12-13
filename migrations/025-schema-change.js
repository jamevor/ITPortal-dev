// 2.6.0
'use strict';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.renameTable('groupHasPermission', 'groupPermissionLevel');
	},
	down: (queryInterface) => {
		return queryInterface.renameTable('groupPermissionLevel', 'groupHasPermission');
	}
};
