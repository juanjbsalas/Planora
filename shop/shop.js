document.addEventListener("DOMContentLoaded", () =>{
    const buttons = document.querySelectorAll(" .product-card button");
    const popup = document.getElementById("cart-popup");
    let total = 0;

    buttons.forEach((button) =>{
        button.addEventListener("click", () =>{
            const originalText = "Add to Cart";

            button.textContent = "Item Added!"
            button.classList.add("button-added");

            //Revert after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove("button-added");
            }, 2000);

            //Get the product price and update total
            const priceText= button.closest(".product-card").querySelector(".product-price").textContent;
            const price = parseFloat(priceText.replace("$" , ""));
            total += price;

            //Show popup with updated total
            popup.textContent = `Total: $${total.toFixed(2)}`;
            popup.classList.add("show");

            //Auto-hide popup after 2 seconds
            setTimeout(() =>{
                popup.classList.remove("show");
            }, 8000);
        });
    });
});