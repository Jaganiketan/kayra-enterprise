document.addEventListener("DOMContentLoaded", () => {

    console.log("Kayra Enterprise Website Loaded");

    const searchInput = document.querySelector(".search input");
    const cards = document.querySelectorAll(".card");

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        cards.forEach(card => {

            const product = card.querySelector("h3").textContent.toLowerCase();

            if(product.includes(value)){
                card.style.display = "block";
            }else{
                card.style.display = "none";
            }

        });

    });

});
