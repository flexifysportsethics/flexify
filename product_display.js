// Function to load and display products on the client-side website
function loadProductsForDisplay(category = null) {
    let products;
    
    if (category) {
        products = getProductsByCategory(category);
    } else {
        products = getAllProducts();
    }
    
    return products;
}

// Function to render products in a grid format
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600">No products found in this category.</p>';
        return;
    }
    
    // Create product grid
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer';
        productElement.onclick = () => window.location.href = `product.html?id=${product.id}`;
        
        productElement.innerHTML = `
            <div class="p-4">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg">
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg text-black">${product.name}</h3>
                <p class="text-gray-600 text-sm">${product.description}</p>
                <div class="mt-2 flex justify-between items-center">
                    <span class="font-bold text-black">$${product.price.toFixed(2)}</span>
                    <button class="bg-black text-white px-3 py-1 rounded-full text-sm hover:bg-gray-800 add-to-cart-btn" data-product-id="${product.id}" onclick="event.stopPropagation();">
                        Add to Cart
                    </button>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                    Sizes: ${product.sizes.join(', ')}
                </div>
                <div class="mt-1 text-xs text-gray-500">
                    Colors: ${product.colors.join(', ')}
                </div>
            </div>
        `;
        
        container.appendChild(productElement);
    });
    
    // Add event listeners to the "Add to Cart" buttons using event delegation to prevent duplicate listeners
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.stopPropagation();
            const productId = e.target.getAttribute('data-product-id');
            addToCart(productId);
        }
    });
}



// Function to update cart count in UI
function updateCartCount() {
    // Use the same storage mechanism as products.js (sessionStorage)
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count elements if they exist
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Function to get cart items
function getCartItems() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

// Function to remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    cart = cart.filter(item => item.id !== productId);
    
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to update item quantity in cart
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// Function to get cart total
function getCartTotal() {
    const cart = getCartItems();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Initialize cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});