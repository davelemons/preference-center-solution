<a name="module_Lambda Handler for the Preference Center REST API"></a>

## Lambda Handler for the Preference Center REST API
**Version**: 1.0.0  
**Author**: davelem  

* [Lambda Handler for the Preference Center REST API](#module_Lambda Handler for the Preference Center REST API)
    * _static_
        * [.handler(event, context, callback)](#module_Lambda Handler for the Preference Center REST API.handler)
    * _inner_
        * [~createPinpointEvent(preferenceCenterID, eventType, endpoint, attributes)](#module_Lambda Handler for the Preference Center REST API..createPinpointEvent) ⇒ <code>Object</code>
        * [~processEvents(projectId, events, endpoint, attributes)](#module_Lambda Handler for the Preference Center REST API..processEvents) ⇒ <code>Promise</code>
        * [~getMetadata(projectId, preferenceCenterID)](#module_Lambda Handler for the Preference Center REST API..getMetadata) ⇒ <code>Promise</code>
        * [~getUserEndpoints(projectId, userID)](#module_Lambda Handler for the Preference Center REST API..getUserEndpoints) ⇒ <code>Promise</code>
        * [~upsertEndpoints(projectId, endpoints)](#module_Lambda Handler for the Preference Center REST API..upsertEndpoints) ⇒ <code>Promise</code>
        * [~upsertEndpoint(projectId, [userID], endpoints)](#module_Lambda Handler for the Preference Center REST API..upsertEndpoint) ⇒ <code>Promise</code>

<a name="module_Lambda Handler for the Preference Center REST API.handler"></a>

### Lambda Handler for the Preference Center REST API.handler(event, context, callback)
Main Lambda Handler...Start Here.

**Kind**: static method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The Lambda event object |
| context | <code>Object</code> | The Lambda Context Object |
| callback | <code>Array.&lt;Object&gt;</code> | The lambda callback method to execute when the function completes |

<a name="module_Lambda Handler for the Preference Center REST API..createPinpointEvent"></a>

### Lambda Handler for the Preference Center REST API~createPinpointEvent(preferenceCenterID, eventType, endpoint, attributes) ⇒ <code>Object</code>
Formats a custom Pinpoint event

**Kind**: inner method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  
**Returns**: <code>Object</code> - Returns a pinpoint custom event object  

| Param | Type | Description |
| --- | --- | --- |
| preferenceCenterID | <code>String</code> | The preference center id |
| eventType | <code>String</code> | A pinpoint event type |
| endpoint | <code>Object</code> | The pinpoint project or application id |
| attributes | <code>Object</code> | Custom attributes to add to pinpoint event |

<a name="module_Lambda Handler for the Preference Center REST API..processEvents"></a>

### Lambda Handler for the Preference Center REST API~processEvents(projectId, events, endpoint, attributes) ⇒ <code>Promise</code>
Writes a batch of custom pinpoint events

**Kind**: inner method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>String</code> | The pinpoint application/project id to associate the events with |
| events | <code>Array</code> | Collection of custom events to add |
| endpoint | <code>Object</code> | The pinpoint project or application id |
| attributes | <code>Object</code> | Custom attributes to add to pinpoint event |

<a name="module_Lambda Handler for the Preference Center REST API..getMetadata"></a>

### Lambda Handler for the Preference Center REST API~getMetadata(projectId, preferenceCenterID) ⇒ <code>Promise</code>
Writes a batch of custom pinpoint events

**Kind**: inner method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  
**Returns**: <code>Promise</code> - A Promise object that contatins the metadata retrieved from DynamoDB  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>String</code> | The pinpoint application/project id to associate the events with |
| preferenceCenterID | <code>String</code> | The preference center id |

<a name="module_Lambda Handler for the Preference Center REST API..getUserEndpoints"></a>

### Lambda Handler for the Preference Center REST API~getUserEndpoints(projectId, userID) ⇒ <code>Promise</code>
Writes a batch of custom pinpoint events

**Kind**: inner method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  
**Returns**: <code>Promise</code> - A Promise object that contatins a collection of user endpoints  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>String</code> | The pinpoint application/project id to associate the events with |
| userID | <code>String</code> | The User.UserID to retrieve |

<a name="module_Lambda Handler for the Preference Center REST API..upsertEndpoints"></a>

### Lambda Handler for the Preference Center REST API~upsertEndpoints(projectId, endpoints) ⇒ <code>Promise</code>
Upserts a collection of endpoints synchronously to avoid hammering the API

**Kind**: inner method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  
**Returns**: <code>Promise</code> - A Promise object that returns the User.ID.  If it was a new user then this will contain the UUID that was generated  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>String</code> | The pinpoint application/project id to associate the events with |
| endpoints | <code>Array.&lt;Object&gt;</code> | The endpoints to upsert |

<a name="module_Lambda Handler for the Preference Center REST API..upsertEndpoint"></a>

### Lambda Handler for the Preference Center REST API~upsertEndpoint(projectId, [userID], endpoints) ⇒ <code>Promise</code>
Writes a batch of custom pinpoint events

**Kind**: inner method of [<code>Lambda Handler for the Preference Center REST API</code>](#module_Lambda Handler for the Preference Center REST API)  
**Returns**: <code>Promise</code> - A Promise object that contatins a collection of user endpoints  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| projectId | <code>String</code> |  | The pinpoint application/project id to associate the events with |
| [userID] | <code>String</code> | <code>UUID</code> | userID The User.UserID to retrieve will default to new UUID if not specified |
| endpoints | <code>Array.&lt;Object&gt;</code> |  | The endpoints to upsert |

