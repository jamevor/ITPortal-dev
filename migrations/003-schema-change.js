module.exports = {
	up: queryInterface => {
		return queryInterface.removeColumn('myApps', 'icon');
	},
	down: () => {
	}
};