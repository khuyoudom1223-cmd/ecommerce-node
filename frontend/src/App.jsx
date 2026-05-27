import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Heart, User, Shield, Layers, 
  Search, Star, Plus, Minus, X, Trash2, CheckCircle2, 
  ArrowRightLeft, AlertCircle, ShoppingCart, RefreshCw,
  LogOut, PlusCircle, Settings, Edit3, Check, XCircle, Eye, EyeOff,
  TrendingUp, Package, Users, DollarSign, BarChart2, Menu, Globe,
  ChevronDown, MapPin, Building2, Home, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { INITIAL_PRODUCTS, CATEGORIES } from './mockData';
import {
  getProvinces,
  getDistricts,
  getCommunes,
  getVillages,
  formatAddress,
  getStats,
} from 'kh-address';

const CAMBODIA_COUNTRY_LABEL = {
  en: 'Cambodia',
  km: 'កម្ពុជា'
};

const ADMIN_LEVEL_LABELS = {
  province: { en: 'Province / City', km: 'រាជធានី / ខេត្ត' },
  district: { en: 'District / Khan / Srok', km: 'ស្រុក / ខណ្ឌ' },
  commune: { en: 'Commune / Sangkat', km: 'ឃុំ / សង្កាត់' },
  village: { en: 'Village / Phum', km: 'ភូមិ' }
};

const formatLocalizedName = (name, lang = 'en') => {
  if (!name) return '';
  const primary = lang === 'kh' ? (name.km || name.en) : (name.en || name.km);
  const secondary = lang === 'kh' ? (name.en || name.km) : (name.km || name.en);
  return secondary && secondary !== primary ? `${primary} (${secondary})` : primary;
};

const buildSearchText = (...parts) => parts.filter(Boolean).join(' ').toLowerCase();

function SearchableCombobox({
  label,
  placeholder,
  value,
  options,
  onSelect,
  disabled = false,
  helperText,
  icon: Icon,
  required = false
}) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter(option => {
      const haystack = [option.label, option.description, option.value, option.searchText].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [options, query]);

  return (
    <div className="relative space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}{required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        ) : null}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${Icon ? 'pl-10' : ''}`}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
          disabled={disabled}
          aria-label={`Toggle ${label}`}
        >
          <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled ? (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="max-h-60 overflow-y-auto py-2">
              {filteredOptions.length > 0 ? filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelect(option.value);
                    setQuery(option.label || option.value);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Search className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{option.label}</span>
                </button>
              )) : (
                <div className="px-4 py-6 text-center text-sm text-slate-500">No matching location found.</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
      {helperText ? <p className="text-xs leading-5 text-slate-500">{helperText}</p> : null}
    </div>
  );
}

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

const HERO_SLIDES = [
  {
    tag: "New Arrival • Spring Collection",
    title: "Redefining Modern Elegance",
    description: "Discover a high-end capsule wardrobe crafted for durability, sleek styling, and comfortable fit.",
    desktopImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    bgColor: "from-blue-700 to-indigo-800",
    buttonText: "Shop Now",
    action: 'shop'
  },
  {
    tag: "High Fashion • Editorial Showcase",
    title: "Beauty Feast, Fashion Awards",
    description: "Experience premium designer collections that showcase creativity, precision tailoring, and heritage.",
    desktopImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
    bgColor: "from-purple-800 to-rose-750",
    buttonText: "Check Details",
    action: 'details'
  },
  {
    tag: "Capsule Essentials • Winter Collection",
    title: "Timeless Quality, Perfect Sizing",
    description: "Curated heavy winter coats, cashmere sweaters, and tailoring designed to shield from the elements in style.",
    desktopImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
    bgColor: "from-emerald-800 to-teal-900",
    buttonText: "Browse Coats",
    action: 'coats'
  }
];

export default function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  // Navigation & View
  const [currentTab, setCurrentTab] = useState('home'); // home, product, cart, orders, vendor, admin, profile, auth
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Scroll to top when tab or selected product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab, selectedProduct]);

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
      const raw = localStorage.getItem('current_user') || localStorage.getItem('logged_in_user');
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const token = localStorage.getItem('auth_token');
      const normalizedRole = (parsed?.role || 'user').toString().toLowerCase();
      if (parsed && token && !parsed.token) {
        return { ...parsed, token, role: normalizedRole };
      }
      if (parsed) {
        return { ...parsed, role: normalizedRole };
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        const { password, ...safe } = currentUser;
        localStorage.setItem('current_user', JSON.stringify(safe));
        localStorage.setItem('logged_in_user', JSON.stringify(safe));
        if (safe.token) {
          localStorage.setItem('auth_token', safe.token);
        } else {
          localStorage.removeItem('auth_token');
        }
      } else {
        localStorage.removeItem('current_user');
        localStorage.removeItem('logged_in_user');
        localStorage.removeItem('auth_token');
      }
    } catch (e) {}
  }, [currentUser]);
  
  // DB Mock States: Centralized Users
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem('app_users');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}

    return [
      { id: 1, name: "Alex Mercer",    email: "alex@example.com",    password: "password", role: "user" },
      { id: 3, name: "Super Admin",    email: "admin@sleekcart.com", password: "admin",    role: "admin" },
      { id: 8, name: "Site Admin",     email: "admin@topupgg.com",   password: "admin",    role: "admin" },
      { id: 4, name: "Sofia Chen",     email: "sofia@example.com",   password: "password", role: "user" },
      { id: 5, name: "James Rivera",   email: "james@example.com",   password: "password", role: "user" },
      { id: 6, name: "Priya Sharma",   email: "priya@example.com",   password: "password", role: "user" },
      { id: 7, name: "Michael Torres", email: "michael@example.com", password: "password", role: "user" },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_users', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Autoplay timer for Hero Slide Banner
  useEffect(() => {
    if (currentTab !== 'home' || selectedProduct) return;
    const timer = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlideIndex, currentTab, selectedProduct]);
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

  // DB Mock States: Centralized Transactions
  const [transactions, setTransactions] = useState([
    { id: "TXN-5001", orderId: "ORD-9876", amount: 99.99, status: "Success", date: "2026-05-25T14:30:00Z" },
    { id: "TXN-5002", orderId: "ORD-1012", amount: 99.99, status: "Success", date: "2026-05-09T14:30:00Z" },
    { id: "TXN-5003", orderId: "ORD-1005", amount: 39.99, status: "Success", date: "2026-03-03T15:00:00Z" }
  ]);

  // Temporary Inputs
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Checkout Inputs
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutFullName, setCheckoutFullName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const addressLocale = lang === 'kh' ? 'kh' : 'en';
  const addressStats = useMemo(() => getStats(), []);
  const [checkoutProvinceCode, setCheckoutProvinceCode] = useState('');
  const [checkoutDistrictCode, setCheckoutDistrictCode] = useState('');
  const [checkoutCommuneCode, setCheckoutCommuneCode] = useState('');
  const [checkoutVillageCode, setCheckoutVillageCode] = useState('');
  const [checkoutHouseNumber, setCheckoutHouseNumber] = useState('');
  const [checkoutNote, setCheckoutNote] = useState('');
  const provinceData = useMemo(() => getProvinces(), []);
  const selectedProvinceData = useMemo(
    () => provinceData.find(province => province.code === checkoutProvinceCode) || null,
    [provinceData, checkoutProvinceCode]
  );
  const districtData = useMemo(
    () => (checkoutProvinceCode ? getDistricts(checkoutProvinceCode) : []),
    [checkoutProvinceCode]
  );
  const selectedDistrictData = useMemo(
    () => districtData.find(district => district.code === checkoutDistrictCode) || null,
    [districtData, checkoutDistrictCode]
  );
  const communeData = useMemo(
    () => (checkoutDistrictCode ? getCommunes(checkoutDistrictCode) : []),
    [checkoutDistrictCode]
  );
  const selectedCommuneData = useMemo(
    () => communeData.find(commune => commune.code === checkoutCommuneCode) || null,
    [communeData, checkoutCommuneCode]
  );
  const villageData = useMemo(
    () => (checkoutCommuneCode ? getVillages(checkoutCommuneCode) : []),
    [checkoutCommuneCode]
  );
  const provinceOptions = useMemo(
    () => provinceData.map(province => ({
      value: province.code,
      label: formatLocalizedName(province.name, addressLocale),
      description: ADMIN_LEVEL_LABELS.province[addressLocale],
      searchText: buildSearchText(province.code, province.name.en, province.name.km)
    })),
    [provinceData, addressLocale]
  );
  const districtOptions = useMemo(
    () => districtData.map(district => ({
      value: district.code,
      label: formatLocalizedName(district.name, addressLocale),
      description: ADMIN_LEVEL_LABELS.district[addressLocale],
      searchText: buildSearchText(district.code, district.name.en, district.name.km)
    })),
    [districtData, addressLocale]
  );
  const communeOptions = useMemo(
    () => communeData.map(commune => ({
      value: commune.code,
      label: formatLocalizedName(commune.name, addressLocale),
      description: ADMIN_LEVEL_LABELS.commune[addressLocale],
      searchText: buildSearchText(commune.code, commune.name.en, commune.name.km)
    })),
    [communeData, addressLocale]
  );
  const villageOptions = useMemo(
    () => villageData.map(village => ({
      value: village.code,
      label: formatLocalizedName(village.name, addressLocale),
      description: ADMIN_LEVEL_LABELS.village[addressLocale],
      searchText: buildSearchText(village.code, village.name.en, village.name.km)
    })),
    [villageData, addressLocale]
  );
  const checkoutLocation = useMemo(() => {
    const hierarchy = formatAddress(
      {
        provinceCode: checkoutProvinceCode,
        districtCode: checkoutDistrictCode,
        communeCode: checkoutCommuneCode,
        villageCode: checkoutVillageCode,
      },
      { lang: addressLocale, separator: ' > ', order: ['province', 'district', 'commune', 'village'] }
    );
    const detail = checkoutHouseNumber.trim();
    const countryLabel = CAMBODIA_COUNTRY_LABEL[addressLocale];
    return [countryLabel, hierarchy].filter(Boolean).join(' > ') + (detail ? `, ${detail}` : '');
  }, [addressLocale, checkoutProvinceCode, checkoutDistrictCode, checkoutCommuneCode, checkoutVillageCode, checkoutHouseNumber]);
  const isCheckoutAddressComplete = Boolean(
    checkoutProvinceCode && checkoutDistrictCode && checkoutCommuneCode && checkoutVillageCode && checkoutHouseNumber.trim()
  );
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
  const [newProdImageFile, setNewProdImageFile] = useState(null);
  const [newProdImagePreview, setNewProdImagePreview] = useState('');

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

  const resetCheckoutForm = () => {
    setCheckoutFullName('');
    setCheckoutPhone('');
    setCheckoutProvinceCode('');
    setCheckoutDistrictCode('');
    setCheckoutCommuneCode('');
    setCheckoutVillageCode('');
    setCheckoutHouseNumber('');
    setCheckoutNote('');
  };

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

    triggerNotification('Initiating order and generating KHQR code...', 'info');

    const authHeaders = {};
    try {
      if (currentUser?.token) {
        authHeaders.Authorization = `Bearer ${currentUser.token}`;
      }
    } catch (e) {}

    fetch(`${API_BASE_URL}/api/checkout/generate-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(requestBody)
    })
      .then(r => {
        if (!r.ok) {
          return r.json().then(errData => {
            throw new Error(errData.message || 'Unable to generate QR');
          });
        }
        return r.json();
      })
      .then(data => {
        if (!data || !data.success) {
          throw new Error(data?.message || 'Unable to generate QR');
        }

        const createdOrderDisplayId = `ORD-${data.order_id.toString().slice(-6).toUpperCase()}`;

        // 1. Add pending order to orders list on screen
        setOrders(prev => [{
          id: createdOrderDisplayId,
          userId: currentUser.id,
          userName: currentUser.name,
          productId: cart[0].id,
          productName: cart[0].name,
          size: cart[0].size,
          color: cart[0].color,
          quantity: cart[0].quantity,
          totalAmount: data.amount,
          status: 'Pending',
          date: new Date().toISOString(),
          customerName: fullName || currentUser.name,
          phoneNumber: phone,
          deliveryAddress: location,
          note: note || ''
        }, ...prev]);

        // 2. Set KHQR States
        setKhqrPayload({
          qr_string: data.qr_string,
          qr_image_url: data.qr_image,
          payment_reference: data.payment_reference
        });
        setKhqrOrderId(createdOrderDisplayId);
        setShowKHQRModal(true);
        triggerNotification('QR generated successfully! Scan with Bakong to pay', 'info');

        // Capture cart item data before interval (closure safety)
        const cartProductId = cart[0].id;
        const cartProductQty = cart[0].quantity;

        // 3. Start payment status polling every 3-5 seconds (set to 4s)
        const pid = setInterval(() => {
          const pollHeaders = {};
          try {
            if (currentUser?.token) {
              pollHeaders.Authorization = `Bearer ${currentUser.token}`;
            }
            if (data.payment_reference) {
              pollHeaders['x-payment-reference'] = data.payment_reference;
            }
          } catch (e) {}

          fetch(`${API_BASE_URL}/api/payments/status/${data.order_id}`, {
            headers: pollHeaders
          })
            .then(r => r.json())
            .then(statusData => {
              if (statusData && statusData.paid) {
                // If payment status = Paid:
                // - Update order status to Paid
                setOrders(prev => prev.map(o => o.id === createdOrderDisplayId ? { ...o, status: 'Paid' } : o));
                
                // - Reduce product stock locally in frontend mock state
                setProducts(prevProds => prevProds.map(p => 
                  p.id === cartProductId ? { ...p, stock: Math.max(0, p.stock - cartProductQty) } : p
                ));

                triggerNotification('Order Completed Successfully! Payment received.', 'success');
                clearInterval(pid);
                setPaymentPollingId(null);
                setShowKHQRModal(false);
                setCart([]);
                setShowCheckoutModal(false);
                resetCheckoutForm();
                setCurrentTab('orders');
              }
            })
            .catch(err => {
              console.error('Status poll error', err);
            });
        }, 4000);
        setPaymentPollingId(pid);
      })
      .catch(err => {
        console.error(err);
        triggerNotification(err.message || 'Unable to generate QR', 'error');
      });
  };

  // Vendor Action: Add New Product
  const handleAddProduct = async (e) => {
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

    let finalImage = '';

    if (newProdImageFile) {
      triggerNotification("Uploading product image...", "info");
      
      const formData = new FormData();
      formData.append('image', newProdImageFile);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image. Server error.');
        }
        
        const data = await response.json();
        if (data.success && data.url) {
          finalImage = data.url;
        } else {
          throw new Error(data.message || 'Image upload response was not successful.');
        }
      } catch (err) {
        console.error(err);
        triggerNotification(`Image upload failed: ${err.message}. Using default placeholder.`, "warning");
        
        const defaultImages = {
          Coats: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600",
          Dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
          Shirts: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600",
          Jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600",
          Skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600",
          Sweaters: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600"
        };
        finalImage = defaultImages[newProdCategory] || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600";
      }
    } else {
      const defaultImages = {
        Coats: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600",
        Dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
        Shirts: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600",
        Jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600",
        Skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600",
        Sweaters: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600"
      };
      finalImage = newProdImage.trim() || defaultImages[newProdCategory] || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600";
    }

    const newProductItem = {
      id: products.length + 1,
      name: newProdName,
      sku: newProdSku,
      category: newProdCategory,
      price: priceVal,
      discountPrice: newProdDiscountPrice ? parseFloat(newProdDiscountPrice) : null,
      stock: stockVal,
      description: newProdDescription.trim() || `${newProdName} premium ${newProdCategory.toLowerCase()} collection.`,
      brand: "DOM Studio",
      image: finalImage,
      rating: 5.0,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "White", "Black"],
      reviews: []
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
    setNewProdImageFile(null);
    setNewProdImagePreview('');
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
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = (authEmail || '').trim().toLowerCase();
    const normalizedPassword = (authPassword || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      triggerNotification("Please fill in all auth credentials!", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      triggerNotification("Please enter a valid email address!", "warning");
      return;
    }

    if (normalizedPassword.length < 6) {
      triggerNotification("Password must be at least 6 characters long!", "warning");
      return;
    }

    if (isRegisterMode) {
      const normalizedName = (authName || '').trim();
      if (!normalizedName) {
        triggerNotification("Name is required", "warning");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: normalizedName,
            email: normalizedEmail,
            password: normalizedPassword,
            role: 'User'
          })
        });

        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          triggerNotification(payload?.message || 'Registration failed', 'error');
          return;
        }

        const apiUser = payload?.data?.user;
        const apiToken = payload?.data?.token;
        const sessionUser = {
          id: apiUser?.id || apiUser?._id,
          name: apiUser?.name,
          email: (apiUser?.email || normalizedEmail).toLowerCase(),
          role: (apiUser?.role || 'User').toLowerCase(),
          token: apiToken || null,
        };

        setCurrentUser(sessionUser);
        setUsers(prev => {
          const exists = prev.some(u => (u.email || '').trim().toLowerCase() === sessionUser.email);
          if (exists) {
            return prev.map(u =>
              (u.email || '').trim().toLowerCase() === sessionUser.email
                ? { ...u, ...sessionUser }
                : u
            );
          }
          return [...prev, sessionUser];
        });

        triggerNotification('Customer Registration successful!', 'success');
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setIsRegisterMode(false);
        setSelectedProduct(null);
        setCurrentTab('home');
      } catch (err) {
        triggerNotification('Unable to connect to authentication server', 'error');
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: normalizedEmail,
            password: normalizedPassword,
          })
        });

        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          triggerNotification(payload?.message || 'Invalid email or password', 'error');
          return;
        }

        const apiUser = payload?.data?.user;
        const apiToken = payload?.data?.token;
        const sessionUser = {
          id: apiUser?.id || apiUser?._id,
          name: apiUser?.name,
          email: (apiUser?.email || normalizedEmail).toLowerCase(),
          role: (apiUser?.role || 'User').toLowerCase(),
          token: apiToken || null,
        };

        setCurrentUser(sessionUser);
        setUsers(prev => {
          const exists = prev.some(u => (u.email || '').trim().toLowerCase() === sessionUser.email);
          if (exists) {
            return prev.map(u =>
              (u.email || '').trim().toLowerCase() === sessionUser.email
                ? { ...u, ...sessionUser }
                : u
            );
          }
          return [...prev, sessionUser];
        });

        triggerNotification('Successfully logged in!', 'success');
        setAuthEmail('');
        setAuthPassword('');
        setSelectedProduct(null);
        setCurrentTab('home');
      } catch (err) {
        triggerNotification('Unable to connect to authentication server', 'error');
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
              <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wider">DOM</span>
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
                    setSelectedProduct(null);
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
              <button onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }} className="text-2xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight cursor-pointer">
                DOM
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
                className="text-lg font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-widest cursor-pointer"
              >
                DOM
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
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group min-h-[420px] md:min-h-[480px]">
              
              {/* DESKTOP VIEW SLIDES */}
              <div className="hidden md:block">
                {HERO_SLIDES.map((s, idx) => (
                  <div
                    key={`desktop-${idx}`}
                    className={`absolute inset-0 bg-gradient-to-r ${s.bgColor} p-8 md:p-16 flex flex-row items-center justify-between transition-all duration-700 ease-in-out ${
                      idx === currentSlideIndex 
                        ? 'opacity-100 pointer-events-auto scale-100 translate-x-0' 
                        : 'opacity-0 pointer-events-none scale-95 translate-x-4'
                    }`}
                  >
                    <div className="relative z-10 space-y-6 max-w-xl text-left">
                      <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-white/95 uppercase tracking-widest animate-pulse">
                        {s.tag}
                      </span>
                      <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-sm">
                        {s.title}
                      </h1>
                      <p className="text-white/90 text-base md:text-lg font-light leading-relaxed">
                        {s.description}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button
                          onClick={() => {
                            if (s.action === 'shop') {
                              const featured = products.find(p => p.id === 1);
                              if (featured) {
                                setSelectedProduct(featured);
                                setCurrentTab('product');
                              }
                            } else if (s.action === 'details') {
                              setSelectedCategory('All');
                              document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              setSelectedCategory('Coats');
                              document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-white text-slate-900 hover:bg-slate-50 font-bold px-6 py-3.5 rounded-full shadow-lg transition flex items-center gap-2 cursor-pointer"
                        >
                          {s.buttonText} <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white/10 transform transition-transform duration-1000 ease-out hover:scale-102">
                      <img 
                        src={s.desktopImage} 
                        alt={s.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* MOBILE VIEW SLIDES (aspect-[4/5]) */}
              <div className="block md:hidden">
                {HERO_SLIDES.map((s, idx) => (
                  <div
                    key={`mobile-${idx}`}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      idx === currentSlideIndex 
                        ? 'opacity-100 pointer-events-auto scale-100' 
                        : 'opacity-0 pointer-events-none scale-95'
                    }`}
                  >
                    <div className="relative w-full h-[450px] bg-slate-100">
                      <img 
                        src={s.mobileImage} 
                        alt={s.title} 
                        className="w-full h-full object-cover brightness-[0.85]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
                      
                      <div className="absolute inset-x-6 top-1/4 space-y-3 text-left">
                        <span className="text-white/95 text-xs font-semibold tracking-wider block uppercase">
                          {s.tag.split(' • ')[0]}
                        </span>
                        <h1 className="text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                          {s.title}
                        </h1>
                        <p className="text-white/95 text-sm font-medium leading-relaxed drop-shadow-sm max-w-[90%]">
                          {s.description}
                        </p>
                        
                        <div className="pt-4">
                          <button 
                            onClick={() => {
                              if (s.action === 'shop') {
                                const featured = products.find(p => p.id === 1);
                                if (featured) {
                                  setSelectedProduct(featured);
                                  setCurrentTab('product');
                                }
                              } else if (s.action === 'details') {
                                setSelectedCategory('All');
                                document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
                              } else {
                                setSelectedCategory('Coats');
                                document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="bg-white text-slate-900 border border-slate-900/10 font-bold px-6 py-3 rounded-lg text-xs shadow-md transition hover:bg-slate-50 cursor-pointer"
                          >
                            {s.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows (visible on hover) */}
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/35 hover:bg-black/50 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer animate-fade-in"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/35 hover:bg-black/50 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer animate-fade-in"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    type="button"
                    key={`dot-${idx}`}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
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

                        {/* Discount badge */}
                        {discount > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow-md">
                            -{discount}% OFF
                          </span>
                        )}
                        
                        {/* Overlay text at bottom-left corner */}
                        <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                          <h4 className="text-sm font-extrabold text-white leading-tight drop-shadow-sm uppercase">
                            {product.discountPrice ? 'Flash Sale' : product.id % 2 === 0 ? '30% Off All Items' : 'Exclusive Brand'}
                          </h4>
                          <p className="text-[10px] text-white/95 font-medium drop-shadow-xs truncate">
                            {product.discountPrice ? 'New arrivals, trendsetting' : 'Grab limited offers'}
                          </p>

                          <div className="flex items-center gap-2 pt-0.5">
                            {product.discountPrice ? (
                              <>
                                <span className="text-sm font-extrabold text-white">${product.discountPrice.toFixed(2)}</span>
                                <span className="text-[10px] text-white/80 line-through">${product.price.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-sm font-extrabold text-white">${product.price.toFixed(2)}</span>
                            )}
                          </div>
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
                    <span className="text-xs text-slate-400">({(selectedProduct.reviews || []).length} Verified Customer Reviews)</span>
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
                      {(selectedProduct.sizes || []).map(size => (
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
                      {(selectedProduct.colors || []).map(color => (
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

                      {/* Product Image Option (Upload or URL) */}
                      <div className="md:col-span-2 space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Product Image:</label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* File Upload Section */}
                          <div className="space-y-2">
                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">Option 1: Upload from Device</span>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 hover:border-blue-400 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-4 pb-4 px-2 text-center">
                                  <PlusCircle className="h-6 w-6 text-slate-400 mb-1" />
                                  <p className="text-[11px] text-slate-500 font-medium">Click to upload image</p>
                                  <p className="text-[9px] text-slate-400 mt-0.5">PNG, JPG, WEBP (Max 5MB)</p>
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/png, image/jpeg, image/webp" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      if (file.size > 5 * 1024 * 1024) {
                                        triggerNotification("File is too large! Maximum allowed is 5MB.", "error");
                                        return;
                                      }
                                      setNewProdImageFile(file);
                                      setNewProdImagePreview(URL.createObjectURL(file));
                                      setNewProdImage('');
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Image URL Section */}
                          <div className="space-y-2">
                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">Option 2: Paste Image URL</span>
                            <textarea
                              rows="3"
                              placeholder="https://example.com/image.jpg"
                              value={newProdImage}
                              onChange={(e) => {
                                setNewProdImage(e.target.value);
                                setNewProdImageFile(null);
                                setNewProdImagePreview(e.target.value);
                              }}
                              className="w-full h-24 px-3 py-2 rounded-lg border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800 resize-none placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* Image Preview Area */}
                        {newProdImagePreview && (
                          <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={newProdImagePreview} 
                                alt="Preview" 
                                className="h-14 w-14 rounded-lg object-cover border border-slate-150"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600";
                                }}
                              />
                              <div>
                                <p className="text-[11px] font-bold text-slate-700">Image Selected</p>
                                <p className="text-[9px] text-slate-400 truncate max-w-[200px]">
                                  {newProdImageFile ? newProdImageFile.name : 'Remote URL Link'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setNewProdImageFile(null);
                                setNewProdImagePreview('');
                                setNewProdImage('');
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
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
                    setSelectedProduct(null);
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
            <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/65 p-0 backdrop-blur-xl sm:items-center sm:p-6">
              <div className="relative flex w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] max-w-full sm:max-w-3xl flex-col overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border border-white/70 bg-white/98 shadow-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.24),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.22),_transparent_38%)]" />

            {/* Modal Header */}
                <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 py-4 text-left text-slate-900 backdrop-blur-xl sm:px-6">
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">Checkout</h3>
              </div>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  resetCheckoutForm();
                }}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
                aria-label="Close checkout modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isCheckoutAddressComplete) {
                  triggerNotification('Please complete the Cambodia address selector before placing your order.', 'warning');
                  return;
                }
                handleCheckout(checkoutFullName, checkoutPhone, checkoutLocation, checkoutNote);
              }}
              className="checkout-scrollbar grid min-h-0 flex-1 gap-5 overflow-y-auto scroll-smooth overscroll-contain px-5 pt-5 pb-36 text-left sm:px-6 sm:py-6 sm:pb-6"
            >
              <div className="space-y-4">
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-slate-800">Contact details</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Full name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Mercer"
                        value={checkoutFullName}
                        onChange={(e) => setCheckoutFullName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Phone number <span className="text-rose-500">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +855 12 345 678"
                        value={checkoutPhone}
                        onChange={(e) => setCheckoutPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-slate-800">Address</h4>
                  </div>
                  <div className="space-y-4">
                    <SearchableCombobox
                      label={ADMIN_LEVEL_LABELS.province[addressLocale]}
                      placeholder={addressLocale === 'kh' ? 'ស្វែងរករាជធានី ឬ ខេត្ត' : 'Search province or city'}
                      value={checkoutProvinceCode}
                      options={provinceOptions}
                      onSelect={(provinceCode) => {
                        setCheckoutProvinceCode(provinceCode);
                        setCheckoutDistrictCode('');
                        setCheckoutCommuneCode('');
                        setCheckoutVillageCode('');
                      }}
                      icon={Globe}
                      required
                    />

                    <SearchableCombobox
                      label={ADMIN_LEVEL_LABELS.district[addressLocale]}
                      placeholder={checkoutProvinceCode ? (addressLocale === 'kh' ? 'ស្វែងរកស្រុក / ខណ្ឌ' : 'Search district') : (addressLocale === 'kh' ? 'ជ្រើសរើសរាជធានី ឬ ខេត្តជាមុនសិន' : 'Choose a province first')}
                      value={checkoutDistrictCode}
                      options={districtOptions}
                      onSelect={(districtCode) => {
                        setCheckoutDistrictCode(districtCode);
                        setCheckoutCommuneCode('');
                        setCheckoutVillageCode('');
                      }}
                      disabled={!checkoutProvinceCode}
                      icon={Building2}
                      required
                    />

                    <SearchableCombobox
                      label={ADMIN_LEVEL_LABELS.commune[addressLocale]}
                      placeholder={checkoutDistrictCode ? (addressLocale === 'kh' ? 'ស្វែងរកឃុំ / សង្កាត់' : 'Search commune or sangkat') : (addressLocale === 'kh' ? 'ជ្រើសរើសស្រុក / ខណ្ឌជាមុនសិន' : 'Choose a district first')}
                      value={checkoutCommuneCode}
                      options={communeOptions}
                      onSelect={(communeCode) => {
                        setCheckoutCommuneCode(communeCode);
                        setCheckoutVillageCode('');
                      }}
                      disabled={!checkoutDistrictCode}
                      icon={Layers}
                      required
                    />

                    <SearchableCombobox
                      label={ADMIN_LEVEL_LABELS.village[addressLocale]}
                      placeholder={checkoutCommuneCode ? (addressLocale === 'kh' ? 'ស្វែងរកភូមិ' : 'Search village') : (addressLocale === 'kh' ? 'ជ្រើសរើសឃុំ / សង្កាត់ជាមុនសិន' : 'Choose a commune first')}
                      value={checkoutVillageCode}
                      options={villageOptions}
                      onSelect={setCheckoutVillageCode}
                      disabled={!checkoutCommuneCode}
                      icon={Home}
                      required
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Detailed address <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="House 12, Street 271"
                        value={checkoutHouseNumber}
                        onChange={(e) => setCheckoutHouseNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-slate-800">Note</h4>
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Optional delivery note"
                    value={checkoutNote}
                    onChange={(e) => setCheckoutNote(e.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-slate-200 pt-4 sm:pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowCheckoutModal(false);
                    resetCheckoutForm();
                  }}
                  className="w-1/2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!checkoutPhone.trim() || !isCheckoutAddressComplete}
                  className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
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
            <strong className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent tracking-wider">DOM</strong>
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
            <strong className="text-white text-sm font-semibold tracking-wider block uppercase">Security & Payments</strong>
            <p className="text-xs font-light text-slate-400 leading-relaxed">
              All transactions are secured locally through double-entry ledger security systems. Money from user is processed through the centralized admin panel.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light">
          <span>&copy; 2026 Khuy Oudom. All Rights Reserved.</span>
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
