import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
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
// FIREBASE
// ==================================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// ==================================================
// WEBSITE ELEMENTS
// ==================================================

const productList =
    document.getElementById("product-list");

const searchInput =
    document.getElementById("searchInput");

const noProducts =
    document.getElementById("no-products");

const loading =
    document.getElementById("products-loading");

const categoryButtons =
    document.querySelectorAll(".category-btn");


// ==================================================
// WHATSAPP
// ==================================================

const WHATSAPP_NUMBER =
    "918673822563";


// ==================================================
// DATA
// ==================================================

let products = [];

let selectedCategory =
    "all";


// ==================================================
// PRODUCT DETAIL STATE
// ==================================================

let detailImages = [];

let detailImageIndex = 0;


// ==================================================
// CREATE DETAIL MODAL
// ==================================================

function createDetailModal() {

    if (
        document.getElementById(
            "productDetailModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement("div");

    modal.id =
        "productDetailModal";


    modal.innerHTML = `

        <div
            class="product-detail-overlay"
            id="productDetailOverlay"
        >

            <div
                class="product-detail-box"
            >

                <button
                    type="button"
                    class="detail-close"
                    id="detailClose"
                    aria-label="Close"
                >
                    ✕
                </button>


                <div
                    class="detail-gallery"
                >

                    <button
                        type="button"
                        class="gallery-arrow gallery-prev"
                        id="galleryPrev"
                    >
                        ‹
                    </button>


                    <img
                        id="detailMainImage"
                        src=""
                        alt="Product"
                    >


                    <button
                        type="button"
                        class="gallery-arrow gallery-next"
                        id="galleryNext"
                    >
                        ›
                    </button>

                </div>


                <div
                    class="gallery-counter"
                    id="galleryCounter"
                >
                </div>


                <div
                    class="detail-thumbnails"
                    id="detailThumbnails"
                >
                </div>


                <div
                    class="detail-content"
                >

                    <div
                        class="detail-badges"
                        id="detailBadges"
                    >
                    </div>


                    <h2
                        id="detailName"
                    >
                    </h2>


                    <div
                        class="detail-category"
                        id="detailCategory"
                    >
                    </div>


                    <div
                        class="detail-price"
                        id="detailPrice"
                    >
                    </div>


                    <div
                        class="detail-stock"
                        id="detailStock"
                    >
                    </div>


                    <div
                        class="detail-info"
                        id="detailInfo"
                    >
                    </div>


                    <div
                        class="detail-description"
                        id="detailDescription"
                    >
                    </div>


                    <div
                        class="detail-buttons"
                    >

                        <a
                            id="detailWhatsapp"
                            class="detail-whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            💬 Order on WhatsApp
                        </a>


                        <button
                            type="button"
                            id="detailShare"
                            class="detail-share"
                        >
                            📤 Share Product
                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(modal);


    addDetailStyles();


    document
        .getElementById(
            "detailClose"
        )
        .addEventListener(
            "click",
            closeProductDetails
        );


    document
        .getElementById(
            "productDetailOverlay"
        )
        .addEventListener(
            "click",
            function(event) {

                if (
                    event.target.id ===
                    "productDetailOverlay"
                ) {
                    closeProductDetails();
                }

            }
        );


    document
        .getElementById(
            "galleryPrev"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                showDetailImage(
                    detailImageIndex - 1
                );

            }
        );


    document
        .getElementById(
            "galleryNext"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                showDetailImage(
                    detailImageIndex + 1
                );

            }
        );


    document
        .getElementById(
            "detailShare"
        )
        .addEventListener(
            "click",
            shareProduct
        );


    document.addEventListener(
        "keydown",
        function(event) {

            const modal =
                document.getElementById(
                    "productDetailModal"
                );

            if (
                !modal ||
                !modal.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {
                closeProductDetails();
            }


            if (
                event.key === "ArrowLeft"
            ) {
                showDetailImage(
                    detailImageIndex - 1
                );
            }


            if (
                event.key === "ArrowRight"
            ) {
                showDetailImage(
                    detailImageIndex + 1
                );
            }

        }
    );

}


// ==================================================
// DETAIL CSS
// ==================================================

function addDetailStyles() {

    if (
        document.getElementById(
            "productDetailStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");

    style.id =
        "productDetailStyles";


    style.textContent = `

        .product-detail-overlay {

            position:fixed;
            inset:0;
            background:rgba(0,0,0,.72);
            z-index:99999;
            display:none;
            align-items:center;
            justify-content:center;
            padding:12px;
            overflow-y:auto;

        }


        .product-detail-overlay.open {

            display:flex;

        }


        .product-detail-box {

            width:100%;
            max-width:650px;
            max-height:95vh;
            overflow-y:auto;
            background:#fff;
            border-radius:20px;
            position:relative;
            box-shadow:0 10px 40px rgba(0,0,0,.3);

        }


        .detail-close {

            position:absolute;
            right:12px;
            top:12px;
            z-index:5;
            width:42px;
            height:42px;
            border-radius:50%;
            border:0;
            background:rgba(0,0,0,.65);
            color:#fff;
            font-size:20px;
            cursor:pointer;
            margin:0;
            padding:0;

        }


        .detail-gallery {

            width:100%;
            height:380px;
            background:#f5f5f5;
            display:flex;
            align-items:center;
            justify-content:center;
            position:relative;
            overflow:hidden;

        }


        .detail-gallery img {

            width:100%;
            height:100%;
            object-fit:contain;
            padding:12px;

        }


        .gallery-arrow {

            position:absolute;
            top:50%;
            transform:translateY(-50%);
            width:42px;
            height:42px;
            border-radius:50%;
            border:0;
            background:rgba(0,0,0,.55);
            color:#fff;
            font-size:34px;
            line-height:35px;
            padding:0;
            margin:0;
            z-index:2;

        }


        .gallery-prev {

            left:10px;

        }


        .gallery-next {

            right:10px;

        }


        .gallery-counter {

            text-align:center;
            font-size:12px;
            color:#777;
            padding:8px 0 2px;

        }


        .detail-thumbnails {

            display:flex;
            gap:8px;
            overflow-x:auto;
            padding:8px 15px;

        }


        .detail-thumb {

            width:65px;
            height:65px;
            min-width:65px;
            border-radius:9px;
            object-fit:cover;
            border:2px solid transparent;
            cursor:pointer;

        }


        .detail-thumb.active {

            border-color:#08a65c;

        }


        .detail-content {

            padding:18px;

        }


        .detail-badges {

            display:flex;
            gap:7px;
            flex-wrap:wrap;
            margin-bottom:8px;

        }


        .detail-badge {

            background:#e9f8f0;
            color:#08733f;
            padding:5px 9px;
            border-radius:20px;
            font-size:12px;
            font-weight:bold;

        }


        .detail-content h2 {

            margin:5px 0;
            font-size:25px;
            color:#064d35;

        }


        .detail-category {

            color:#777;
            font-size:14px;
            margin-bottom:10px;

        }


        .detail-price {

            font-size:25px;
            font-weight:700;
            color:#08a65c;
            margin:10px 0;

        }


        .detail-old-price {

            color:#888;
            font-size:15px;
            text-decoration:line-through;
            margin-left:8px;

        }


        .detail-stock {

            display:inline-block;
            padding:7px 10px;
            border-radius:20px;
            background:#d9f8e8;
            color:#08733f;
            font-size:13px;
            font-weight:bold;
            margin-bottom:15px;

        }


        .detail-stock.out {

            background:#ffe1e1;
            color:#a40000;

        }


        .detail-info {

            background:#f5f7f6;
            border-radius:12px;
            padding:12px;
            font-size:14px;
            line-height:1.7;
            margin-bottom:15px;

        }


        .detail-description {

            font-size:15px;
            line-height:1.7;
            color:#444;
            white-space:pre-line;
            margin-bottom:18px;

        }


        .detail-buttons {

            display:flex;
            flex-direction:column;
            gap:10px;

        }


        .detail-whatsapp,
        .detail-share {

            width:100%;
            border:0;
            border-radius:11px;
            padding:14px;
            text-align:center;
            text-decoration:none;
            font-size:16px;
            font-weight:bold;
            cursor:pointer;
            margin:0;

        }


        .detail-whatsapp {

            background:#08a65c;
            color:#fff;

        }


        .detail-share {

            background:#064d35;
            color:#fff;

        }


        @media(max-width:600px) {

            .detail-gallery {

                height:330px;

            }

            .product-detail-box {

                max-height:96vh;
                border-radius:16px;

            }

        }

    `;


    document.head.appendChild(style);

}


// ==================================================
// LOAD PRODUCTS
// ==================================================

async function loadProducts() {

    try {

        createDetailModal();


        if (loading) {

            loading.style.display =
                "block";

        }


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
            (doc) => {

                const data =
                    doc.data();


                products.push({

                    id:
                        doc.id,

                    ...data

                });

            }
        );


        if (loading) {

            loading.style.display =
                "none";

        }


        renderProducts();


    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        if (loading) {

            loading.style.display =
                "none";

        }


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
                        Please try again later.
                    </p>

                </div>

            `;

        }

    }

}


// ==================================================
// RENDER PRODUCTS
// ==================================================

function renderProducts() {

    if (!productList) {

        return;

    }


    const searchText =
        searchInput
            ?
            searchInput.value
                .trim()
                .toLowerCase()
            :
            "";


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


    productList.innerHTML =
        "";


    if (
        filteredProducts.length ===
        0
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


    card.style.cursor =
        "pointer";


    const name =
        product.name ||
        product.Name ||
        "Product";


    const price =
        Number(
            product.price ||
            0
        );


    const offerPrice =
        Number(
            product.offerPrice ||
            0
        );


    const category =
        product.category ||
        "Other";


    const image =
        product.image ||
        getProductImages(product)[0] ||
        "";


    const stock =
        product.stock === true;


    const stockQty =
        Number(
            product.stockQty ||
            0
        );


    const featured =
        product.featured === true;


    const isNew =
        product.isNew === true;


    const displayPrice =
        (
            offerPrice > 0 &&
            offerPrice < price
        )
        ?
        `

            <span>
                ₹${offerPrice}
            </span>

            <del>
                ₹${price}
            </del>

        `
        :
        `₹${price}`;


    card.innerHTML = `

        <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(name)}"
            loading="lazy"
            style="
                width:100%;
                height:220px;
                object-fit:contain;
                background:#f7f7f7;
                border-radius:12px;
            "
            onerror="
                this.style.display='none'
            "
        >


        <div class="card-content">

            <div
                style="
                    display:flex;
                    gap:6px;
                    flex-wrap:wrap;
                    margin-bottom:7px;
                "
            >

                ${
                    featured
                    ?
                    `
                    <span
                        style="
                            background:#fff3cd;
                            padding:4px 8px;
                            border-radius:15px;
                            font-size:11px;
                            font-weight:bold;
                        "
                    >
                        ⭐ Featured
                    </span>
                    `
                    :
           
