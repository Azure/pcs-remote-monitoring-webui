Protected Components
=================================

These components are intended to enforce user permissions in the UI layer.

The individual permissions are defined with the [models for the auth microservice](../../../services/models/authModels.js).


## Using the Protected component

React components allow you to pass functions as children instead of pure JSX. So the Protected component can have two use cases
enabling it to be simple, declarative, highly customizable, and hide the permission logic from the rest of the app.

### Use case 1: 

Pass pure JSX as the children will either render or not render the children based on the permission status.

	<Protected permissions={permissions.deleteDevices}>
	  <Btn>Protected Button</Btn>
	</Protected>
 
### Use case 2: 

Pass a function as the children. In this case, the Protected component will pass a boolean indicating if the user has the required permission or not.

	<Protected permissions={permissions.deleteDevices}>
	  {
	    (hasPermission) => hasPermission 
	      ? <FormControl link={this.userEmails}> 
	      : <span>You don't have permission to edit user emails :(</span>
	  }
	</Protected>

Additionally, a parameter containing the permission will also be passed. See below for an example of its use with the ProtectedError component.

## Using the optional ProtectedError component

If you'd like to show a default message instead of simply hiding the children, use case 2 above along with the ProtectedError component can assist.

	<Protected permissions={permissions.deleteDevices}>
	  {
	    (hasPermission, permission) => hasPermission 
	      ? <FormControl link={this.userEmails}> 
	      : <ProtectedError t={t} permission={permission} /> 
	  }
	</Protected>
