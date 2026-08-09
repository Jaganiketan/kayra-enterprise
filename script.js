function renderProducts() {

if (!productList) {
return;
}

const searchText =
searchInput
? searchInput.value
.trim()
.toLowerCase()
: "";

const filteredProducts =
products.filter((product) => {

// Firebase field is "Name"    
    const productName =    
        String(    
            product.name || ""    
        ).toLowerCase();    


    const category =    
        String(    
            product.category || "Other"    
        );    


    const matchesSearch =    
        productName.includes(    
            searchText    
        );    


    const matchesCategory =    
        selectedCategory === "all" ||    
        category === selectedCategory;    


    return (    
        matchesSearch &&    
        matchesCategory    
    );    

});

productList.innerHTML = "";

if (filteredProducts.length === 0) {

if (noProducts) {    
    noProducts.style.display = "block";    
}    

return;

}

if (noProducts) {
noProducts.style.display = "none";
}

filteredProducts.forEach((product) => {

const card =    
    createProductCard(product);    

productList.appendChild(card);

});

}

// ==================================================
// CREATE PRODUCT CARD
// ==================================================

function createProductCard(product) {

    const card = document.createElement("div");

    card.className = "card";


    const name =
        product.name ||
        product.Name ||
        "Product";


    const price =
        Number(product.price || 0);


    const offerPrice =
        Number(product.offerPrice || 0);


    const category =
        product.category ||
        "Other";


    const image =
        product.image ||
        "https://via.placeholder.com/500x500?text=Kayra+Enterprise";


    const stock =
        product.stock === true;


    const sku =
        product.sku ||
        "Not set";


    const description =
        product.description ||
        "No description available.";


    const quantity =
        Number(product.stockQty || 0);


    const featured =
        product.featured === true;


    const isNew =
        product.isNew === true;


    // Multiple images
    let images = [];

    if (Array.isArray(product.images)) {
        images = product.images.filter(Boolean);
    }

    // अगर images array नहीं है तो main image इस्तेमाल होगी
    if (images.length === 0 && image) {
        images.push(image);
    }


    // WhatsApp
    const finalPrice =
        offerPrice > 0 && offerPrice < price
            ? offerPrice
            : price;


    const message =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${finalPrice}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    card.innerHTML = `

        <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(name)}"
            loading="lazy"
            onerror="
                this.src='https://via.placeholder.com/500x500?text=Product'
            "
        >

        <div class="card-content">

            <h3>
                ${escapeHTML(name)}
            </h3>


            <div class="card-category">
                ${escapeHTML(category)}
            </div>


            <div class="card-price">

                ${
                    offerPrice > 0 &&
                    offerPrice < price

                    ?

                    `
                    ₹${offerPrice}

                    <span class="old-price">
                        ₹${price}
                    </span>
                    `

                    :

                    `₹${price}`
                }

            </div>


            ${
                stock

                ?

                `
                <span class="card-stock">
                    ✓ In Stock
                </span>
                `

                :

                `
                <span class="card-stock out-of-stock">
                    Out of Stock
                </span>
                `
            }


            ${
                featured
                ?
                `
                <span class="card-badge">
                    ⭐ Featured
                </span>
                `
                :
                ""
            }


            ${
                isNew
                ?
                `
                <span class="card-badge">
                    🆕 New
                </span>
                `
                :
                ""
            }


            <button
                type="button"
                class="details-btn"
            >
                👆 Tap for Full Details
            </button>


            ${
                stock

                ?

                `
                <a
                    href="${whatsappLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="order-btn"
                >
                    💬 Order on WhatsApp
                </a>
                `

                :

                `
                <div class="order-btn out-of-stock">
                    Currently Unavailable
                </div>
                `
            }

        </div>

    `;


    // Full details popup
    const detailsButton =
        card.querySelector(".details-btn");


    detailsButton.addEventListener(
        "click",
        () => {

            showProductDetails({

                ...product,

                name: name,
                price: price,
                offerPrice: offerPrice,
                category: category,
                image: image,
                images: images,
                stock: stock,
                sku: sku,
                description: description,
                stockQty: quantity,
                featured: featured,
                isNew: isNew

            });

        }
    );


    return card;
}
// ==================================================
// PRODUCT DETAILS POPUP
// ==================================================

function showProductDetails(product) {

    // पहले से popup है तो हटाओ
    const oldModal =
        document.getElementById(
            "productDetailsModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const name =
        product.name ||
        product.Name ||
        "Product";


    const price =
        Number(product.price || 0);


    const offerPrice =
        Number(product.offerPrice || 0);


    const category =
        product.category ||
        "Other";


    const stock =
        product.stock === true;


    const sku =
        product.sku ||
        "Not set";


    const description =
        product.description ||
        "No description available.";


    const quantity =
        Number(product.stockQty || 0);


    const featured =
        product.featured === true;


    const isNew =
        product.isNew === true;


    // Images
    let images = [];

    if (Array.isArray(product.images)) {

        images =
            product.images.filter(
                img => img
            );

    }


    if (
        images.length === 0 &&
        product.image
    ) {

        images.push(
            product.image
        );

    }


    if (images.length === 0) {

        images.push(
            "https://via.placeholder.com/600x600?text=Product"
        );

    }


    const firstImage =
        images[0];


    const finalPrice =
        offerPrice > 0 &&
        offerPrice < price

            ? offerPrice
            : price;


    const whatsappMessage =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${finalPrice}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;


    // ==================================================
    // MODAL
    // ==================================================

    const modal =
        document.createElement("div");


    modal.id =
        "productDetailsModal";


    modal.innerHTML = `

        <div class="product-modal-overlay">

            <div class="product-modal">


                <button
                    type="button"
                    class="modal-close"
                    aria-label="Close"
                >
                    ✕
                </button>


                <!-- MAIN IMAGE -->

                <div class="main-image-box">

                    <img
                        id="modalMainImage"
                        src="${escapeHTML(firstImage)}"
                        alt="${escapeHTML(name)}"
                    >

                </div>


                <!-- THUMBNAILS -->

                ${
                    images.length > 1

                    ?

                    `
                    <div class="gallery-thumbs">

                        ${
                            images.map(
                                (img, index) => `

                                <button
                                    type="button"
                                    class="gallery-thumb ${
                                        index === 0
                                            ? "active"
                                            : ""
                                    }"
                                    data-image="${escapeHTML(img)}"
                                >

                                    <img
                                        src="${escapeHTML(img)}"
                                        alt="Product image ${
                                            index + 1
                                        }"
                                    >

                                </button>

                            `
                            ).join("")
                        }

                    </div>
                    `

                    :

                    ""
                }


                <!-- CONTENT -->

                <div class="modal-content">


                    <h2>
                        ${escapeHTML(name)}
                    </h2>


                    <!-- BADGES -->

                    <div class="modal-badges">

                        <span class="modal-badge">
                            ${escapeHTML(category)}
                        </span>


                        ${
                            featured

                            ?

                            `
                            <span
                                class="modal-badge featured"
                            >
                                ⭐ Featured
                            </span>
                            `

                            :

                            ""
                        }


                        ${
                            isNew

                            ?

                            `
                            <span
                                class="modal-badge new"
                            >
                                🆕 New
                            </span>
                            `

                            :

                            ""
                        }

                    </div>


                    <!-- INFO -->

                    <div class="modal-info">

                        <p>
                            <strong>SKU:</strong>
                            ${escapeHTML(sku)}
                        </p>


                        <p>
                            <strong>Stock:</strong>

                            ${
                                stock
                                ?
                                "🟢 In Stock"
                                :
                                "🔴 Out of Stock"
                            }

                        </p>


                        <p>
                            <strong>Quantity:</strong>
                            ${quantity}
                        </p>

                    </div>


                    <!-- DESCRIPTION -->

                    <div class="description-box">

                        <h3>
                            Description
                        </h3>

                        <p>
                            ${escapeHTML(description)}
                        </p>

                    </div>


                    <!-- PRICE -->

                    <div class="modal-price">

                        <strong>
                            ₹${finalPrice}
                        </strong>


                        ${
                            offerPrice > 0 &&
                            offerPrice < price

                            ?

                            `
                            <span class="modal-old-price">
                                ₹${price}
                            </span>

                            <span class="offer-label">
                                OFFER
                            </span>
                            `

                            :

                            ""
                        }

                    </div>


                    <!-- WHATSAPP -->

                    ${
                        stock

                        ?

                        `
                        <a
                            href="${whatsappLink}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="modal-whatsapp"
                        >
                            💬 Order on WhatsApp
                        </a>
                        `

                        :

                        `
                        <div class="modal-unavailable">
                            📦 Currently Out of Stock
                        </div>
                        `
                    }


                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ==================================================
    // CLOSE
    // ==================================================

    const closeButton =
        modal.querySelector(
            ".modal-close"
        );


    closeButton.onclick =
        () => modal.remove();


    // बाहर overlay पर tap करने से बंद
    const overlay =
        modal.querySelector(
            ".product-modal-overlay"
        );


    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target === overlay
            ) {

                modal.remove();

            }

        }
    );


    // ==================================================
    // MULTIPLE IMAGE SWITCH
    // ==================================================

    const mainImage =
        modal.querySelector(
            "#modalMainImage"
        );


    const thumbnails =
        modal.querySelectorAll(
            ".gallery-thumb"
        );


    thumbnails.forEach(
        (thumb) => {

            thumb.addEventListener(
                "click",
                () => {

                    const newImage =
                        thumb.dataset.image;


                    mainImage.src =
                        newImage;


                    thumbnails.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    thumb.classList.add(
                        "active"
                    );

                }
            );

        }
    );


    // ==================================================
    // ESC KEY
    // ==================================================

    document.addEventListener(
        "keydown",
        function closeWithEscape(event) {

            if (
                event.key === "Escape"
            ) {

                modal.remove();

                document.removeEventListener(
                    "keydown",
                    closeWithEscape
                );

            }

        }
    );

        }
