Utilities
==========
The utilities folder contains helper/utility code. This code is not specific to
any specific view.

SVG Icons
==========

See [src/components/shared/svg/README.md](/src/components/shared/svg/README.md) for information on adding and using SVG icons.

Input Validation
==========
The [validation.js](validation.js) file contains logic for easily validating forms. It follows
the state linking pattern. The next few sections explain how to use the links.

## Linked components
The `LinkedComponent` is a React `Component` with a single helper method included:
`linkTo`. The `linkTo` method automatically attaches the component reference to
the returned `Link` instance. Note that this could be done manually, but having a
wrapper component makes things easier to write and read by automating some of the
boilerplate.

```js
import { LinkedComponent } from 'utilities';

class MyFormComponent extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }
  ...
}
```

## Creating a link to component state
A `Link` is an abstraction around a property in the component state intended to
be used with controlled inputs. A `Link` contains logic for rejecting, mapping,
validating a controlled inputs value. It effectively manages the two way binding
between the state and an input.

```js
class MyFormComponent extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };

    this.userNameLink = this.linkTo('username');
  }

  render() {
    return (
      <input value={this.userNameLink.value} onChange={this.userNameLink.onChange} />
    );
  }
}
```

Writing out the value and onChange for each input can be tedious so in the `FormControl`
allows passing the link directly.

```js
render() {
  return (
    <FormControl link={this.userNameLink} />
  );
}
```

## Rejecting inputs
Sometimes we don't want to update the component state if the user attempts to
enter an invalid value. Rejecting values is easy using links.

```js
// Rejects attempts to enter a username with more than 10 characters
this.userNameLink = this.linkTo('username')
  .reject(x => x.length > 10);
```

## Mapping input values
Sometimes the user input needs to be manipulated before being saved in the state.
We can do this by using mapping functions.

```js
// Checks the username for profanity and removes any matching substrings
this.userNameLink = this.linkTo('username')
  .map(x => removeProfanity(x));
```

## Validating inputs
We can validate an input state by passing a check function to the Link. Check
functions are called in the order they were provided to the Link. If any check
function fails, no functions added after that will be fired.

```js
this.userNameLink = this.linkTo('username')
  .check(x => x.length >= 10);
  .check(x => x.length <= 20);
// Validation will fail if the input is less than 10 characters long or greater than 20
```

We can also pass an error message to associate with this error

```js
this.userNameLink = this.linkTo('username')
  .check(x => x.length >= 10, 'The user name must be at least 10 chars long');
  .check(x => x.length <= 20, 'The user name must be no greater than 20 chars long');
```

If the input value is required in the error message, you can access it by passing a
function as the error parameter.

```js
this.userNameLink = this.linkTo('username')
  .check(x => x.length >= 10, (username) => `${username} is too short`);
  .check(x => x.length <= 20, (username) => `${username} is too long`);
```

## What about nested state?
You can chain into deeper state properties using the `to` method.

```js
this.state = {
  data: {
    profile: {
      username: ''
    }
  }
};

this.userNameLink = this.linkTo('data')
  .to('profile')
  .to('username');
}
```

Note that this will also work with arrays.

```js
this.state = {
  users: [
    { username: '' }
  ]
};

this.userNameLink = this.linkTo('users')
  .to(0)
  .to('username');
}
```
