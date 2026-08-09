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
Hello Kayra Enterprise, I want to order ${name}. Price: ₹${price}. I will pickup from the shop.;

const whatsappLink =
https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)};
