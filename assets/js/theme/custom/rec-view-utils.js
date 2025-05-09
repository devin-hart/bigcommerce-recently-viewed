const recViewListProductsGQL = (limit, ids) => {
    return `
    query {
        site {
            products(first: ${limit} entityIds: [${ids}]) {
                edges {
                    node {
                        entityId
                        name
                        path
                        addToCartUrl
                        showCartAction
                        prices {
                            price {
                                value
                            }
                        }
                        productOptions {
                            edges {
                                node {
                                    displayName
                                }
                            }
                        }
                        images(first: 1) {
                            edges {
                                node {
                                    altText
                                    url(width: 200)
                                }
                            }
                        }
                    }
                }
            }
        }
    }`
};

const listMarkup = (request) => {
    return `
    <div class="recView__remove-container">
        <a href="##" 
            class="recView__remove" 
            aria-label="remove" 
            aria-description="Remove ${request.title} from the Recently Viewed Products list"
            data-rec-view-id="${request.id}">
            <span class="icon icon--rec-view-remove">
                <svg><use xlink:href="#icon-rec-view-remove"></use></svg>
            </span>
        </a>
    </div>
      <figure class="recView__image-container">
          <img class="lazyload recView__image" src="${request.imgSrc}" alt="${request.imgAlt}">
          <h6 class="recView__current recView__current--${request.id}">Currently Viewing</h6>
      </figure>
      <div class="recView__text-container">
        <h5 class="recView__product-title">${request.title}</h5>
        <h6 class="recView__price">$${request.price}</h6>
      </div>
      <div class="recView__button-container">
        <a href="${request.addToCart}" 
            class="recView__button recView__button--atc" 
            aria-label="add" 
            aria-description="Add ${request.title} to the Cart"
            style="display: ${request.showCartAction};">
            <span class="icon icon--rec-view-cart">
                <svg><use xlink:href="#icon-${request.icon}"></use></svg>
            </span>
        </a>
        <a href="${request.quickView}" 
            class="recView__button recView__button--quickView" 
            aria-label="view" 
            aria-description="View ${request.title} product page">
            <span class="icon icon--rec-view-view">
                <svg><use xlink:href="#icon-rec-view-view"></use></svg>
            </span>
        </a>
      </div>
  `
}

export {
    recViewListProductsGQL,
    listMarkup
};

