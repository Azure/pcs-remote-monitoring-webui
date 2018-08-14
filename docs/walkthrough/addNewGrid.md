Walkthrough: Adding a New Grid
==============================

The following is for creating a new grid called "**exampleGrid**."

Grids in remote monitoring are based on [ag-grid][ag-grid], with our own customization called [pcsGrid][pcsGrid]. Each grid in the application will be built using pcsGrid.

### Preconditions
1. You already have a folder for your page (our sample here is called `gridExample`) inside the `components/pages` folder.
    - See the [Add a New Page walkthrough](addNewPage.md) if you need a new page.
1. The grid will use data from a service already established within the application (and its associated [redux][redux] and [redux-observable][redux-obs] infrastructure is already set up).
    - See the [Add a New Service walkthrough](addNewService.md) if you need to call a new service. We'll use the example service set up in that walkthrough for our new grid example.


### Create the new grid
1. Create a folder named `exampleGrid` inside your page's folder.
1. Create 3 files in the new folder. See the individual example files for more details and comments inline.
    - [exampleGrid.js](/src/components/pages/_gridExample/exampleGrid/exampleGrid.js) - main component for the grid, sets up context buttons and soft/hard selection event handlers, wraps [pcsGrid][pcsGrid]
    - [exampleGridConfig.js](/src/components/pages/_gridExample/exampleGrid/exampleGridConfig.js) - configuration such as column definitions for the grid
    - [index.js](/src/components/pages/_gridExample/exampleGrid/index.js) - exports for the new grid

### Setup the page
1. Open your page's container file [gridExample.container.js](/src/components/pages/_gridExample/gridExample.container.js) so the data and actions can be connected to the page props.
1. Map the data from the redux store to props.
    ```js
    const mapStateToProps = state => ({
      data: getExamples(state),
      error: getExamplesError(state),
      isPending: getExamplesPendingStatus(state),
      lastUpdated: getExamplesLastUpdated(state)
    });
    ```
1. Map the redux and/or epic actions to props.
    ```js
    const mapDispatchToProps = dispatch => ({
      fetchData: () => dispatch(exampleEpics.actions.fetchExamples())
    });
    ```
1. Connect the data and actions to the page component.
    ```js
    export const GridExampleContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(GridExample));
    ```
    - Notice the use of [i18next][i18next]'s translate method. This will pass an additional prop called `t` containing the translated strings for use in the page.

1. Open your page's file [gridExample.js](/src/components/pages/_gridExample/gridExample.js) so the grid and refresh bar can be added.
1. Import your grid as well as other components like `AjaxError` and `RefreshBar`.
    ```js
    import { AjaxError, RefreshBar } from 'components/shared';
    import { ExampleGrid } from './exampleGrid';
    ```
    - `AjaxError` is optional, but adding it provides a simple and consistent way to display errors resulting from loading data.
    - `RefreshBar` is optional, but adding it now can be useful. It shows when the data was last updated, indicates if a fetch is in progress, and enables the user to click to refresh the data on the page.
1. Load the data when in `componentDidMount`.
    ```js
    componentDidMount() {
      const { isPending, lastUpdated, fetchData } = this.props;
      if (!lastUpdated && !isPending) fetchData();
    }
    ```
    - Alternatively, if the the data is useful on other pages as well, then it can be loaded in the "APP_INITIALIZE" epic in [appReducer.js](../store/reducers/appReducer.js)
1. In render, set up the props for the grid. Choose the columnDefs to show from those configured in [exampleGridConfig.js](/src/components/pages/_gridExample/exampleGrid/exampleGridConfig.js).
    ```js
    const { t, data, error, isPending, lastUpdated, fetchData } = this.props;
    const gridProps = {
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : data || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };
    ```
1. Add the your grid and `RefreshBar to the `PageContent` (or in another component such as a flyout).
    ```jsx
      <PageContent className="grid-example-container" key="page-content">
        <RefreshBar refresh={fetchData} time={lastUpdated} isPending={isPending} t={t} />
        {!!error && <AjaxError t={t} error={error} />}
        {!error && <ExampleGrid {...gridProps} />}
      </PageContent>
      ```
    - The refresh bar is hooked up to the props configured for the data, pending flag, etc.
    - When there is an error in this example, an error will be shown.
    - When there is no error, the grid with data will be shown.


#### Congratulations! Your page should now contain your new grid full of data.

## More Advanced Topics

### Hard Select Rows
The user may need to act on mulitple rows at the same time. Checking a row's checkbox will hard select that row.

1. Enable hard selection of rows by adding the `checkboxColumn` to the columnDefs prvided to the grid. `checkboxColumn` is provided as part of [pcsGrid][pcsGrid].
    ```js
    this.columnDefs = [
      checkboxColumn,
      exampleColumnDefs.id,
      exampleColumnDefs.description
    ];
    ```
1. Get a reference (`this.gridApi`) to the internal grid API so the selected items can be accessed.
    ```js
    onGridReady = gridReadyEvent => {
      this.gridApi = gridReadyEvent.api;
      // Call the onReady props if it exists
      if (isFunc(this.props.onGridReady)) {
        this.props.onGridReady(gridReadyEvent);
      }
    };
    ```
1. Provide context buttons to the page when a row in the grid is hard selected (checkbox is checked).
    ```jsx
    this.contextBtns = [
      <Btn key="context-btn-1" svg={svgs.reconfigure} onClick={this.doSomething()}>Button 1</Btn>,
      <Btn key="context-btn-2" svg={svgs.trash} onClick={this.doSomethingElse()}>Button 2</Btn>
    ];
    ```
    ```js
    onHardSelectChange = (selectedObjs) => {
      const { onContextMenuChange, onHardSelectChange } = this.props;
      // Show the context buttons when there are rows checked.
      if (isFunc(onContextMenuChange)) {
        onContextMenuChange(selectedObjs.length > 0 ? this.contextBtns : null);
      }
      //...
    }
    ```
1. When a context button is clicked, get the hard selected items to do your work on.
    ```js
    doSomething = () => {
      //Just for demo purposes. Don't console log in a real grid.
      console.log('hard selected rows', this.gridApi.getSelectedRows());
    };
    ```

### Soft Select Rows
The user may need to act on a single row. A soft select link can be configured for one or more columns in the columnDefs.

1. In [exampleGridConfig.js](/src/components/pages/_gridExample/exampleGrid/exampleGridConfig.js), add `SoftSelectLinkRenderer` as the cellRendererFramework for a columnDef.
    ```js
    export const exampleColumnDefs = {
      id: {
        headerName: 'examples.grid.name',
        field: 'id',
        sort: 'asc',
        cellRendererFramework: SoftSelectLinkRenderer
      }
    };
    ```
1. When a soft select link is clicked, the `onSoftSelectChange` event is triggered. Perform whatever action is desired for that row (often opening a "details" flyout, but we'll just console log in this demo).
    ```js
    onSoftSelectChange = (rowId, rowEvent) => {
      const { onSoftSelectChange } = this.props;
      const obj = (this.gridApi.getDisplayedRowAtIndex(rowId) || {}).data;
      if (obj) {
        //Just for demo purposes. Don't console log a real grid.
        console.log('Soft selected', obj);
        this.setState({ softSelectedObj: obj });
      }
      if (isFunc(onSoftSelectChange)) {
        onSoftSelectChange(obj, rowEvent);
      }
    }
    ```

### More Information

- Explore the other remote monitoring [walkthroughs](README.md).
- Technology reference:
    - [ag-grid][ag-grid]
    - [i18next][i18next]
    - [react][react]
    - [redux][redux]
    - [redux-observable][redux-obs]



[pcsGrid]: /src/components/shared/pcsGrid/pcsGrid.js

[ag-grid]: https://www.ag-grid.com/react-getting-started/
[i18next]: https://www.i18next.com/
[react]: https://reactjs.org/
[redux]: https://redux.js.org/
[redux-obs]: https://redux-observable.js.org
