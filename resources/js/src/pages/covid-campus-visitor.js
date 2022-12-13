// const deptList = ["Academic & Corporate Engagement","Academic Advising","Academic Technology Support Services","Aerospace Engineering","Air Force ","Alumni Relations","Army ROTC","Arts & Sciences, Dean's Office","BETC & PracticePoint","Bioengineering Institute","Biology & Biotechnology ","Biomedical Engineering","Bursar's Office","Campus Center Director Office","Campus Safety","Career Development Center","Center for Project Based Learning","Chemical Engineering","Chemistry & Biochemistry ","Civil and Environmental Engineering ","Computer Science","Controller's Office","Corporate & Professional Education","Dean of Students Office","Dining Services ","Disability Services","Electrical and Computer Engineering","Engineering, Dean's Office","Environmental Health & Safety","Events Office","Faculty Governance","Finance and Operations","Financial Aid/Student Aid & Financial Literacy ","Fire Protection Engineering","Gateway - Life Sciences and Bioengineering Center","Gateway - Vivarium","General Counsel, Office of the ","Graduate Studies, Dean's Office","Health Services","Humanities and Arts","Identity & Access Management","IGSD, Dean's Office","Information Security","Information Technology","Innovation & Entrepreneurship","Intellectual Property & Innovation","International House","Library Services","Mail Services","Manufacturing Engineering","Marketing Communications","Mass Academy of Math & Science","Mathematical Sciences","Mechanical Engineering","Metal Processing Institute","Military Science","Multicultural Affairs, Office of","Physical Education/PERA","Physics","Pre-Collegiate Outreach Programs","President, Office of the","Printing Services","Procurement Services","Provost, Office of the","Registrar","Research Solutions Institute","Residential Services ","Robotics Engineering","School of Business, Dean's Office","Social Science and Policy Studies","Sponsored Programs, Office of","STEM Education Center","Student Activities Office","Student Affairs, Dean's Office","Student Development & Counseling","Sustainability, Office of","Talent & Inclusion/Human Resources","Undergraduate Admissions","Undergraduate Studies, Office of","University Advancement"];
const terms =[
	{
		"title":"Term 1",
		"content":`The novel coronavirus, COVID-19, is a highly infectious, life-threatening disease declared by the World Health Organization to be a global pandemic. COVID-19’s highly contagious nature means that contact with others, or contact with surfaces or areas that have been exposed to the virus, may lead to infection. Because of its highly contagious and sometimes “hidden” nature, it is currently very difficult to control the spread of COVID19 or to determine whether, where, or how a specific individual may have been exposed to the disease.  I understand and acknowledge that given the unknown nature of COVID-19, it is not possible to list each and every individual risk of contracting COVID-19.`
	},
	{
		"title":"Term 2",
		"content":`I have not tested positive for COVID-19 within the past ten (10) days.  I am not aware of being in close contact within the past fourteen (14) days with an individual (including any member of my household) who has tested positive for COVID-19, is being tested for COVID-19, or has COVID-19-like symptoms.`
	},
	{
		"title":"Term 3",
		"content":`I agree that I will not come to campus if I have a fever or other COVID-19-like symptoms; if I am advised to self-isolate, self-quarantine, or get tested for COVID-19; if I test positive for COVID-19; or if I have been in close contact with someone, including any member of my household, who I know has tested positive for COVID-19, is being tested for COVID-19, or has COVID-19-like symptoms. For purposes of contact tracing, I will immediately report any positive COVID-19 test, for myself or a close contact, to WPI by contacting <a href="mailto:wearewpi@wpi.edu">wearewpi@wpi.edu</a>.`
	},
	{
		"title":"Term 4",
		"content":`I understand and acknowledge WPI’s COVID-19 Protocols described on the <a href="https://www.wpi.edu/we-are-wpi" target="_blank">We Are WPI website</a>, including the requirement of performing a daily self-check for symptoms; staying home if I am sick; wearing a face covering (gaiters, bandanas, and vented masks are not permitted); maintaining physical distance and staying at least six feet from others; washing my hands frequently with soap and water for at least 20 seconds or using alcohol-based hand sanitizers with at least 60% alcohol; avoiding touching my face, eyes, nose, and mouth; covering my coughs and sneezes; throwing out used tissues and washing my hands; and avoiding shaking hands, hugging, or touching when greeting another person on campus. `},
	{
		"title":"Term 5",
		"content":`I agree to comply with the <a href="https://www.mass.gov/info-details/covid-19-travel-advisory" target="_blank">Massachusetts Travel Advisory</a>.  I understand and acknowledge that pursuant to the Massachusetts Travel Advisory, WPI requires all visitors from outside Massachusetts to quarantine for 10 days upon their arrival in Massachusetts or ensure that they are exempt from the quarantine advisory.  The Massachusetts Travel Advisory exempts the following individuals from the quarantine advisory: (i) travelers who have received a negative COVID-19 test (PCR) not more than 72 hours prior to their arrival in Massachusetts or upon their arrival in Massachusetts; (ii) anyone entering Massachusetts for fewer than 24 hours; (iii) anyone who is returning to Massachusetts after being out-of-state for fewer than 24 hours; (iv) workers who perform critical infrastructure services; (v) travelers who are fully vaccinated and do not have symptoms; and (vi) travelers who have tested positive for COVID-10 between 10-90 days prior to their arrival in Massachusetts, who have completed their appropriate isolation period, and do not have symptoms`
	},
	{
		"title":"Term 6",
		"content":`I agree to comply with instructions concerning access to buildings and spaces on campus, including occupancy limits and building and office-specific signage, including elevator limits, one-way hallways and stairwells, restroom limits, and designated entrances and exits`
	},
	{
		"title":"Term 7",
		"content":`I understand and agree that WPI has the discretion to determine whether I am permitted to be on campus, or in a particular building, and at any time may require me to leave and not return to campus if it is determined that I have not complied with WPI or public health policies or guidelines, or if my presence on campus poses a health risk to others.`
	},
	{
		"title":"Term 8",
		"content":`I voluntarily assume the risk that I may be exposed or infected by COVID-19 by visiting the campus of WPI and that such exposure or infection may result in personal injury, illness, permanent disability, and/or even death.  I understand that the risk of becoming exposed to or infected by COVID-19 at WPI may result from the actions, omissions, or negligence of myself and others, including WPI and its affiliates, subsidiaries, trustees, officers, students, employees and agents (collectively, “WPI”).  `
	},
	{
		"title":"Term 9",
		"content":`I VOLUNTARILY ASSUME FULL RESPONSIBILITY FOR ANY RISKS OF ILLNESS OR INJURY that may be sustained by me due to any potential exposure to COVID-19 while visiting campus.  I hereby RELEASE WAIVE, DISCHARGE, AND COVENANT NOT TO SUE WPI, its affiliates, subsidiaries, trustees, officers, students, employees and agents, and their respective successors, heirs, and assigns (the “Related Parties”) from any and all liability, claims, demands, actions, and causes of action whatsoever arising out or related to any illness or injury, that may be sustained by me due to any potential exposure to COVID-19 while visiting campus, whether caused by the negligent act or omission of WPI, or otherwise, while visiting campus or in transportation to and from campus.  It is my express intent that this Acknowledgement Form shall bind the members of my family, my heirs, assigns and personal representatives, and shall be deemed as a RELEASE, WAIVER, DISCHARGE, and COVENANT NOT TO SUE WPI and the Related Parties.`
	}
]

const consentLanguage = {
	"guardian": "This is to certify that I, as parent/guardian with legal responsibility for the visitor, do consent and agree to all of the provisions of this Acknowledgement Form, and for myself, my heirs, assigns, and next of kin, I release and hold harmless WPI and the Related Parties from any and all liabilities related to my minor child’s visit to campus.",
	"regular": "I have read this Acknowledgement Form, fully understand its terms, understand and acknowledge that I have given up substantial rights by signing it, and sign it freely and voluntarily without any inducement. In executing this Acknowledgment Form, I assert that I am 18 years of age or older and make this decision informed of its implications and entirely of my own free will.",
	"external": "I HAVE READ THIS FORM BEFORE SIGNING IT AND AGREE TO BE BOUND BY ITS TERMS."
}

const showFor = {
	"Visitor":[1,2,3,4,5,6,7,8,9],
	"Vendor":[1,2,3,4,5,6],
	"Employee":0,
	"Human Subject":[1,2,3,4,5,6],
	"External Partner":[1,2,3,4,5,6,7,8,9],
}

const langChooser = {
	"Visitor": "regular",
	"Vendor":"external",
	"Employee":0,
	"Human Subject":"external",
	"External Partner":"regular",
}
function buildTerms(terms, options, usertype){
	let output ="";
	
	if(options[usertype] == 0){
		return false
	}else{
		$.each(options[usertype], function(e){
			output += `<div class="tos-section">
			<h2>${terms[e].title}</h2>
			<p>${terms[e].content}</p>
		  	</div>`
		})
	}
	return output;
}

function buildConsent(language, options, usertype){
	
	if($('#age').prop('checked') == true){
		return language["guardian"]
	}else{
		if(options[usertype] == 0){
			return false
		}else{
			return language[options[usertype]];
		}
	}
	
	
}
/* global grecaptcha */
$(document).ready(function() {
	
	const formUser = {};

	// $('#visit-department').html($.map(deptList, function(e){
	// 	return $('<option/>', {text: e});
	// }));
	// $('#visit-department').prepend("<option value='Default' selected>--Choose a Department--</option>")
	
	
	$('#button-unlock').on("click",function(e) {
		if($(this).hasClass("disabled")){
			e.preventDefault()
		}else{

			if($("#visitor-first").val() == '' || $("#visitor-last").val() == ''  || $("#visitor-phone").val() == ''  || $("#visitor-email").val() == ''){
				$(".name-error").show();
			}else{
				if($('#age').prop('checked') == true && $("#guardName").val() == ''){
					$(".name-error").show();
				}else{
					$("#aboutVisit").show();
					$(".name-error").hide();
					$("#release").show();
					$('#button-unlock').hide();

					formUser.full = $('#visitor-first').val() + " " + $('#visitor-middle').val() + " " + $('#visitor-last').val();
					formUser.first = $('#visitor-first').val();
					formUser.middle = $('#visitor-middle').val();
					formUser.last = $('#visitor-last').val();
					if($('#age').prop('checked') == true){
						formUser.guardian = $('#guardName').val();
					}
					setNameEverywhere(formUser);
					return formUser;
				}
			}
		}
	})

	function setNameEverywhere(formUser){
		let nameOutput = "";
		if($('#age').prop('checked') == true){
			nameOutput = formUser.guardian;
		}else{
			nameOutput = formUser.full;
		}
		$('#signage .signed').text(nameOutput);
		$('.name-drop').text(nameOutput);
		$('#name-print').val(nameOutput);
	}

	$("#age").change(function() {
		if(this.checked) {
			$('.signedSealedDelivered').hide();
			$('#guardianBlock').show();

		}else{
			$('.signedSealedDelivered').show();
			$('#guardianBlock').hide();
		}
		let usertype = $('input[name=type]:checked').val()
		$("#consent-text").text(buildConsent(consentLanguage,langChooser,usertype));
	})
	var difference = "";
	var isTimeOK = false;

	$("#visit-start, #visit-end").change(function(){
		let usertype = $('input[name=type]:checked').val();
		let startDate  = moment($("#visit-start").val());
		let endDate = moment($("#visit-end").val());
		if(usertype == "Visitor" || usertype == "Employee"  || usertype == "External Partner" ){
			
			if(startDate != '' && endDate != ''){
				
				difference = endDate.diff(startDate,"hours")
				if(difference > 20){
					$("#date-error").text("This form is intended to be used for each visit, please adjust your dates to cover one day").show()
					isTimeOK = false;
				}else if(difference < 0){
					$("#date-error").text("The provided end date is before the start date.").show()
					isTimeOK = false;
				}else{
					$("#date-error").text("").hide()
					isTimeOK = true;
				}
			}
			if(usertype == "Employee" && startDate != ''){
				if(startDate.hour() >= 17 || startDate.hour() <= 7 || startDate.day() == 0 ||  startDate.day() == 6){
					$("#employeeAccess-block").show();
				}else{
					$("#employeeAccess-block").hide();
				}
			}
		}
	})
	
	$("#employeeAccess").change(function(){
		if($('#employeeAccess').prop('checked') == true){
			$("#employeeAccess-info").show();
		}else{
			$("#employeeAccess-info").hide();
		}

		
	})
	$("#agree").change(function() {

		if(this.checked) {
			$('#signage .signed').text(formUser.full);
			$('#signage .dated').text(moment().format("MMM D, YYYY, h:mm a"));
			formUser.signedDate = moment().toISOString();
			$('#sigBlock').fadeIn();
			$('#button-submit-help-form').removeClass('disabled');
			$('#signage').show()
		}else{
			$('#signage .signed').text(null);
			$('#signage .dated').text(null);
			formUser.signedDate = "";
			$('#sigBlock').hide();
			$('#button-submit-help-form').addClass('disabled');
			$('#signage').hide()
		}
	});

	$("#guardName").on("input", function() {

		if($(this).val().length >= 1){
			$('#GuardianAgree').prop('disabled', false);
		}else{
			$('#GuardianAgree').prop('disabled', true);
		}
	})

	$('input[name=type]').change(function(){
		let usertype = $('input[name=type]:checked').val()
		
		$('#button-unlock').removeClass("disabled").prop("disabled", false);

		$("#terms").html(buildTerms(terms,showFor,usertype));
		$("#consent-text").text(buildConsent(consentLanguage,langChooser,usertype));
		
		if(usertype == "Vendor" || usertype == "External Partner"){
			$('#company-group').fadeIn();
		}else{
			$('#company-group').hide();
			
		}

		if(usertype == "Employee"){
			$('#termsBox').hide();
			$("#employeeFlavor").show();
			$('#button-submit-help-form').removeClass('disabled');
		}else{
			$('#termsBox').show();
			$("#employeeFlavor").hide();
			$('#button-submit-help-form').addClass('disabled');
		}

		if(usertype == "Human Subject"){
			$('#detailed-questions').hide();
			$('#subjects-questions').show();
		}else{
			$('#detailed-questions').show();
			$('#subjects-questions').hide();
		}
	})
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			

			if($('input[name=type]:checked').val() != "Human Subject" && $('#visit-department').val() == "Default"){
				$('#final-error').show();
			}else{
				$('#final-error').hide();
			let deptVisiting = "";

			if($('input[name=type]:checked').val() == "Human Subject" || $('input[name=type]:checked').val() == "Research Partner"){
				deptVisiting = "Research"
			}else{
				deptVisiting = $('#visit-department').val();
			}
			// validation step
			let usertype = $('input[name=type]:checked').val()
			let validated = false;
			if(usertype != "Human Subject"){
				if($('#visit-contact').val() == ""
				|| $('#visit-email').val() == "" 
				|| $('#visit-building').val() == ""
				|| $('#visit-room').val() == "" ){
					$('#required-error').text("All visit information fields are required, please fill out to the best of your abilities.").show();
					validated = false;
				}else{
					$('#required-error').text("").hide();
					validated = true;
				}
			}else{
				if($('#visit-code').val() == ""){
					$('#required-error').text("The Research Code is required, please check emails from the WPI researcher you are working with for this info.").show();
					validated = false;
				}else{
					$('#required-error').text("").hide();
					validated = true;
				}
			}
			if(validated == true){
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/covid-campus-visitor',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									type: $('input[name=type]:checked').val() || "",
									firstName: $('#visitor-first').val() || "",
									middleName: $('#visitor-middle').val() || "",
									lastName: $('#visitor-last').val() || "",
									fullName: $('#visitor-first').val() + " " + $('#visitor-middle').val() + " " + $('#visitor-last').val(),
									phone: $('#visitor-phone').val() || "",
									email: $('#visitor-email').val() || "",
									companyName: $('#visitor-company').val() || "",
									underAge: $('input[name=age]').prop("checked") || "",
									guardName: $('#guardName').val() || "",
									guardPhone: $('#guardPhone').val() || "",
									guardEmail: $('#guardEmail').val() || "",
									visitStart: $('#visit-start').val() || "",
									visitEnd: $('#visit-end').val() || "",
									deptVisit: deptVisiting,
									deptContactName: $('#visit-contact').val() || "",
									deptContactEmail: $('#visit-email').val() || "",
									building: $('#visit-building').val() || "",
									room: $('#visit-room').val() || "",
									note: $('#visit-note').val() || "",
									code: $('visit-code').val() || "",
									agreeTOS: $('input[name=type]').prop("checked"),
									agreeDate: formUser.signedDate || "",
									employeeAccess: $('input[name=employeeAccess]').prop("checked")
								}
							},
							beforeSend: function(data) {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function() {
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('Submit Guest Access Request');
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').removeClass('disabled')
								$('#button-submit-help-form').html('Submit Guest Access Request');
							}
						}
					);
				});
			});
		}
		}
		}
	});

});