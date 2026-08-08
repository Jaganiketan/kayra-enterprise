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
// FIREBASE
// ==================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==================================================
// WEBSITE ELEMENTS
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
// LOAD PRODUCTS
// ==================================================

async function loadProducts() {

    try {

        if (loading) {
            loading.style.display = "block";
        }

        const productsRef =
            collection(db, "products");

        const snapshot =
            await getDocs(productsRef);

        products = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            products.push({
                id: doc.id,
                ...data
            });

        });

        if (loading) {
            loading.style.display = "none";
        }

        renderProducts();

    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );

        if (loading) {
            loading.style.display = "none";
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

    const card =
        document.createElement("div");

    card.className = "card";


    // Firebase field: Name
    const name =
        product.name || "Product";


    // Firebase field: price
    const price =
        Number(product.price || 0);


    // Firebase field: category
    const category =
        product.category || "Other";


    // Firebase field: image
    const image =
        product.image ||
        "https://via.placeholder.com/500x500?text=Kayra+Enterprise";


    // Firebase field: stock
    const stock =
        product.stock === true;


    // WhatsApp message
    const message =
        `Hello Kayra Enterprise, I want to order ${name}. Price: ₹${price}. I will pickup from the shop.`;


    const whatsappLink =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    card.innerHTML = `

        <img
            src="${image}"
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
                ₹${price}
            </div>


            ${
                stock
                ?
                `

                    <span class="card-stock">
                        ✓ In Stock
                    </span>


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

                    <span class="card-stock out-of-stock">
                        Out of Stock
                    </span>


                    <div class="order-btn out-of-stock">
                        Currently Unavailable
                    </div>

                `
            }

        </div>

    `;


    return card;

}


// ==================================================
// SEARCH
// ==================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            renderProducts();

        }
    );

}


// ==================================================
// CATEGORY FILTER
// ==================================================

categoryButtons.forEach((button) => {

    button.addEventListener(
        "click",
        function () {

            categoryButtons.forEach(
                (btn) => {

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

});


// ==================================================
// HTML SECURITY
// ==================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==================================================
// START
// ==================================================

loadProducts();
