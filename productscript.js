// ========== MENU ICON ==========
const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");

if (menuIcon && mobileMenu) {
    menuIcon.addEventListener("click", function () {
        mobileMenu.classList.toggle("show");
    });
}

// ========== UPDATE CART COUNT IN HEADER ==========
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("toyHavenCart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    // Support both possible id names
    const cartDisplay = document.getElementById("cart-count") || document.getElementById("cartCount");
    if (cartDisplay) {
        cartDisplay.innerText = totalItems;
    }
}

// Run once when page loads
updateCartCount();

// ========== PRODUCTS PAGE FUNCTIONALITY ==========
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const categoryRadios = document.querySelectorAll('input[name="category"]');
const priceRadios = document.querySelectorAll('input[name="price"]');

// Get all product cards
function getAllProducts() {
    return Array.from(document.querySelectorAll(".product-card"));
}

// Main filter + search + sort function
function filterAndSortProducts() {
    let products = getAllProducts();

    // 1. Category filter
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (selectedCategory && selectedCategory.value !== "all") {
        products = products.filter(p => p.dataset.category === selectedCategory.value);
    }

    // 2. Price filter
    const selectedPrice = document.querySelector('input[name="price"]:checked');
    if (selectedPrice && selectedPrice.value !== "all") {
        products = products.filter(p => {
            const price = parseInt(p.dataset.price);
            if (selectedPrice.value === "under1000") return price < 1000;
            if (selectedPrice.value === "1000-3000") return price >= 1000 && price <= 3000;
            if (selectedPrice.value === "3000-5000") return price >= 3000 && price <= 5000;
            if (selectedPrice.value === "above5000") return price > 5000;
            return true;
        });
    }

    // 3. Search filter
    if (searchInput) {
        const searchText = searchInput.value.toLowerCase().trim();
        if (searchText) {
            products = products.filter(p => {
                const name = (p.dataset.name || "").toLowerCase();
                return name.includes(searchText);
            });
        }
    }

    // 4. Sort
    if (sortSelect) {
        const sortValue = sortSelect.value;
        if (sortValue === "price-low") {
            products.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        } else if (sortValue === "price-high") {
            products.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        } else if (sortValue === "name") {
            products.sort((a, b) => (a.dataset.name || "").localeCompare(b.dataset.name || ""));
        }
    }
   if (productsGrid) {
        // Hide all cards first
        getAllProducts().forEach(p => p.style.display = "none");

        // Show + reorder only the filtered/sorted ones
        products.forEach(card => {
            card.style.display = "block";
            productsGrid.appendChild(card);   // moves the existing card (does not recreate it)
        });
   }
}

// Event listeners for filters
categoryRadios.forEach(radio => {
    radio.addEventListener("change", filterAndSortProducts);
});

priceRadios.forEach(radio => {
    radio.addEventListener("change", filterAndSortProducts);
});

if (searchInput) {
    searchInput.addEventListener("input", filterAndSortProducts);
}

if (sortSelect) {
    sortSelect.addEventListener("change", filterAndSortProducts);
}

// ========== ADD TO CART (no id needed) ==========
document.querySelectorAll(".btn-cart").forEach(button => {
    button.addEventListener("click", function () {
        const card = this.closest(".product-card");
        if (!card) return;

        const product = {
            name: card.dataset.name || "Unknown Product",
            type: card.dataset.category || "Toy",
            price: parseInt(card.dataset.price) || 0,
            image: card.querySelector("img") ? card.querySelector("img").getAttribute("src") : "",
            qty: 1
        };

        // Get current cart
        let cart = JSON.parse(localStorage.getItem("toyHavenCart") || "[]");

        // Check if same product already exists (using name)
        const existing = cart.find(item => item.name === product.name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push(product);
        }

        // Save cart
        localStorage.setItem("toyHavenCart", JSON.stringify(cart));

        // Update header count
        updateCartCount();

        alert(product.name + " added to cart!");
    });
});

    

// ========== ADD TO WISHLIST ==========
document.querySelectorAll(".btn-wishlist").forEach(button => {
    button.addEventListener("click", function () {
        const card = this.closest(".product-card");
        if (!card) {
            alert("Product card not found");
            return;
        }

        const id = card.dataset.id || card.dataset.name; // try to get a unique id
        const name = card.dataset.name || card.querySelector("h3")?.innerText || "Unknown Product";
        const price = card.dataset.price || card.querySelector("p")?.innerText?.replace(/[^\d]/g, "") || 0;
        const image = card.querySelector("img")?.getAttribute("src") || "";

        addToWishlist(id, name, price, image);
    });
});

function addToWishlist(id, name, price, image, status = "interested") {
    let list = JSON.parse(localStorage.getItem("toyHavenWishlist") || "[]");

    if (list.some(item => item.id === id)) {
        alert("This product is already in your wishlist!");
        return;
    }

    list.push({
        id: id,
        name: name,
        price: Number(price),
        image: image,
        status: status
    });

    localStorage.setItem("toyHavenWishlist", JSON.stringify(list));
    alert("Added to Wishlist ✓");
}
