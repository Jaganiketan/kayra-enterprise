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
    apiKey: "AIzaSyBe1Gi-atOr6ugqIIHNs5W_8x6DH0oCY9g",
    authDomain: "kayraenterprise-8a2ec.firebaseapp.com",
    projectId: "kayraenterprise-8a2ec",
    storageBucket: "kayraenterprise-8a2ec.firebasestorage.app",
    messagingSenderId: "541311529043",
    appId: "1:541311529043:web:d8e2300b7290e7caa356a6"
};


// ==================================================
// FIREBASE START
// ==================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==================================================
// ELEMENTS
// ==================================================

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const noProducts = document.getElementById("no-products");
const loading = document.getElementById("products-loading");

const categoryButtons =
    document.querySelectorAll(".category-btn");


// ==================================================
// WHATSAPP
// ==================================================

const WHATSAPP_NUMBER = "918673822563";


// ==================================================
// DATA
// ==================================================

let products = [];
let selectedCategory = "all";


// ==================================================
// SAFE HTML
// ==================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==================================================
// IMAGE URL
// ==================================================

function safeImage(url) {

    if (!url) return "";

    try {

        const parsed = new URL(url);

        if (
            parsed.protocol === "https:" ||
            parsed.protocol === "http:"
        ) {
            return url;
        }

    } catch (error) {}

    return "";

}


// ==================================================
// SHOW ERROR
// ==================================================

function showFirebaseError(error) {

    console.error("Firebase Error:", error);

    if (loading) {
        loading.style.display = "none";
    }

    if (noProducts) {
        noProducts.style.display = "none";
    }

    if (productList) {

        productList.innerHTML = `

            <div class="no-products"
                 style="
                 display:block;
                 padding:25px;
                 text-align:center;
                 background:#fff;
                 border-radius:15px;
                 ">

                <div
                    style="
                    font-size:40px;
                    margin-bottom:10px;
                    ">
                    ⚠️
                </div>

                <h3>
                    Products load नहीं हो पाए
                </h3>

                <p>
                    Internet connection check करें
                    और page refresh करें।
                </p>

                <small
                    style="
                    color:#777;
                    word-break:break-word;
                    ">
                    ${escapeHTML(error?.message || "Unknown error")}
                </small>

            </div>

        `;

    }

}


// ==================================================
// LOAD PRODUCTS
// ==================================================

async function loadProducts() {

    console.log("Loading products from Firebase...");

    if (loading) {
        loading.style.display = "block";
    }

    if (productList) {
        productList.innerHTML = "";
    }

    try {

        const productsRef =
            collection(db, "products");

        const snapshot =
            await getDocs(productsRef);

        console.log(
            "Firebase products:",
            snapshot.size
        );

        products = [];

        snapshot.forEach((item) => {

            products.push({
                id: item.id,
                ...item.data()
            });

        });

        if (loading) {
            loading.style.display = "none";
        }

        renderProducts();

    } catch (error) {

        showFirebaseError(error);

    }

}


// ==================================================
// RENDER PRODUCTS
// ==================================================

function renderProducts() {

    if (!productList) return;

    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const filteredProducts =
        products.filter((product) => {

            const name =
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


            const description =
                String(
                    product.description ||
                    ""
                ).toLowerCase();


            const sku =
                String(
                    product.sku ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                name.includes(searchText) ||
                description.includes(searchText) ||
                sku.includes(searchText);


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

        productList.appendChild(
            createProductCard(product)
        );

    });

}


// ==================================================
// GET PRODUCT IMAGES
// ==================================================

function getProductImages(product) {

    let images = [];

    if (
        Array.isArray(product.images)
    ) {

        images =
            product.images.filter(
                item => typeof item === "string" && item
            );

    }


    const mainImage =
        product.image || "";


    if (
        mainImage &&
        !images.includes(mainImage)
    ) {

        images.unshift(mainImage);

    }


    return images;

}


// ==================================================
// CREATE PRODUCT CARD
// ==================================================

function createProductCard(product) {

    const card =
        document.createElement("div");

    card.className = "card";

    card.style.cursor = "pointer";


    const name =
        product.name ||
        product.Name ||
        "Product";


    const category =
        product.category ||
        "Other";


    const price =
        Number(product.price || 0);


    const offerPrice =
        Number(product.offerPrice || 0);


    const stock =
        product.stock === true;


    const imageList =
        getProductImages(product);


    const image =
        imageList[0] || "";


    const whatsappPrice =
        offerPrice > 0 &&
        offerPrice < price
            ? offerPrice
            : price;


    const message =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${whatsappPrice}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    card.innerHTML = `

        ${
            image
            ?
            `
            <div
                style="
                width:100%;
                height:260px;
                background:#f5f5f5;
                border-radius:15px;
                overflow:hidden;
                display:flex;
                align-items:center;
                justify-content:center;
                ">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                    display:block;
                    "
                    onerror="
                    this.style.display='none';
                    "
                >

            </div>
            `
            :
            `
            <div
                style="
                height:200px;
                background:#f1f1f1;
                border-radius:15px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:50px;
                ">
                📦
            </div>
            `
        }


        <div class="card-content">

            <h3>
                ${escapeHTML(name)}
            </h3>


            <div class="card-category">
                ${escapeHTML(category)}
            </div>


            ${
                offerPrice > 0 &&
                offerPrice < price
                ?
                `
                <div class="card-price">

                    ₹${offerPrice}

                    <span
                        style="
                        color:#888;
                        text-decoration:line-through;
                        font-size:14px;
                        margin-left:7px;
                        ">
                        ₹${price}
                    </span>

                </div>
                `
                :
                `
                <div class="card-price">
                    ₹${price}
                </div>
                `
            }


            <div
                style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin:8px 0;
                ">

                ${
                    product.featured === true
                    ?
                    `
                    <span
                        style="
                        background:#fff3cd;
                        padding:5px 9px;
                        border-radius:20px;
                        font-size:12px;
                        font-weight:bold;
                        ">
                        ⭐ Featured
                    </span>
                    `
                    :
                    ""
                }


                ${
                    product.isNew === true
                    ?
                    `
                    <span
                        style="
                        background:#e8f1ff;
                        padding:5px 9px;
                        border-radius:20px;
                        font-size:12px;
                        font-weight:bold;
                        ">
                        🆕 New
                    </span>
                    `
                    :
                    ""
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
                <span
                    class="card-stock out-of-stock">
                    Out of Stock
                </span>
                `
            }


            <div
                style="
                margin-top:12px;
                color:#087f5b;
                font-weight:bold;
                text-align:center;
                ">
                👆 Tap for Full Details
            </div>


            ${
                stock
                ?
                `
                <a
                    href="${whatsappLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="order-btn"
                    onclick="event.stopPropagation()"
                >
                    💬 Order on WhatsApp
                </a>
                `
                :
                `
                <div
                    class="order-btn out-of-stock">
                    Currently Unavailable
                </div>
                `
            }

        </div>

    `;


    card.addEventListener(
        "click",
        function () {

            openProductDetails(product);

        }
    );


    return card;

}


// ==================================================
// FULL PRODUCT DETAILS
// ==================================================

function openProductDetails(product) {

    closeProductDetails();


    const name =
        product.name ||
        product.Name ||
        "Product";


    const category =
        product.category ||
        "Other";


    const price =
        Number(product.price || 0);


    const offerPrice =
        Number(product.offerPrice || 0);


    const stock =
        product.stock === true;


    const quantity =
        Number(product.stockQty || 0);


    const sku =
        product.sku ||
        "Not set";


    const description =
        product.description ||
        "No description available.";


    const images =
        getProductImages(product);


    const firstImage =
        images[0] || "";


    const orderPrice =
        offerPrice > 0 &&
        offerPrice < price
            ? offerPrice
            : price;


    const whatsappMessage =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${orderPrice}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;


    const modal =
        document.createElement("div");


    modal.id =
        "productDetailsModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.75);
        z-index:99999;
        overflow-y:auto;
        padding:20px;
    `;


    modal.innerHTML = `

        <div
            style="
            max-width:650px;
            margin:20px auto;
            background:white;
            border-radius:20px;
            overflow:hidden;
            position:relative;
            ">


            <button
                id="closeDetails"
                type="button"
                style="
                position:absolute;
                right:12px;
                top:12px;
                z-index:5;
                width:45px;
                height:45px;
                padding:0;
                margin:0;
                border-radius:50%;
                background:#222;
                color:white;
                font-size:25px;
                ">
                ×
            </button>


            <div
                id="detailMainImage"
                style="
                width:100%;
                height:380px;
                background:#f5f5f5;
                display:flex;
                align-items:center;
                justify-content:center;
                ">

                ${
                    firstImage
                    ?
                    `
                    <img
                        src="${escapeHTML(firstImage)}"
                        style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                        "
                        alt="${escapeHTML(name)}"
                    >
                    `
                    :
                    `
                    <div
                        style="
                        font-size:70px;
                        ">
                        📦
                    </div>
                    `
                }

            </div>


            ${
                images.length > 1
                ?
                `
                <div
                    style="
                    display:flex;
                    gap:8px;
                    padding:10px;
                    overflow-x:auto;
                    ">

                    ${
                        images.map(
                            (img,index) =>
                            `
                            <img
                                src="${escapeHTML(img)}"
                                data-image="${escapeHTML(img)}"
                                class="detail-thumb"
                                style="
                                width:70px;
                                height:70px;
                                object-fit:cover;
                                border-radius:10px;
                                border:2px solid #ddd;
                                flex-shrink:0;
                                "
                                alt="Photo ${index+1}"
                            >
                            `
                        ).join("")
                    }

                </div>
                `
                :
                ""
            }


            <div
                style="
                padding:20px;
                ">


                <h2
                    style="
                    margin-top:0;
                    color:#064d35;
                    ">
                    ${escapeHTML(name)}
                </h2>


                <div
                    style="
                    display:inline-block;
                    background:#eee;
                    padding:6px 12px;
                    border-radius:20px;
                    font-weight:bold;
                    ">
                    ${escapeHTML(category)}
                </div>


                ${
                    product.featured === true
                    ?
                    `
                    <span
                        style="
                        display:inline-block;
                        background:#fff3cd;
                        padding:6px 12px;
                        border-radius:20px;
                        margin-left:5px;
                        font-weight:bold;
                        ">
                        ⭐ Featured
                    </span>
                    `
                    :
                    ""
                }


                ${
                    product.isNew === true
                    ?
                    `
                    <span
                        style="
                        display:inline-block;
                        background:#e8f1ff;
                        padding:6px 12px;
                        border-radius:20px;
                        margin-left:5px;
                        font-weight:bold;
                        ">
                        🆕 New
                    </span>
                    `
                    :
                    ""
                }


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

                ${
                    description
                    ?
                    `
                    <div
                        style="
                        background:#f7f7f7;
                        padding:15px;
                        border-radius:12px;
                        margin:15px 0;
                        ">

                        <strong>Description</strong>

                        <p
                            style="
                            white-space:pre-wrap;
                            margin-bottom:0;
                            ">
                            ${escapeHTML(description)}
                        </p>

                    </div>
                    `
                    :
                    ""
                }

                <div
                    style="
                    margin:15px 0;
                    ">

                    ${
                        offerPrice > 0 &&
                        offerPrice < price

                        ?

                        `
                        <span
                            style="
                            font-size:28px;
                            font-weight:bold;
                            color:#08a65c;
                            ">
                            ₹${offerPrice}
                        </span>

                        <span
                            style="
                            margin-left:8px;
                            color:#888;
                            text-decoration:line-through;
                            font-size:18px;
                            ">
                            ₹${price}
                        </span>

                        <span
                            style="
                            margin-left:8px;
                            color:#d93025;
                            font-weight:bold;
                            ">
                            OFFER
                        </span>
                        `

                        :

                        `
                        <span
                            style="
                            font-size:28px;
                            font-weight:bold;
                            color:#08a65c;
                            ">
                            ₹${price}
                        </span>
                        `
                    }

                </div>

                ${
                    stock

                    ?

                    `
                    <a
                        href="${whatsappLink}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                        display:block;
                        text-align:center;
                        text-decoration:none;
                        background:#20d866;
                        color:white;
                        padding:15px;
                        border-radius:12px;
                        font-size:18px;
                        font-weight:bold;
                        ">
                        💬 Order on WhatsApp
                    </a>
                    `

                    :

                    `
                    <div
                        style="
                        text-align:center;
                        background:#ddd;
                        padding:15px;
                        border-radius:12px;
                        font-weight:bold;
                        ">
                        Currently Unavailable
                    </div>
                    `
                }

            </div>

        </div>

    `;

    document.body.appendChild(modal);

    document
        .getElementById("closeDetails")
        .onclick = closeProductDetails;

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {
                closeProductDetails();
            }

        }
    );

    const thumbnails =
        modal.querySelectorAll(
            ".detail-thumb"
        );

    const mainImage =
        modal.querySelector(
            "#detailMainImage img"
        );

    thumbnails.forEach(
        thumb => {

            thumb.addEventListener(
                "click",
                function() {

                    if (mainImage) {

                        mainImage.src =
                            thumb.dataset.image;

                    }

                }
            );

        }
    );

}


// ==================================================
// CLOSE PRODUCT DETAILS
// ==================================================

function closeProductDetails() {

    const modal =
        document.getElementById(
            "productDetailsModal"
        );

    if (modal) {
        modal.remove();
    }

}


// ==================================================
// SEARCH
// ==================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            renderProducts();

        }
    );

}


// ==================================================
// CATEGORY FILTER
// ==================================================

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                categoryButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );

                selectedCategory =
                    button.dataset.category ||
                    "all";

                renderProducts();

            }
        );

    }
);


// ==================================================
// START WEBSITE
// ==================================================

loadProducts();
