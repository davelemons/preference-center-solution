<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API"></a>

##   Will also validate inputs and submit updates to REST API
**Version**: 1.0.0  
**Author**: davelem  

* [  Will also validate inputs and submit updates to REST API](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)
    * [~getMetadata()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..getMetadata) ⇒ <code>Object</code>
    * [~loadMetadata()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..loadMetadata)
    * [~getEndpoints(projectID, userID)](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..getEndpoints) ⇒ <code>Array</code>
    * [~loadUser()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..loadUser)
    * [~upsertEndpoints()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..upsertEndpoints)
    * [~upsertUser()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..upsertUser) ⇒ <code>Array</code>
    * [~readFormData()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..readFormData)
    * [~showLoader()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showLoader)
    * [~hideLoader()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..hideLoader)
    * [~showProgress()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showProgress)
    * [~hideProgress()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..hideProgress)
    * [~showForm()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showForm)
    * [~hideForm()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..hideForm)
    * [~showError(msg)](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showError)
    * [~showSuccess(msg)](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showSuccess)
    * [~getParameterByName(name, url)](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..getParameterByName) ⇒ <code>String</code>
    * [~registerEvents()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..registerEvents)
    * [~registerHelpers()](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..registerHelpers)

<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..getMetadata"></a>

###   Will also validate inputs and submit updates to REST API~getMetadata() ⇒ <code>Object</code>
Retrieves all endpoints for a given UserID

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
**Returns**: <code>Object</code> - The preference center metadata stored in DynamoDB for the given projectID and preferenceCenterID. 
If preferenceCenterID isn't specified then 'default' will be used.  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..loadMetadata"></a>

###   Will also validate inputs and submit updates to REST API~loadMetadata()
Compiles handlebars template to populate preference center html

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..getEndpoints"></a>

###   Will also validate inputs and submit updates to REST API~getEndpoints(projectID, userID) ⇒ <code>Array</code>
Retrieves all endpoints for a given UserID

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
**Returns**: <code>Array</code> - Collection of user endpoints: https://docs.aws.amazon.com/pinpoint/latest/apireference/apps-application-id-users-user-id.html#apps-application-id-users-user-id-response-body-endpointsresponse-example  

| Param | Type | Description |
| --- | --- | --- |
| projectID | <code>String</code> | The pinpoint project or application id |
| userID | <code>String</code> | The User.UserID to retrieve |

<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..loadUser"></a>

###   Will also validate inputs and submit updates to REST API~loadUser()
Loads retrieved user data into preference center form

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..upsertEndpoints"></a>

###   Will also validate inputs and submit updates to REST API~upsertEndpoints()
Orchestrates the process to read form data, show spinners, and call REST API

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..upsertUser"></a>

###   Will also validate inputs and submit updates to REST API~upsertUser() ⇒ <code>Array</code>
Calls REST API to upsert a user

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
**Returns**: <code>Array</code> - Collection of updated user endpoints with generated userIDs and endpointIDs for new users.  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..readFormData"></a>

###   Will also validate inputs and submit updates to REST API~readFormData()
Reads form data and updates endpoints collection with user entered values

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showLoader"></a>

###   Will also validate inputs and submit updates to REST API~showLoader()
Shows initial full page loader

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..hideLoader"></a>

###   Will also validate inputs and submit updates to REST API~hideLoader()
Hides initial full page loader

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showProgress"></a>

###   Will also validate inputs and submit updates to REST API~showProgress()
Shows ajax spinner during endpoint updates

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..hideProgress"></a>

###   Will also validate inputs and submit updates to REST API~hideProgress()
Hides ajax spinner during endpoint updates

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showForm"></a>

###   Will also validate inputs and submit updates to REST API~showForm()
Shows the preference center form after generation

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..hideForm"></a>

###   Will also validate inputs and submit updates to REST API~hideForm()
Hides the preference center form

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showError"></a>

###   Will also validate inputs and submit updates to REST API~showError(msg)
Shows the Error growl notification

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message to display in the notification |

<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..showSuccess"></a>

###   Will also validate inputs and submit updates to REST API~showSuccess(msg)
Shows the Success growl notification

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message to display in the notification |

<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..getParameterByName"></a>

###   Will also validate inputs and submit updates to REST API~getParameterByName(name, url) ⇒ <code>String</code>
Parses querystring for values

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
**Returns**: <code>String</code> - The querystring value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The querystring value to retrieve |
| url | <code>String</code> | The url to search |

<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..registerEvents"></a>

###   Will also validate inputs and submit updates to REST API~registerEvents()
Register jquery events

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
<a name="Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API..registerHelpers"></a>

###   Will also validate inputs and submit updates to REST API~registerHelpers()
Registers Handlebars Helpers

**Kind**: inner method of [<code>  Will also validate inputs and submit updates to REST API</code>](#Client side JS code for Preference Center Solution.  Handles fetching metadata and user data.module_  Will also validate inputs and submit updates to REST API)  
