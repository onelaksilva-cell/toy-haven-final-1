const CART_KEY = "toyHavenCart";
const ORDER_KEY = "toyHavenOrder";

function formatLKR(amount) {
    return "LKR " + Number(amount).toLocaleString("en-LK");
}

function getCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

        return cart.reduce((sum, item) => {
            return sum + (item.qty || 1);
        }, 0);

    } catch {
        return 0;
    }
}

function loadOrder() {

    // Update cart count in header
    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = getCartCount();
    }

    // Get elements
    const summaryEl = document.getElementById("orderSummary");
    const itemsSection = document.getElementById("itemsSection");
    const itemsList = document.getElementById("itemsList");

    // Get saved order
    const orderData = localStorage.getItem(ORDER_KEY);

    // If no order exists
    if (!orderData) {

        summaryEl.innerHTML = `
            <div class="order-row">
                <span class="order-label">ORDER ID</span>
                <span class="order-value">#TH-XXXXXX</span>
            </div>

            <div class="order-row">
                <span class="order-label">TOTAL</span>
                <span class="order-value">LKR 0</span>
            </div>

            <div class="order-row">
                <span class="order-label">PAYMENT METHOD</span>
                <span class="order-value">—</span>
            </div>
        `;

        itemsSection.style.display = "none";
        return;
    }

    // Convert stored JSON into an object
    const order = JSON.parse(orderData);

    // Display order summary
    summaryEl.innerHTML = `
        <div class="order-row">
            <span class="order-label">ORDER ID</span>
            <span class="order-value">
                #${order.orderId || "TH-XXXXXX"}
            </span>
        </div>

        <div class="order-row">
            <span class="order-label">TOTAL</span>
            <span class="order-value">
                ${formatLKR(order.total || 0)}
            </span>
        </div>

        <div class="order-row">
            <span class="order-label">PAYMENT METHOD</span>
            <span class="order-value">
                ${(order.paymentMethod || "CARD").toUpperCase()}
            </span>
        </div>
    `;

    // Display ordered items
    if (order.items && order.items.length > 0) {

        itemsList.innerHTML = order.items.map(item => `
            <div class="item">

                <div class="item-img">
                    ${
                        item.image
                        ? `<img 
                            src="${item.image}" 
                            alt="${item.name || "Product"}"
                            onerror="this.parentElement.textContent='IMG'"
                           >`
                        : "IMG"
                    }
                </div>

                <div class="item-info">

                    <div class="item-name">
                        ${item.name || "Toy Item"}
                    </div>

                    <div class="item-meta">
                        Qty: ${item.qty || 1}
                    </div>

                </div>

                <div class="item-price">
                    ${formatLKR(
                        (item.price || 0) * (item.qty || 1)
                    )}
                </div>

            </div>
        `).join("");

    } else {

        itemsSection.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", loadOrder);