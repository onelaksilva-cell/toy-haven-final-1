// Menu Icon
const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");

menuIcon.addEventListener("click", function () {
    mobileMenu.classList.toggle("show");
});

// Slider (manual only)
let current = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    current = index;
}

// Dots
dots.forEach(dot => {
    dot.addEventListener("click", function () {
        showSlide(parseInt(this.getAttribute("data-index")));
    });
});

// Arrows
prevBtn.addEventListener("click", function () {
    showSlide(current - 1);
});

nextBtn.addEventListener("click", function () {
    showSlide(current + 1);
});

// Cart counter
const CART_KEY = "toyHavenCart";

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    const count = cart.reduce((sum, item) => {
        return sum + (item.qty || 1);
    }, 0);

    const cartDisplay = document.getElementById("cart-count");

    if (cartDisplay) {
        cartDisplay.textContent = count;
    }
}

updateCartCount();


// Newsletter
document.getElementById("subscribe-btn").addEventListener("click", function () {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const msg = document.getElementById("message");

    if (email === "") {
        msg.innerText = "Please enter your email";
        msg.style.color = "red";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        msg.innerText = "Please enter a valid email";
        msg.style.color = "red";
        return;
    }

    // Get existing emails from localStorage
    let subscribers = JSON.parse(localStorage.getItem("toyHavenSubscribers") || "[]");

    // Check if email already exists
    if (subscribers.includes(email)) {
        msg.innerText = "This email is already subscribed!";
        msg.style.color = "orange";
        return;
    }

    // Add new email
    subscribers.push(email);
    localStorage.setItem("toyHavenSubscribers", JSON.stringify(subscribers));

    msg.innerText = "Thank you for subscribing!";
    msg.style.color = "green";
    emailInput.value = "";
});

