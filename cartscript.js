// Menu Icon
const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");

menuIcon.addEventListener("click", function () {
    mobileMenu.classList.toggle("show");
});


// Global product list (loaded from JSON)
let PRODUCTS = [];

function getCart() {
    return JSON.parse(localStorage.getItem("toyHavenCart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("toyHavenCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll("#cartCount").forEach(el => {
        el.textContent = count;
    });
}

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            type: product.type,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    saveCart(cart);
    alert(product.name + " added to cart");
}

function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(row => row.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty < 1) {
        cart = cart.filter(row => row.id !== id);
    }

    saveCart(cart);
    renderCart();
}

function removeItem(id) {
    saveCart(getCart().filter(row => row.id !== id));
    renderCart();
}

function renderCart() {
    const emptyEl  = document.getElementById("emptyCart");
    const filledEl = document.getElementById("filledCart");
    if (!emptyEl || !filledEl) return;

    const cart = getCart();
    updateCartCount();

    if (cart.length === 0) {
        emptyEl.style.display = "flex";
        filledEl.style.display = "none";
        return;
    }

    emptyEl.style.display = "none";
    filledEl.style.display = "flex";

   

// Show the full cart
    emptyEl.style.display = "none";
    filledEl.style.display = "flex";


    document.getElementById("cartItems").innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.type}<br>1 - LKR ${item.price}</p>
                <div class="qty-row">
                    Quantity :
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    ${item.qty}
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <p>Subtotal : LKR ${item.price * item.qty}</p>
                <button class="btn-trash" onclick="removeItem(${item.id})">🗑</button>
            </div>
        </div>
    `).join("");

    const items    = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = items >= 2 ? 50 : 0;

    document.getElementById("summaryItems").textContent    = items;
    document.getElementById("summarySubtotal").textContent = "LKR " + subtotal;
    document.getElementById("summaryDiscount").textContent = "LKR " + discount;
    document.getElementById("summaryTotal").textContent    = "LKR " + (subtotal - discount);
}

// ---- Load products from JSON (same pattern as last week’s phone directory) ----
function getData() {
    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            PRODUCTS = data;          // store globally
            renderCart();             // now we can safely render
        })
        .catch(error => console.log(`error - ${error}`));
}

// ---- Page start ----
document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu
    const toggle = document.getElementById("menuToggle");
    const menu   = document.getElementById("mobileMenu");
    if (toggle && menu) {
        toggle.addEventListener("click", () => menu.classList.toggle("show"));
    }

    // Clear cart button
    const clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            saveCart([]);
            renderCart();
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            location.href = "checkout.html";
        });
    }

    // Load products from JSON, then render cart
    getData();
    updateCartCount();   // still update the header count immediately
});