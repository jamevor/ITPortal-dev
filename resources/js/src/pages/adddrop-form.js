$(document).ready(function() {

	const initialCourseData = {};

	$('#courses-list .course-item').each(function() {
		const course = $(this).find('.course-item-crn').html();
		const choice = $(this).find('input[name$=_choice]:checked').val();
		initialCourseData[course] = choice;
	});

	var AddedCourse = {};
	var DroppedCourse = new Array();

	$.get("/api/v1/workday/getCourse/allFull/")
			.done(function(data) {
				initAutoComplete(data);
				$('.data-loader').hide();
				$('.data-loaded').fadeIn();
			})
			.fail(function() {
				$('.data-loader i').removeClass('fa-spinner-third fa-spin');
				$('.data-loader i').addClass('fa-times-circle');
				$('.data-loader p').text("Unable to get course list. Please refresh or try again later.");
			});

		function initAutoComplete(autocompleteDataSource) {
			var options = {

				data: autocompleteDataSource,
			  
				getValue: function(element){
					if(element.Hidden_Course_Section == 0 && element.Hidden_Course == 0 && (element.Section_Status == "Closed" || element.Section_Status == "Waitlist" || element.Section_Status == "Open")){
						return element.cour_Definition+" - "+element.Course_Tags+" - "+element.Section_Listings+" - "+element.All_Instructors;
					}else{
						return '';
					}
				 },
				template: {
					type: "custom",
					method: function(value, item) {
						const instructor = item.Primary_Instructor_Name || '';
						return `
						<div class="course-lookup-item" data-crn="${item.cour_sec_def_referenceID}">
							<div class="course-lookup-group group-text">
								<div class="course-lookup-item-title">${item.Section_Listings}</div>
								<div class="course-lookup-item-crn">${item.cour_sec_def_Title}</div>
								<div class="course-lookup-item-crn">${instructor}</div>
							</div>
		
						</div>`
					}
				},
				list: {
				  match: {
					enabled: true
				  },
				  onChooseEvent: function() {
					var CRN = $("#courses").getSelectedItemData().cour_sec_def_referenceID; 
					$('.data-loaded').hide();
					$('.data-loader p').text('Fetching Course...')
					$('.data-loader').fadeIn();
					$.ajax(
						{
							url: `/api/v1/workday/getSection/${CRN}`,
							method: 'GET',
							success: function(resp) {
								AddedCourse = resp;
								
								$('.data-loader').hide();
								$('#courseToAdd').show().html(buildCourse(resp[0],"add"));
								$('#reg-add').slideUp();
								checkCourseConflicts();
								$('#course-add-block').fadeIn();
							},
							error: function(resp) {
								$('.data-loaded').fadeIn();
								console.log("Something went wrong");
							}
						}
					);
					
				  }
				}
		
			  };
			  $("#courses").easyAutocomplete(options);
			}

	  function prepCourses(){
		let output = '';
		if(ssrEnroll != null){
			for(const courses of ssrEnroll){
				output += buildCourse(courses,"remove")
			}

			$('#courseToDrop').html(output)
		}
	  }
	  prepCourses()
	function checkCourseConflicts(){
		let Avail = AddedCourse[0].Section_Capacity - AddedCourse[0].Enrollment_Count;
		console.log(Avail);
		let WLAvail = AddedCourse[0].Wait_List_Capacity - AddedCourse[0].Waitlist_Count;
		// Closed Course Conflict
		if((Avail <= 0) || AddedCourse[0].Section_Status != "Open"){
			$("#bool-isClosed").prop( "checked", true ).change();
		}else{
			$("#bool-isClosed").prop( "checked", false ).change();
		}

	}
	function buildCourse(aCourse,type) {
		if(aCourse && aCourse.cour_sec_def_referenceID){
			let courseActions;
			let courseTitle = aCourse.cour_sec_def_Title || aCourse.Course_Title;
			let courseDef =  aCourse.Course_Section_Definition || aCourse.Section_Listings;
			let courseInstr = aCourse.Primary_Instructor_Name || aCourse.CF_LRV_Instructor_Preferred_First_Name + " " + aCourse.CF_LRV_Instructor_Preferred_Last_Name || "";
			let courseMinCred = aCourse.Minimum_Credits || 0;
			let hideEnroll = aCourse.Enrollment_Count ? "" : "display:none";
			if(type == 'add'){
				courseActions = `<a id="startOver" href="#">X</a>`;
			}else{
				courseActions = `<label for="drop-${aCourse.cour_sec_def_referenceID}">Drop Course?</label><input name="drop-${aCourse.cour_sec_def_referenceID}" id="drop-${aCourse.cour_sec_def_referenceID}" data-crn="${aCourse.cour_sec_def_referenceID}" type="checkbox" class="course-item-remove">`;
			}
			let courseHTML = `
			<div id="Course-${aCourse.cour_sec_def_referenceID}" class="course-item" data-crn="${aCourse.cour_sec_def_referenceID}">
				<div class="course-item-dept">
				${courseDef.split(" ")[0]}
				</div>
				<div class="course-item-text">
					<div class="course-item-title">${courseTitle}</div>
					<div class="course-item-list"><span class="course-item-crn">${courseDef.split(" - ")[0]}</span> - <span class="course-item-course">${courseDef.split(" - ")[1]}</span></div>
					<div class="course-item-list"><span class="course-item-course">${courseInstr}</span></div>
					<div class="course-item-credit-block"><span class="course-item-credit">${courseMinCred}</span> Credit Hours</div>
					</div>
				<div class="course-item-cap" style="${hideEnroll}">
					<div class="course-label">Enrollment</div>
					<div class="course-item-enrollment">${aCourse.Enrollment_Count} / ${aCourse.Section_Capacity}</div>
					<div class="course-label">Waitlist</div>
					<div class="course-item-waitlist">${aCourse.Waitlist_Count} / ${aCourse.Wait_List_Capacity}</div>
				</div>
				<div class="course-item-actions">
					${courseActions}
				</div>
			</div>
			`
			return courseHTML
		}else{
			return 0;
		}
	}

	
	function generateApprovals(){
		let isTimeConflict = $("#bool-isTimeConflict").is(':checked');
		let isDeptRestricted = $("#bool-isDeptRestricted").is(':checked');
		let isMajor = $("#bool-isMajor").is(':checked');
		let isLevel = $("#bool-isLevel").is(':checked');
		let isClosed = $("#bool-isClosed").is(':checked');
		let isSpecial = $("#bool-isSpecial").is(':checked');

		let approvalOutput = "";

		let inst = {
			"id": AddedCourse[0].CF_primary_instructor_emp_id,
			"name": AddedCourse[0].Primary_Instructor_Name,
			"email": AddedCourse[0].Primary_Instructor_Email,
			"dept": AddedCourse[0].Owning_Academic_Unit,
			"extra": AddedCourse[0],
			"relation" : "Instructor",
			"type": ""
		}
		if(inst.name !== undefined && inst.name != ''){
			if(isTimeConflict){
				let type = "Time Conflict"
				inst.type != "" ?  inst.type += `, ${type}` : inst.type = type;
				$( "#bool-instructor" ).prop( "checked", true );
			}
			if(isDeptRestricted){
				let type = "Department Restriction";
				inst.type != "" ?  inst.type += `, ${type}` : inst.type = type;
				$( "#bool-instructor" ).prop( "checked", true );
			}
			if(isMajor){
				let type = "Major Restriction";
				inst.type != "" ?  inst.type += `, ${type}` : inst.type = type;
				$( "#bool-instructor" ).prop( "checked", true );
			}
			if(isLevel){
				let type = "Level Restriction";
				inst.type != "" ?  inst.type += `, ${type}` : inst.type = type;
				$( "#bool-instructor" ).prop( "checked", true );
			}
			if(isClosed){
				let type = "Closed Course";
				inst.type != "" ?  inst.type += `, ${type}` : inst.type = type;
				$( "#bool-instructor" ).prop( "checked", true );
			}
			if(isSpecial){
				let type = "Special";
				inst.type != "" ?  inst.type += `, ${type}` : inst.type = type;
				$( "#bool-instructor" ).prop( "checked", true );
			}
			// If No Instructors left
			if(!isTimeConflict && !isDeptRestricted && !isMajor && !isLevel && !isClosed && !isSpecial){
				$( "#bool-instructor" ).prop( "checked", false );
			}

			if($("#bool-instructor").is(':checked')){
				approvalOutput += generateApprovalTemplate(inst)
			}
			if(true == false && inst.name == undefined && $("#bool-instructor").is(':checked')){
				$("#approval-error-line1").text("An approval cannot be sent because this course does not currently have a listed Instructor.");
				$("#approval-error-line2").text("Please contact the academic department to inquire about assigning an instructor.");
				$("#approvalError").show();
				
			}else{
				$("#approvalError").hide();
				if(approvalOutput != ""){
					$('#courseApprovals').html(approvalOutput);
					$('#course-approvals-block').fadeIn();
				}
			}
		}
		
	}
	function generateApprovalTemplate(approval){
		let approvalHTML = `
		<div class="approval-item">
			<div class="approval-item-relation">${approval.relation}</div>
			<div class="approval-content">
				<div class="approval-item-approver">
					<span class="approval-item-approver-name">${approval.name}</span>
					(
					<span class="approval-item-approver-email">${approval.email}</span>
					)
					<span class="approval-item-approver-id">${approval.id}</span>
				</div>
				<div class="approval-item-type">${approval.type}</div>
			</div>
		</div>
		`
		return approvalHTML;
	}
	$('#course-approval-bools input').on( "change", function() {
		generateApprovals()
	})
	$('#request-overload').on( "change", function() {
		if($(this).is(':checked')){
			$( "#bool-isOverload" ).prop( "checked", true ).change();
		}else{
			$( "#bool-isOverload" ).prop( "checked", false ).change();
		}
	})
	$('#courseToDrop').on( "change",".course-item-remove", function(event) {
		let itemCRN = $(this).data("crn");
		let thisCourse = ssrEnroll.find(obj => {
			return obj.cour_sec_def_referenceID == itemCRN;
		})
		
		if($(this).is(':checked')){
			DroppedCourse.push(thisCourse);
			console.log(DroppedCourse)
		}else{
			DroppedCourse = DroppedCourse.filter(obj => {
				return obj.CRN != itemCRN;
			})
		}
	})
	$('#courseToAdd').on( "click","#startOver", function(event) {
		event.preventDefault();
		AddedCourse = {};
		$("#courses").val('');
		$('#courseToAdd').html('');
		$('#course-add-block').hide();
		$('.data-loaded').show();
		$('#reg-add').slideDown();
		$('#course-approval-bools input:checkbox').prop( "checked", false );
		$('#courseApprovals').html('');
		$("#approvalError").hide();
	})

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if($("#additional-info").val() == "" || $("#additional-info").val() == undefined){
			$('#toast-details').addClass('show');
			setTimeout(function() {
				$('#toast-details').removeClass('show');
			}, 10000);
		}else if(!$("#courseToAdd").is(":visible")){
			$('#toast-NoCourse').addClass('show');
			setTimeout(function() {
				$('#toast-NoCourse').removeClass('show');
			}, 10000);
		}else if($("#overload-block").is(":visible") && !$("#bool-isOverload").is(':checked')){
			$('#toast-Overloaded').addClass('show');
			setTimeout(function() {
				$('#toast-Overloaded').removeClass('show');
			}, 10000);
		}else{
			if (!$('#button-submit-help-form').hasClass('disabled')) {
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {

						const formData = {
							source: window.location.href,
							type: 'Course Add / Drop',
							fullName: $('#full-name').text(),
							wpiID: $('#wpi-id').text(),
							wpiEmail: $('#wpi-email').text(),
							major:$('#wpi-major').text(),
							colCode:$('#wpi-colCode').text(),
							additional: $('#additional-info').val(),
							booleans:{
								isOverload: $("#bool-isOverload").is(':checked'),
								isTimeConflict: $("#bool-isTimeConflict").is(':checked'),
								isDeptRestricted: $("#bool-isDeptRestricted").is(':checked'),
								isMajor: $("#bool-isMajor").is(':checked'),
								isLevel: $("#bool-isLevel").is(':checked'),
								isClosed: $("#bool-isClosed").is(':checked'),
								isSpecial: $("#bool-isSpecial").is(':checked'),
								inStructor: $("#bool-instructor").is(':checked'),
								advisor:$("#bool-advisor").is(':checked')
							},
							addCourse:AddedCourse,
							dropCourse:DroppedCourse
						};

						const approvals =[];
						$('#course-approvals-block .approval-item').each(function() {
							let ai = {}
							ai.relation = $(this).find('.approval-item-relation').text(),
							ai.name = $(this).find('.approval-item-approver-name').text(),
							ai.email = $(this).find('.approval-item-approver-email').text(),
							ai.id = $(this).find('.approval-item-approver-id').text(),
							ai.type = $(this).find('.approval-item-type').text(),
							
							approvals.push(ai);

						});

						formData.approvals = approvals;
						const courses = [];
						
						formData.courses = courses;
						$.ajax(
							{
								url: '/api/v1/cherwell/ticket/create/one/add-drop',
								method: 'POST',
								data: {
									token,
									formData
								},
								beforeSend: function() {
									$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
									$('#submitError').hide();
								},
								success: function() {
									$('#toast-save-success').addClass('show');
									$('#button-submit-help-form').html('<i class=\'fas fa-check-circle\'></i>');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').html('Submit Add / Drop Request');
									$('#button-submit-help-form').removeClass('disabled');
									$('#submitError').fadeIn();
								}
							}
						);
						
					});
				});
			}
		}
	});

	// Locks Add Drop Button must be uncommnted at the end of the Add/Drop period
	document.querySelector('#button-submit-help-form').disabled = true;


});