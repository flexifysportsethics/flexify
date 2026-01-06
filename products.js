// Product management functions

// Function to get all products
function getAllProducts() {
    // If client_products.js is loaded, use hardcoded products
    if (typeof CLIENT_PRODUCTS !== 'undefined') {
        return CLIENT_PRODUCTS;
    }
    
    // Otherwise, return empty array
    return [];
}

// Function to get products by category
function getProductsByCategory(category) {
    const products = getAllProducts();
    return products.filter(product => product.category === category);
}

// Function to get a specific product by ID
function getProductById(id) {
    const products = getAllProducts();
    return products.find(product => product.id == id);
}

// Function to add a new product
function addProduct(productData) {
    // In manual product mode, we don't actually add products via code
    console.warn('Adding products via code is disabled in manual product mode');
    return null;
}

// Function to update an existing product
function updateProduct(id, productData) {
    // In manual product mode, we don't actually update products via code
    console.warn('Updating products via code is disabled in manual product mode');
    return null;
}

// Function to delete a product
function deleteProduct(id) {
    // In manual product mode, we don't actually delete products via code
    console.warn('Deleting products via code is disabled in manual product mode');
    return false;
}

// Function to render products in a container
function renderProducts(containerId, category = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }
    
    let products = getAllProducts();
    if (category) {
        products = products.filter(product => product.category === category);
    }
    
    // Clear the container
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600">No products available.</p>';
        return;
    }
    
    // Create product cards
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer';
        productCard.onclick = () => window.location.href = `product.html?id=${product.id}`;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-gray-900">$${product.price.toFixed(2)}</span>
                    <button class="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-green-700 transition-colors whatsapp-order-btn" data-product-id="${product.id}" onclick="event.stopPropagation();">
                        Order via WhatsApp
                    </button>
                </div>
                ${product.sizes && product.sizes.length > 0 ? `
                <div class="mt-2">
                    <p class="text-xs text-gray-600">Sizes: ${product.sizes.join(', ')}</p>
                </div>
                ` : ''}
                ${product.colors && product.colors.length > 0 ? `
                <div class="mt-1">
                    <p class="text-xs text-gray-600">Colors: ${product.colors.join(', ')}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(productCard);
    });
    
    // Use event delegation for WhatsApp order buttons to prevent duplicate listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('whatsapp-order-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            orderViaWhatsApp(productId);
        }
    });
}

// Function to order product via WhatsApp
function orderViaWhatsApp(productId) {
    const product = getProductById(productId);
    
    if (product) {
        // Create order object to store in localStorage
        const order = {
            id: Date.now(), // unique ID based on timestamp
            items: [{
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                size: null, // Will be set if user specifies
                color: null // Will be set if user specifies
            }],
            date: new Date().toISOString(),
            status: 'pending',
            source: 'whatsapp' // Track that this order came from WhatsApp
        };
        
        // Store order in localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Create WhatsApp message with product details
        const productName = encodeURIComponent(product.name);
        const productPrice = product.price;
        const message = encodeURIComponent(`Hello, I would like to order this product: ${product.name}
Price: $${product.price}

Please let me know the next steps. Order ID: ORD-${order.id}`);
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/919087733332?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        // Show notification to user with order ID
        showCartNotification(`Order placed! Order ID: ORD-${order.id}. Please complete your order via WhatsApp.`, 'success');
    } else {
        showCartNotification('Product not found!', 'error');
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transition-transform transform`;
    notification.textContent = message;
    
    // Add animation
    notification.style.transform = 'translateX(100%)';
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Function to show notification
function showCartNotification(message, type = 'success') {
    showNotification(message, type);
}

// Function to process WhatsApp checkout
function processWhatsAppCheckout() {
    // For WhatsApp orders, we just need to provide a general message
    const message = encodeURIComponent('Hello, I would like to place an order for multiple items. Please let me know the next steps.');
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/919087733332?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // No cart initialization needed for WhatsApp orders
});