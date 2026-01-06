// Order management functions

// Function to get all orders
async function getAllOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Function to get an order by ID
async function getOrderById(id) {
    try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

// Function to add a new order
async function addOrder(orderData) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding order:', error);
        return null;
    }
}

// Function to update an existing order
async function updateOrder(id, orderData) {
    try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
}

// Function to delete an order
async function deleteOrder(id) {
    try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting order:', error);
        return false;
    }
}

// Function to update order status
async function updateOrderStatus(id, status) {
    try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating order status:', error);
        return null;
    }
}

// Function to render orders in a container
async function renderOrders(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }
    
    const orders = await getAllOrders();
    
    // Clear the container
    container.innerHTML = '';
    
    if (orders.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No orders found.</td></tr>';
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create order rows
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString();
        
        // Format status with color
        let statusClass = '';
        let statusText = order.status;
        switch(order.status) {
            case 'pending':
                statusClass = 'bg-yellow-100 text-yellow-800';
                break;
            case 'processing':
                statusClass = 'bg-blue-100 text-blue-800';
                break;
            case 'shipped':
                statusClass = 'bg-purple-100 text-purple-800';
                break;
            case 'delivered':
                statusClass = 'bg-green-100 text-green-800';
                break;
            case 'cancelled':
                statusClass = 'bg-red-100 text-red-800';
                statusText = 'Cancelled';
                break;
            default:
                statusClass = 'bg-gray-100 text-gray-800';
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${order.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.customerName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${order.total.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-blue-600 hover:text-blue-900 font-medium view-order-btn" data-order-id="${order.id}">View</button>
                <select class="ml-4 status-select" data-order-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        `;
        
        container.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-order-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const orderId = this.getAttribute('data-order-id');
            await viewOrderDetails(orderId);
        });
    });
    
    // Add event listeners to status selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async function() {
            const orderId = this.getAttribute('data-order-id');
            const newStatus = this.value;
            await updateOrderStatus(orderId, newStatus);
            
            // Refresh the orders display
            await renderOrders('ordersTable');
        });
    });
}

// Function to view order details
async function viewOrderDetails(orderId) {
    const order = await getOrderById(orderId);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    // Remove any existing order detail modals
    const existingModal = document.getElementById('order-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="order-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">Order Details</h2>
                            <p class="text-gray-600 mt-1">Order #${order.id}</p>
                        </div>
                        <button id="close-order-modal" class="text-gray-500 hover:text-gray-700">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Customer Information -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                            <div class="space-y-2">
                                <p><span class="font-medium">Name:</span> ${order.customerName}</p>
                                <p><span class="font-medium">Email:</span> ${order.customerEmail}</p>
                                <p><span class="font-medium">Date:</span> ${new Date(order.date).toLocaleString()}</p>
                                <p><span class="font-medium">Status:</span> 
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}">
                                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Order Summary -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                            <div class="space-y-2">
                                <p><span class="font-medium">Total:</span> $${order.total.toFixed(2)}</p>
                                <p><span class="font-medium">Payment Method:</span> ${order.paymentMethod || 'N/A'}</p>
                                <p><span class="font-medium">Shipping Address:</span></p>
                                <p class="ml-4">${formatAddress(order.shippingAddress)}</p>
                                <p><span class="font-medium">Billing Address:</span></p>
                                <p class="ml-4">${formatAddress(order.billingAddress)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Items -->
                    <div class="mt-8">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${order.items.map(item => `
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm font-medium text-gray-900">${item.name}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                $${item.price.toFixed(2)}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${item.quantity}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                $${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot class="bg-gray-50">
                                    <tr>
                                        <td class="px-6 py-3 text-right text-sm font-medium text-gray-900" colspan="3">Subtotal:</td>
                                        <td class="px-6 py-3 text-sm font-medium text-gray-900">$${order.total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button id="close-order-modal-bottom" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize lucide icons in the modal
    lucide.createIcons();
    
    // Add event listeners to close buttons
    document.getElementById('close-order-modal').addEventListener('click', closeModal);
    document.getElementById('close-order-modal-bottom').addEventListener('click', closeModal);
    
    // Close modal when clicking on the overlay
    const modal = document.getElementById('order-detail-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Helper function to get status class for styling
function getStatusClass(status) {
    switch(status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Helper function to format address
function formatAddress(address) {
    if (typeof address === 'string') {
        return address;
    } else if (typeof address === 'object' && address !== null) {
        return `${address.address || ''}\n${address.city || ''}, ${address.state || ''} ${address.zip || ''}`.trim();
    } else {
        return 'N/A';
    }
}

// Helper function to close the modal
function closeModal() {
    const modal = document.getElementById('order-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Function to initialize order management
async function initOrderManagement() {
    // Load orders when the page loads if the orders section is visible
    const ordersSection = document.getElementById('orders');
    if (ordersSection) {
        await renderOrders('ordersTable');
    }
}

// Function to generate sample orders for testing
async function generateSampleOrders() {
    // Check if we already have sample orders to avoid duplicates
    const existingOrders = await getAllOrders();
    if (existingOrders.length > 0) {
        return;
    }
    
    // Create sample orders
    const sampleOrders = [
        {
            customerId: 'customer1',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            items: [
                {
                    name: 'Performance T-Shirt',
                    price: 49.99,
                    quantity: 2,
                    size: 'M',
                    color: 'Black'
                },
                {
                    name: 'Training Shorts',
                    price: 59.99,
                    quantity: 1,
                    size: 'L',
                    color: 'Blue'
                }
            ],
            total: 159.97,
            shippingAddress: '123 Main St, New York, NY 10001',
            billingAddress: '123 Main St, New York, NY 10001',
            paymentMethod: 'credit-card',
            status: 'pending'
        },
        {
            customerId: 'customer2',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            items: [
                {
                    name: 'Compression Leggings',
                    price: 79.99,
                    quantity: 1,
                    size: 'M',
                    color: 'Black'
                }
            ],
            total: 79.99,
            shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
            billingAddress: '456 Oak Ave, Los Angeles, CA 90210',
            paymentMethod: 'paypal',
            status: 'processing'
        }
    ];
    
    // Add sample orders
    for (const orderData of sampleOrders) {
        await addOrder(orderData);
    }
    
    console.log('Sample orders generated for testing');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Generate sample orders for testing if none exist
    await generateSampleOrders();
    await initOrderManagement();
});