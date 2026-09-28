// ========== MENU ICON ==========
const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");

if (menuIcon && mobileMenu) {
    menuIcon.addEventListener("click", function () {
        mobileMenu.classList.toggle("show");
    });
}


// ========== GET CART ==========
function getCart() {
    return JSON.parse(localStorage.getItem("toyHavenCart") || "[]");
}


// ========== UPDATE CART COUNT ==========
function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((sum, item) => {
        return sum + (item.qty || 1);
    }, 0);

    document.querySelectorAll("#cartCount").forEach(el => {
        el.textContent = count;
    });
}


// ========== DISPLAY ORDER ==========
function renderOrder() {

    const cart = getCart();
    const orderItemsEl = document.getElementById("orderItems");

    if (cart.length === 0) {

        orderItemsEl.innerHTML = "<p>Your cart is empty.</p>";

        document.getElementById("subtotal").textContent = "LKR 0";
        document.getElementById("discount").textContent = "LKR 0";
        document.getElementById("delivery").textContent = "LKR 0";
        document.getElementById("total").textContent = "LKR 0";

        return;
    }


    // Display products
    orderItemsEl.innerHTML = cart.map(item => `
        <div class="order-item">

            <div class="name">
                ${item.name}
            </div>

            <div class="price">
                LKR ${Number(item.price).toLocaleString()}
                &nbsp; Quantity: ${item.qty}
            </div>

        </div>
    `).join("");


    // Calculate totals
    const subtotal = cart.reduce(
        (sum, item) => sum + (Number(item.price) * item.qty),
        0
    );

    const itemsCount = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    const discount = itemsCount >= 2 ? 50 : 0;

    const delivery = 200;

    const total = subtotal + delivery - discount;


    // Display totals
    document.getElementById("subtotal").textContent =
        "LKR " + subtotal.toLocaleString();

    document.getElementById("discount").textContent =
        "LKR " + discount.toLocaleString();

    document.getElementById("delivery").textContent =
        "LKR " + delivery.toLocaleString();

    document.getElementById("total").textContent =
        "LKR " + total.toLocaleString();
}


// ========== PAYMENT METHOD ==========
document.querySelectorAll('input[name="payment"]').forEach(radio => {

    radio.addEventListener("change", function () {

        const cardDetails = document.getElementById("cardDetails");

        if (this.value === "card") {
            cardDetails.style.display = "block";
        } else {
            cardDetails.style.display = "none";
        }

    });

});


// ========== PLACE ORDER ==========
document.getElementById("placeOrderBtn").addEventListener("click", function () {

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    const payment =
        document.querySelector('input[name="payment"]:checked')?.value;


    // Check customer details
    if (!name || !email || !address) {
        alert("Please fill in all required fields.");
        return;
    }


    // Check payment method
    if (!payment) {
        alert("Please select a payment method.");
        return;
    }


    // Get cart
    const cart = getCart();


    // Check cart
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }


    // Calculate totals
    const subtotal = cart.reduce(
        (sum, item) => sum + (Number(item.price) * item.qty),
        0
    );

    const itemsCount = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    const discount = itemsCount >= 2 ? 50 : 0;

    const delivery = 200;

    const total = subtotal + delivery - discount;


    // Create order object
    const order = {

        orderId:
            "TH-" +
            Math.random()
                .toString(36)
                .substr(2, 6)
                .toUpperCase(),

        total: total,

        paymentMethod: payment,

        items: cart,

        customer: {
            name: name,
            email: email,
            address: address
        }

    };


    // SAVE COMPLETED ORDER
    localStorage.setItem(
        "toyHavenOrder",
        JSON.stringify(order)
    );


    // CLEAR CART
    localStorage.removeItem("toyHavenCart");


    // GO TO THANK YOU PAGE
    window.location.href = "thankyou.html";

}); // <-- THIS WAS MISSING


// ========== PAGE INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    renderOrder();

});