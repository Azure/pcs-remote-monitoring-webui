SVG Components
=================================

There are two ways to handle SVG icons within the application.  Over time, we'll migrate away from styling via CSS (the old way) and toward the separate files for each theme (the new way).


## Separate Files for each theme (the new way)

When you need a new SVG icon for use in the application, UX will provide two files: one for each theme (dark and light).
1. Add the files to the `src/assets/icons` folder.
    - Add the copyright to the top of the file.
    - Update the indentation of the file to match coding standards.
    - Do NOT update other things in the file. Leave all the colors and opactities and other settings just as they are.
1. Add an import in the [src/utilities/themedPaths.js](/src/utilities/themedPaths.js) file for the new icons.
    ```js
    import IconDarkInfoBubble from 'assets/icons/IconDarkInfoBubble.svg';
    import IconDarkQuestionBubble from 'assets/icons/IconDarkQuestionBubble.svg';
    ```
1. So it can be easily referenced in the components, add an export in the [src/utilities/themedPaths.js](/src/utilities/themedPaths.js) file for the new icon, including the path for both the dark and light themes.
    ```js
    export const themedPaths = {
      //...
      infoBubble: { dark: IconDarkInfoBubble, light: IconLightInfoBubble },
      //...
    };
    ```
1. Use the icon in a component. See [svg.js](svg.js) for more info on supported props like onClick, className, svgClassName.
    ```js
    import { themedPaths } from 'utilities';
    import { ThemedSvgContainer } from 'components/shared';

    export class FooComponent extends Component {
      ///...
      render() {
        <ThemedSvgContainer paths={themedPaths.infoBubble} />
      };
    ```
1. There is usually no need for additional styling in the component's SCSS file.


## Styling via CSS (the old way)

When you need a new SVG icon for use in the application,
1. Add it to the `src/assets/icons` folder.
    - Add the copyright to the top of the file.
    - Update the indentation of the file to match coding standards.
    - Remove fill colors. These will be applied via CSS.
1. Add an import in the [src/utilities/svgs.js](/src/utilities/svgs.js) file for the new icon.
    ```js
    import FooIconPath from 'assets/icons/foo.svg';
    ```
1. So it can be easily referenced in the components, add an export in the [src/utilities/svgs.js](/src/utilities/svgs.js) file for the new icon.
    ```js
    export const svgs = {
      //...
      foo: FooIconPath,
      //...
    };
    ```
1. Use the icon in a component. See [svg.js](svg.js) for more info on supported props like onClick, className, svgClassName.
    ```js
    import { svgs } from 'utilities';
    import { Svg } from 'components/shared';

    export class FooComponent extends Component {
      ///...
      render() {
        <Svg path={svgs.fooIcon} className="foo-icon" />
      };
    ```
1. In the SCSS file for the component, style the icon as needed. Note that you may need to add colors to [src/styles/_themes.scss](/src/styles/_themes.scss).
    ```css
    .foo-icon svg {
      @include square-px-rem(16px);
      @include rem-fallback(padding, 0px, 8px);
    }

    @include themify($themes) {
      .foo-icon svg { fill: themed('colorContentText'); }
    }
    ```
