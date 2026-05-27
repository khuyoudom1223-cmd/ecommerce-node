import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Heart, User, Shield, Layers, 
  Search, Star, Plus, Minus, X, Trash2, CheckCircle2, 
  ArrowRightLeft, AlertCircle, ShoppingCart, RefreshCw,
  LogOut, PlusCircle, Settings, Edit3, Check, XCircle, Eye, EyeOff,
  TrendingUp, Package, Users, DollarSign, BarChart2, Menu, Globe
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { INITIAL_PRODUCTS, CATEGORIES } from './mockData';

const TRANSLATIONS = {
  en: {
    home: "Home",
    orders: "Orders",
    adminPanel: "Admin Panel",
    profile: "Profile",
    login: "Login",
    logout: "Logout",
    newArrival: "New Arrival • Spring Collection",
    redefiningElegance: "Redefining modern elegance.",
    discoverCapsule: "Discover a high-end capsule wardrobe crafted for durability, sleek styling, and comfortable fit.",
    shopNow: "Shop Now",
    browseCoats: "Browse Coats",
    beautyFeast: "Beauty Feast, Fashion Awards",
    lifetimeWarranty: "Immediately buyers enjoy a lifetime warranty",
    checkDetails: "Check Details",
    discoverCollection: "Discover Our Collection",
    filterPremium: "Filter premium apparel by collection, category or pricing.",
    trendyNewArrivals: "Trendy new arrivals",
    freshFashion: "Fresh fashion hits the shelves! Revamp your look with our latest trendy items. Keep your style sharp and on-trend with our stylish picks. Shop now!",
    searchCatalog: "Search catalog...",
    searchPremium: "Search premium apparel...",
    flashSale: "Flash Sale",
    offAllItems: "30% Off All Items",
    trendingItem: "Trending Item",
    exclusiveBrand: "Exclusive Brand",
    newArrivalsTrendsetting: "New arrivals, trendsetting",
    grabLimited: "Grab limited offers",
    outOfStock: "Out of Stock",
    onlyLeft: "Only {count} Left",
    selectDetails: "Select Details",
    priceRange: "Price Range",
    categories: {
      "All": "All",
      "Coats": "Coats",
      "Shirts": "Shirts",
      "Sweaters": "Sweaters",
      "Accessories": "Accessories"
    }
  },
  kh: {
    home: "ទំព័រដើម",
    orders: "ការបញ្ជាទិញ",
    adminPanel: "ផ្ទាំងគ្រប់គ្រង",
    profile: "គណនីខ្ញុំ",
    login: "ចូលប្រព័ន្ធ",
    logout: "ចាកចេញ",
    newArrival: "ម៉ូដថ្មីទើបមកដល់ • និទាឃរដូវ",
    redefiningElegance: "និយមន័យថ្មីនៃភាពស៊ីវិល័យ",
    discoverCapsule: "ស្វែងរកសម្លៀកបំពាក់លំដាប់ខ្ពស់ដែលផលិតឡើងសម្រាប់ការប្រើប្រាស់បានយូរ ម៉ូដទាន់សម័យ និងផាសុកភាព។",
    shopNow: "ទិញឥឡូវនេះ",
    browseCoats: "មើលអាវធំ",
    beautyFeast: "មហោស្រពសម្រស់ និងពានរង្វាន់ម៉ូដសម្លៀកបំពាក់",
    lifetimeWarranty: "អតិថិជននឹងទទួលបានការធានាពេញមួយជីវិតភ្លាមៗ",
    checkDetails: "ពិនិត្យព័ត៌មានលម្អិត",
    discoverCollection: "ស្វែងរកការប្រមូលផ្តុំរបស់យើង",
    filterPremium: "ជ្រើសរើសសម្លៀកបំពាក់ប្រណិតតាមក្រុម ប្រភេទ ឬតម្លៃ។",
    trendyNewArrivals: "ម៉ូដថ្មីៗទាន់សម័យ",
    freshFashion: "ម៉ូដសម្លៀកបំពាក់ថ្មីៗបានមកដល់ហើយ! កែលម្អការតុបតែងខ្លួនរបស់អ្នកជាមួយទំនិញថ្មីៗចុងក្រោយបង្អស់របស់យើង។ រក្សាម៉ូដរបស់អ្នកឱ្យទាន់សម័យជាមួយជម្រើសដ៏ទាក់ទាញរបស់យើង។ ទិញឥឡូវនេះ!",
    searchCatalog: "ស្វែងរកផលិតផល...",
    searchPremium: "ស្វែងរកសម្លៀកបំពាក់ប្រណិត...",
    flashSale: "លក់បញ្ចុះតម្លៃពិសេស",
    offAllItems: "បញ្ចុះតម្លៃ ៣០% គ្រប់មុខ",
    trendingItem: "ទំនិញពេញនិយម",
    exclusiveBrand: "ម៉ាកផ្តាច់មុខ",
    newArrivalsTrendsetting: "ម៉ូដថ្មីៗ នាំមុខគេ",
    grabLimited: "ការផ្តល់ជូនមានកំណត់",
    outOfStock: "អស់ពីស្តុក",
    onlyLeft: "នៅសល់តែ {count} គ្រឿង",
    selectDetails: "មើលលម្អិត",
    priceRange: "កម្រិតតម្លៃ",
    categories: {
      "All": "ទាំងអស់",
      "Coats": "អាវរងាធំ",
      "Shirts": "អាវយឺត/អាវសិប",
      "Sweaters": "អាវរោមចៀម",
      "Accessories": "គ្រឿងតុបតែងកាយ"
    }
  }
};

export default function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  // Navigation & View
  const [currentTab, setCurrentTab] = useState('home'); // home, product, cart, orders, vendor, admin, profile, auth
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Language Localization (default 'kh' for Khmer)
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('app_lang') || 'kh';
    } catch (e) {
      return 'kh';
    }
  });
  useEffect(() => {
    try { localStorage.setItem('app_lang', lang); } catch (e) {}
  }, [lang]);
  const toggleLang = () => {
    const prev = lang;
    const next = prev === 'kh' ? 'en' : 'kh';

    const applyTranslations = (from, to) => {
      if (typeof document === 'undefined') return;
      const map = {};
      const fromMap = TRANSLATIONS[from] || {};
      const toMap = TRANSLATIONS[to] || {};

      Object.keys(fromMap).forEach(key => {
        if (key === 'categories') return;
        const fv = fromMap[key];
        const tv = toMap[key] || fv;
        if (typeof fv === 'string') map[fv] = tv;
      });

      const fromCats = fromMap.categories || {};
      const toCats = toMap.categories || {};
      Object.keys(fromCats).forEach(catKey => {
        const fv = fromCats[catKey];
        const tv = toCats[catKey] || fv;
        map[fv] = tv;
      });

      // sort by length to replace longer phrases first
      const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        let v = node.nodeValue;
        entries.forEach(([fromStr, toStr]) => {
          if (!fromStr) return;
          if (v.includes(fromStr)) v = v.split(fromStr).join(toStr);
        });
        if (v !== node.nodeValue) node.nodeValue = v;
      }

      // Replace common attributes
      const attrNames = ['placeholder', 'title', 'alt', 'aria-label', 'value'];
      const selector = attrNames.map(a => `[${a}]`).join(',');
      document.querySelectorAll(selector).forEach(el => {
        attrNames.forEach(attr => {
          if (el.hasAttribute && el.hasAttribute(attr)) {
            let val = el.getAttribute(attr) || '';
            entries.forEach(([fromStr, toStr]) => {
              if (!fromStr) return;
              if (val.includes(fromStr)) val = val.split(fromStr).join(toStr);
            });
            el.setAttribute(attr, val);
          }
        });
      });
    };

    try { applyTranslations(prev, next); } catch (e) { console.warn('translation apply failed', e); }
    setLang(next);
  };
  const t = (key, categoryKey = null) => {
    if (categoryKey) {
      return TRANSLATIONS[lang]?.categories?.[categoryKey] || categoryKey;
    }
    return TRANSLATIONS[lang]?.[key] || key;
  };
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(200);

  // Notifications
  const [notification, setNotification] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('current_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        const { password, ...safe } = currentUser;
        localStorage.setItem('current_user', JSON.stringify(safe));
      } else {
        localStorage.removeItem('current_user');
      }
    } catch (e) {}
  }, [currentUser]);
  
  // DB Mock States: Centralized Users
  const [users, setUsers] = useState([
    { id: 1, name: "Alex Mercer",    email: "alex@example.com",    password: "password", role: "user" },
    { id: 3, name: "Super Admin",    email: "admin@sleekcart.com", password: "admin",    role: "admin" },
    { id: 8, name: "Site Admin",     email: "admin@topupgg.com",   password: "admin",    role: "admin" },
    { id: 4, name: "Sofia Chen",     email: "sofia@example.com",   password: "password", role: "user" },
    { id: 5, name: "James Rivera",   email: "james@example.com",   password: "password", role: "user" },
    { id: 6, name: "Priya Sharma",   email: "priya@example.com",   password: "password", role: "user" },
    { id: 7, name: "Michael Torres", email: "michael@example.com", password: "password", role: "user" },
  ]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([
    { id: "ORD-1001", userId: 1, userName: "Alex Mercer",    productName: "Azurea Classic Trench Coat",    productId: 1, size: "M",  color: "Blue",  quantity: 1, totalAmount: 99.99,  status: "Completed", date: "2026-01-10T10:00:00Z" },
    { id: "ORD-1002", userId: 1, userName: "Alex Mercer",    productName: "Royal Velvet Evening Gown",     productId: 2, size: "S",  color: "Red",   quantity: 1, totalAmount: 149.99, status: "Completed", date: "2026-01-22T14:00:00Z" },
    { id: "ORD-1003", userId: 4, userName: "Sofia Chen",     productName: "Minimalist Linen Summer Shirt", productId: 3, size: "M",  color: "White", quantity: 2, totalAmount: 99.98,  status: "Completed", date: "2026-02-05T09:30:00Z" },
    { id: "ORD-1004", userId: 5, userName: "James Rivera",   productName: "Slim-Fit Indigo Denim Jacket",  productId: 4, size: "L",  color: "Blue",  quantity: 1, totalAmount: 79.99,  status: "Completed", date: "2026-02-18T11:00:00Z" },
    { id: "ORD-1005", userId: 4, userName: "Sofia Chen",     productName: "Chiffon Pleated Midi Skirt",    productId: 5, size: "S",  color: "White", quantity: 1, totalAmount: 39.99,  status: "Paid",      date: "2026-03-03T15:00:00Z" },
    { id: "ORD-1006", userId: 6, userName: "Priya Sharma",   productName: "Cable-Knit Cashmere Sweater",  productId: 6, size: "M",  color: "Blue",  quantity: 1, totalAmount: 119.99, status: "Completed", date: "2026-03-14T08:00:00Z" },
    { id: "ORD-1007", userId: 5, userName: "James Rivera",   productName: "Azurea Classic Trench Coat",   productId: 1, size: "XL", color: "Black", quantity: 1, totalAmount: 99.99,  status: "Completed", date: "2026-03-28T13:00:00Z" },
    { id: "ORD-1008", userId: 1, userName: "Alex Mercer",    productName: "Royal Velvet Evening Gown",    productId: 2, size: "M",  color: "Blue",  quantity: 1, totalAmount: 149.99, status: "Cancelled", date: "2026-04-07T10:00:00Z" },
    { id: "ORD-1009", userId: 6, userName: "Priya Sharma",   productName: "Slim-Fit Indigo Denim Jacket", productId: 4, size: "M",  color: "Black", quantity: 2, totalAmount: 159.98, status: "Completed", date: "2026-04-15T16:00:00Z" },
    { id: "ORD-1010", userId: 7, userName: "Michael Torres", productName: "Minimalist Linen Summer Shirt", productId: 3, size: "L",  color: "Blue",  quantity: 1, totalAmount: 49.99,  status: "Processing",date: "2026-04-22T12:00:00Z" },
    { id: "ORD-1011", userId: 4, userName: "Sofia Chen",     productName: "Cable-Knit Cashmere Sweater",  productId: 6, size: "S",  color: "White", quantity: 1, totalAmount: 119.99, status: "Completed", date: "2026-05-02T09:00:00Z" },
    { id: "ORD-1012", userId: 7, userName: "Michael Torres", productName: "Azurea Classic Trench Coat",   productId: 1, size: "M",  color: "Blue",  quantity: 1, totalAmount: 99.99,  status: "Paid",      date: "2026-05-09T14:30:00Z" },
    { id: "ORD-1013", userId: 5, userName: "James Rivera",   productName: "Chiffon Pleated Midi Skirt",   productId: 5, size: "M",  color: "Blue",  quantity: 2, totalAmount: 79.98,  status: "Completed", date: "2026-05-17T11:30:00Z" },
    { id: "ORD-1014", userId: 6, userName: "Priya Sharma",   productName: "Royal Velvet Evening Gown",    productId: 2, size: "L",  color: "Red",   quantity: 1, totalAmount: 149.99, status: "Pending",   date: "2026-05-24T15:00:00Z" },
    { id: "ORD-9876", userId: 1, userName: "Alex Mercer",    productName: "Azurea Classic Trench Coat",   productId: 1, size: "M",  color: "Blue",  quantity: 1, totalAmount: 99.99,  status: "Paid",      date: "2026-05-25T14:30:00Z" },
  ]);

  // Temporary Inputs
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Checkout Inputs
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutFullName, setCheckoutFullName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutLocation, setCheckoutLocation] = useState('');
  const [checkoutNote, setCheckoutNote] = useState('');
  // KHQR Payment state
  const [showKHQRModal, setShowKHQRModal] = useState(false);
  const [khqrPayload, setKhqrPayload] = useState(null);
  const [khqrOrderId, setKhqrOrderId] = useState(null);
  const [paymentPollingId, setPaymentPollingId] = useState(null);

  // Add Product Inputs
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Coats');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Admin sub-panel states
  const [adminTab, setAdminTab] = useState('dashboard');

  // Mobile layout state variables
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Notification helper
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Switch role helper (for demonstration ease)
  const switchRole = (role) => {
    if (role === 'user') {
      const userObj = users.find(u => u.id === 1) || { id: 1, name: "Alex Mercer", email: "alex@example.com", role: "user" };
      setCurrentUser(userObj);
      triggerNotification("Switched to Customer View!");
    } else if (role === 'admin') {
      const adminObj = users.find(u => u.id === 3) || { id: 3, name: "Super Admin", email: "admin@example.com", role: "admin" };
      setCurrentUser(adminObj);
      triggerNotification("Switched to Admin View!");
    }
  };

  // Add to Wishlist
  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      triggerNotification("Removed from wishlist", "info");
    } else {
      setWishlist([...wishlist, product]);
      triggerNotification("Added to wishlist!");
    }
  };

  // Cart operations
  const addToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      triggerNotification("Please select a size and color variant first!", "warning");
      return;
    }

    // Check stock
    if (product.stock <= 0) {
      triggerNotification("Sorry, this item is out of stock!", "warning");
      return;
    }

    const existingIndex = cart.findIndex(item => 
      item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingIndex].quantity + quantity > product.stock) {
        triggerNotification(`Cannot exceed available stock (${product.stock})`, "warning");
        return;
      }
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      if (quantity > product.stock) {
        triggerNotification(`Cannot exceed available stock (${product.stock})`, "warning");
        return;
      }
      setCart([...cart, {
        ...product,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      }]);
    }

    triggerNotification("Added to cart successfully!");
    // Reset variants selector
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setCurrentTab('cart');
  };

  const updateCartQty = (index, change) => {
    const updated = [...cart];
    const item = updated[index];
    const newQty = item.quantity + change;
    
    if (newQty <= 0) {
      updated.splice(index, 1);
      setCart(updated);
      triggerNotification("Item removed from cart", "info");
    } else if (newQty > item.stock) {
      triggerNotification(`Sorry, only ${item.stock} units are in stock`, "warning");
    } else {
      item.quantity = newQty;
      setCart(updated);
    }
  };

  const removeCartItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    triggerNotification("Item removed from cart", "info");
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const cartTotal = cartSubtotal; // No delivery costs as requested

  // Checkout
  const handleCheckout = (fullName, phone, location, note) => {
    if (cart.length === 0) {
      triggerNotification("Your cart is empty!", "warning");
      return;
    }

    if (!phone || !phone.trim()) {
      triggerNotification("Phone number is required!", "error");
      return;
    }

    if (!location || !location.trim()) {
      triggerNotification("Location / Address is required!", "error");
      return;
    }

    const orderItems = cart.map(item => ({
      product_id: item.id,
      product_name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      total_amount: (item.discountPrice || item.price) * item.quantity,
      customer_name: fullName || currentUser.name,
      phone_number: phone,
      delivery_address: location,
      note: note || '',
      payment_method: 'KHQR'
    }));

    const requestBody = {
      user_id: currentUser.id,
      product_id: cart[0].id,
      size: cart[0].size,
      color: cart[0].color,
      quantity: cart[0].quantity,
      customer_name: fullName || currentUser.name,
      phone_number: phone,
      delivery_address: location,
      note: note || '',
      payment_method: 'KHQR'
    };

    fetch(`${API_BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then(r => r.json())
      .then(orderResponse => {
        if (!orderResponse || !orderResponse.success || !orderResponse.order) {
          throw new Error(orderResponse?.message || 'Failed to create pending order');
        }

        const createdOrder = orderResponse.order;
        const createdOrderDisplayId = createdOrder.order_number || `ORD-${createdOrder.id}`;
        setOrders(prev => [{
          id: createdOrderDisplayId,
          userId: createdOrder.user_id,
          userName: currentUser.name,
          vendorId: createdOrder.vendor_id,
          productId: createdOrder.product_id,
          productName: createdOrder.product_name,
          size: createdOrder.size,
          color: createdOrder.color,
          quantity: createdOrder.quantity,
          totalAmount: Number(createdOrder.total_amount),
          status: createdOrder.status || 'Pending',
          date: new Date().toISOString(),
          customerName: createdOrder.customer_name,
          phoneNumber: createdOrder.phone_number,
          deliveryAddress: createdOrder.delivery_address,
          note: createdOrder.note || ''
        }, ...prev]);

        return fetch(`${API_BASE_URL}/api/payments/khqr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: createdOrder.id,
            amount: createdOrder.total_amount,
            customer_name: createdOrder.customer_name,
            phone_number: createdOrder.phone_number,
            delivery_address: createdOrder.delivery_address,
            product_id: createdOrder.product_id,
            user_id: createdOrder.user_id,
            product_name: createdOrder.product_name,
            size: createdOrder.size,
            color: createdOrder.color,
            quantity: createdOrder.quantity,
            note: createdOrder.note
          })
        });
      })
      .then(r => r.json())
      .then(data => {
        if (!data || data.error) {
          throw new Error(data?.message || 'Failed to generate KHQR');
        }

        setKhqrPayload(data.khqr);
        setKhqrOrderId(data.order_id);
        setShowKHQRModal(true);
        triggerNotification('Scan the displayed KHQR with Bakong to pay', 'info');

        const pid = setInterval(() => {
          fetch(`${API_BASE_URL}/api/payments/status/${data.order_id}`)
            .then(r => r.json())
            .then(statusData => {
              if (statusData && statusData.paid) {
                setOrders(prev => prev.map(o => o.id === createdOrderDisplayId ? { ...o, status: 'Paid' } : o));
                triggerNotification('Payment received — order marked as Paid', 'success');
                clearInterval(pid);
                setPaymentPollingId(null);
                setShowKHQRModal(false);
                setCart([]);
                setShowCheckoutModal(false);
                setCheckoutPhone('');
                setCheckoutLocation('');
                setCheckoutNote('');
                setCurrentTab('orders');
              }
            })
            .catch(err => {
              console.error('Status poll error', err);
            });
        }, 5000);
        setPaymentPollingId(pid);
      })
      .catch(err => {
        console.error(err);
        triggerNotification(err.message || 'Payment request failed', 'error');
      });
  };

  // Vendor Action: Add New Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSku.trim() || !newProdPrice || !newProdStock) {
      triggerNotification("Please fill in all required fields!", "error");
      return;
    }
    const priceVal = parseFloat(newProdPrice);
    const stockVal = parseInt(newProdStock);
    if (isNaN(priceVal) || priceVal <= 0) {
      triggerNotification("Price must be a valid positive number!", "error");
      return;
    }
    if (isNaN(stockVal) || stockVal < 0) {
      triggerNotification("Stock quantity must be 0 or more!", "error");
      return;
    }

    // Default image mappings
    const defaultImages = {
      Coats: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600",
      Dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
      Shirts: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600",
      Jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600",
      Skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600",
      Sweaters: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600"
    };

    const finalImage = newProdImage.trim() || defaultImages[newProdCategory] || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600";

    const newProductItem = {
      id: products.length + 1,
      name: newProdName,
      sku: newProdSku,
      category: newProdCategory,
      price: priceVal,
      discountPrice: newProdDiscountPrice ? parseFloat(newProdDiscountPrice) : null,
      stock: stockVal,
      description: newProdDescription.trim() || `${newProdName} premium ${newProdCategory.toLowerCase()} collection.`,
      brand: "Azurea Capsule",
      image: finalImage,
      rating: 5.0,
      reviews: 1
    };

    setProducts([newProductItem, ...products]);
    triggerNotification(`Product "${newProdName}" added successfully to catalog!`, "success");
    
    // Reset states
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice('');
    setNewProdDiscountPrice('');
    setNewProdStock('');
    setNewProdDescription('');
    setNewProdImage('');
    setShowAddProductForm(false);
  };

  // Vendor Action: Update Product Stock
  const handleUpdateStock = (productId, newStock) => {
    const stockVal = parseInt(newStock);
    if (isNaN(stockVal) || stockVal < 0) {
      triggerNotification("Please enter a valid stock quantity!", "warning");
      return;
    }

    setProducts(products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: stockVal };
      }
      return p;
    }));
    triggerNotification("Product inventory stock updated successfully!");
  };

  // Admin Action: Cancel Order & Automatic Refund Flow
  const handleAdminCancelOrder = (orderId) => {
    const orderToCancel = orders.find(o => o.id === orderId);
    if (!orderToCancel) return;

    if (orderToCancel.status === 'Cancelled') {
      triggerNotification("Order is already cancelled!", "warning");
      return;
    }

    const refundAmount = orderToCancel.totalAmount;

    // Update order status to Cancelled
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Cancelled' };
      }
      return o;
    }));

    // Replenish stock
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === orderToCancel.productId) {
        return { ...p, stock: p.stock + orderToCancel.quantity };
      }
      return p;
    }));

    triggerNotification(`Order ${orderId} successfully cancelled by Admin. Stock replenished.`, "info");
  };

  // Admin Action: Delete Product completely
  const handleAdminDeleteProduct = (productId) => {
    const prodToDelete = products.find(p => p.id === productId);
    if (!prodToDelete) return;
    setProducts(products.filter(p => p.id !== productId));
    triggerNotification(`Product "${prodToDelete.name}" successfully deleted from catalog!`, "info");
  };


  // Auth Operations
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      triggerNotification("Please fill in all auth credentials!", "warning");
      return;
    }

    if (isRegisterMode) {
      const newUser = {
        id: Math.floor(Math.random() * 1000 + 10),
        name: authName || "New User",
        email: authEmail,
        password: authPassword,
        role: 'user',
      };
      setCurrentUser(newUser);
      setUsers([...users, newUser]);
      triggerNotification(`Customer Registration successful!`, "success");
      setCurrentTab('home');
    } else {
      // Check account exists?
      const existingUser = users.find(u => u.email === authEmail);
      
      if (!existingUser) {
        triggerNotification("Invalid email or password", "error");
        return;
      }

      // Verify Password
      if (existingUser.password !== authPassword) {
        triggerNotification("Invalid password", "error");
        return;
      }

      // Password correct? Yes -> Continue
      setCurrentUser(existingUser);
      triggerNotification("Successfully logged in!", "success");

      // Check User Role
      if (existingUser.role === 'admin') {
        // Open Admin Dashboard
        setCurrentTab('admin');
      } else {
        // Open User Dashboard
        setCurrentTab('home');
      }
    }
  };

  // Admin Actions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'Cancelled') {
      handleAdminCancelOrder(orderId);
      return;
    }

    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
    triggerNotification(`Order ${orderId} status set to ${newStatus}`);
  };

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* MOBILE MENU DRAWER OVERLAY */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop shadow */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Drawer content panel */}
          <div className="relative flex w-4/5 max-w-xs flex-col bg-white h-full shadow-2xl p-6 text-left animate-fade-in z-50">
            {/* Header with Title and Close X */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <span className="text-lg font-black text-slate-900 tracking-wider">AZUREA</span>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* User Quick Info Card if logged in */}
            {currentUser && (
              <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-750">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1">{currentUser.name}</h4>
                    <p className="text-[10px] text-slate-400 capitalize">{currentUser.role} Account</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <div className="flex-grow space-y-4 py-4">
              <button 
                onClick={() => { setCurrentTab('home'); setSelectedProduct(null); setShowMobileMenu(false); }}
                className={`flex items-center justify-start gap-3 w-full py-2.5 px-3 rounded-xl text-sm font-bold transition cursor-pointer ${currentTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-650 hover:bg-slate-50'}`}
              >
                {t('home')}
              </button>

              {currentUser && (
                <>
                  <button 
                    onClick={() => { setCurrentTab('orders'); setShowMobileMenu(false); }}
                    className={`flex items-center justify-start gap-3 w-full py-2.5 px-3 rounded-xl text-sm font-bold transition cursor-pointer ${currentTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-655 hover:bg-slate-50'}`}
                    >
                    {t('orders')}
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('profile'); setShowMobileMenu(false); }}
                    className={`flex items-center justify-start gap-3 w-full py-2.5 px-3 rounded-xl text-sm font-bold transition cursor-pointer ${currentTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-655 hover:bg-slate-50'}`}
                    >
                    {t('profile')}
                  </button>
                  <button 
                    onClick={() => { setShowWishlistModal(true); setShowMobileMenu(false); }}
                    className={`flex items-center justify-start gap-3 w-full py-2.5 px-3 rounded-xl text-sm font-bold transition cursor-pointer ${''}`}
                  >
                    <Heart className="h-4 w-4" /> Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ''}
                  </button>
                </>
              )}

              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => { setCurrentTab('admin'); setShowMobileMenu(false); }}
                  className={`flex items-center justify-start gap-3 w-full py-2.5 px-3 rounded-xl text-sm font-bold transition cursor-pointer ${currentTab === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-655 hover:bg-slate-50'}`}
                >
                  <Shield className="h-4 w-4" /> {t('adminPanel')}
                </button>
              )}
            </div>

            {/* Footer Action buttons: Login / Logout */}
            <div className="pt-4 border-t border-slate-100">
              {currentUser ? (
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthPassword('');
                    setAuthEmail('');
                    triggerNotification("Logged out successfully");
                    setCurrentTab('home');
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Logout Account
                </button>
              ) : (
                <button 
                  onClick={() => { setCurrentTab('auth'); setShowMobileMenu(false); }}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-100 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* DESKTOP HEADER (visible on medium screens and up) */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <button onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }} className="text-2xl font-extrabold text-blue-700 tracking-tight cursor-pointer">
                AZUREA
              </button>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <button onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }} className={`cursor-pointer hover:text-blue-600 ${currentTab === 'home' ? 'text-blue-600 font-semibold' : ''}`}>{t('home')}</button>
                {currentUser && (
                  <>
                    <button onClick={() => setCurrentTab('orders')} className={`cursor-pointer hover:text-blue-600 ${currentTab === 'orders' ? 'text-blue-600 font-semibold' : ''}`}>{t('orders')}</button>
                  </>
                )}
                {/* admin/dashboard moved to mobile menu */}
              </nav>
            </div>

            {/* Right Header Navigation Icons */}
            <div className="flex items-center gap-4">
              
              {/* Search Input in header */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder={t('searchPremium')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-100 rounded-full text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 focus:w-64 transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => { console.log('toggleLang clicked, before=', lang); toggleLang(); }}
                title={lang === 'kh' ? 'Switch to English' : 'ប្ដូរទៅភាសាខ្មែរ'}
                className="p-2 rounded-full border text-sm text-slate-600 hover:bg-slate-50 transition flex items-center justify-center"
              >
                <Globe className="h-5 w-5" />
                <span className="ml-2 text-xs font-bold">{lang === 'kh' ? 'ខ្មែរ' : 'EN'}</span>
              </button>

              {/* Wishlist moved into mobile menu */}

              {/* Shopping Cart */}
              <button onClick={() => setCurrentTab('cart')} className="p-2 text-slate-500 hover:text-blue-600 transition relative cursor-pointer">
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white rounded-full h-4 w-4 text-[9px] font-bold flex items-center justify-center">{cart.reduce((s,i) => s + i.quantity, 0)}</span>
                )}
              </button>

              {/* Profile Menu or Login */}
              {currentUser ? (
                <button onClick={() => setCurrentTab('profile')} className="p-2 text-slate-500 hover:text-blue-600 transition cursor-pointer">
                  <User className="h-5 w-5" />
                </button>
              ) : (
                <button onClick={() => setCurrentTab('auth')} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow hover:bg-blue-700 transition cursor-pointer">
                  {t('login')}
                </button>
              )}
            </div>
          </div>

          {/* MOBILE/PHONE HEADER (strictly matches the screenshot view) */}
          <div className="flex md:hidden items-center justify-between w-full relative">
            {/* Left Icons: Hamburger Menu and Search */}
              <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileMenu(true)}
                className="p-1.5 text-slate-800 hover:text-blue-600 transition cursor-pointer"
              >
                <Menu className="h-6 w-6 stroke-[1.5]" />
              </button>
              <button 
                onClick={() => setShowMobileSearch(prev => !prev)}
                className={`p-1.5 transition cursor-pointer ${showMobileSearch ? 'text-blue-600' : 'text-slate-800 hover:text-blue-650'}`}
              >
                <Search className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Centered Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <button 
                onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }} 
                className="text-lg font-black text-slate-900 tracking-widest font-serif cursor-pointer uppercase"
              >
                AZUREA
              </button>
            </div>

            {/* Right Icons: Cart and Login */}
            <div className="flex items-center gap-2">
              {/* Shopping Cart */}
              <button onClick={() => setCurrentTab('cart')} className="p-1.5 text-slate-800 hover:text-blue-600 transition relative cursor-pointer">
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {cart.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white rounded-full h-4 w-4 text-[8px] font-bold flex items-center justify-center">{cart.reduce((s,i) => s + i.quantity, 0)}</span>
                )}
              </button>

              {/* Mobile wishlist moved into the mobile menu */}
              
              {/* Language Toggle (mobile) */}
              <button
                onClick={() => { console.log('mobile toggleLang clicked, before=', lang); toggleLang(); }}
                title={lang === 'kh' ? 'Switch to English' : 'ប្ដូរទៅភាសាខ្មែរ'}
                className="p-1.5 rounded-full transition cursor-pointer text-slate-800 hover:text-blue-600 flex items-center"
              >
                <Globe className="h-5 w-5 stroke-[1.5]" />
                <span className="ml-2 text-xs font-bold">{lang === 'kh' ? 'ខ្មែរ' : 'EN'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search input expander (premium toggle action) */}
        {showMobileSearch && (
          <div className="md:hidden border-t border-slate-100 bg-slate-50 px-4 py-3 flex items-center gap-2 animate-fade-in text-left">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button 
              onClick={() => { setShowMobileSearch(false); setSearchQuery(''); }}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 px-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* Floating Notifications */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
          <div className={`shadow-xl rounded-xl p-4 flex items-center gap-3 border ${
            notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            notification.type === 'info' ? 'bg-sky-50 border-sky-200 text-sky-800' :
            'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {notification.type === 'error' && <XCircle className="h-5 w-5 text-rose-600" />}
            {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600" />}
            {notification.type === 'info' && <ArrowRightLeft className="h-5 w-5 text-sky-600" />}
            {notification.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: Home Page */}
        {currentTab === 'home' && !selectedProduct && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            {/* Desktop Hero Section */}
            <div className="hidden md:flex relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl overflow-hidden shadow-2xl flex-row items-center justify-between p-8 md:p-16 min-h-[450px]">
              <div className="absolute inset-0 bg-opacity-20 bg-cover bg-center mix-blend-overlay" />
              
              <div className="relative z-10 space-y-6 max-w-xl text-left">
                <span className="inline-block px-3 py-1 bg-blue-500/25 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-200 uppercase tracking-widest">
                  New Arrival • Spring Collection
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Redefining modern elegance.
                </h1>
                <p className="text-blue-100 text-lg md:text-xl font-light">
                  Discover a high-end capsule wardrobe crafted for durability, sleek styling, and comfortable fit.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => {
                    const featured = products.find(p => p.id === 1);
                    if (featured) {
                      setSelectedProduct(featured);
                      setCurrentTab('product');
                    }
                  }} className="bg-white text-blue-900 font-bold px-6 py-3.5 rounded-full shadow-lg hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer">
                    Shop Now <ShoppingCart className="h-4 w-4" />
                  </button>
                  <button onClick={() => {
                    setSelectedCategory('Coats');
                    document.getElementById('catalog-start')?.scrollIntoView();
                  }} className="bg-transparent border-2 border-white/60 text-white hover:border-white font-bold px-6 py-3.5 rounded-full transition cursor-pointer">
                    Browse Coats
                  </button>
                </div>
              </div>

              {/* Render generated image as hero preview */}
              <div className="relative z-10 w-full md:w-1/2 max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" 
                  alt="Premium Fashion Models" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Mobile/Phone Hero Section (looks exactly like the user's screenshot on mobile viewport) */}
            <div className="block md:hidden relative w-full rounded-2xl overflow-hidden shadow-lg text-left">
              {/* Main Model Background Image */}
              <div className="relative w-full aspect-[4/5] bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800" 
                  alt="Fashion Beauty Awards" 
                  className="w-full h-full object-cover brightness-[0.9]"
                />
                {/* Visual Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
                
                {/* Foreground Text */}
                <div className="absolute inset-x-6 top-1/4 space-y-3">
                  <span className="text-white/95 text-xs font-semibold tracking-wider block uppercase">Fashion</span>
                  <h1 className="text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                    Beauty Feast, Fashion Awards
                  </h1>
                  <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-sm max-w-[85%]">
                    Immediately buyers enjoy a lifetime warranty
                  </p>
                  
                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        setSelectedCategory('All');
                        document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white text-slate-900 border border-slate-900/10 font-bold px-6 py-3 rounded-lg text-xs shadow-md transition hover:bg-slate-50 cursor-pointer"
                    >
                      Check Details
                    </button>
                  </div>
                </div>

                {/* Dots indicators centered at bottom of hero */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                  <span className="w-6 h-1 rounded-full bg-white" />
                  <span className="w-2 h-1 rounded-full bg-white/40" />
                  <span className="w-2 h-1 rounded-full bg-white/40" />
                </div>
              </div>

              {/* Horizontal Moving Marquee Ticker (pink/beige background) */}
              <div className="bg-[#ebdcd1] border-y border-orange-200/20 py-2.5 overflow-hidden w-full relative flex items-center">
                <div className="animate-marquee whitespace-nowrap flex gap-8 text-[11px] font-bold text-slate-800 tracking-wider uppercase">
                  <span>80% Off!</span>
                  <span>Fashion Gala: Up to 80% Off!</span>
                  <span>80% Off!</span>
                  <span>Fashion Gala: Up to 80% Off!</span>
                  <span>80% Off!</span>
                  <span>Fashion Gala: Up to 80% Off!</span>
                  <span>80% Off!</span>
                  <span>Fashion Gala: Up to 80% Off!</span>
                  <span>80% Off!</span>
                  <span>Fashion Gala: Up to 80% Off!</span>
                </div>
              </div>
            </div>

            {/* Category selection */}
            <div id="catalog-start" className="space-y-6">
              {/* DESKTOP DISCOVER COLLECTION TITLE */}
              <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-3xl font-extrabold text-slate-900">Discover Our Collection</h2>
                  <p className="text-slate-500 text-sm">Filter premium apparel by collection, category or pricing.</p>
                </div>
              </div>

              {/* MOBILE TRENDY NEW ARRIVALS TITLE (looks exactly like user screenshot) */}
              <div className="flex sm:hidden flex-col items-center text-center space-y-3 px-4 pt-4">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Trendy new arrivals</h2>
                <div className="wavy-line mx-auto" />
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                  Fresh fashion hits the shelves! Revamp your look with our latest trendy items. Keep your style sharp and on-trend with our stylish picks. Shop now!
                </p>
              </div>

              {/* Categories Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => {
                  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice)/product.price)*100) : 0;
                  return (
                    <div 
                      key={product.id} 
                      className="group"
                    >
                      {/* DESKTOP CARD DESIGN (matches current gorgeous styles) */}
                      <div className="hidden sm:flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                        {/* Image Frame */}
                        <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => { setSelectedProduct(product); setCurrentTab('product'); }}>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          
                          {/* Discount Badge */}
                          {discount > 0 && (
                            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                              -{discount}% OFF
                            </span>
                          )}

                          {/* Stock Badge */}
                          {product.stock <= 0 ? (
                            <span className="absolute top-4 right-4 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              Out of Stock
                            </span>
                          ) : product.stock <= 5 ? (
                            <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                              Only {product.stock} Left
                            </span>
                          ) : null}

                          {/* Floating Quick Action */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                                setCurrentTab('product');
                              }} 
                              className="bg-white text-blue-900 px-4 py-2 rounded-full font-bold text-xs shadow-md hover:bg-blue-50 transition cursor-pointer"
                            >
                              Select Details
                            </button>
                          </div>
                        </div>

                        {/* Details Box */}
                        <div className="p-6 flex-grow flex flex-col justify-between text-left space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs text-slate-400">
                              <span>{product.brand}</span>
                              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                                <Star className="h-3 w-3 fill-amber-500" />
                                <span>{product.rating}</span>
                              </div>
                            </div>
                            <h3 
                              className="font-bold text-lg text-slate-800 hover:text-blue-600 transition cursor-pointer line-clamp-1"
                              onClick={() => { setSelectedProduct(product); setCurrentTab('product'); }}
                            >
                              {product.name}
                            </h3>
                            <p className="text-slate-400 text-xs line-clamp-2">{product.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <div className="flex items-baseline gap-2">
                              {product.discountPrice ? (
                                <>
                                  <span className="text-xl font-extrabold text-blue-700">${product.discountPrice.toFixed(2)}</span>
                                  <span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="text-xl font-extrabold text-slate-800">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => toggleWishlist(product)}
                              className={`p-2.5 rounded-full border transition cursor-pointer ${
                                wishlist.some(item => item.id === product.id)
                                  ? 'bg-rose-50 border-rose-100 text-rose-500'
                                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500'
                              }`}
                            >
                              <Heart className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* MOBILE HIGH-FASHION MINIMALIST DESIGN (strictly matches screenshot layout) */}
                      <div 
                        onClick={() => { setSelectedProduct(product); setCurrentTab('product'); }}
                        className="flex sm:hidden flex-col relative aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden cursor-pointer shadow-sm active:scale-95 transition-all duration-300 border border-slate-100/50 animate-fade-in"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                        {/* Elegant bottom gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        
                        {/* Overlay text at bottom-left corner */}
                        <div className="absolute bottom-3 left-3 text-left space-y-0.5 max-w-[85%]">
                          <h4 className="text-sm font-extrabold text-white leading-tight drop-shadow-sm uppercase">
                            {product.discountPrice ? 'Flash Sale' : product.id % 2 === 0 ? '30% Off All Items' : 'Exclusive Brand'}
                          </h4>
                          <p className="text-[10px] text-white/95 font-medium drop-shadow-xs truncate">
                            {product.discountPrice ? 'New arrivals, trendsetting' : 'Grab limited offers'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800">No Premium Items Found</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">Try resetting your filters or keyword query to explore other elegant styles.</p>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange(300); }}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Premium Marketing Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 text-left">
              <div className="bg-slate-900 rounded-3xl p-8 flex flex-col justify-between items-start text-white space-y-6">
                <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase">Platform Control</span>
                <h3 className="text-2xl font-black text-white">Centralized Management System</h3>
                <p className="text-slate-400 text-sm">Super Administrator dashboard access. Instantly manage orders and catalog operations centrally.</p>
                <button onClick={() => setCurrentTab('auth')} className="bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer">
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Product Detail System */}
        {currentTab === 'product' && selectedProduct && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-12 shadow-sm text-left">
            
            {/* Back to Home Button */}
            <button 
              onClick={() => { setSelectedProduct(null); setCurrentTab('home'); }} 
              className="text-xs text-slate-500 font-bold flex items-center gap-1 hover:text-blue-600 mb-8 cursor-pointer"
            >
              ← Back to Catalog Collection
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Product Gallery */}
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {/* Gallery Sub-items */}
                  <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 border-blue-500 cursor-pointer">
                    <img src={selectedProduct.image} alt="main view" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-not-allowed opacity-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    Front Side
                  </div>
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-not-allowed opacity-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    Back Side
                  </div>
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-not-allowed opacity-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    Model Fit
                  </div>
                </div>
              </div>

              {/* Product Info Selection */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* Brand & SKU */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{selectedProduct.brand}</span>
                    <span className="text-xs text-slate-400">SKU: <strong className="font-mono text-slate-600">{selectedProduct.sku}</strong></span>
                  </div>

                  {/* Name */}
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                    {selectedProduct.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <Star className="h-4 w-4 fill-amber-500" />
                      <Star className="h-4 w-4 fill-amber-500" />
                      <Star className="h-4 w-4 fill-amber-500" />
                      <Star className="h-4 w-4 fill-amber-500 text-slate-200" />
                      <span className="ml-1 text-sm font-bold text-slate-800">{selectedProduct.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">({selectedProduct.reviews.length} Verified Customer Reviews)</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3 pt-2">
                    {selectedProduct.discountPrice ? (
                      <>
                        <span className="text-3xl font-black text-blue-700">${selectedProduct.discountPrice.toFixed(2)}</span>
                        <span className="text-base text-slate-400 line-through">${selectedProduct.price.toFixed(2)}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">
                          Save ${(selectedProduct.price - selectedProduct.discountPrice).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-black text-slate-800">${selectedProduct.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed pt-2">
                    {selectedProduct.description}
                  </p>

                  <hr className="border-slate-100 my-2" />

                  {/* VARIANT 1: Size Selection */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      <span>Select Size:</span>
                      <span className="text-blue-600 hover:underline cursor-pointer normal-case">Size Chart Guide</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[45px] h-[45px] text-sm font-bold rounded-xl border flex items-center justify-center transition cursor-pointer ${
                            selectedSize === size
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VARIANT 2: Color Selection */}
                  <div className="space-y-2 pt-2">
                    <span className="block text-xs font-semibold uppercase text-slate-500 tracking-wider">Select Color:</span>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            selectedColor === color
                              ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-2 pt-2">
                    <span className="block text-xs font-semibold uppercase text-slate-500 tracking-wider">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                          className="p-3 text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 font-extrabold text-sm">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)} 
                          className="p-3 text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-slate-400">Available Stock: <strong className="text-slate-600">{selectedProduct.stock} units</strong></span>
                    </div>
                  </div>

                </div>

                {/* Bottom CTA Buttons */}
                <div className="space-y-3 pt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      disabled={selectedProduct.stock <= 0}
                      className="flex-grow bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="h-5 w-5" /> Add to Shopping Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-4 rounded-2xl border transition cursor-pointer ${
                        wishlist.some(item => item.id === selectedProduct.id)
                          ? 'bg-rose-50 border-rose-100 text-rose-500'
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Product Reviews */}
            <div className="mt-16 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Verified Customer Reviews</h3>
              <div className="space-y-6">
                {selectedProduct.reviews.map(rev => (
                  <div key={rev.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm text-slate-800">{rev.user}</strong>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Shopping Cart */}
        {currentTab === 'cart' && (
          <div className="space-y-8 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Your Shopping Cart</h2>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="h-20 w-16 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                          <div className="flex flex-wrap gap-2 text-xs font-semibold">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Size: {item.size}</span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Color: {item.color}</span>
                          </div>
                          <div className="text-sm font-extrabold text-blue-700 pt-1">
                            ${(item.discountPrice || item.price).toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Qty Selectors */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button onClick={() => updateCartQty(index, -1)} className="p-2 cursor-pointer text-slate-500 hover:text-slate-900"><Minus className="h-3 w-3" /></button>
                          <span className="px-3 text-xs font-extrabold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(index, 1)} className="p-2 cursor-pointer text-slate-500 hover:text-slate-900"><Plus className="h-3 w-3" /></button>
                        </div>

                        {/* Remove */}
                        <button onClick={() => removeCartItem(index)} className="p-2 text-slate-400 hover:text-rose-500 cursor-pointer">
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Checkout Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 h-fit">
                  <h3 className="font-extrabold text-lg text-slate-950 pb-3 border-b border-slate-100">Order Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Bag Subtotal:</span>
                      <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Shipping Delivery:</span>
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">FREE</span>
                    </div>
                    <hr className="border-slate-100 my-2" />
                    
                    <div className="flex justify-between text-base font-extrabold">
                      <span>Estimated Total:</span>
                      <span className="text-xl text-blue-700">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>


                  {/* Checkout Button */}
                  {!currentUser ? (
                    <button
                      onClick={() => setCurrentTab('auth')}
                      className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Login to Checkout
                    </button>
                  ) : currentUser.role === 'admin' ? (
                    <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200 font-medium">
                      Admin accounts cannot purchase items. Switch to Customer persona to complete transaction.
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCheckoutFullName(currentUser.name || '');
                        setShowCheckoutModal(true);
                      }}
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Proceed to Checkout <ArrowRightLeft className="h-4.5 w-4.5" />
                    </button>
                  )}

                  <button 
                    onClick={() => { setSelectedProduct(null); setCurrentTab('home'); }}
                    className="w-full text-center text-xs text-slate-400 font-semibold hover:underline"
                  >
                    Continue Shopping
                  </button>

                </div>

              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 space-y-4 max-w-lg mx-auto">
                <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">Your Shopping Cart is Empty</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">Looks like you haven't added any designer items to your fashion bag yet.</p>
                <button 
                  onClick={() => { setSelectedProduct(null); setCurrentTab('home'); }}
                  className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer text-sm"
                >
                  Start Shopping
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 5: Order History & Tracking */}
        {currentTab === 'orders' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Your Orders & Billing</h2>
              <p className="text-slate-500 text-sm">Monitor order fulfillment logs, size metrics, and tracking statuses.</p>
            </div>

            <div className="space-y-6">
              {orders.filter(o => o.userId === currentUser.id).length > 0 ? (
                orders.filter(o => o.userId === currentUser.id).map(order => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 text-sm">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Order Identifer:</span>
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-slate-900">{order.id}</strong>
                          <span className="text-xs text-slate-400">Placed on: {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Status pill */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Paid' ? 'bg-emerald-50 text-emerald-800' :
                        order.status === 'Processing' ? 'bg-blue-50 text-blue-800 animate-pulse' :
                        order.status === 'Completed' ? 'bg-slate-100 text-slate-800' :
                        order.status === 'Cancelled' ? 'bg-rose-50 text-rose-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        Status: {order.status}
                      </span>
                    </div>

                    {/* Order details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-2 flex items-center gap-4">
                        <div className="h-16 w-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {/* Fetch product image */}
                          <img src={products.find(p => p.id === order.productId)?.image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100"} alt="apparel thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800">{order.productName}</h4>
                          <div className="flex gap-3 text-xs text-slate-500">
                            <span>Size Selection: <strong className="text-slate-700">{order.size}</strong></span>
                            <span>Color: <strong className="text-slate-700">{order.color}</strong></span>
                            <span>Qty: <strong className="text-slate-700">{order.quantity}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-center">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Total Paid Amount:</span>
                        <strong className="text-xl text-blue-700">${order.totalAmount.toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Delivery & Checkout Details */}
                    {order.customerName && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase">Recipient Name:</span>
                          <strong className="text-slate-700 text-sm mt-0.5 block">{order.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase">Contact Phone:</span>
                          <strong className="text-slate-700 text-sm mt-0.5 block">{order.phoneNumber}</strong>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 font-semibold block uppercase">Delivery Location / Address:</span>
                          <strong className="text-slate-700 text-sm mt-0.5 block">{order.deliveryAddress}</strong>
                        </div>
                        {order.note && (
                          <div className="sm:col-span-2 md:col-span-4 border-t border-slate-200/60 pt-2.5">
                            <span className="text-slate-400 font-semibold block uppercase">Optional Note:</span>
                            <span className="text-slate-600 mt-0.5 block italic">"{order.note}"</span>
                          </div>
                        )}
                        <div className="sm:col-span-2 md:col-span-4 border-t border-slate-200/60 pt-2.5 flex items-center gap-1.5">
                          <span className="text-slate-400 font-semibold uppercase">Payment Method:</span>
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-[10px] uppercase border border-blue-100">{order.paymentMethod || 'Paid'}</span>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 space-y-4 max-w-lg mx-auto">
                  <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-800">No Purchase History</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">You have not completed any orders yet.</p>
                  <button 
                    onClick={() => { setSelectedProduct(null); setCurrentTab('home'); }}
                    className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer text-sm"
                  >
                    Explore Trendy Clothing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}



        {/* TAB 7: Admin Panel */}
        {/* TAB 7: Admin Panel */}
        {currentTab === 'admin' && currentUser.role === 'admin' && (
          <div className="space-y-8 text-left animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Super Administrator Control Center</h2>
                <p className="text-sm text-slate-500 font-medium">Manage catalog products, user accounts, orders, and financial transactions.</p>
              </div>

              {/* Sub-tabs switchers */}
              <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 max-w-fit gap-1 text-xs font-bold text-slate-600 shadow-inner">
                <button
                  onClick={() => setAdminTab('dashboard')}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${adminTab === 'dashboard' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/40' : 'hover:bg-slate-50/80 hover:text-slate-800'}`}
                >
                  <BarChart2 className="h-3.5 w-3.5" /> Dashboard
                </button>
                <button
                  onClick={() => setAdminTab('products')}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${adminTab === 'products' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/40' : 'hover:bg-slate-50/80 hover:text-slate-800'}`}
                >
                  Products ({products.length})
                </button>
                <button
                  onClick={() => setAdminTab('orders')}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${adminTab === 'orders' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/40' : 'hover:bg-slate-50/80 hover:text-slate-800'}`}
                >
                  Orders ({orders.length})
                </button>
                <button
                  onClick={() => setAdminTab('users')}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${adminTab === 'users' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/40' : 'hover:bg-slate-50/80 hover:text-slate-800'}`}
                >
                  Users ({users.length})
                </button>
                <button
                  onClick={() => setAdminTab('transactions')}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${adminTab === 'transactions' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/40' : 'hover:bg-slate-50/80 hover:text-slate-800'}`}
                >
                  Ledger ({transactions.length})
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Store Products</span>
                <strong className="text-2xl text-blue-700 font-black">{products.length} Items</strong>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Customer Orders</span>
                <strong className="text-2xl text-slate-800 font-black">{orders.length} Logged</strong>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Total Users</span>
                <strong className="text-2xl text-violet-700 font-black">{users.length} Active</strong>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Platform Ledger</span>
                <strong className="text-2xl text-emerald-600 font-black">{transactions.length} Logged</strong>
              </div>
            </div>

            {/* ── DASHBOARD ANALYTICS ─────────────────────────────── */}
            {adminTab === 'dashboard' && (() => {
              const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0);
              const totalOrders  = orders.length;
              const totalUsers   = users.filter(u => u.role === 'user').length;
              const totalProducts = products.length;

              // Sales by category
              const catSales = products.reduce((acc, p) => {
                const cat = p.category || 'Other';
                const catOrders = orders.filter(o => o.productId === p.id && o.status !== 'Cancelled');
                const revenue = catOrders.reduce((s, o) => s + o.totalAmount, 0);
                acc[cat] = (acc[cat] || 0) + revenue;
                return acc;
              }, {});
              const categoryData = Object.entries(catSales).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

              // Order status breakdown
              const statusCount = orders.reduce((acc, o) => {
                acc[o.status] = (acc[o.status] || 0) + 1;
                return acc;
              }, {});
              const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

              // Monthly revenue (mock trend based on orders)
              const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              const monthlyData = monthNames.map((month, i) => {
                const monthOrders = orders.filter(o => new Date(o.date).getMonth() === i && o.status !== 'Cancelled');
                return { month, revenue: parseFloat(monthOrders.reduce((s, o) => s + o.totalAmount, 0).toFixed(2)) };
              });

              // Top products by revenue
              const prodRevenue = products.map(p => {
                const rev = orders.filter(o => o.productId === p.id && o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0);
                return { name: p.name?.length > 18 ? p.name.slice(0, 18) + '…' : p.name, revenue: parseFloat(rev.toFixed(2)) };
              }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

              // Top customers by spend
              const custSpend = users.filter(u => u.role === 'user').map(u => {
                const spent = orders.filter(o => o.userId === u.id && o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0);
                return { name: u.name, spent: parseFloat(spent.toFixed(2)) };
              }).sort((a, b) => b.spent - a.spent).slice(0, 4);

              const PIE_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'];
              const STATUS_COLORS = { Pending:'#f59e0b', Paid:'#3b82f6', Processing:'#6366f1', Completed:'#10b981', Cancelled:'#ef4444' };

              return (
                <div className="space-y-6 animate-fade-in">

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign className="h-5 w-5" />, color: 'from-indigo-500 to-indigo-700', light: 'bg-indigo-50 text-indigo-700' },
                      { label: 'Total Orders', value: totalOrders, icon: <ShoppingBag className="h-5 w-5" />, color: 'from-blue-500 to-blue-700', light: 'bg-blue-50 text-blue-700' },
                      { label: 'Customers', value: totalUsers, icon: <Users className="h-5 w-5" />, color: 'from-violet-500 to-violet-700', light: 'bg-violet-50 text-violet-700' },
                      { label: 'Products Listed', value: totalProducts, icon: <Package className="h-5 w-5" />, color: 'from-emerald-500 to-emerald-700', light: 'bg-emerald-50 text-emerald-700' },
                    ].map(kpi => (
                      <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.light}`}>
                          {kpi.icon}
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{kpi.label}</p>
                          <p className="text-2xl font-black text-slate-800">{kpi.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Row 2: Monthly Revenue Bar + Order Status Pie */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-500" />Monthly Revenue</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData} barSize={22}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                          <Tooltip formatter={v => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4">Order Status</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                            {statusData.map((entry, i) => (
                              <Cell key={i} fill={STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Row 3: Top Products Bar + Category Pie + Top Customers Bar */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4">Top 5 Products by Revenue</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={prodRevenue} layout="vertical" barSize={14}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
                          <Tooltip formatter={v => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4">Sales by Category</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={categoryData.length ? categoryData : [{name:'No Data', value:1}]} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                            {(categoryData.length ? categoryData : [{name:'No Data', value:1}]).map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={v => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4">Top Customers by Spend</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={custSpend} barSize={20}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                          <Tooltip formatter={v => [`$${v}`, 'Total Spent']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                            {custSpend.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Row 4: Recent Orders Table */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100">
                            {['Order ID','Customer','Product','Amount','Status','Date'].map(h => (
                              <th key={h} className="text-left py-2 px-3 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 6).map(o => (
                            <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                              <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{o.id}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-700">{o.userName}</td>
                              <td className="py-2.5 px-3 text-slate-500 max-w-[150px] truncate">{o.productName}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-800">${o.totalAmount.toFixed(2)}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                  o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                  o.status === 'Paid'      ? 'bg-blue-100 text-blue-700' :
                                  o.status === 'Processing'? 'bg-violet-100 text-violet-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>{o.status}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">{new Date(o.date).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Sub-tab view: Products */}
            {adminTab === 'products' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-1.5"><Layers className="h-5 w-5 text-blue-600" /> Platform Catalog Inventory</h3>
                  <button 
                    onClick={() => setShowAddProductForm(!showAddProductForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    {showAddProductForm ? 'Close Add Form' : '+ Add Catalog Product'}
                  </button>
                </div>

                {showAddProductForm && (
                  <form onSubmit={handleAddProduct} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 text-left animate-slide-down">
                    <strong className="text-sm font-bold text-slate-700 block border-b border-slate-200/60 pb-2">Add New Designer Apparel</strong>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Product Name <span className="text-rose-500">*</span>:</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Azurea Classic Trench Coat"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* SKU */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">SKU <span className="text-rose-500">*</span>:</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. AZ-TC-001"
                          value={newProdSku}
                          onChange={(e) => setNewProdSku(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Category <span className="text-rose-500">*</span>:</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        >
                          <option value="Coats">Winter Coats</option>
                          <option value="Dresses">Evening Dresses</option>
                          <option value="Shirts">Linen Shirts</option>
                          <option value="Jackets">Denim Jackets</option>
                          <option value="Skirts">Midi Skirts</option>
                          <option value="Sweaters">Cashmere Sweaters</option>
                        </select>
                      </div>

                      {/* Stock */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Stock Quantity <span className="text-rose-500">*</span>:</label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="e.g. 15"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Retail Price ($) <span className="text-rose-500">*</span>:</label>
                        <input
                          type="number"
                          required
                          min="1"
                          step="0.01"
                          placeholder="e.g. 120.00"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* Discount Price */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Discount Price ($):</label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="e.g. 99.99"
                          value={newProdDiscountPrice}
                          onChange={(e) => setNewProdDiscountPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* Image URL */}
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Product Image URL (Optional):</label>
                        <input
                          type="url"
                          placeholder="Leave blank to use a high-quality category default placeholder"
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Description:</label>
                        <textarea
                          rows="2"
                          placeholder="Write key features, materials used, fitting, etc."
                          value={newProdDescription}
                          onChange={(e) => setNewProdDescription(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800 resize-none"
                        />
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProductForm(false)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        Save Apparel <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-12 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <strong className="text-sm text-slate-800 block line-clamp-1">{p.name}</strong>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">{p.category} | SKU: {p.sku}</span>
                          <strong className="text-xs text-blue-700 block">${p.discountPrice || p.price}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Stock Adjustment */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stock</span>
                          <input
                            type="number"
                            min="0"
                            defaultValue={p.stock}
                            onBlur={(e) => handleUpdateStock(p.id, e.target.value)}
                            className="w-12 px-1 py-1 bg-white border border-slate-250 rounded-lg text-xs text-center font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleAdminDeleteProduct(p.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-100 transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab view: Orders */}
            {adminTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-fade-in">
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-1.5"><Settings className="h-5 w-5 text-blue-600" /> Platform Orders Manager</h3>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2 text-xs text-left max-w-xl">
                          <div className="flex items-center gap-2">
                            <strong className="font-mono text-sm text-slate-900 block">{order.id}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{new Date(order.date).toLocaleDateString()}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              order.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-slate-200 text-slate-800'
                            }`}>{order.status}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="block text-slate-800 font-bold text-sm">{order.productName} ({order.size} | {order.color}) • Qty: {order.quantity}</span>
                            <span className="block text-slate-400">Buyer: <strong className="text-slate-600">{order.userName}</strong> • Cost Amount: <strong className="text-blue-700">${order.totalAmount.toFixed(2)}</strong></span>
                          </div>

                          {order.customerName && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 space-y-1 mt-2 text-left">
                              <span className="block font-semibold text-slate-700">Fulfillment details:</span>
                              <span className="block">Name: <strong className="text-slate-800">{order.customerName}</strong> | Phone: <strong className="text-slate-800">{order.phoneNumber}</strong></span>
                              <span className="block">Location Address: <strong className="text-slate-800">{order.deliveryAddress}</strong></span>
                              {order.note && <span className="block italic text-slate-500">Note: "{order.note}"</span>}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-stretch gap-2 w-full md:w-fit min-w-[150px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase text-center md:text-right">Set Order Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-400 text-center py-12">
                      No platform order logs registered.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab view: Users */}
            {adminTab === 'users' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-fade-in">
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-1.5"><User className="h-5 w-5 text-blue-600" /> Platform Registered Accounts</h3>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {users.map(u => (
                    <div key={u.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-slate-800">{u.name}</strong>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-violet-100 text-violet-800' : 'bg-blue-100 text-blue-800'
                          }`}>{u.role}</span>
                        </div>
                        <span className="block text-slate-400">{u.email}</span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}

        {/* TAB 8: Profile View */}
        {currentTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-left space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold uppercase shadow">
                {currentUser.name.substring(0,2)}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h3>
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">{currentUser.role} Account</span>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold block uppercase">Email address:</span>
                  <strong className="text-slate-800">{currentUser.email}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold block uppercase">Account Type:</span>
                  <strong className="text-slate-800 capitalize">{currentUser.role}</strong>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => triggerNotification("Profile settings edited", "info")}
                  className="bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-slate-200 transition cursor-pointer"
                >
                  Edit Profile Information
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthPassword('');
                    setAuthEmail('');
                    triggerNotification("Logged out successfully");
                    setCurrentTab('home');
                  }}
                  className="bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout Account
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 9: Authentication */}
        {currentTab === 'auth' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-fade-in text-left">
            <div className="p-8 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900">{isRegisterMode ? 'Create an Account' : 'Welcome Back'}</h2>
                <p className="text-sm text-slate-500">{isRegisterMode ? 'Sign up to access your premium wardrobe.' : 'Sign in to your account.'}</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={authName} 
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      placeholder="e.g. Alex Mercer"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={authEmail} 
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    placeholder="e.g. alex@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={authPassword} 
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 pr-12"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 transition cursor-pointer flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition cursor-pointer mt-2">
                  {isRegisterMode ? 'Register Account' : 'Sign In'}
                </button>
              </form>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setIsRegisterMode(!isRegisterMode)} 
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium cursor-pointer"
                >
                  {isRegisterMode ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Checkout Modal Form */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 relative flex justify-between items-center text-left">
              <div>
                <h3 className="text-xl font-extrabold">Delivery & Checkout Details</h3>
                <p className="text-blue-100 text-xs mt-1">Please enter your checkout details to complete your clothing order.</p>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCheckout(checkoutFullName, checkoutPhone, checkoutLocation, checkoutNote);
            }} className="p-6 space-y-4 text-left">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={checkoutFullName}
                  onChange={(e) => setCheckoutFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 text-sm"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number <span className="text-rose-500">*</span>:</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 text-sm"
                />
              </div>

              {/* Delivery Location / Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Location / Address <span className="text-rose-500">*</span>:</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. 5th Avenue, Suite 100, New York, NY 10001"
                  value={checkoutLocation}
                  onChange={(e) => setCheckoutLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 text-sm resize-none"
                />
              </div>

              {/* Optional Note */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Optional Note:</label>
                <input
                  type="text"
                  placeholder="e.g. Please leave package at front gate"
                  value={checkoutNote}
                  onChange={(e) => setCheckoutNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 text-sm"
                />
              </div>

              {/* Cart Summary Snippet */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 mt-2 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Bag Items:</span>
                  <span className="font-bold text-slate-700">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Estimated Total Amount:</span>
                  <strong className="text-blue-700 text-sm">${cartTotal.toFixed(2)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Complete Order <CheckCircle2 className="h-4.5 w-4.5" />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* KHQR Payment Modal */}
      {showKHQRModal && khqrPayload && (
        <div className="fixed inset-0 bg-slate-900/70 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Pay with Bakong (KHQR)</h3>
              <button onClick={() => { setShowKHQRModal(false); if (paymentPollingId) { clearInterval(paymentPollingId); setPaymentPollingId(null); } }} className="p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"><X className="h-4 w-4 text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-slate-500">Scan this QR with the Bakong app to pay</div>
              <div className="p-4 bg-slate-50 rounded-lg">
                {/* If backend returned a QR image URL, show it. Otherwise convert the QR string to an image URL. */}
                {khqrPayload.qr_image_url ? (
                  <img src={khqrPayload.qr_image_url} alt="KHQR" className="mx-auto" />
                ) : khqrPayload.qr_string ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(khqrPayload.qr_string)}`}
                    alt="KHQR"
                    className="mx-auto"
                  />
                ) : (
                  <div className="text-sm text-rose-600 font-medium">KHQR payload was empty. Check the backend log for the Bakong response.</div>
                )}
              </div>
              <div className="text-xs text-slate-400">Order ID: {khqrOrderId}</div>
              <div className="flex gap-2 justify-center pt-2">
                <button onClick={() => { if (paymentPollingId) { clearInterval(paymentPollingId); setPaymentPollingId(null); } setShowKHQRModal(false); }} className="px-3 py-2 bg-slate-100 rounded">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold">Wishlist ({wishlist.length})</h3>
              <button onClick={() => setShowWishlistModal(false)} className="p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"><X className="h-4 w-4 text-slate-600" /></button>
            </div>
            {wishlist.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {wishlist.map(item => (
                  <div key={item.id} onClick={() => { setSelectedProduct(item); setCurrentTab('product'); setShowWishlistModal(false); }} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:shadow-sm transition">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <div className="font-semibold text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-blue-700">${(item.discountPrice || item.price).toFixed(2)}</strong>
                      <button onClick={(e) => { e.stopPropagation(); setWishlist(wishlist.filter(w => w.id !== item.id)); triggerNotification('Removed from wishlist','info'); }} className="text-rose-600 text-xs px-2 py-1 rounded hover:bg-rose-50">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">No items in your wishlist.</div>
            )}
          </div>
        </div>
      )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20 pt-16 pb-8 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <strong className="text-white text-xl tracking-wider">AZUREA</strong>
            <p className="text-xs font-light text-slate-400 leading-relaxed">
              Premium curated capsule collections with perfect sizing structures and exceptional quality.
            </p>
          </div>
          <div className="space-y-4">
            <strong className="text-white text-sm font-semibold tracking-wider block uppercase">Shop Fashion</strong>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => { setSelectedCategory('Coats'); setCurrentTab('home'); }} className="hover:text-white cursor-pointer transition">Winter Coats</button></li>
              <li><button onClick={() => { setSelectedCategory('Dresses'); setCurrentTab('home'); }} className="hover:text-white cursor-pointer transition">Evening Dresses</button></li>
              <li><button onClick={() => { setSelectedCategory('Shirts'); setCurrentTab('home'); }} className="hover:text-white cursor-pointer transition">Linen Shirts</button></li>
              <li><button onClick={() => { setSelectedCategory('Jackets'); setCurrentTab('home'); }} className="hover:text-white cursor-pointer transition">Denim Jackets</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <strong className="text-white text-sm font-semibold tracking-wider block uppercase">Platform</strong>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => switchRole('admin')} className="hover:text-white cursor-pointer transition">Admin Dashboard</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <strong className="text-white text-sm font-semibold tracking-wider block uppercase">Security & Payments</strong>
            <p className="text-xs font-light text-slate-400 leading-relaxed">
              All transactions are secured locally through double-entry ledger security systems. Money from user is processed through the centralized admin panel.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light">
          <span>&copy; {new Date().getFullYear()} Azurea Premium. All Rights Reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Preferences</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
