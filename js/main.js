	
const apiKey = 'TkpUxABWt5aVSeh5k5Fac6EBR8ytwoxS3raEvHME'
const baseURL = 'https://d72sxacxcl.execute-api.us-east-1.amazonaws.com/prod/preferencecenter/'

var metadata = {};
var endpoint = {};

var mockMetadata = {
  "projectID": "1aa20d5ade5c4699a5df45ddad370a10",
  "description": "Preference center for Spyglass & Field",
  "brandName": "Spyglass & Field",
  "logoURL": "img/badge.png",
  "availableChannels": [
    {
      "id": "EMAIL",
      "displayName": "Email",
      "inputLabel": "Email Address",
      "inputType": "email",
      "inputPlaceholder": "mary@test.com",
      "required": "true",
      "description": "This is a tooltip for Email!"
    },
    {
      "id": "SMS",
      "displayName": "SMS",
      "inputLabel": "Mobile Phone Number",
      "inputType": "tel",
      "inputPlaceholder": "(555) 123-4567",
      "required": "true",
      "description": "This is a tooltip for SMS!"
    }
  ],
  "text":{
    "page-header": "<img class='logo' alt='Spyglass & Field' src='img/logo.png' />",
    "page-title": "Communication Preferences",
    "page-description": "Please indicate which newsletters and special offers you would like to receive below"
  },
  "endpoints":[
    {
      "Address":"dave@davelemons.com",
      "ChannelType":"EMAIL"
    },
    {
      "Address":"+13173739253",
      "ChannelType":"SMS"
    }
  ],
  "unsubscribe":{
    "enabled":true,
    "surveyEnabled":true,
    "buttonText": "Please Remove me from all Publications",
    "confirmationHTML": "<strong>You have been removed from all publications.</strong?<hr /> We're sorry to see you go.  We want to be better can you let us know why you are leaving us?",
    "surveyQuestions":[
      "I no longer want to receive these emails",
      "I never signed up for this mailing list",
      "The emails are inappropriate",
      "The emails are spam and should be reported",
      "Other (fill in reason below)"
    ]
  },
  "attributes":[
      {
        "id":"firstName",
        "inputLabel": "First Name",
        "inputType": "text",
        "inputPlaceholder": "Mary",
        "required": true,
        "description": "Please enter your First Name"
      },
      {
        "id":"lastName",
        "inputLabel": "Last Name",
        "inputType": "text",
        "inputPlaceholder": "Smith",
        "required": true,
        "description": "Please enter your Last Name"
      },
      {
        "id":"preferredChannel",
        "inputLabel": "Communication Preference",
        "inputType": "radio",
        "required": false,
        "description": "How would you like for us to contact you?",
        "options": [
          {
            "value": "EMAIL",
            "label": "Email",
            "selected": false,
          },
          {
            "value": "SMS",
            "label": "SMS",
            "selected": false,
          }
        ]
      },
      {
        "id":"pizzaTopping",
        "inputLabel": "Favorite Pizza Topping",
        "inputType": "select",
        "required": false,
        "description": "What do you like on your Pizza?",
        "options": [
          {
            "value": "",
            "label": "",
            "selected": true,
          },
          {
            "value": "sausage",
            "label": "Sausage",
            "selected": false,
          },
          {
            "value": "Pepperoni",
            "label": "Pepperoni",
            "selected": false,
          },
          {
            "value": "Anchovies",
            "label": "Anchovies",
            "selected": false,
          }
        ]
      },
      {
        "id":"cuisineType",
        "inputLabel": "Favorite Cuisine Types",
        "inputType": "checkbox",
        "required": false,
        "description": "What types of food do you like to eat",
        "options": [
          {
            "value": "Spanish",
            "label": "Spanish",
            "selected": false,
          },
          {
            "value": "American",
            "label": "American",
            "selected": false,
          },
          {
            "value": "Sushi",
            "label": "Sushi",
            "selected": false,
          },
          {
            "value": "Mexican",
            "label": "Mexican",
            "selected": false,
          }
        ]
      }
  ],
  "categories":[
    {
      "name": "Newsletters",
      "description": "Check out our way cool newsletters!",
      "publications": [
        {
          "id":"plm",
          "name": "Pizza Lovers Monthly",
          "description": "<strong>Do you love pizza?</strong>  If so, you need to subscribe to this great newsletter with all things Pizza.",
        },
        {
          "id":"eos",
          "name": "The Earl of Sandwich",
          "description": "Celebrate all things related to the amazing sandwich",
        }
      ]
    },
    {
      "name": "Specials & Seasonal Updates",
      "description": "Sign up for the best deals and upcoming new seasonal menus",
      "publications": [
        {
          "id":"ws",
          "name": "Weekly Specials",
          "description": "Be one of the first to know about our weekly specials and special discounts",
        },
        {
          "id":"sm",
          "name": "Seasonal Updates",
          "description": "Our menu changes according to whats available this season.  Sign up to stay informed of all the new dishes",
        }
      ]
    }
  ]
}

$(document).ready(function() { 

  registerHelpers();

  getMetadata('1aa20d5ade5c4699a5df45ddad370a10') //TODO: pull from query string
  .then(function(returnedMetadata) {
    metadata = returnedMetadata;
    console.log("Metadata Loaded");
    return getEndpoint('1aa20d5ade5c4699a5df45ddad370a10','a8vcg700nsarn0wj4zfkql8hd68')
  })
  .then(function(returnedEndpoint) {
    endpoint = returnedEndpoint;
    console.log("Endpoint Loaded");
    loadMetadata();
    loadEndpoint();
    hideLoader();
    showForm();
  })
  .catch(function(e) {
    console.error('Error:', e);
    hideLoader();
    showError();
  });

}); 

function getMetadata(projectID) {
  return new Promise(function(resolve, reject) {
    if (projectID) {
      // Update mode
      var requestUrl = baseURL + projectID;
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      })
      .done(function(json) {
        if (json) {
          resolve(json);
        } else {
          reject();
        }
      })
      .fail(function(error) {
        reject(error);
      });
    } else {
      reject();
    }
  })
}

function loadMetadata(){
  var source = $("#template-main-content").html();
  var template = Handlebars.compile(source);
  $('#content').html(template(metadata));
}

function getEndpoint(projectID, endpointID){
  return new Promise(function(resolve, reject) {
    if (projectID && endpointID) {
      // Update mode
      var requestUrl = baseURL + projectID + '/endpoints/' + endpointID;
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      })
      .done(function(json) {
        if (json) {
          resolve(json.EndpointResponse);
        } else {
          reject();
        }
      })
      .fail(function(error) {
        reject(error);
      });
    } else {
      reject();
    }
  })
}

function loadEndpoint(){
  console.log(endpoint)

  //Endpoint Addresses
  $('.user-endpoint-input').each(function(address, index){
    if ($(this).data('attribute') === endpoint.ChannelType){
      $(this).val(endpoint.Address);
    }
  });

  //TODO: Mocking Data for now
  endpoint.User.UserAttributes = {
    'firstName':['Dave'],
    'lastName':['Lemons'],
    'preferredChannel':['SMS'],
    'pizzaTopping':['sausage'],
    'cuisineType':['American','Mexican'],
    'plm': ['EMAIL','SMS'],
    'ws': ['EMAIL'],
    'sm': ['SMS']
  }

  //User Attributes
  var userAttributes = endpoint.User.UserAttributes;
  
  //Textboxes and Dropdowns
  $('.user-attribute-input').each(function(attribute, index){
    for (const property in userAttributes) {
      if ($(this).data('attribute') === property){
        $(this).val(userAttributes[property]);
      }
    }
  });

  //Radio Buttons
  $('.user-attribute-radio').each(function(attribute, index){
    for (const property in userAttributes) {
      if ($(this).attr('name') === property){
        if($(this).val() == userAttributes[property])
        $(this).prop('checked', true)
      }
    }
  });

  //Checkboxes
  $('.user-attribute-checkbox').each(function(attribute, index){
    for (const property in userAttributes) {
      if ($(this).attr('name') === property){
        if(userAttributes[property].indexOf($(this).val()) > -1){
          $(this).prop('checked', true)
        }
      }
    }
  });

  //Publications
  metadata.categories.forEach(function(category, index) {
    category.publications.forEach(function(publication, index) {
      $('.publication_' + publication.id).each(function(attribute, index){
        for (const property in userAttributes) {
          if ($(this).attr('name') === property){
            if(userAttributes[property].indexOf($(this).val()) > -1){
              $(this).prop('checked', true)
            }
          }
        }
      });
    });
  });
}

function showLoader() {
	$('#spinner').show()
}

function hideLoader() {
	$('#spinner').hide()
}

function showForm() {
	$('#content').show()
}

function hideForm() {
	$('#content').hide()
}

function showError(msg) {
	$('#error').html(msg).show()
}

function hideError() {
	$('#error').html('').hide()
}

function registerHelpers(){
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':  return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':  return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':   return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':  return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':   return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':  return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':  return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':  return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:    return options.inverse(this);
    }
  });

  Handlebars.registerHelper('buildInput', function (type, options) {

    var html = '';
    switch (this.inputType) {
        case 'select':
          html = '<select class="user-attribute-input" data-attribute="' + this.id + '" id="select_' + this.id + '">';
          this.options.forEach((option, index) => {
            html += '<option value="' + option.value + '">' + option.label + '</option>';
          });
          html += '</select>';
          return new Handlebars.SafeString(html);
        case 'checkbox':
          html = '<span class="checkbox-container">';
          this.options.forEach((option, index) => {
            html += '<input type="checkbox" class="user-attribute-checkbox" data-attribute="' + this.id + '" id="checkbox_' + this.id + '_' + index + '" name="' + this.id + '" value="' + option.value + '"> <label class="checkbox-label" for="checkbox_' + this.id + '_' + index + '">' + option.label + '</label>'
          });
          html += '</span>'
          return new Handlebars.SafeString(html);
        case 'radio':
          html = '<span class="radio-container">';
          this.options.forEach((option, index) => {
            html += '<input type="radio" class="user-attribute-radio" data-attribute="' + this.id + '" id="radio_' + this.id + '_' + index + '" name="' + this.id + '" value="' + option.value + '"> <label class="radio-label" for="radio_' + this.id + '_' + index + '">' + option.label + '</label>'
          });
          html += '</span>'
          return new Handlebars.SafeString(html);
        default:
          html = '<input class="user-' + type + '-input" type="text" data-attribute="' + this.id + '" placeholder="' + this.inputPlaceholder + '" id="' + type + '_' + this.id + '_' + options.data.index + '"></input>';
    }
    return new Handlebars.SafeString(html)
  });
}