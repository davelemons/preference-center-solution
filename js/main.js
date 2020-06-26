	
const apiKey = 'TkpUxABWt5aVSeh5k5Fac6EBR8ytwoxS3raEvHME'
const baseURL = 'https://d72sxacxcl.execute-api.us-east-1.amazonaws.com/prod/preferencecenter/'

//TODO: get from query string
const projectID = '1aa20d5ade5c4699a5df45ddad370a10'
const userID = 'davelem_sms'

var metadata = {};
var endpoints = [];

var mockMetadata = {
  "projectID": "1aa20d5ade5c4699a5df45ddad370a10",
  "description": "Preference center for Spyglass & Field",
  "brandName": "Spyglass & Field",
  "logoURL": "img/badge.jpg",
  "availableChannels": [
    {
      "id": "EMAIL",
      "displayName": "Email",
      "inputLabel": "Email Address",
      "inputType": "email",
      "inputPlaceholder": "jane@example.com",
      "required": "true",
      "description": "This is a tooltip for Email!"
    },
    {
      "id": "SMS",
      "displayName": "SMS",
      "inputLabel": "Mobile Phone Number",
      "inputType": "tel",
      "inputPlaceholder": "(206) 555-0199",
      "required": "true",
      "description": "This is a tooltip for SMS!"
    }
  ],
  "text":{
    "page-header": "",
    "page-title": "Communication Preferences",
    "page-description": "Please indicate which newsletters and special offers you would like to receive below"
  },
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
        "inputPlaceholder": "Jane",
        "required": true,
        "description": "Please enter your First Name"
      },
      {
        "id":"lastName",
        "inputLabel": "Last Name",
        "inputType": "text",
        "inputPlaceholder": "Doe",
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
        "id":"shoppingPreference",
        "inputLabel": "Where do you Shop?",
        "inputType": "select",
        "required": false,
        "description": "",
        "options": [
          {
            "value": "",
            "label": "",
            "selected": true,
          },
          {
            "value": "ao",
            "label": "Always online",
            "selected": false,
          },
          {
            "value": "airs",
            "label": "Always in regular shops",
            "selected": false,
          },
          {
            "value": "aoirsap",
            "label": "As often in regular shops as possible",
            "selected": false,
          },
          {
            "value": "uooirs",
            "label": "Usually online, occasionally in regular shops",
            "selected": false,
          },
          {
            "value": "uirsoo",
            "label": "Usually in regular shops, occasionally online",
            "selected": false,
          }
        ]
      },
      {
        "id":"favoriteActivity",
        "inputLabel": "Favorite Activities",
        "inputType": "checkbox",
        "required": false,
        "description": "What is your favorite outdoor activity?",
        "options": [
          {
            "value": "Hiking",
            "label": "Hiking",
            "selected": false,
          },
          {
            "value": "Running",
            "label": "Running",
            "selected": false,
          },
          {
            "value": "Walking",
            "label": "Walking",
            "selected": false,
          },
          {
            "value": "Cycling",
            "label": "Cycling",
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
          "id":"runnersMonthly",
          "name": "Runners Monthly",
          "description": "<strong>Do you love running?</strong>  If so, you need to subscribe to this great newsletter with all things Running",
        },
        {
          "id":"theShoeCollector",
          "name": "The Shoe Collector",
          "description": "Celebrate all things related to the collecting and storing shoes",
        }
      ]
    },
    {
      "name": "Specials & New Arrivals",
      "description": "Sign up for the best deals and upcoming new seasonal seasonal discounts",
      "publications": [
        {
          "id":"weeklySpecials",
          "name": "Weekly Specials",
          "description": "Be one of the first to know about our weekly specials and special discounts",
        },
        {
          "id":"newArrivals",
          "name": "New Arrivals",
          "description": "Our inventory changes according to whats available each season.  Sign up to stay informed of all the new arrivals",
        }
      ]
    }
  ]
}

$(document).ready(function() { 

  registerHelpers();

  getMetadata(projectID) //TODO: pull from query string
  .then(function(returnedMetadata) {
    metadata = returnedMetadata;
    console.log("Metadata Loaded");
    return getEndpoints(projectID,userID)
  })
  .then(function(returnedEndpoints) {
    endpoints = returnedEndpoints;
    console.log("User Loaded");
    loadMetadata();
    loadUser();
    hideLoader();
    showForm();
  })
  .catch(function(e) {
    console.error('Error:', e);
    hideLoader();
    showError();
  });

  $(document).on('click', '#submit', function(){
    upsertEndpoints();
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
          resolve(mockMetadata); //TODO: Just mocking local data for now
          //resolve(json);
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

function getEndpoints(projectID, userID){
  return new Promise(function(resolve, reject) {
    if (projectID && userID) {
      // Update mode
      var requestUrl = baseURL + projectID + '/users/' + userID;
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      })
      .done(function(json) {
        if (json) {
          resolve(json.EndpointsResponse.Item);
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

function loadUser(){

  //Endpoint Addresses
  endpoints.forEach(function(endpoint, index) {
    $('.user-endpoint-input').each(function(address, index){
      if ($(this).data('attribute') === endpoint.ChannelType){
        $(this).val(endpoint.Address);
      }
    });

    //TODO: Mocking Data for now
    // endpoint.User.UserAttributes = {
    //   'firstName':['Paulo'],
    //   'lastName':['Santos'],
    //   'preferredChannel':['SMS'],
    //   'shoppingPreference':['ao'],
    //   'favoriteActivity':['Running','Cycling'],
    //   'runnersMonthly': ['EMAIL','SMS'],
    //   'weeklySpecials': ['EMAIL'],
    //   'newArrivals': ['SMS']
    // }
  });

  //User Attributes
  //TODO: need to figure out which endpoint we grab data off of...using first one for now
  var userAttributes = endpoints[0].User.UserAttributes;
  
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

function upsertEndpoints(){
  console.log("upsertEndpoints!");

  //TODO Validate Form

  readFormData();

  endpoints.reduce( (previousPromise, nextEndpoint) => {
    return previousPromise.then(() => {
      return upsertEndpoint(nextEndpoint);
    });
  }, Promise.resolve());

}

function upsertEndpoint(endpoint){
  return new Promise(function(resolve, reject) {
      // Update mode
      var requestUrl = baseURL + projectID + '/endpoints/' + encodeURIComponent(endpoint.Id);
      $.ajax({
        url: requestUrl,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(endpoint), 
        headers: {
          'x-api-key': apiKey
        }
      })
      .done(function(json) {
        if (json) {
          console.log(json)
          resolve();
        } else {
          reject();
        }
      })
      .fail(function(error) {
        console.error(error)
        reject(error);
      });
  })
}

function readFormData(){

  //Endpoint Addresses
  $('.user-endpoint-input').each(function(address, index){
    endpoints.forEach(function(endpoint, index) {
      $('.user-endpoint-input').each(function(address, index){
        if ($(this).data('attribute') === endpoint.ChannelType){
          endpoint.Address = $(this).val();
        }
      });
    });
  });

  //TODO: need to figure out which endpoint we grab data off of...using first one for now
  var userAttributes = endpoints[0].User.UserAttributes;
  
  var tmpData = {}

  //Textboxes and Dropdowns
  $('.user-attribute-input').each(function(attribute, index){
    for (const property in userAttributes) {
      if ($(this).data('attribute') === property){
        if(!tmpData[property]){
          tmpData[property] = [$(this).val()]
        } else {
          tmpData[property].push($(this).val());
        }
      }
    }
  });

  //Radio Buttons
  $('.user-attribute-radio').each(function(attribute, index){
    for (const property in userAttributes) {
      if ($(this).attr('name') === property){
        if($(this).val() == userAttributes[property])
          if($(this).prop('checked')){
            if(!tmpData[property]){
              tmpData[property] = [$(this).val()]
            } else {
              tmpData[property].push($(this).val());
            }
          }
      }
    }
  });

  //Checkboxes
  $('.user-attribute-checkbox').each(function(attribute, index){
    for (const property in userAttributes) {
      if ($(this).attr('name') === property){
        if ($(this).prop('checked')){
          if(!tmpData[property]){
            tmpData[property] = [$(this).val()]
          } else {
            tmpData[property].push($(this).val());
          }
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
            if ($(this).prop('checked')){
              if(!tmpData[property]){
                tmpData[property] = [$(this).val()]
              } else {
                tmpData[property].push($(this).val());
              }
            }
          }
        }
      });
    });
  });

  //Copy Checkbox values back into userAttributes
  for (const property in tmpData) {
    userAttributes[property] = tmpData[property]
  }

  //Update endpoint Users Attributes  TODO: Do we update all, or only update appropriate one if endpoint id is passed
  //TODO: do we want to make it configurable if user or endpoint attributes are updated?
  endpoints.forEach(function(endpoint, index) {
    endpoint.User.UserAttributes = userAttributes;
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