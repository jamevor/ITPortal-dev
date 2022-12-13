'use strict';
/* global spinner, HTMLReplace, Foundation */
/* exported EntityGroupsUtility */
class EntityGroupsUtility {

	constructor({container, entity, isNewEntity, entityID, isAccessRestricted, canRemoveGroups}) {
		this.container = container;
		this.entity = entity;
		this.entityID = entityID;
		this.isNewEntity = isNewEntity;
		this.isAccessRestricted = isAccessRestricted;
		this.canRemoveGroups = canRemoveGroups;
		this.groups = [];
	}

	init() {
		$(this.container).append(this.buildContainer());
		this.attachSearch();
		this.refresh();
		this.attachListeners();
	}


	refresh() {
		const entity = this.entity;
		const entityID = this.entityID;
		const url = this.isNewEntity ? `/api/v1/me/group/get?entity=${entity}&level=create&isdefault=true` : `/api/v1/${entity}/group/get/${entityID}`;
		$.ajax(
			{
				url,
				method: 'GET',
				data: {},
				context: this,
				beforeSend: function() {
					$(this.container).children('.groups-container').append(spinner());
				},
				success: function(data) {
					$(this.container).children('.groups-container').empty();
					if (data && data.count) {
						for (const group of data.groups) {
							this.addGroup(group, !(this.isNewEntity || this.canRemoveGroups));
						}
					}
				},
				error: function(resp) {
					console.error({resp});
					$(this.container).children('.groups-container').empty();
				}
			}
		);
	}

	attachListeners() {
		$(this.container).on('click', '.group-remove.enabled', event => {
			event.preventDefault();
			const id = $(event.currentTarget).parents('.group').first().data('group').id;
			const index = this.groups.findIndex(g => g.id === id);
			this.groups.splice(index, 1);
			$(event.currentTarget).parents('.group').slideUp('slow');
		});
	}

	addGroup(group, isLocked) {
		if (this.groups.some(g => g.id === group.id)) {
			return false;
		}
		this.groups.push(group);
		let result =`<div class="group" data-group="${HTMLReplace(JSON.stringify(group))}"><div class="group-info"><span>${group.title}</span>`;
		if (isLocked) {
			result += '<button class="group-remove disabled"><i class="far fa-fw fa-lock"></i> </button>';
		} else {
			result += '<button class="group-remove enabled"><i class="far fa-fw fa-times"></i> </button>';
		}
		const yesPermission ='<i class="group-level-yes fas fa-check-circle"></i>';
		const noPermission = '<i class="group-level-no fas fa-times-square"></i>';
		result += `</div>
			<div class="group-levels">
				<div data-tooltip tabindex="1" title="Read Published" class="bottom group-level-item group-level-readPublic">${yesPermission}</div>
				<div data-tooltip tabindex="1" title="Read" class="bottom group-level-item group-level-read">${group.groupPermissionLevels && group.groupPermissionLevels.some(gpl => gpl.idPermissionLevel >= 1) ? yesPermission : noPermission }</div>
				<div data-tooltip tabindex="1" title="Create" class="bottom group-level-item group-level-create">${group.groupPermissionLevels && group.groupPermissionLevels.some(gpl => gpl.idPermissionLevel >= 2) ? yesPermission : noPermission }</div>
				<div data-tooltip tabindex="1" title="Author" class="bottom group-level-item group-level-author">${group.groupPermissionLevels && group.groupPermissionLevels.some(gpl => gpl.idPermissionLevel >= 3) ? yesPermission : noPermission }</div>
				<div data-tooltip tabindex="1" title="Publish" class="bottom group-level-item group-level-publish">${group.groupPermissionLevels && group.groupPermissionLevels.some(gpl => gpl.idPermissionLevel >= 4) ? yesPermission : noPermission }</div>
				<div data-tooltip tabindex="1" title="Delete" class="bottom group-level-item group-level-delete">${group.groupPermissionLevels && group.groupPermissionLevels.some(gpl => gpl.idPermissionLevel >= 5) ? yesPermission : noPermission }</div>
			</div>
		</div>`;
		$(this.container).children('.groups-container').append(result);
		$(this.container).children('.groups-container').find('.group-levels').last().children().each(function() {
			new Foundation.Tooltip($(this));
		});
		$(this.container).children('.groups-container').find('.group-info span').last().click(function() {
			$(this).parents('.group').toggleClass('expanded');
		});
		return true;
	}

	getGroups() {
		return this.groups.map(g => g.id);
	}

	lockGroups() {
		if (!this.canRemoveGroups) {
			$(this.container).find('.group-remove.enabled').toggleClass(['disabled', 'enabled']).children('i').toggleClass(['fa-lock', 'fa-times']);
		}
	}

	attachSearch()  {
		const input = `
		<div id="add-group-box" class="link-cards">
			<input type="hidden" id="group" name="group">
			<label for="groupTitle">Group Title</label>
			<div class="input-group">
				<input type="text" id="groupTitle" name="groupTitle" class="add-action-input input-group-field ez-input">
				<div class="input-group-button">
					<button id="add-group-button" class='button-link-item'><i class="fas fa-handshake"></i> Share</button>
				</div>
			</div>
		</div>`;
		$(this.container).children('.groups-container').before(input);
		$('#groupTitle').easyAutocomplete(
			{
				url: `/api/v1/group/get?entity=${this.entity}`,
				listLocation: 'groups',
				getValue: 'title',
				list: {
					maxNumberOfElements: 5,
					match: {
						enabled: true
					},
					onChooseEvent: () => {
						$('#group').val(JSON.stringify($('#groupTitle').getSelectedItemData()));
					},
					showAnimation: {
						type: 'slide',
						time: 300,
						callback: function() {}
					},
					hideAnimation: {
						type: 'slide',
						time: 300,
						callback: function() {}
					}
				},
				placeholder: 'Share with a group...',
				requestDelay: 200
			}
		);

		$('#add-group-button').click(event => {
			event.preventDefault();
			if ($('#group').val().length) {
				this.addGroup(JSON.parse($('#group').val()), false);
				$('#group, #groupTitle').val('');
			}
		});

	}

	buildContainer()  {
		return `
			<h2 style="font-size:1.25em;"><i class="far fa-user-lock"></i> Permissions</h2>
			<div class="groups-container"></div>
			<p style="margin-bottom: 0; font-size: 0.875em;">Restrict Access</p>
			<small>Only people in these groups will be able to access this resource.</small>
			<div class="switch">
				<input class="switch-input" id="restrictAccess" type="checkbox" name="restrictAccess"${this.isAccessRestricted ? ' checked' : ''}>
				<label class="switch-paddle" for="restrictAccess">
					<span class='show-for-sr'>Restrict Access</span>
					<span class='switch-active'>Yes</span>
					<span class='switch-inactive'>No</span>
				</label>
			</div>
		`;
	}

}