const apiKey = 'TkpUxABWt5aVSeh5k5Fac6EBR8ytwoxS3raEvHME'
const baseURL = 'https://d72sxacxcl.execute-api.us-east-1.amazonaws.com/prod/preferencecenter/'

const projectID = getParameterByName('pid') // '1aa20d5ade5c4699a5df45ddad370a10'
const preferenceCenterID = getParameterByName('pcid') // '1aa20d5ade5c4699a5df45ddad370a10'
const userID = getParameterByName('uid')// 'cf2e45ba-6773-478a-8496-6c94231b215e'
var metadata = {}
var endpoints = []

$(document).ready(function () {
  registerHelpers()
  registerEvents()

  getMetadata(projectID).then(function (returnedMetadata) {
    metadata = returnedMetadata
    console.log('Metadata Loaded')
    return getEndpoints(projectID, userID)
  }).then(function (returnedEndpoints) {
    endpoints = returnedEndpoints
    console.log('User Loaded', returnedEndpoints)
    loadMetadata()
    loadUser()

    // Input Masks
    $(':input').inputmask()

    // Form Validation
    $('#form').validetta({
      display: 'bubble',
      bubblePosition: 'bottom',
      errorClass: 'validetta-error',
      realTime: true
    }, metadata.text.inputValidationMessages)

    hideLoader()
    showForm()
  }).catch(function (e) {
    console.error('Error:', e)
    hideLoader()
    showError('There was an error loading the preference center.')
  })
})

function getMetadata (projectID) {
  return new Promise(function (resolve, reject) {
    if (projectID) {
      // Update mode
      var requestUrl = baseURL + projectID + '?pcid=' + preferenceCenterID
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      }).done(function (json) {
        if (json) {
          resolve(json)
          // resolve(mockMetadata); //TODO: Remove.
        } else {
          reject(new Error('Received invalid json from service'))
        }
      }).fail(function (error) {
        reject(error)
      })
    } else {
      reject(new Error('projectID is required'))
    }
  })
}

function loadMetadata () {
  var source = $('#template-main-content').html()
  var template = Handlebars.compile(source)
  $('#content').html(template(metadata))
}

function getEndpoints (projectID, userID) {
  return new Promise(function (resolve, reject) {
    if (projectID) {
      // Update mode
      var requestUrl = baseURL + projectID + '/users/' + userID
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      }).done(function (json) {
        if (json) {
          resolve(json)
        } else {
          reject(new Error('Received invalid json from service'))
        }
      }).fail(function (error) {
        reject(error)
      })
    } else {
      reject(new Error('projectID is required'))
    }
  })
}

function loadUser () {
  // Endpoint Addresses
  endpoints.forEach(function (endpoint, index) {
    $('.user-endpoint-input').each(function (address, index) {
      if ($(this).data('attribute') === endpoint.ChannelType) {
        $(this).val(endpoint.Address)
        $(this).data('endpointid', endpoint.Id)
      }
    })
  })

  // User Attributes
  // TODO: need to figure out which endpoint we grab data off of...using first one for now
  if (endpoints.length) {
    var userAttributes = endpoints[0].User.UserAttributes

    // Textboxes and Dropdowns
    $('.user-attribute-input').each(function (attribute, index) {
      for (const property in userAttributes) {
        if ($(this).data('attribute') === property) {
          $(this).val(userAttributes[property])
        }
      }
    })

    // Radio Buttons
    $('.user-attribute-radio').each(function (attribute, index) {
      for (const property in userAttributes) {
        if ($(this).attr('name') === property) {
          if (userAttributes[property].indexOf($(this).val()) > -1) {
            $(this).prop('checked', true)
          }
        }
      }
    })

    // Checkboxes
    $('.user-attribute-checkbox').each(function (attribute, index) {
      for (const property in userAttributes) {
        if ($(this).attr('name') === property) {
          if (userAttributes[property].indexOf($(this).val()) > -1) {
            $(this).prop('checked', true)
          }
        }
      }
    })

    // Publications
    metadata.categories.forEach(function (category, index) {
      category.publications.forEach(function (publication, index) {
        $('.publication_' + publication.id).each(function (attribute, index) {
          for (const property in userAttributes) {
            if ($(this).attr('name') === property) {
              if (userAttributes[property].indexOf($(this).val()) > -1) {
                $(this).prop('checked', true)
              }
            }
          }
        })
      })
    })
  }
}

function upsertEndpoints () {
  console.log('upsertEndpoints!')

  showProgress()
  readFormData()

  upsertUser().then(function (returnedEndpoints) {
    endpoints = returnedEndpoints
    loadUser()
    hideProgress()
    showSuccess(metadata.text.successText)
  }).catch(function (e) {
    console.error('Error:', e)
    hideProgress()
    showError(metadata.text.errorText)
  })
}

function upsertUser () {
  return new Promise(function (resolve, reject) {
    // Update mode
    var requestUrl = baseURL + projectID + '/users'
    $.ajax({
      url: requestUrl,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(endpoints),
      headers: {
        'x-api-key': apiKey
      }
    })
      .done(function (json) {
        if (json) {
          console.log(json)
          resolve(json)
        } else {
          reject(new Error('Received invalid json from service'))
        }
      })
      .fail(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function readFormData () {
  // Endpoint Addresses
  $('.user-endpoint-input').each(function (address, index) {
    var endpointID = ''
    if ($(this).data('endpointid')) {
      // Existing Endpoint, so update
      endpointID = $(this).data('endpointid')
      var endpointInput = this
      endpoints.forEach(function (endpoint, index) {
        if (endpointID === endpoint.Id) {
          if ($(endpointInput).data('inputmask')) {
            // We have an input mask so grab unmasked value
            endpoint.Address = $(endpointInput).inputmask('unmaskedvalue')
          } else {
            endpoint.Address = $(endpointInput).val()
          }
        }
      })
    } else if ($(this).val()) {
      // New Endpoint, so create new endpoint
      var tmpAddress = ''
      if ($(this).data('inputmask')) {
        // We have an input mask so grab unmasked value
        tmpAddress = $(this).inputmask('unmaskedvalue')
      } else {
        tmpAddress = $(this).val()
      }
      endpoints.push({
        Address: tmpAddress,
        ChannelType: $(this).data('attribute'),
        User: {
          UserAttributes: {}
        }
      })
    }
  })

  // Build temporary attributes object
  var tmpAttributes = {}
  metadata.attributes.forEach(function (attribute, index) {
    tmpAttributes[attribute.id] = []
  })

  metadata.categories.forEach(function (category, index) {
    category.publications.forEach(function (publication, index) {
      tmpAttributes[publication.id] = []
    })
  })

  // Textboxes and Dropdowns
  $('.user-attribute-input').each(function (attribute, index) {
    for (const property in tmpAttributes) {
      if ($(this).data('attribute') === property) {
        if ($(this).data('inputmask')) {
          // We have an input mask so grab unmasked value
          tmpAttributes[property].push($(this).inputmask('unmaskedvalue'))
        } else {
          tmpAttributes[property].push($(this).val())
        }
      }
    }
  })

  // Radio Buttons
  $('.user-attribute-radio').each(function (attribute, index) {
    for (const property in tmpAttributes) {
      if ($(this).attr('name') === property) {
        if ($(this).prop('checked') && tmpAttributes[property].indexOf($(this).val()) < 0) {
          tmpAttributes[property].push($(this).val())
        }
      }
    }
  })

  // Checkboxes
  $('.user-attribute-checkbox').each(function (attribute, index) {
    for (const property in tmpAttributes) {
      if ($(this).attr('name') === property) {
        if ($(this).prop('checked')) {
          tmpAttributes[property].push($(this).val())
        }
      }
    }
  })

  // Publications
  metadata.categories.forEach(function (category, index) {
    category.publications.forEach(function (publication, index) {
      $('.publication_' + publication.id).each(function (attribute, index) {
        for (const property in tmpAttributes) {
          if ($(this).attr('name') === property) {
            if ($(this).prop('checked')) {
              tmpAttributes[property].push($(this).val())
            }
          }
        }
      })
    })
  })

  // Update endpoint Users Attributes  TODO: Do we update all, or only update appropriate one if endpoint id is passed
  // TODO: do we want to make it configurable if user or endpoint attributes are updated?
  endpoints.forEach(function (endpoint, index) {
    endpoint.User.UserAttributes = tmpAttributes
  })

  console.log(endpoints)
}

function showLoader () {
  $('#spinner').show()
}

function hideLoader () {
  $('#spinner').hide()
}

function showProgress () {
  $('#progress').show()
}

function hideProgress () {
  $('#progress').hide()
}

function showForm () {
  $('#content').show()
}

function hideForm () {
  $('#content').hide()
}

function showError (msg) {
  $('.error-notification').fadeIn().html('<i class="fas fa-exclamation-circle"></i> ' + msg)
  setTimeout(function () {
    $('.error-notification').fadeOut()
  }, 4000)
}

function showSuccess (msg) {
  $('.success-notification').fadeIn().html('<i class="far fa-check-circle"></i> ' + msg)
  setTimeout(function () {
    $('.success-notification').fadeOut()
  }, 4000)
}

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)
  if (!results) return ''
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function registerEvents () {
  $(document).on('submit', 'form', function (e) {
    e.preventDefault()
    upsertEndpoints()
    return false
  })

  $(document).on('click', '#unsub-from-all', function (e) {
    if ($(this).prop('checked')) {
      $('.publication-checkbox').each(function (attribute, index) {
        $(this).prop('checked', false)
      })
    }
  })
}

function registerHelpers () {
  Handlebars.registerHelper('buildInput', function (type, options) {
    var html = ''
    var required = ''

    console.log(typeof (this.required))
    if (this.required && typeof (this.required) === 'string') {
      required = 'data-validetta="' + this.required + '"'
    } else if (this.required) {
      required = 'data-validetta="required"'
    }

    switch (this.inputType) {
      case 'select':
        html = '<select class="user-attribute-input" data-attribute="' + this.id + '" id="select_' + this.id + '">'
        this.options.forEach((option, index) => {
          html += '<option value="' + option.value + '">' + option.label + '</option>'
        })
        html += '</select>'
        return new Handlebars.SafeString(html)
      case 'checkbox':
        html = '<span class="checkbox-container">'
        this.options.forEach((option, index) => {
          html += '<input type="checkbox" class="user-attribute-checkbox" data-attribute="' + this.id + '" id="checkbox_' + this.id + '_' + index + '" name="' + this.id + '" value="' + option.value + '" ' + required + '> <label class="checkbox-label" for="checkbox_' + this.id + '_' + index + '">' + option.label + '</label>'
        })
        html += '</span>'
        return new Handlebars.SafeString(html)
      case 'radio':
        html = '<span class="radio-container">'
        this.options.forEach((option, index) => {
          html += '<input type="radio" class="user-attribute-radio" data-attribute="' + this.id + '" id="radio_' + this.id + '_' + index + '" name="' + this.id + '" value="' + option.value + '" ' + required + '> <label class="radio-label" for="radio_' + this.id + '_' + index + '">' + option.label + '</label>'
        })
        html += '</span>'
        return new Handlebars.SafeString(html)
      default:
        inputMask = this.inputMask ? 'data-inputmask="' + this.inputMask + '"' : ''
        html = '<input class="user-' + type + '-input" type="text" data-attribute="' + this.id + '" placeholder="' + this.inputPlaceholder + '" id="' + type + '_' + this.id + '_' + options.data.index + '" ' + required + ' ' + inputMask + '/>'
    }
    return new Handlebars.SafeString(html)
  })
}