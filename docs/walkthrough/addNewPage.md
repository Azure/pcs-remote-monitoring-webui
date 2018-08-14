Walkthrough: Adding a New Page
===========================

The following is for creating a new page called "**example**."

1. Create a folder named `example` inside the `components/pages` folder.
1. Create 4 files in the new folder. See the individual example files for more details and comments inline.
    - [example.container.js](/src/components/pages/_example/example.container.js) - maps redux and epic actions and selectors to the props for the page
    - [example.js](/src/components/pages/_example/example.js) - main component for the page
    - [example.scss](/src/components/pages/_example/example.scss) - styles for the page
    - [example.test.js](/src/components/pages/_example/example.test.js) - basic rendering test
1. Add the new page's container to the [components/pages/index.js](/src/components/pages/index.js) file.
    ```js
    export * from './example/example.container';
    ```
1. (Optional)  Add an SVG icon for the new page. See [utilities/README.md](../utilities/README.md) for more information.
    - Note that existing SVGs can be used as well.
1. Add the page name to the translations file, [translations.json](../../public/locales/en/translations.json). [i18next][i18next] is used for internationalization.
    ```json
    "tabs": {
      "template": "Template",
    },
    ```
1. Open the top level application page, [components/app/app.js](/src/components/app/app.js).
1. Add the new page to the imports.
    ```javascript
    // Page Components
    import  {
      //...
      TemplateContainer as TemplatePage
    } from 'components/pages';
    ```
1. Add a navigation tab, refernce the SVG icon added previously.
    ```js
    const templateTab = { to: '/template', svg: svgs.tabs.template, labelId: 'tabs.template' };
    ```
1. Add the new navigation tab to tabConfigs.
      ```js
      const tabConfigs = [ dashboardTab, devicesTab, rulesTab, maintenanceTab, templateTab ];
      ```
1. In the render method, add the route for the new page.
    ```jsx
    <Route path={templateTab.to} component={TemplatePage} />
    ```
1. **Congratulations!** Run the application to see your new page in action.
1. Now, you can edit the page to do what you want.

### More Information

- Explore the other remote monitoring [walkthroughs](README.md).
- Technology reference:
    - [react][react]
    - [i18next][i18next]



[ag-grid]: https://www.ag-grid.com/react-getting-started/
[i18next]: https://www.i18next.com/
[react]: https://reactjs.org/
[redux]: https://redux.js.org/
[redux-obs]: https://redux-observable.js.org
