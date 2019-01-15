Store
==========
The store folder contains all of the logic related to creating, updating
and accessing the [Redux](https://redux.js.org/) store. For handling async
actions in the store, we are using the [Redux-Observable](https://redux-observable.js.org/)
middleware making use of [RxJs](http://reactivex.io/rxjs/). You will notice
that there isn't a file or folder contain actions. The reason for this is
that, in an effort to avoid boilerplate, much of that functionality has
been wrapped in the store utilities (found `utilities.js`). These utilities
are discussed in the following sections.

Reducers and epics are tightly linked concepts. Because of this, we attempt
to define epics and reducers together as much as possible. Each grouping is
considered a scenario. A reducer scenario is all the logic for creating and
updating a reducer

Using store utilities
==========
## How to create a redux reducer
Creating reducers is handled using the `createReducerScenario` utility.

```
const reducerHandler = (state, action) => ({ ...state, property: action.payload });

export const redux = createReducerScenario({
  nameOfAction: { type: 'ACTION_TYPE_STRING', reducer: reducerHandler }
});

export const reducer = redux.getReducer();
```

To dispatch a reducer action, you use the object stored in the `redux` constant
to access the action creator.

```
dispatch(redux.actions.nameOfAction('payload'))
```

For reference, the `redux` constant declared above contains an object of the
following structure.

```
{
  actionTypes: {
    nameOfAction: 'ACTION_TYPE_STRING'
  },
  actions: {
    nameOfAction: actionCreator()
  },
  reducers: {
    nameOfAction: reducer()
  }
}
```

## How to create epics
Creating epics is handled using the `createEpicScenario` utility.

```
const handleError = error => Observable.of(redux.actions.registerError(error));

export const epics = createEpicScenario({
  fetchData: {
    type: 'DATA_FETCH',
    epic: () =>
      Service.ajaxFetch()
        .map(redux.actions.nameOfAction)
        .startWith(redux.actions.loadingState())
        .catch(handleError)
  }
});
```

To dispatch an epic action, you use the object stored in the `epics` constant
to access the action creator.

```
dispatch(epics.actions.fetchData())
```

For reference, the `epics` constant declared above contains an object of the
following structure.

```
{
  actionTypes: {
    fetchData: 'DATA_FETCH'
  },
  actions: {
    fetchData: actionCreator()
  },
  epics: {
    fetchData: epic()
  }
}
```

The above example could be rewritten accessing the raw epic as defined in the
redux-observable middleware as follows.

```
export const epics = createEpicScenario({
  fetchData: {
    type: 'DATA_FETCH',
    rawEpic: (action$, store, actionType) =>
      action$.ofType(actionType)
      .flatMap(_ =>
        Service.ajaxFetch()
          .map(redux.actions.nameOfAction)
          .startWith(redux.actions.loadingState())
          .catch(handleError)
      )
  }
});
```
