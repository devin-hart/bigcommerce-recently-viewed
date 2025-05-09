# Recently Viewed

![Recently Viewed](rec-view.png)
![Recently Viewed Expanded](rec-view-expanded.png)

## What is Recently Viewed

The "Recently Viewed" addon allows guests on the site to keep track of the products they've looked at over the course of their visit.

## Installation

- Pull the included `assets` and `templates` folders into your theme.

### JavaScript
- Import our `rec-view.js` file into either `global.js` or `its-global.js`

    `global.js`
    ```javascript
    // IntuitSolutions.net -- Recently Viewed
    import recView from './custom/rec-view';
    ```

    `its-global.js`
    ```javascript
    // IntuitSolutions.net -- Recently Viewed
    import recView from './rec-view';
    ```

- Call our Recently Viewed code:

    `global.js`, paste the following at the bottom of the `onReady()` method:
    ```javascript
    // IntuitSolutions.net -- Recently Viewed
    recView(this.context);
    ```

    `its-global.js`, paste the following anywhere in our `default function`:
    ```javascript
    // IntuitSolutions.net -- Recently Viewed
    recView(context);
    ```

- Configure Rec View settings (optional):

    ```js
    const settings = {
        productsMin: 1, // Minimum number of products view before RV widget appears
        productsMax: 3, // Maximum number of products to show in RV widget
        allProductsMax: 50 // Maximum number of products to load in RV widget
    }
    ```

### Handlebars
- Call the component in `base.html` beneath the header component:

    ```handlebars
    {{> components/custom/rec-view }}
    ```

### SCSS
- Import the included `_its_rec-view.scss` stylesheet into `theme.scss`.

    ```scss
    @import 'custom/its_rec-view';
    ```

- Test the component by clicking through different product pages and make sure it's picking up products and the View All Products button works
