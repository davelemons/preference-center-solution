# Annotated Metadata
Please refer to the comments below for a high-level description of each property in the metadata:

```js
{
  "projectID": "1aa20d5ade5c4699a5df45ddad370a10", //[Required] - The PinpointProjectID associated with this preference center
 	"preferenceCenterID": "default", //[Required] - A preference center ID that allows you to have multiple preference centers for a Pinpoint Project/Application.  This could be used to support multiple brands and/or languages.  This is also passed as a querystring parameter (pcid).  If not specified then the preference center will pull 'default' 
	"description": "Preference center for Accent Athletics", //[Optional] - Just a description of the preference center.  Not displayed anywhere and just used to help describe the preference center.  For example if you had multiple brands and languages, you could say: "Japanese Preference Center for Way Cool Brand B"
	"websiteURL": "http://aws.amazon.com", //[Optional] - The website url to link to when the Logo Image is clicked
	"unsubscribe": {
		"surveyQuestions": ["I no longer want to receive these emails", "I never signed up for this mailing list", "The emails are inappropriate", "The emails are spam and should be reported", "Other (fill in reason below)"], //[Optional] - A collection of responses to render in the Unsubscribe Survey.
		"enabled": true, //[Optional] - If true will render Unsubscribe from all checkbox at bottom of page.
		"surveyEnabled": true //[Optional] - If true will render an unsubscribe survey and record responses as custom pinpoint events
	},
	"categories": [{ //[Optional] - A collection of Categories to display for publications.
		"name": "Newsletters", //[Required] - The name of the category displayed as a header on the preference center
		"description": "Check out our way cool newsletters!", //[Optional] - Will display a short description under the Category header above.
		"publications": [{ //[Required] - a collection of Publications.  These eventually manifest as pre-defined segments within Pinpoint
			"name": "Runners Monthly", //[Required] - The name of the publication to display in the preference center
			"description": "<strong>Do you love running?</strong>  If so, you need to subscribe to this great newsletter with all things Running", //[Optional] - An HTML description to display under the publication name
			"id": "runnersMonthly" // [Required] An ID that represents the publication, this will be used as the Segment Name within Pinpoint
		}, {
			"name": "The Shoe Collector",
			"description": "Celebrate all things related to the collecting and storing shoes",
			"id": "theShoeCollector"
		}]
	}, {
		"name": "Specials & New Arrivals",
		"description": "Sign up for the best deals and upcoming new seasonal seasonal discounts",
		"publications": [{
			"name": "Weekly Specials",
			"description": "Be one of the first to know about our weekly specials and special discounts",
			"id": "weeklySpecials"
		}, {
			"name": "New Arrivals",
			"description": "Our inventory changes according to whats available each season.  Sign up to stay informed of all the new arrivals",
			"id": "newArrivals"
		}]
	}],
	"logoURL": "img/badge.jpg", //[Optional] - A URL to an image to be displayed at the top-left.  This can be omitted to allow for iFraming the preference center into an existing page
	"attributes": [{ //[Optional] - A collection of custom attributes to display.  These will be saved as User.UserAttributes on each of the endpoint records
		"inputLabel": "First Name", //[Required] - The label to display next to the input.
		"description": "Please enter your First Name", //[Optional] - If specified will render a tooltip question mark next to the encdpoint so the user can see more information
		"inputType": "text", //[Required] - The type of input to display.  Supports all html input types along with: select, radio, and checkbox.  See: https://www.w3schools.com/html/html_form_input_types.asp
		"id": "firstName", //[Required] - the ID of the attribute.  This will be used as the property name on the User.UserAttributes object
		"required": true, //[Optional] - If true will force the user to enter a value.  This also supports passing a string value to allow for more granular field validation.  See http://lab.hasanaydogdu.com/validetta/
		"inputPlaceholder": "Jane" //[ Optional] - Will display place holder text into the input with an example for the user
		"inputMask": "", // [Optional] - If specified will force the input into a particular format.  See availableChannels below for a better example. https://github.com/RobinHerbots/Inputmask#via-data-inputmask-attribute
	}, {
		"inputLabel": "Last Name",
		"description": "Please enter your Last Name",
		"inputType": "text",
		"id": "lastName",
		"required": true,
		"inputPlaceholder": "Doe"
	}, {
		"inputLabel": "Communication Preference",
		"options": [{ //[Required for select, radio, checkbox] - The options to display in a dropdown, radio button list, or checkbox list.
			"value": "EMAIL", //[Required] - The value to store in the User.UserAttributes
			"selected": false, //[Optional] - If specified this value will be selected by default
			"label": "Email" //[Required] - The lable to display on the website
		}, {
			"value": "SMS",
			"selected": false,
			"label": "SMS"
		}],
		"description": "How would you like for us to contact you?",
		"inputType": "radio",
		"id": "preferredChannel",
		"required": false
	}, {
		"inputLabel": "Where do you Shop?",
		"options": [{
			"value": "",
			"selected": true,
			"label": ""
		}, {
			"value": "ao",
			"selected": false,
			"label": "Always online"
		}, {
			"value": "airs",
			"selected": false,
			"label": "Always in regular shops"
		}, {
			"value": "aoirsap",
			"selected": false,
			"label": "As often in regular shops as possible"
		}, {
			"value": "uooirs",
			"selected": false,
			"label": "Usually online, occasionally in regular shops"
		}, {
			"value": "uirsoo",
			"selected": false,
			"label": "Usually in regular shops, occasionally online"
		}],
		"description": "",
		"inputType": "select",
		"id": "shoppingPreference",
		"required": false
	}, {
		"inputLabel": "Favorite Activities",
		"options": [{
			"value": "Hiking",
			"selected": false,
			"label": "Hiking"
		}, {
			"value": "Running",
			"selected": false,
			"label": "Running"
		}, {
			"value": "Walking",
			"selected": false,
			"label": "Walking"
		}, {
			"value": "Cycling",
			"selected": false,
			"label": "Cycling"
		}],
		"description": "What is your favorite outdoor activity?",
		"inputType": "checkbox",
		"id": "favoriteActivity",
		"required": false
	}],
	"text": { //[Required] - This object contains all of the text that will be displayed on the preference center.  This text can be customized with a different language as well.
		"inputValidationMessages": { //[Optional] - This object allows for overriding all of the different input validation messages that can appear on the preference center
			"number": "You can enter only numbers in this field.",
			"maxChecked": "Maximum {count} options allowed. ",
			"minLength": "Minimum {count} characters allowed.",
			"maxSelected": "Maximum {count} selection allowed.",
			"notEqual": "Fields do not match.",
			"minChecked": "Please select minimum {count} options.",
			"minSelected": "Minimum {count} selection allowed.",
			"different": "Fields cannot be the same as each other.",
			"creditCard": "Invalid credit card number.",
			"required": "This field is required.",
			"email": "Your E-mail address appears to be invalid.",
			"maxLength": "Maximum {count} characters allowed."
		},
		"errorText": "We apologize, but there was an error saving your information.", //The general error message displayed if there are errors saving information
		"pageTitle": "Communication Preferences", //The main title displayed at the top of the preference center just under the header
		"unsubscribeText": "Please Remove me from all Publications", //The text displayed next to the unsubscribe from all checkbox
		"successText": "Thank you for submitting your information!", //The text displayed when the users information was successfully saved.
		"pageDescription": "Please indicate which newsletters and special offers you would like to receive below", //The text displayed just under the Page Title above. This also accepts HTML
		"submitButtonText": "Submit", //The text displayed on the submit button
		"pageHeader": "" //HTML displayed in the page header. This could be a banner, company title, or left empty to allow for iFraming the preference center into an existing webpage
	},
	"availableChannels": [{  //[Required] - A collection of Channels to collect for the user.  These will equate to endpoints within Pinpoint
		"displayName": "Email", //[Required] - The preference center allows users to opt-into publications for each of the available channels.  This value is displayed as the header of the table column
		"inputLabel": "Email Address", //[Required] - The label to display next to the input.
		"description": "This is a tooltip for Email!", //[Optional] - If specified will render a tooltip question mark next to the encdpoint so the user can see more information
		"inputType": "email", //[Required] - The type of input to display.  Supports all html input types along with: select, radio, and checkbox.  See: https://www.w3schools.com/html/html_form_input_types.asp
		"id": "EMAIL", //[Required] - the Channel of the available channel.  This is the Channel of the endpoint: https://docs.aws.amazon.com/pinpoint/latest/userguide/channels.html
		"inputMask": "'alias': 'email'", // [Optional] - If specified will force the input into a particular format. https://github.com/RobinHerbots/Inputmask#via-data-inputmask-attribute
		"required": true, //[Optional] - If true will force the user to enter a value.  This also supports passing a string value to allow for more granular field validation.  See http://lab.hasanaydogdu.com/validetta/
		"inputPlaceholder": "jane@example.com" //[ Optional] - Will display place holder text into the input with an example for the user
	}, {
		"displayName": "SMS",
		"inputLabel": "Mobile Phone Number",
		"description": "This is a tooltip for SMS!",
		"inputType": "tel",
		"id": "SMS",
		"inputMask": "'mask': '+1(999) 999-9999'",
		"required": false,
		"inputPlaceholder": "(206) 555-0199"
	}],
	"description": "Preference center for Accent Athletics", //[Optional] - Just a description of the preference center.  Not displayed anywhere and just used to help describe the preference center.  For example if you had multiple brands and languages, you could say: "Japanese Preference Center for Way Cool Brand B"
	"preferenceCenterID": "default" //[Required] - A preference center ID that allows you to have multiple preference centers for a Pinpoint Project/Application.  This could be used to support multiple brands and/or languages.  This is also passed as a querystring parameter (pcid).  If not specified then the preference center will pull 'default'
}
```