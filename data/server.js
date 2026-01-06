const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve static files from parent directory

// Data files
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Initialize data files if they don't exist
async function initializeDataFiles() {
  await ensureDataDir();
  
  // Initialize products file
  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify([], null, 2));
  }
  
  // Initialize orders file
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

// API Routes

// Products
app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to read products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[productIndex] = { ...products[productIndex], ...req.body, updatedAt: new Date().toISOString() };
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json(products[productIndex]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
    const productId = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== productId);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filteredProducts, null, 2));
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf8'));
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'pending'
    };
    orders.push(newOrder);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json(newOrder);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf8'));
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex] = { ...orders[orderIndex], ...req.body, updatedAt: new Date().toISOString() };
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update the client-side JavaScript files to use the new API endpoints
app.get('/api/init-client-js', async (req, res) => {
  // This endpoint would return updated JavaScript files that use the API
  // For now, we'll just return a status
  res.json({ message: 'API server running. Update client JS to use /api endpoints' });
});

// Initialize data files and start server
initializeDataFiles()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('API endpoints available:');
      console.log('  GET    /api/products - Get all products');
      console.log('  POST   /api/products - Create a product');
      console.log('  PUT    /api/products/:id - Update a product');
      console.log('  DELETE /api/products/:id - Delete a product');
      console.log('  GET    /api/orders - Get all orders');
      console.log('  POST   /api/orders - Create an order');
      console.log('  PUT    /api/orders/:id - Update an order');
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
  });

module.exports = app;