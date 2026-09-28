// ========== MENU ICON ==========
const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");

if (menuIcon && mobileMenu) {
    menuIcon.addEventListener("click", function () {
        mobileMenu.classList.toggle("show");
    });
}

const WISHLIST_KEY = "toyHavenWishlist";
const CART_KEY = "toyHavenCart";

function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
}

function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const el = document.getElementById("cartCount");
    if (el) el.textContent = count;
}

function updateSavedCount() {
    const el = document.getElementById("savedCount");
    if (el) el.textContent = getWishlist().length;
}

function renderWishlist(filter = "all") {
    const container = document.getElementById("wishlistList");
    if (!container) return;

    let list = getWishlist();

    if (filter === "interested") {
        list = list.filter(item => item.status === "interested");
    } else if (filter === "owned") {
        list = list.filter(item => item.status === "owned");
    }

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-msg">No products in your wishlist yet.</div>`;
        updateSavedCount();
        return;
    }

    container.innerHTML = list.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">LKR ${Number(item.price).toLocaleString()}</p>
                <div class="status-row">
                    <span>Status:</span>
                    <select onchange="changeStatus('${item.id}', this.value)">
                        <option value="interested" ${item.status === "interested" ? "selected" : ""}>Interested</option>
                        <option value="owned" ${item.status === "owned" ? "selected" : ""}>Owned</option>
                    </select>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromWishlist('${item.id}')">
                🗑 Remove
            </button>
        </div>
    `).join("");

    updateSavedCount();
}

function filterWishlist() {
    const value = document.getElementById("wishlistFilter").value;
    renderWishlist(value);
}

function changeStatus(id, newStatus) {
    let list = getWishlist();
    list = list.map(item => {
        if (item.id === id) item.status = newStatus;
        return item;
    });
    saveWishlist(list);
    filterWishlist();
}

function removeFromWishlist(id) {
    let list = getWishlist();
    list = list.filter(item => item.id !== id);
    saveWishlist(list);
    filterWishlist();
}



    updateCartCount();
    renderWishlist();
