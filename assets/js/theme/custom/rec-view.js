import {
    recViewListProductsGQL,
    listMarkup
} from "./rec-view-utils";
import { createFocusTrap } from "focus-trap";

export default function recView(context) {
    console.log('IntuitSolutions.net -- Recently Viewed');

    if (localStorage.getItem('rec-view-on') === null) {
        localStorage.setItem('rec-view-on', true);
    }

    if (localStorage.getItem("rec-view-on") === 'true') {
        const GQLToken = context.GQLToken;
        const productId = context.productId;
        const recView = document.querySelector('.recView');

        const settings = {
            productsMin: 1, // Minimum number of products view before RV widget appears
            productsMax: 3, // Maximum number of products to show in RV widget
            allProductsMax: 50 // Maximum number of products to load in RV widget
        }

        // Removes empty strings and duplicates
        const cleanArr = arr => arr.filter(Boolean).filter((item, i) => arr.indexOf(item) === i);

        let sessionIds = localStorage.getItem('rec-view-products');
        let sessionIdsArr = [];

        if (sessionIds) {
            document.querySelector('.recView').style.display = 'flex';
            sessionIdsArr = sessionIds.split(',');
        }

        if (context.template === 'pages/product') {
            localStorage.setItem('rec-view-current-product', productId);

            let currentId = localStorage.getItem('rec-view-current-product', productId);

            if (sessionIds === '' || sessionIds === null) {
                localStorage.setItem('rec-view-products', productId);
            }

            sessionIdsArr.push(`${currentId}`);

            let filterSessionIds = cleanArr(sessionIdsArr);

            localStorage.setItem('rec-view-products', filterSessionIds);
        }

        const requestProducts = (limit) => {
            let strIdsToNum = sessionIdsArr.map(id => {
                return Number(id);
            });

            strIdsToNum = cleanArr(strIdsToNum);

            const removeIdFromList = (id) => {
                document.querySelectorAll(`.recView__list-item [data-rec-view-id="${id}"], .product [data-rec-view-id="${id}"]`).forEach(removeBtn => {
                    removeBtn.addEventListener('click', event => {
                        event.preventDefault();
                        let removalId = event.currentTarget.getAttribute('data-rec-view-id');
                        let recViewIdsStr = localStorage.getItem("rec-view-products");

                        // Check and remove id match
                        localStorage.setItem('rec-view-products', recViewIdsStr.replace(removalId, ''));
                        // Reset variable
                        recViewIdsStr = localStorage.getItem("rec-view-products");
                        // Remove any duplicate commas and trailing commas
                        localStorage.setItem('rec-view-products',
                            recViewIdsStr
                            .replace(',,', ',')
                            .replace(/^,/, '')
                            .replace(/(\s*,?\s*)*$/, ''));

                        let parentElement = event.currentTarget.parentElement.parentElement;

                        // Fade out, and remove element from the list
                        parentElement.classList.add('fade-out');
                        setTimeout(() => {
                            parentElement.remove();
                        }, 900);
                    });
                })
            }

            const gqlRequest = (limit) => { fetch('/graphql', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GQLToken}`
                    },
                    body: JSON.stringify({
                        query: recViewListProductsGQL(limit, strIdsToNum.reverse().slice(0, limit)),
                    }),
                })
                .then(res => res.json())
                .then(request => {
                    let requestProducts = request.data.site.products.edges;
                    const sortRequestProductArr = [];

                    strIdsToNum.forEach(num => {
                        requestProducts.forEach(product => {
                            if (product.node.entityId === num) {
                                sortRequestProductArr.push(product)
                            }
                        })
                    });

                    setTimeout(() => {
                        sortRequestProductArr.forEach(product => {
                            const requestProductSettings = {
                                id: product.node.entityId,
                                imgSrc: product.node.images.edges[0].node.url,
                                imgAlt: product.node.images.edges[0].node.altText,
                                title: product.node.name,
                                price: product.node.prices.price.value,
                                addToCart: product.node.addToCartUrl.replace(/^https?:\/\/[a-z\:0-9.]+/, ''),
                                quickView: product.node.path,
                                icon: 'rec-view-cart',
                                showCartAction: 'flex'
                            }

                            if (product.node.productOptions.edges.length) {
                                requestProductSettings.addToCart = product.node.path;
                                requestProductSettings.icon = 'rec-view-options';
                            }
                            
                            if (!product.node.showCartAction) {
                                requestProductSettings.showCartAction = 'none';    
                            }

                            const li = document.createElement('li');
                            li.classList.add('recView__list-item');
                            li.innerHTML = listMarkup(requestProductSettings);

                            document.querySelector('.recView__list').prepend(li);

                            removeIdFromList(requestProductSettings.id);
                        });

                        document.querySelector('.recView__list-container').classList.add('fade-in');
                        document.querySelector('.recView__lds-dual-ring-container').style.display = 'none';
                        const currentProductId = localStorage.getItem('rec-view-current-product');
                        

                        if (sessionIdsArr.length > settings.productsMax && document.querySelector('.recView--view-all') === null) {
                            document.querySelector('.recView__list-item--all').style.display = 'block';
                        }

                        if (context.template === 'pages/product' && document.querySelector(`.recView__current--${currentProductId}`) !== null) {
                            document.querySelector(`.recView__current--${currentProductId}`).style.display = "block";
                        }

                        const container = document.querySelector('.recView');

                        const focusTrap = createFocusTrap('.recView', {
                            onActivate: () => container.classList.add('is-active'),
                            onDeactivate: () => container.classList.remove('is-active'),
                          });
                          
                          document
                            .querySelector('.recView__toggle')
                            .addEventListener('click', focusTrap.activate);
                          document
                            .querySelector('.recView__toggle')
                            .addEventListener('click', focusTrap.deactivate);


                    }, 1500);
                })};

                gqlRequest(settings.productsMax);

                // View All Products
                document.querySelector('.recView__list-item--all .button').addEventListener('click', event => {
                    event.preventDefault();
                    // Empty list
                    document.querySelector('.recView__list').innerHTML = '';
                    document.querySelector('.recView').classList.add('recView--view-all');

                    // Loading ring
                    document.querySelector('.recView__lds-dual-ring-container').style.display = 'inline-block';

                    gqlRequest(settings.allProductsMax);
                });
        }

        if (sessionIdsArr.length) {
            // Toggle slide animation
            document.querySelector('.recView__toggle, .recView__overlay').addEventListener('click', event => {
                if (recView.classList.contains('recView-open')) {
                    recView.classList.remove('recView-open');
                    recView.classList.add('recView-closed');
                } else {
                    recView.classList.remove('recView-closed');
                    recView.classList.add('recView-open');
                }

                // Request products
                if (!recView.classList.contains('recView-loaded')) {
                    requestProducts();
                    recView.classList.add('recView-loaded');
                }
            });
        }
    }
}