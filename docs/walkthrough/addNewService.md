Walkthrough: Adding a New Service
==============================

The following is for creating a new grid called "**serviceExample**."

Services in remote monitoring are called using [rxjs][rxjs] Observables.

### Create the Service

1. Create [exampleModels.js](/src/services/models/_exampleModels.js) for the service under the `services/models` folder.
    - See the models [README](/src/services/models/README.md) for more information on the purpose of these models and general naming conventions.
    - Don't forget to add your new file to the exports in [index.js](/src/services/models/index.js)
1. Create [exampleService.js](/src/services/_exampleService.js) in the `services` folder.
    - Use [services/httpClient.js](/src/services/httpClient.js) to make calls to the services. Then, transform the response using the models.
    - Note that the example service does not call actual services. Instead, it returns hardcoded data as an observable to mimick service calls.
    - Don't forget to add your new file to the exports in [index.js](/src/services/index.js)

### Set up the Service in the store
1. Create [exampleReducer.js](/src/store/reducers/_exampleReducer.js) in the `store/reducers/` folder.
1. Add [redux-observable][redux-obs] epics to make service calls.
    ```js
    export const epics = createEpicScenario({
      /** Loads the example items */
      fetchExamples: {
        type: 'EXAMPLES_FETCH',
        epic: fromAction =>
          ExampleService.getExampleItems()
            .map(toActionCreator(redux.actions.updateExamples, fromAction))
            .catch(handleError(fromAction))
      }
    });
    ```
    - Notice that the redux action to update state is queued once the data is received. See `.map(toActionCreator(redux.actions...., fromAction))`
    - Notice that exceptions are handled by a helper action. This will register an error as specific to the epic action that triggered it. This means reducer file can track and make available error messages from mutliple service calls. Later, a selector `getExamplesError` will be set up to retrieve the error for `fetchExamples`.
1. For epics that fetch data (i.e. get requests, not post/put/delete), add them to the `fetchableTypes`.
    ```js
    const fetchableTypes = [
      epics.actionTypes.fetchExamples
    ];
    ```
    -  Doing this automatically enrolls the epic in helpers to enable tracking when calls are in progress (pending) or complete. Later, a selector `getExamplesPendingStatus` will be set up to retrieve the pending status for `fetchExamples`.
1. Add the schemas for [normalizr][normalizr]. Normalization enables us to easily access an an item by its ID without having to walk the array of items.
    ```js
    const itemSchema = new schema.Entity('examples');
    const itemListSchema = new schema.Array(itemSchema);
    ```
1. Create a reducer to up to update the application state. Note the use of [immutability-helper][immut-helper]'s update method to mutate the state.
    ```js
    const updateExamplesReducer = (state, { payload, fromAction }) => {
      const { entities: { examples }, result } = normalize(payload, itemListSchema);
      return update(state, {
        entities: { $set: examples },
        items: { $set: result },
        lastUpdated: { $set: moment() },
        ...setPending(fromAction.type, false)
      });
    };
    ```
    - Notice the use of [moment][moment] to set the when this data was last updated in the UI.
1. Include the reducer in the redux actions.
    ```js
    export const redux = createReducerScenario({
      updateExamples: { type: 'EXAMPLES_UPDATE', reducer: updateExamplesReducer },
      registerError: { type: 'EXAMPLE_REDUCER_ERROR', reducer: errorReducer },
      isFetching: { multiType: fetchableTypes, reducer: pendingReducer }
    });
    ```
1. Export the main reducer.
    ```js
    export const reducer = { examples: redux.getReducer(initialState) };
    ```
1. Export selectors for the data.
    ```js
    export const getEntities = state => getExamplesReducer(state).entities || {};
    export const getItems = state => getExamplesReducer(state).items || [];
    export const getExamplesLastUpdated = state => getExamplesReducer(state).lastUpdated;
    export const getExamplesError = state => getError(getExamplesReducer(state), epics.actionTypes.fetchExamples);
    export const getExamplesPendingStatus = state => getPending(getExamplesReducer(state), epics.actionTypes.fetchExamples);
    ```

## Configure the Middleware

1. Add the reducer to the [rootReducer.js](/src/store/rootReducer.js) in the `store` folder.
    ```js
    import { reducer as exampleReducer } from './reducers/_exampleReducer';

    const rootReducer = combineReducers({
      ...exampleReducer,
    //...
    });
    ```

1. Add the epics to [rootEpic.js](/src/store/rootEpic.js) in the `store` folder.
    ```js
    import { epics as exampleEpics } from './reducers/_exampleReducer';

    const epics = [
      ...exampleEpics.getEpics(),
      //...
    ];

    const rootEpic = combineEpics(...epics);
```


#### Congratulations! Your service is ready to be hooked up to user interface components.



### More Information

- Explore the other remote monitoring [walkthroughs](README.md).
- Technology reference:
    - [ag-grid][ag-grid]
    - [immutability-helper][immut-helper]
    - [moment][moment]
    - [normalizr][normalizr]
    - [redux][redux]
    - [redux-observable][redux-obs]
    - [rxjs][rxjs]



[ag-grid]: https://www.ag-grid.com/react-getting-started/
[immut-helper]: https://github.com/kolodny/immutability-helper
[moment]: https://momentjs.com/
[normalizr]: https://github.com/paularmstrong/normalizr
[redux]: https://redux.js.org/
[redux-obs]: https://redux-observable.js.org
[rxjs]: https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
