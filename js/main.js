	
const apiKey = 'TkpUxABWt5aVSeh5k5Fac6EBR8ytwoxS3raEvHME'
const baseURL = 'https://d72sxacxcl.execute-api.us-east-1.amazonaws.com/prod/preferencecenter/'

const projectID = getParameterByName('pid') //'1aa20d5ade5c4699a5df45ddad370a10'
const userID = getParameterByName('uid')//'cf2e45ba-6773-478a-8496-6c94231b215e'
var metadata = {};
var endpoints = [];



$(document).ready(function() { 

  registerHelpers();
  registerEvents();

  getMetadata(projectID)
  .then(function(returnedMetadata) {
    metadata = returnedMetadata;
    console.log("Metadata Loaded");
    return getEndpoints(projectID,userID)
  })
  .then(function(returnedEndpoints) {
    endpoints = returnedEndpoints;
    console.log("User Loaded", returnedEndpoints);
    loadMetadata();
    loadUser();
    hideLoader();
    showForm();
  })
  .catch(function(e) {
    console.error('Error:', e);
    hideLoader();
    showError("There was an error loading the preference center.");
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

function getEndpoints(projectID, userID){
  return new Promise(function(resolve, reject) {
    if (projectID) {
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

function loadUser(){

  //Endpoint Addresses
  endpoints.forEach(function(endpoint, index) {
    $('.user-endpoint-input').each(function(address, index){
      if ($(this).data('attribute') === endpoint.ChannelType){
        $(this).val(endpoint.Address);
        $(this).data('endpointid', endpoint.Id);
      }
    });
  });

  //User Attributes
  //TODO: need to figure out which endpoint we grab data off of...using first one for now
  if (endpoints.length){

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
}

function upsertEndpoints(){
  console.log("upsertEndpoints!");

  //TODO Validate Form

  readFormData();

  upsertUser() 
  .then(function(returnedEndpoints) {
    endpoints = returnedEndpoints;
    loadUser();
    hideLoader();
    showSuccess(metadata.text.successText)
  })
  .catch(function(e) {
    console.error('Error:', e);
    hideLoader();
    showError(metadata.text.errorText);
  });

  return;
}

function upsertUser(){
  return new Promise(function(resolve, reject) {
      // Update mode
      var requestUrl = baseURL + projectID + '/users';
      $.ajax({
        url: requestUrl,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(endpoints), 
        headers: {
          'x-api-key': apiKey
        }
      })
      .done(function(json) {
        if (json) {
          console.log(json)
          resolve(json);
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
    var endpointID = '';
    if( $(this).data('endpointid') ){
      //Existing Endpoint, so update
      endpoints.forEach(function(endpoint, index) {
        if (endpointID === endpoint.Id){
          endpoint.Address = $(this).val();
        }
      });
    } else if ($(this).val()) {
      //New Endpoint, so create new endpoint
      endpoints.push({
        'Address': $(this).val(),
        'ChannelType': $(this).data('attribute'),
        'User': { 
          'UserAttributes':{}
        }
      })
    }

  });

  //Build temporary attributes object
  var tmpAttributes = {};
  metadata.attributes.forEach(function(attribute, index) {
    tmpAttributes[attribute.id] = [];
  })

  metadata.categories.forEach(function(category, index) {
    category.publications.forEach(function(publication, index) {
      tmpAttributes[publication.id] = [];
    })
  })

  //Textboxes and Dropdowns
  $('.user-attribute-input').each(function(attribute, index){
    for (const property in tmpAttributes) {
      if ($(this).data('attribute') === property){
        tmpAttributes[property].push($(this).val());
      }
    }
  });

  //Radio Buttons
  $('.user-attribute-radio').each(function(attribute, index){
    for (const property in tmpAttributes) {
      if ($(this).attr('name') == property){
        if($(this).prop('checked') && tmpAttributes[property].indexOf($(this).val()) < 0){
          tmpAttributes[property].push($(this).val());
        }
      }
    }
  });

  //Checkboxes
  $('.user-attribute-checkbox').each(function(attribute, index){
    for (const property in tmpAttributes) {
      if ($(this).attr('name') === property){
        if ($(this).prop('checked')){
          tmpAttributes[property].push($(this).val());
        }
      }
    }
  });

  //Publications
  metadata.categories.forEach(function(category, index) {
    category.publications.forEach(function(publication, index) {
      $('.publication_' + publication.id).each(function(attribute, index){
        for (const property in tmpAttributes) {
          if ($(this).attr('name') === property){
            if ($(this).prop('checked')){
              tmpAttributes[property].push($(this).val());
            }
          }
        }
      });
    });
  });

  //Update endpoint Users Attributes  TODO: Do we update all, or only update appropriate one if endpoint id is passed
  //TODO: do we want to make it configurable if user or endpoint attributes are updated?
  endpoints.forEach(function(endpoint, index) {
    endpoint.User.UserAttributes = tmpAttributes;
  });

  console.log(endpoints);

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
  $('.error-notification').fadeIn().html('<i class="fas fa-exclamation-circle"></i> '+ msg);
  setTimeout(function(){ 
    $('.error-notification').fadeOut();
  }, 4000);
}

function showSuccess(msg) {
  $('.success-notification').fadeIn().html('<i class="far fa-check-circle"></i> ' + msg);
  setTimeout(function(){ 
    $('.success-notification').fadeOut();
  }, 4000);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function registerEvents(){
  $(document).on("submit", "form", function(e){
    e.preventDefault();
    upsertEndpoints();
    return  false;
  });

  $(document).on("click", "#unsub-from-all", function(e){
    if($(this).prop('checked')){
      $('.publication-checkbox').each(function(attribute, index){
        $(this).prop('checked', false);
      })
    }
  });
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
    var required = this.required ? 'required' : '';
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
            html += '<input type="checkbox" class="user-attribute-checkbox" data-attribute="' + this.id + '" id="checkbox_' + this.id + '_' + index + '" name="' + this.id + '" value="' + option.value + '" ' + required + '> <label class="checkbox-label" for="checkbox_' + this.id + '_' + index + '">' + option.label + '</label>'
          });
          html += '</span>'
          return new Handlebars.SafeString(html);
        case 'radio':
          html = '<span class="radio-container">';
          this.options.forEach((option, index) => {
            html += '<input type="radio" class="user-attribute-radio" data-attribute="' + this.id + '" id="radio_' + this.id + '_' + index + '" name="' + this.id + '" value="' + option.value + '" ' + required + '> <label class="radio-label" for="radio_' + this.id + '_' + index + '">' + option.label + '</label>'
          });
          html += '</span>'
          return new Handlebars.SafeString(html);
        default:
          html = '<input class="user-' + type + '-input" type="text" data-attribute="' + this.id + '" placeholder="' + this.inputPlaceholder + '" id="' + type + '_' + this.id + '_' + options.data.index + '" ' + required + '></input>';
    }
    return new Handlebars.SafeString(html)
  });
}