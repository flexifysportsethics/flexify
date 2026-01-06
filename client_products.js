// Client-side product display functions

// Hardcoded products data
const CLIENT_PRODUCTS = [
    
    {
        id: 1,
        name: "Sublimation Half Sleeve",
        price: 320,
        description: "Lightweight sublimation half sleeve t-shirt for everyday wear.",
        image: "Sublimation-half sleeve-320.jpeg",
        category: "men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Red"],
        material: "Premium sublimation printed fabric",
        care: "Machine wash cold, gentle cycle, do not bleach",
        features: "Sublimation print, lightweight, comfortable fit"
    },
    {
        id: 1,
        name: "Sublimation Half Sleeve",
        price: 320,
        description: "Lightweight sublimation half sleeve t-shirt for everyday wear.",
        image: "Sublimation-half sleeve-320.jpeg",
        category: "collections",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Red"],
        material: "Premium sublimation printed fabric",
        care: "Machine wash cold, gentle cycle, do not bleach",
        features: "Sublimation print, lightweight, comfortable fit"
    },
    {
        id: 2,
        name: "Sublimation Half Sleeve",
        price: 320,
        description: "Lightweight sublimation half sleeve t-shirt for everyday wear.",
        image: "Sublimation -half sleeve-320.jpeg",
        category: "men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Blue"],
        material: "Premium sublimation printed fabric",
        care: "Machine wash cold, gentle cycle, do not bleach",
        features: "Sublimation print, lightweight, comfortable fit"
    },
    {
        id: 2,
        name: "Sublimation Half Sleeve",
        price: 320,
        description: "Lightweight sublimation half sleeve t-shirt for everyday wear.",
        image: "Sublimation -half sleeve-320.jpeg",
        category: "collections",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Blue"],
        material: "Premium sublimation printed fabric",
        care: "Machine wash cold, gentle cycle, do not bleach",
        features: "Sublimation print, lightweight, comfortable fit"
    },
    {
        id: 3,
        name: "Embroidery Half Sleeve",
        price: 360,
        description: "Stylish embroidered half sleeve t-shirt for everyday wear.",
        image: "Embroidery -half sleeve-360.jpeg",
        category: "men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Blue"],
        material: "Premium cotton with embroidered details",
        care: "Machine wash cold, gentle cycle, do not bleach",
        features: "Embroidered design, comfortable fit, durable fabric"
    },
    {
        id: 3,
        name: "Embroidery Half Sleeve",
        price: 360,
        description: "Stylish embroidered half sleeve t-shirt for everyday wear.",
        image: "Embroidery -half sleeve-360.jpeg",
        category: "collections",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Blue"],
        material: "Premium cotton with embroidered details",
        care: "Machine wash cold, gentle cycle, do not bleach",
        features: "Embroidered design, comfortable fit, durable fabric"
    },
    {
        id: 4,
        name: "Shots",
        price: 200,
        description: "Stylish shots for everyday wear.",
        image: "Shots-200.jpeg",
        category: "men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Gray"],
        material: "Premium cotton blend",
        care: "Machine wash cold, do not bleach",
        features: "Stylish design, comfortable fit, durable fabric"
    },
    {
        id: 4,
        name: "Shots",
        price: 200,
        description: "Stylish shots for everyday wear.",
        image: "Shots-200.jpeg",
        category: "collections",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Gray"],
        material: "Premium cotton blend",
        care: "Machine wash cold, do not bleach",
        features: "Stylish design, comfortable fit, durable fabric"
    },
    {
        id: 5,
        name: "Sublimation Half Sleeve",
        price: 320,
        description: "Lightweight sublimation half sleeve t-shirt for everyday wear.",
        image: "Sublimation -halfsleeve-320.jpeg",
        category: "men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Gray"],
        material: "Premium cotton blend",
        care: "Machine wash cold, do not bleach",
        features: "Sublimation print, lightweight, comfortable fit"
    },
    {
        id: 5,
        name: "Sublimation Half Sleeve",
        price: 320,
        description: "Lightweight sublimation half sleeve t-shirt for everyday wear.",
        image: "Sublimation -halfsleeve-320.jpeg",
        category: "collections",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Gray"],
        material: "Premium cotton blend",
        care: "Machine wash cold, do not bleach",
        features: "Sublimation print, lightweight, comfortable fit"
    },
];

// Function to get all products
function getAllProducts() {
    return CLIENT_PRODUCTS;
}

// Function to get products by category
function getProductsByCategory(category) {
    return CLIENT_PRODUCTS.filter(product => product.category === category);
}

// Function to get a specific product by ID
function getProductById(id) {
    return CLIENT_PRODUCTS.find(product => product.id == id);
}

// Function to load and display products on the client side
function loadClientProducts() {
    // This function will be called when the page loads
    // It will render products in any containers that have the appropriate data attributes
    const productContainers = document.querySelectorAll('[data-product-category]');
    
    productContainers.forEach(container => {
        const category = container.getAttribute('data-product-category');
        renderProducts(container.id, category);
    });
}

// Function to initialize cart functionality
function initCart() {
    // Update cart count on page load
    updateCartCount();
    
    // Use event delegation for WhatsApp order buttons to prevent duplicate listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('whatsapp-order-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            orderViaWhatsApp(productId);
        }
    });
}

// Function to initialize checkout process
function initCheckout() {
    // Add event listener to checkout button if it exists
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // For WhatsApp orders, just open WhatsApp
            processWhatsAppCheckout();
        });
    }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadClientProducts();
    initCart();
    initCheckout();
});