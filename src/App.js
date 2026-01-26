import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu, Search, Heart, MessageCircle, Package, ChevronDown, ChevronUp, Grid, List, ArrowUp, Moon, Sun, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Tag, Instagram, Twitter, Facebook, ZoomIn, Settings, User, LogOut, Mail, Lock, Phone } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import AdminPanel from './AdminPanel';

export default function WallArtShop() {
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [checkoutData, setCheckoutData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', cardNumber: '', expiry: '', cvv: '' });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [pageTransition, setPageTransition] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [showCollection, setShowCollection] = useState(false);
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  const [newArrivalIndex, setNewArrivalIndex] = useState(0);
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [specialFilter, setSpecialFilter] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '' });
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const t = { collection: 'Koleksiyon', about: 'Hakkımızda', howItWorks: 'Nasıl Çalışır', faq: 'SSS', search: 'Ürün ara...', cart: 'Sepetim', favorites: 'Favorilerim', addToCart: 'Sepete Ekle', checkout: 'Ödemeye Geç', total: 'Toplam', empty: 'Sepetiniz boş', filters: 'Filtreler', price: 'Fiyat', size: 'Boyut', bestSellers: 'Çok Satanlar', newArrivals: 'Yeni Gelenler', allCollection: 'Tüm Koleksiyon', framed: 'Çerçeveli', unframed: 'Çerçevesiz', inStock: 'Stokta', outOfStock: 'Tükendi', similarProducts: 'Benzer Ürünler', applyCoupon: 'Uygula', newsletter: 'Yeni Koleksiyonlardan Haberdar Olun', subscribe: 'Abone Ol', compare: 'Karşılaştır', recentlyViewed: 'Son Görüntülenenler', orderHistory: 'Sipariş Geçmişi' };

  const theme = {
    bg: darkMode ? 'bg-stone-900' : 'bg-stone-50', bgSecondary: darkMode ? 'bg-stone-800' : 'bg-white', bgTertiary: darkMode ? 'bg-stone-950' : 'bg-stone-100',
    text: darkMode ? 'text-white' : 'text-stone-900', textSecondary: darkMode ? 'text-stone-400' : 'text-stone-600', textMuted: darkMode ? 'text-stone-500' : 'text-stone-400',
    border: darkMode ? 'border-stone-700' : 'border-stone-200', card: darkMode ? 'bg-stone-800/50 border-stone-700/50' : 'bg-white border-stone-200',
    input: darkMode ? 'bg-stone-800 border-stone-700 text-white placeholder-stone-500' : 'bg-white border-stone-300 text-stone-900', accent: '#e8dcc4',
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const firebaseProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(firebaseProducts);
    } catch (error) {
      console.error('Firebase hatası:', error);
      setProducts([]);
    }
    setIsLoading(false);
  };

  const loadUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        setFavorites(userDoc.data().favorites || []);
      }
    } catch (error) { console.error('Profil yükleme hatası:', error); }
  };

  const loadUserOrders = async (userId) => {
    try {
      const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);
      setUserOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error('Siparişler yüklenirken hata:', error); }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setUserOrders([]);
      setFavorites([]);
      setShowProfile(false);
    } catch (error) { console.error('Çıkış hatası:', error); }
  };

  useEffect(() => {
    fetchProducts();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser.uid);
        await loadUserOrders(currentUser.uid);
      }
    });
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); unsubscribe(); };
  }, []);

  const addToCart = (product, isFramed) => {
    let price;
    const size = product.selectedSize || '50x70';
    if (size === '30x40') {
      price = isFramed ? (product.price30x40Framed || Math.round(product.priceFramed * 0.7)) : (product.price30x40Unframed || Math.round(product.priceUnframed * 0.7));
    } else {
      price = isFramed ? (product.price50x70Framed || product.priceFramed) : (product.price50x70Unframed || product.priceUnframed);
    }
    const discountedPrice = product.discount > 0 ? Math.round(price * (1 - product.discount / 100)) : price;
    const quantity = product.quantity || 1;
    const cartId = `${product.id}-${size}-${isFramed}`;
    const cartItem = { ...product, isFramed, selectedSize: size, price: discountedPrice, cartId };
    const existing = cart.find(item => item.cartId === cartId);
    if (existing) {
      setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...cartItem, quantity }]);
    }
    setSelectedProduct(null);
  };

  const updateQuantity = (cartId, change) => setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item).filter(item => item.quantity > 0));

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;500&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className={`${theme.bgTertiary} sticky top-0 z-40 border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`lg:hidden ${theme.textSecondary}`}><Menu size={24} /></button>
            <button onClick={() => { setShowCollection(false); setSelectedProduct(null); }} className="hover:opacity-80 transition">
              <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-8" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${theme.textSecondary}`}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary}`}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (Özetlenmiş) */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Ürün Listeleme Buraya Gelecek */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="cursor-pointer" onClick={() => setSelectedProduct({...product, selectedSize: '50x70', selectedFrame: 'Çerçevesiz', quantity: 1})}>
              <img src={product.images?.[0]} alt={product.name} className="aspect-[3/4] object-cover mb-2" />
              <h3 className={`text-sm ${theme.text}`}>{product.name}</h3>
              <p className={`text-xs ${theme.textMuted}`}>{product.priceUnframed} TL</p>
            </div>
          ))}
        </div>
      </main>

      {/* ÜRÜN DETAY MODALI (Düzeltilen Kısım) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${theme.bgSecondary} w-full max-w-4xl max-h-[90vh] overflow-y-auto relative rounded-sm shadow-2xl flex flex-col md:flex-row`}>
            <button onClick={() => setSelectedProduct(null)} className={`absolute top-4 right-4 z-10 p-2 ${theme.textSecondary} hover:${theme.text}`}><X size={24} /></button>
            
            {/* Görsel Alanı */}
            <div className="w-full md:w-1/2 bg-stone-100">
              <img src={selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-full h-full object-cover aspect-[3/4]" />
            </div>

            {/* İçerik Alanı */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <p className={`text-[10px] tracking-[0.3em] uppercase mb-2 ${theme.textMuted}`}>LUUZ POSTER</p>
              <h2 className={`text-3xl font-light mb-4 ${theme.text}`} style={{fontFamily: "'Raleway', sans-serif"}}>{selectedProduct.name}</h2>
              <p className={`text-xl mb-8 ${theme.text}`}>
                {selectedProduct.selectedSize === '30x40' ? selectedProduct.price30x40Unframed : selectedProduct.price50x70Unframed} TL - {selectedProduct.selectedSize === '30x40' ? selectedProduct.price30x40Framed : selectedProduct.price50x70Framed} TL
              </p>

              {/* BOYUT SEÇİMİ - DÜZELTİLDİ */}
              <div className="mb-8">
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${theme.textSecondary}`}>BOYUT</p>
                <div className="flex gap-3">
                  {['30x40 cm', '50x70 cm'].map((size) => {
                    const cleanSize = size.split(' ')[0];
                    const isSelected = selectedProduct.selectedSize === cleanSize;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedProduct({ ...selectedProduct, selectedSize: cleanSize })}
                        className={`px-6 py-3 text-xs font-bold border transition-all duration-300 ${
                          isSelected
                            ? (darkMode ? 'bg-white text-stone-900 border-white' : 'bg-stone-900 text-white border-stone-900')
                            : `bg-transparent ${theme.border} ${theme.textSecondary} hover:border-stone-400`
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ÇERÇEVE SEÇİMİ - DÜZELTİLDİ */}
              <div className="mb-8">
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${theme.textSecondary}`}>ÇERÇEVE</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Çerçevesiz', 'Ahşap', 'Siyah', 'Beyaz'].map((frame) => {
                    const isSelected = selectedProduct.selectedFrame === frame;
                    return (
                      <button
                        key={frame}
                        onClick={() => setSelectedProduct({ ...selectedProduct, selectedFrame: frame })}
                        className={`py-3 text-[10px] font-bold uppercase border transition-all duration-300 ${
                          isSelected
                            ? (darkMode ? 'bg-white text-stone-900 border-white' : 'bg-stone-900 text-white border-stone-900')
                            : `bg-transparent ${theme.border} ${theme.textSecondary} hover:border-stone-400`
                        }`}
                      >
                        {frame}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEPETE EKLE - DÜZELTİLDİ */}
              <div className="flex flex-col gap-4">
                <div className={`flex items-center w-32 border ${theme.border}`}>
                  <button onClick={() => setSelectedProduct({...selectedProduct, quantity: Math.max(1, (selectedProduct.quantity || 1) - 1)})} className={`p-3 ${theme.text}`}><Minus size={14} /></button>
                  <span className={`flex-1 text-center text-sm ${theme.text}`}>{selectedProduct.quantity || 1}</span>
                  <button onClick={() => setSelectedProduct({...selectedProduct, quantity: (selectedProduct.quantity || 1) + 1})} className={`p-3 ${theme.text}`}><Plus size={14} /></button>
                </div>
                <button
                  onClick={() => addToCart(selectedProduct, selectedProduct.selectedFrame !== 'Çerçevesiz')}
                  className={`w-full py-5 text-[11px] font-bold uppercase tracking-[0.4em] transition-all ${
                    darkMode ? 'bg-white text-stone-900 hover:bg-stone-200' : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  SEPETE EKLE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer vb. Alt Kısımlar... */}
    </div>
  );
}
