// ==================================================
// KAYRA ENTERPRISE - SCRIPT.JS
// PART 1
// FIREBASE + PRODUCT LOADING + SEARCH + CATEGORY
// ==================================================


// ==================================================
// FIREBASE IMPORTS
// ==================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==================================================
// FIREBASE CONFIG
// ==================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBe1Gi-atOr6ugqIIHNs5W_8x6DH0oCY9g",

    authDomain:
        "kayraenterprise-8a2ec.firebaseapp.com",

    projectId:
        "kayraenterprise-8a2ec",

    storageBucket:
        "kayraenterprise-8a2ec.firebasestorage.app",

    messagingSenderId:
        "541311529043",

    appId:
        "1:541311529043:web:d8e2300b7290e7caa356a6"

};


// ==================================================
// INITIALIZE FIREBASE
// ==================================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// ==================================================
// WEBSITE ELEMENTS
// ==================================================

const productList =
    document.getElementById(
        "product-list"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const noProducts =
    document.getElementById(
        "no-products"
    );

const loading =
    document.getElementById(
        "products-loading"
    );

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


// ==================================================
// WHATSAPP
// ==================================================

const WHATSAPP_NUMBER =
    "918673822563";

// ==================================================
// SAVE WHATSAPP ORDER TO FIREBASE
// ==================================================

async function saveWhatsAppOrder(product) {

    try {

        const orderData = {

            productId:
                product.id || "",

            productName:
                product.name || "Product",

            price:
                Number(product.price || 0),

            offerPrice:
                Number(product.offerPrice || 0),

            finalPrice:
                Number(product.finalPrice || 0),

            quantity:
                1,

            status:
                "pending",

            source:
                "WhatsApp",

            customerName:
                "WhatsApp Customer",

            pickup:
                true,

            createdAt:
                serverTimestamp()

        };


        const orderRef =
            await addDoc(
                collection(
                    db,
                    "orders"
                ),
                orderData
            );


        console.log(
            "Order saved:",
            orderRef.id
        );


        return orderRef.id;


    } catch (error) {

        console.error(
            "ORDER SAVE ERROR:",
            error
        );

        return null;

    }

}

// ==================================================
// PRODUCT DATA
// ==================================================

let products = [];

let selectedCategory =
    "all";


// ==================================================
// LOAD PRODUCTS FROM FIREBASE
// ==================================================

async function loadProducts() {

    console.log(
        "Loading products from Firebase..."
    );


    // Show loading

    if (loading) {

        loading.style.display =
            "block";

    }


    try {

        const productsRef =
            collection(
                db,
                "products"
            );


        const snapshot =
            await getDocs(
                productsRef
            );


        products = [];


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                products.push({

                    id:
                        docSnapshot.id,

                    ...data

                });

            }
        );


        console.log(
            "Products loaded:",
            products
        );


        // Hide loading

        if (loading) {

            loading.style.display =
                "none";

        }


        // Show products

        renderProducts();


    } catch (error) {

        console.error(
            "FIREBASE LOAD ERROR:",
            error
        );


        // Hide loading

        if (loading) {

            loading.style.display =
                "none";

        }


        // Show error

        if (productList) {

            productList.innerHTML = `

                <div class="no-products">

                    <div class="no-products-icon">
                        ⚠️
                    </div>

                    <h3>
                        Products could not be loaded
                    </h3>

                    <p>
                        Firebase से products load नहीं हो पाए।
                    </p>

                </div>

            `;

        }

    }

}


// ==================================================
// SEARCH
// ==================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderProducts();

        }
    );

}


// ==================================================
// CATEGORY FILTER
// ==================================================

categoryButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {


                // Remove active

                categoryButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                // Add active

                button.classList.add(
                    "active"
                );


                // Category

                selectedCategory =
                    button.dataset.category ||
                    "all";


                // Render

                renderProducts();

            }
        );

    }
);


// ==================================================
// HTML SECURITY
// ==================================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==================================================
// PART 1 END
// ==================================================
// ==================================================
// PART 2
// RENDER PRODUCTS + PRODUCT CARD + FULL DETAILS
// ==================================================


// ==================================================
// RENDER PRODUCTS
// ==================================================

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
        products.filter(
            (product) => {

                const productName =
                    String(
                        product.name ||
                        product.Name ||
                        ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category ||
                        "Other"
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

            }
        );


    productList.innerHTML = "";


    if (
        filteredProducts.length === 0
    ) {

        if (noProducts) {

            noProducts.style.display =
                "block";

        }

        return;

    }


    if (noProducts) {

        noProducts.style.display =
            "none";

    }


    filteredProducts.forEach(
        (product) => {

            const card =
                createProductCard(
                    product
                );


            productList.appendChild(
                card
            );

        }
    );

}


// ==================================================
// CREATE PRODUCT CARD
// ==================================================

function createProductCard(product) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card";


    const name =
        product.name ||
        product.Name ||
        "Product";


    const price =
        Number(
            product.price || 0
        );


    const offerPrice =
        Number(
            product.offerPrice || 0
        );


    const category =
        product.category ||
        "Other";


    const image =
        product.image ||
        (
            Array.isArray(product.images)
                ? product.images[0]
                : ""
        ) ||
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
        Number(
            product.stockQty || 0
        );


    const featured =
        product.featured === true;


    const isNew =
        product.isNew === true;


    // ==================================================
    // MULTIPLE IMAGES
    // ==================================================

    let images = [];


    if (
        Array.isArray(
            product.images
        )
    ) {

        images =
            product.images.filter(
                (img) =>
                    typeof img === "string" &&
                    img.trim() !== ""
            );

    }


    if (
        images.length === 0 &&
        image
    ) {

        images.push(
            image
        );

    }


    // ==================================================
    // FINAL PRICE
    // ==================================================

    const finalPrice =
        offerPrice > 0 &&
        offerPrice < price

            ? offerPrice

            : price;


    // ==================================================
    // WHATSAPP
    // ==================================================

    const message =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${finalPrice}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    // ==================================================
    // CARD HTML
    // ==================================================

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

// ==================================================
// WHATSAPP ORDER CLICK
// ==================================================

const orderButton =
    card.querySelector(
        ".order-btn"
    );


if (
    orderButton &&
    stock
) {

    orderButton.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const orderProduct = {

                id:
                    product.id || "",

                name:
                    name,

                price:
                    price,

                offerPrice:
                    offerPrice,

                finalPrice:
                    finalPrice

            };


            // Open WhatsApp immediately
            window.open(
                whatsappLink,
                "_blank"
            );


            // Save order in Firebase
            await saveWhatsAppOrder(
                orderProduct
            );

        }
    );

}
    
    // ==================================================
    // DETAILS BUTTON
    // ==================================================

    const detailsButton =
        card.querySelector(
            ".details-btn"
        );


    if (detailsButton) {

        detailsButton.addEventListener(
            "click",
            () => {

                showProductDetails({

                    ...product,

                    name:
                        name,

                    price:
                        price,

                    offerPrice:
                        offerPrice,

                    category:
                        category,

                    image:
                        image,

                    images:
                        images,

                    stock:
                        stock,

                    sku:
                        sku,

                    description:
                        description,

                    stockQty:
                        quantity,

                    featured:
                        featured,

                    isNew:
                        isNew

                });

            }
        );

    }


    return card;

}


// ==================================================
// PRODUCT DETAILS POPUP
// ==================================================

function showProductDetails(product) {

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
        Number(
            product.price || 0
        );


    const offerPrice =
        Number(
            product.offerPrice || 0
        );


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
        Number(
            product.stockQty || 0
        );


    const featured =
        product.featured === true;


    const isNew =
        product.isNew === true;


    // ==================================================
    // IMAGES
    // ==================================================

    let images = [];


    if (
        Array.isArray(
            product.images
        )
    ) {

        images =
            product.images.filter(
                (img) =>
                    typeof img === "string" &&
                    img.trim() !== ""
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


    if (
        images.length === 0
    ) {

        images.push(
            "https://via.placeholder.com/600x600?text=Product"
        );

    }


    const firstImage =
        images[0];


    // ==================================================
    // PRICE
    // ==================================================

    const finalPrice =
        offerPrice > 0 &&
        offerPrice < price

            ? offerPrice

            : price;


    // ==================================================
    // WHATSAPP
    // ==================================================

    const whatsappMessage =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${finalPrice}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;


    // ==================================================
    // CREATE MODAL
    // ==================================================

    const modal =
        document.createElement(
            "div"
        );


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
                                (
                                    img,
                                    index
                                ) => `

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
                                            alt="Product image ${index + 1}"
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
                            <span class="modal-badge featured">
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
                            <span class="modal-badge new">
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

                            <strong>
                                SKU:
                            </strong>

                            ${escapeHTML(sku)}

                        </p>


                        <p>

                            <strong>
                                Stock:
                            </strong>

                            ${
                                stock
                                ?
                                "🟢 In Stock"
                                :
                                "🔴 Out of Stock"
                            }

                        </p>


                        <p>

                            <strong>
                                Quantity:
                            </strong>

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
    // CLOSE BUTTON
    // ==================================================

    const closeButton =
        modal.querySelector(
            ".modal-close"
        );


    if (closeButton) {

        closeButton.onclick =
            () => {

                modal.remove();

            };

    }


    // ==================================================
    // OVERLAY CLOSE
    // ==================================================

    const overlay =
        modal.querySelector(
            ".product-modal-overlay"
        );


    if (overlay) {

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

    }


    // ==================================================
    // IMAGE SWITCH
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


                    if (mainImage) {

                        mainImage.src =
                            newImage;

                    }


                    thumbnails.forEach(
                        (item) => {

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

    const closeWithEscape =
        (event) => {

            if (
                event.key === "Escape"
            ) {

                modal.remove();

                document.removeEventListener(
                    "keydown",
                    closeWithEscape
                );

            }

        };


    document.addEventListener(
        "keydown",
        closeWithEscape
    );

            }
// ==================================================
// PART 3
// START WEBSITE
// ==================================================


// ==================================================
// START FIREBASE PRODUCT LOADING
// ==================================================

loadProducts();


// ==================================================
// SAFETY ERROR HANDLER
// ==================================================

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "Website Error:",
            event.error || event.message
        );

    }
);


// ==================================================
// FIREBASE PROMISE ERROR HANDLER
// ==================================================

window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.error(
            "Firebase/Promise Error:",
            event.reason
        );

    }
);


// ==================================================
// END SCRIPT.JS
// ==================================================
