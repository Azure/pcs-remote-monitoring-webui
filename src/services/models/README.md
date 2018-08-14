Models
==========
The models folder contains mappings from service response objects and request
objects that act as interfaces between the UI and the backend.

### Server Response to Client Mappings
Many models models will assist in formatting the server side data to better meet the needs of the UI. This may mean
  1. updating to consistent camel casing
  1. flattening (or otherwise reshaping) the structure
  1. making calculations
  1. leaving out values that aren't needed

### Client to Server Request Mappings
Some models will then convert those UI based representations back to a format needed for the service HTTP request.

### General Naming Conventions
| Method Name               | Description |
|---------------------------|----------|
| to*Xyz*Model              | transforms a single data item from its server representation to its client model
| to*Xyz*sModel             | transforms multiple data items from server to client representation
| to*ActionXyz*RequestModel | transforms a payload to what the request to the server expects for the given action (delete, update, etc)
