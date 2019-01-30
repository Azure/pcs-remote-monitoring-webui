Walkthrough: Adding a New Flyout
==============================

The following is for creating a new flyout called "**exampleFlyout**."

### Preconditions
1. You already have a folder for your page (our sample here is called `flyoutExample`) inside the `components/pages` folder.
    - See the [Add a New Page walkthrough](addNewPage.md) if you need a new page.


### Create the new flyout
1. Create a folder named `exampleFlyout` inside your page's `flyouts` folder.
1. Create 4 files in the new folder. See the individual example files for more details and comments inline.
    - [exampleFlyout.container.js](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.container.js) - maps redux and epic actions and selectors to the props for the flyout
    - [exampleFlyout.js](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.js) - main component for the flyout
    - [exampleFlyout.scss](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.scss) - styles for the flyout
    - [index.js](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/index.js) - exports for the new flyout

### Setup the flyout
1. Open your flyout's container file [exampleFlyout.container.js](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.container.js) so the data and actions can be connected to the page props.
    - To keep our example simple, no actions are mapped. But in a real world scenario, you would very likely need this. See the [Add a New Grid walkthrough](addNewGrid.md) for more information on mapping data and actions via a `container.js.`

1. Open your flyout's file [exampleFlyout.js](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.js). Use the various Flyout properties to ensure consistency with others. Then, add whatever properties are needed inside `Flyout`. Notice that the onClose property provides a way to close the flyout.
    ```jsx
    <Flyout header='My New Flyout' onClose={this.props.onClose}>
      {
        /**
         * Really, anything you need could go inside a flyout.
         */
      }
    </Flyout>
    ```

### Open the flyout from a page
1. Open your page's file [pageWithFlyout.js](/src/walkthrough/components/pages/pageWithFlyout/pageWithFlyout.js).
1. In the render method, add a context button to open the flyout.
    ```jsx
    <ContextMenu key="context-menu">
      <Btn svg={svgs.reconfigure} onClick={this.openFlyout('example')}>Open Flyout</Btn>
    </ContextMenu>
    ```
1. When the button is clicked, set the component state to indicate which flyout should be open. Also, go ahead and set up your `closeFlyout` handler.
    ```js
    openFlyout = (name) => () => this.setState({ openFlyoutName: name });

    closeFlyout = () => this.setState({ openFlyoutName: undefined });
    ```
1. In render, show the flyout if it is the one that should be open. Notice hooking up to the `closeFlyout` handler.
    ```jsx
    <PageContent className="flyout-example-container" key="page-content">
      {/** more page components go here */}
      { isExampleFlyoutOpen && <ExampleFlyoutContainer onClose={this.closeFlyout} /> }
    </PageContent>
    ```

#### Congratulations! You should be able to open your new flyout.



## More Advanced Topics

### Do some action and show progress
Often, a flyout will be used to call a service to create/update/delete something. See the [exampleFlyout.js](/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.js) file for an example of
- using `SummarySection` to indicate how many items will be affected
- showing an `Indicator` (progress spinner) while an action is in progress
- showing an `Svg` checkmark when the action is complete

There is also an example of calling a service within the example file.

Comments inline should help guide you.

### More Information

- Explore the other remote monitoring [walkthroughs](README.md).
- Technology reference:
    - [react][react]



[pcsGrid]: /src/components/shared/pcsGrid/pcsGrid.js

[ag-grid]: https://www.ag-grid.com/react-getting-started/
[i18next]: https://www.i18next.com/
[react]: https://reactjs.org/
[redux]: https://redux.js.org/
[redux-obs]: https://redux-observable.js.org
