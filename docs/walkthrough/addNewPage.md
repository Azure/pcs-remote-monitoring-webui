Walkthrough: Adding a New Page
===========================

The following is for creating a new page called "**basicPage**."

1. Create a folder named `example` inside the `components/pages` folder.
1. Create 4 files in the new folder. See the individual example files for more details and comments inline.
    - [basicPage.container.js](/src/walkthrough/components/pages/basicPage/basicPage.container.js) - maps redux and epic actions and selectors to the props for the page
    - [basicPage.js](/src/walkthrough/components/pages/basicPage/basicPage.js) - main component for the page
    - [basicPage.scss](/src/walkthrough/components/pages/basicPage/basicPage.scss) - styles for the page
    - [basicPage.test.js](/src/walkthrough/components/pages/basicPage/basicPage.test.js) - basic rendering test
1. Add the new page's container to the [components/pages/index.js](/src/walkthrough/components/pages/index.js) file.
    ```js
    export * from './basicPage/basicPage.container';
    ```
1. (Optional)  Add an SVG icon for the new page. See [utilities/README.md](/src/utilities/README.md) for more information.
    - Note that existing SVGs can be used as well.
1. Add the page name to the translations file, [translations.json](../../public/locales/en/translations.json). [i18next][i18next] is used for internationalization.
    ```json
    "tabs": {
      "template": "Example",
    },
    ```
1. Open the top level application page. For the walkthrough sample code:  [walkthrough/components/app.js](/src/walkthrough/components/app.js). For the normal applicaiton: [components/app.js](/src/components/app.js)
1. Add the new page to the imports.
    ```javascript
    // Page Components
    import  {
      //...
      BasicPageContainer
    } from 'components/pages';
    ```
1. Add the new page to the `pagesConfig`. Set the to address for the route, reference the SVG icon and translations added previously, and set the component to the page's container.
    ```js
    const pagesConfig = [
      //...
      {
        to: '/basicpage',
        exact: true,
        svg: svgs.tabs.example,
        labelId: 'walkthrough.tabs.basicPage',
        component: BasicPageContainer
      },
      //...
    ];
    ```
1. Add any new breadcrumbs to the `crumbsConfig`.
      ```js
      const crumbsConfig = [
        //...
        {
          path: '/basicpage', crumbs: [
            { to: '/basicpage', labelId: 'walkthrough.tabs.basicPage' }
          ]
        },
        //...
      ];
      ```
      - This example page only has one breadcrumb to be shown, but some pages will have more. See [components/app.js](/src/components/app.js) for more examples.
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
