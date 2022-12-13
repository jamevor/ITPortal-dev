const uuidv4 = require('uuid/v4');
module.exports = {
	up: (queryInterface) => {
		return Promise.all(
			[
				queryInterface.bulkInsert('permission', [
					{
						title: 'spread',
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date()
					}
				], {}),
				queryInterface.bulkInsert('spreadLayout', [
					{
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						title: '1 Column',
						svg: '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect class="svg-body" x="56" y="64.5" width="188" height="171" rx="5.17"/><path class="svg-outline" d="M238.83 65.5a4.17 4.17 0 014.17 4.17v160.66a4.17 4.17 0 01-4.17 4.17H61.17a4.17 4.17 0 01-4.17-4.17V69.67a4.17 4.17 0 014.17-4.17h177.66m0-2H61.17A6.17 6.17 0 0055 69.67v160.66a6.17 6.17 0 006.17 6.17h177.66a6.17 6.17 0 006.17-6.17V69.67a6.17 6.17 0 00-6.17-6.17z" /><path class="svg-columns" d="M65.5 77.5H234v150H65.5z" /><path class="svg-inline" d="M233 78.5v148H66.5v-148H233m2-2H64.5v152H235v-152z" /></svg>',
						column1Classlist: 'cell small-12 medium-12 spread-column',
						column2Classlist: 'hide',
						column3Classlist: 'hide',
						column1IsShown: true,
						column2IsShown: false,
						column3IsShown: false
					},
					{
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						title: '2 Column',
						svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect class="svg-body" x="56" y="64.5" width="188" height="171" rx="5.17" /><path class="svg-outline" d="M238.83 65.5a4.17 4.17 0 014.17 4.17v160.66a4.17 4.17 0 01-4.17 4.17H61.17a4.17 4.17 0 01-4.17-4.17V69.67a4.17 4.17 0 014.17-4.17h177.66m0-2H61.17A6.17 6.17 0 0055 69.67v160.66a6.17 6.17 0 006.17 6.17h177.66a6.17 6.17 0 006.17-6.17V69.67a6.17 6.17 0 00-6.17-6.17z" /><path class="svg-columns" d="M65.5 77.5h82v150h-82z" /><path class="svg-inline" d="M146.5 78.5v148h-80v-148h80m2-2h-84v152h84v-152z" /><path class="svg-columns" d="M152.5 77.5h82v150h-82z" /><path class="svg-inline" d="M233.5 78.5v148h-80v-148h80m2-2h-84v152h84v-152z" /></svg>',
						column1Classlist: 'cell small-12 medium-6 spread-column',
						column2Classlist: 'cell small-12 medium-6 spread-column',
						column3Classlist: 'hide',
						column1IsShown: true,
						column2IsShown: true,
						column3IsShown: false
					},
					{
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						title: '3 Column',
						svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect class="svg-body" x="56" y="64.5" width="188" height="171" rx="5.17" /><path class="svg-outline" d="M238.83 65.5a4.17 4.17 0 014.17 4.17v160.66a4.17 4.17 0 01-4.17 4.17H61.17a4.17 4.17 0 01-4.17-4.17V69.67a4.17 4.17 0 014.17-4.17h177.66m0-2H61.17A6.17 6.17 0 0055 69.67v160.66a6.17 6.17 0 006.17 6.17h177.66a6.17 6.17 0 006.17-6.17V69.67a6.17 6.17 0 00-6.17-6.17z" /><path class="svg-columns" d="M66 78h52v150H66z" /><path class="svg-inline" d="M117 79v148H67V79h50m2-2H65v152h54V77z" /><path class="svg-columns" d="M183 78h52v150h-52z" /><path class="svg-inline" d="M234 79v148h-50V79h50m2-2h-54v152h54V77z" /><path class="svg-columns" d="M125 78h52v150h-52z" /><path class="svg-inline" d="M176 79v148h-50V79h50m2-2h-54v152h54V77z" /></svg>',
						column1Classlist: 'cell small-12 medium-4 spread-column',
						column2Classlist: 'cell small-12 medium-4 spread-column',
						column3Classlist: 'cell small-12 medium-4 spread-column',
						column1IsShown: true,
						column2IsShown: true,
						column3IsShown: true
					},
					{
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						title: 'Sidebar',
						svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect class="svg-body"  x="56" y="64.5" width="188" height="171" rx="5.17"/><path class="svg-outline" d="M238.83 65.5a4.17 4.17 0 014.17 4.17v160.66a4.17 4.17 0 01-4.17 4.17H61.17a4.17 4.17 0 01-4.17-4.17V69.67a4.17 4.17 0 014.17-4.17h177.66m0-2H61.17A6.17 6.17 0 0055 69.67v160.66a6.17 6.17 0 006.17 6.17h177.66a6.17 6.17 0 006.17-6.17V69.67a6.17 6.17 0 00-6.17-6.17z"/><path class="svg-columns" d="M66 77.5h111.5v150H66z"/><path class="svg-inline"d="M176.5 78.5v148H67v-148h109.5m2-2H65v152h113.5v-152z"/><path class="svg-columns" d="M182.5 77.5H235v150h-52.5z"/><path class="svg-inline" d="M234 78.5v148h-50.5v-148H234m2-2h-54.5v152H236v-152z"/></svg>',
						column1Classlist: 'cell small-12 medium-8 large-7 spread-column',
						column2Classlist: 'cell small-12 medium-4 spread-column',
						column3Classlist: 'hide',
						column1IsShown: true,
						column2IsShown: true,
						column3IsShown: false
					},
					{
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						title: 'Intro Sidebar',
						svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect class="svg-body"  x="56" y="64.5" width="188" height="171" rx="5.17"/><path class="svg-outline" d="M238.83 65.5a4.17 4.17 0 014.17 4.17v160.66a4.17 4.17 0 01-4.17 4.17H61.17a4.17 4.17 0 01-4.17-4.17V69.67a4.17 4.17 0 014.17-4.17h177.66m0-2H61.17A6.17 6.17 0 0055 69.67v160.66a6.17 6.17 0 006.17 6.17h177.66a6.17 6.17 0 006.17-6.17V69.67a6.17 6.17 0 00-6.17-6.17z" /><path class="svg-columns" d="M66 123h111.5v104.5H66z" /><path class="svg-inline" d="M176.5 124v102.5H67V124h109.5m2-2H65v106.5h113.5V122z" /><path class="svg-columns" d="M66 78h169v37.5H66z" /><path class="svg-inline" d="M234 79v35.5H67V79h167m2-2H65v39.5h171V77z" /><path class="svg-columns" d="M182.5 123H235v104.5h-52.5z" /><path class="svg-inline" d="M234 124v102.5h-50.5V124H234m2-2h-54.5v106.5H236V122z" /></svg>',
						column1Classlist: 'cell small-12 medium-12 spread-column',
						column2Classlist: 'cell small-12 medium-8 large-7 spread-column',
						column3Classlist: 'cell small-12 medium-4 spread-column',
						column1IsShown: true,
						column2IsShown: true,
						column3IsShown: true
					},
				], {}),
				queryInterface.bulkInsert('spreadPhase', [
					{
						id: 1,
						title: 'draft',
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						descriptionShort: null,
						icon: 'fa-file-edit',
						color: 'ff921f'
					},
					{
						id: 2,
						title: 'review',
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						descriptionShort: null,
						icon: 'fa-clipboard-check',
						color: 'f3553d'
					},
					{
						id: 3,
						title: 'publish',
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						descriptionShort: null,
						icon: 'fa-satellite-dish',
						color: '36d657'
					},
					{
						id: 4,
						title: 'retire',
						guid: uuidv4(),
						createdAt: new Date(),
						updatedAt: new Date(),
						descriptionShort: null,
						icon: 'fa-archive',
						color: '9193fa'
					}
				], {})
			]
		);
	},
	down: () => {
	}
};