Walkthrough: Adding a New Panel to the Dashboard
================================================

The following is for creating a new panel called "**examplePanel**."

1. Create a folder named `examplePanel` inside the `components/pages/dashboard/panels` folder.
1. Create 3 files in the new folder. See the individual example files for more details and comments inline.
    - [examplePanel.js](/src/components/pages/dashboard/panels/_examplePanel/examplePanel.js) - main component for the panel
    - [examplePanel.scss](/src/components/pages/dashboard/panels/_examplePanel/examplePanel.scss) - styles for the new panel
    - [index.js](/src/components/pages/dashboard/panels/_examplePanel/index.js) - exports for the new panel
1. Add the new panel to the main panel export file: [dashboard/panels/index.js](/src/components/pages/dashboard/panels/index.js).
    ```js
    export * from './examplePanel';
    ```
1. Add the panel header to the translations file, [translations.json](../../public/locales/en/translations.json). [i18next][i18next] is used for internationalization.
    ```json
    "examplePanel": {
      "header": "Example Panel",
    },
    ```
1. In the [examplePanel.js](/src/components/pages/dashboard/panels/_examplePanel/examplePanel.js), import the `Panel` components.
    ```js
    import {
      Panel,
      PanelHeader,
      PanelHeaderLabel,
      PanelContent,
    } from 'components/pages/dashboard/panel';
    ```
1. In the render method, use the various `Panel` components to ensure consistency with others. Then, add whatever components are needed inside `PanelContent`.
    ```jsx
    <Panel>
      <PanelHeader>
        <PanelHeaderLabel>{t('examples.panel.header')}</PanelHeaderLabel>
      </PanelHeader>
      <PanelContent className="example-panel-container">
        {t('examples.panel.panelBody')}
      </PanelContent>
    </Panel>
    ```
1. Add your panel to the [dashboard.js](/src/components/pages/dashboard/dashboard.js) page. Size the `Cell` for the panel according to how much space it will need. See [grid.scss](/src/components/pages/dashboard/grid/grid.scss) for the available grid-cell styles.
    ```jsx
    <Cell className="col-4">
      <ExamplePanel t={t} />
    </Cell>
    ```
1. **Congratulations!** Run the application and navigate to the Dashboard page.  You should see your new panel in action.

1. Now, you can edit the panel to do what you want. Send props with any data you need. If mapping data and actions from a reducer, consider using the "container" approach described in the [Adding a New Grid](addNewGrid.md) walkthrough.

1. Optional customizations:
    1. Add an `Indicator` to the header to show pending state.
        ```jsx
        { isPending && <Indicator size="small" /> }
        ```
    1. Use a `PanelOverlay` to show pending state. This example uses an `Indicator`, but other components or messages could be placed here.
        ```jsx
        { isPending && <PanelOverlay><Indicator /></PanelOverlay> }
        ```
    1. Use `PanelError` and `AjaxError` to show error state.
        ```jsx
        { error && <PanelError><AjaxError t={t} error={error} /></PanelError> }
        ```

### More Information

- Explore the other remote monitoring [walkthroughs](README.md).
- Technology reference:
    - [react][react]
    - [i18next][i18next]



[i18next]: https://www.i18next.com/
[react]: https://reactjs.org/
