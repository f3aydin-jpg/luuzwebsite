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
  // eslint-disable-next-line no-unused-vars
  const [showFilters, setShowFilters] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [priceRange, setPriceRange] = useState([0, 1500]);
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [newArrivalIndex, setNewArrivalIndex] = useState(0);
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [specialFilter, setSpecialFilter] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  
  // Üyelik sistemi state'leri
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'profile'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const t = { collection: 'Koleksiyon', about: 'Hakkımızda', howItWorks: 'Nasıl Çalışır', faq: 'SSS', search: 'Ürün ara...', cart: 'Sepetim', favorites: 'Favorilerim', addToCart: 'Sepete Ekle', checkout: 'Ödemeye Geç', total: 'Toplam', empty: 'Sepetiniz boş', filters: 'Filtreler', price: 'Fiyat', size: 'Boyut', bestSellers: 'Çok Satanlar', newArrivals: 'Yeni Gelenler', allCollection: 'Tüm Koleksiyon', framed: 'Çerçeveli', unframed: 'Çerçevesiz', inStock: 'Stokta', outOfStock: 'Tükendi', similarProducts: 'Benzer Ürünler', applyCoupon: 'Uygula', newsletter: 'Yeni Koleksiyonlardan Haberdar Olun', subscribe: 'Abone Ol', compare: 'Karşılaştır', recentlyViewed: 'Son Görüntülenenler', orderHistory: 'Sipariş Geçmişi' };

  // Sayfa navigasyon fonksiyonları - Browser History destekli
  const navigateToPage = (page, product = null) => {
    const currentPage = showCollection ? 'collection' : showBestSellers ? 'bestSellers' : showNewArrivals ? 'newArrivals' : selectedProduct ? 'product' : 'home';
    if (currentPage !== 'home') {
      setPageHistory(prev => [...prev, currentPage]);
    }
    // Tüm sayfaları kapat
    setShowCollection(false);
    setShowBestSellers(false);
    setShowNewArrivals(false);
    setSelectedProduct(null);
    // Yeni sayfayı aç
    if (page === 'collection') setShowCollection(true);
    else if (page === 'bestSellers') setShowBestSellers(true);
    else if (page === 'newArrivals') setShowNewArrivals(true);
    else if (page === 'product' && product) {
      setSelectedProduct(product);
      setActiveImageIndex(0);
      setOpenAccordion(null);
    }
    
    // Browser history'ye ekle
    window.history.pushState({ page, product }, '', `#${page}`);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      // Tüm sayfaları kapat
      setShowCollection(false);
      setShowBestSellers(false);
      setShowNewArrivals(false);
      setSelectedProduct(null);
      setSpecialFilter(null);
      // Önceki sayfayı aç
      if (prevPage === 'collection') setShowCollection(true);
      else if (prevPage === 'bestSellers') setShowBestSellers(true);
      else if (prevPage === 'newArrivals') setShowNewArrivals(true);
    } else {
      // Geçmiş yoksa anasayfaya git
      setShowCollection(false);
      setShowBestSellers(false);
      setShowNewArrivals(false);
      setSelectedProduct(null);
      setSpecialFilter(null);
    }
  };

  // Browser geri/ileri butonlarını dinle
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state) {
        const { page, product } = e.state;
        // Tüm sayfaları kapat
        setShowCollection(false);
        setShowBestSellers(false);
        setShowNewArrivals(false);
        setSelectedProduct(null);
        setSpecialFilter(null);
        // İlgili sayfayı aç
        if (page === 'collection') setShowCollection(true);
        else if (page === 'bestSellers') setShowBestSellers(true);
        else if (page === 'newArrivals') setShowNewArrivals(true);
        else if (page === 'product' && product) setSelectedProduct(product);
      } else {
        // Ana sayfaya dön
        setShowCollection(false);
        setShowBestSellers(false);
        setShowNewArrivals(false);
        setSelectedProduct(null);
        setSpecialFilter(null);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Firebase'den ürünleri çek
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const firebaseProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(firebaseProducts);
    } catch (error) {
      console.error('Firebase hatası:', error);
      setProducts([]);
    }
    setIsLoading(false);
  };

  // Kullanıcı profilini yükle
  const loadUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        setFavorites(userDoc.data().favorites || []);
      }
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
    }
  };

  // Kullanıcı siparişlerini yükle
  const loadUserOrders = async (userId) => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(ordersQuery);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserOrders(orders);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    }
  };

  // Favorileri kaydet
  const saveFavorites = async (newFavorites) => {
    // Her zaman localStorage'a kaydet (giriş yapmamış kullanıcılar için)
    localStorage.setItem('luuz_favorites', JSON.stringify(newFavorites));
    
    // Giriş yapmış kullanıcılar için Firebase'e de kaydet
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          favorites: newFavorites
        });
      } catch (error) {
        console.error('Favoriler kaydedilemedi:', error);
      }
    }
  };

  // Kayıt ol
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (authForm.password !== authForm.confirmPassword) {
      setAuthError('Şifreler eşleşmiyor');
      return;
    }
    
    if (authForm.password.length < 6) {
      setAuthError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
      
      // Kullanıcı adını güncelle
      await updateProfile(userCredential.user, {
        displayName: `${authForm.firstName} ${authForm.lastName}`
      });

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: authForm.firstName,
        lastName: authForm.lastName,
        email: authForm.email,
        phone: authForm.phone,
        favorites: [],
        addresses: [],
        createdAt: new Date().toISOString()
      });

      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '' });
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Bu e-posta adresi zaten kullanılıyor');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Geçersiz e-posta adresi');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Şifre çok zayıf. En az 6 karakter olmalı');
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Email/Password girişi aktif değil. Firebase Console\'dan aktif edin.');
      } else {
        setAuthError(`Hata: ${error.message}`);
      }
    }
    setAuthLoading(false);
  };

  // Giriş yap
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '' });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setAuthError('Bu e-posta ile kayıtlı kullanıcı bulunamadı');
      } else if (error.code === 'auth/wrong-password') {
        setAuthError('Hatalı şifre');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Geçersiz e-posta adresi');
      } else {
        setAuthError('Giriş sırasında bir hata oluştu');
      }
    }
    setAuthLoading(false);
  };

  // Çıkış yap
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setUserOrders([]);
      setFavorites([]);
      setShowProfile(false);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Profil güncelle
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        address: userProfile.address || '',
        city: userProfile.city || '',
        postalCode: userProfile.postalCode || ''
      });
      
      await updateProfile(user, {
        displayName: `${userProfile.firstName} ${userProfile.lastName}`
      });
      
      setEditingProfile(false);
      alert('Profil güncellendi!');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert('Profil güncellenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // localStorage'dan favorileri yükle (giriş yapmamış kullanıcılar için)
    const savedFavorites = localStorage.getItem('luuz_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Browser history başlangıç state'i
    window.history.replaceState({ page: 'home' }, '', '#home');
    
    // Auth durumunu dinle
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser.uid);
        await loadUserOrders(currentUser.uid);
      }
    });
    
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const categories = ['Tümü', 'Minimal', 'Soyut', 'Doğa', 'Geometrik', 'Tipografi', 'Modern', 'Klasik', 'Portre', 'Manzara'];
  // eslint-disable-next-line no-unused-vars
  const sizes = ['40x60 cm', '50x70 cm', '60x80 cm', '70x100 cm'];
  const coupons = { 'HOSGELDIN15': { discount: 15, type: 'percent' }, 'YAZ50': { discount: 50, type: 'fixed' } };
  const faqData = [{ q: 'Kargo ne kadar sürede gelir?', a: '2-4 iş günü içinde teslim edilir.' }, { q: 'İade koşulları nelerdir?', a: '14 gün içinde koşulsuz iade hakkınız var.' }, { q: 'Çerçeve malzemesi nedir?', a: '%100 doğal ahşaptan el işçiliği ile üretilir.' }];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.priceUnframed >= priceRange[0] && p.priceUnframed <= priceRange[1];
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.size);
    const matchesSpecial = specialFilter === null || (specialFilter === 'bestSeller' && p.isBestSeller) || (specialFilter === 'newArrival' && p.isNew);
    return matchesCategory && matchesSearch && matchesPrice && matchesSize && matchesSpecial;
  }).sort((a, b) => sortBy === 'priceLow' ? a.priceUnframed - b.priceUnframed : sortBy === 'priceHigh' ? b.priceUnframed - a.priceUnframed : sortBy === 'newest' ? b.isNew - a.isNew : b.isBestSeller - a.isBestSeller);

  // Helper: ID'nin favorilerde olup olmadığını kontrol et (string karşılaştırması)
  const isFavorite = (id) => {
    if (!id) return false;
    return favorites.includes(String(id));
  };

  const toggleFavorite = (id) => {
    if (!id) {
      console.error('toggleFavorite: ID tanımsız!');
      return;
    }
    const stringId = String(id);
    const newFavorites = favorites.includes(stringId) 
      ? favorites.filter(f => f !== stringId) 
      : [...favorites, stringId];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };
  const addToRecentlyViewed = (p) => setRecentlyViewed(prev => [p, ...prev.filter(x => x.id !== p.id)].slice(0, 6));
  // eslint-disable-next-line no-unused-vars
  const toggleCompare = (p) => compareProducts.find(x => x.id === p.id) ? setCompareProducts(compareProducts.filter(x => x.id !== p.id)) : compareProducts.length < 4 && setCompareProducts([...compareProducts, p]);

  const addToCart = (product, isFramed) => {
    // Yeni fiyat yapısını kullan
    let price;
    const size = product.selectedSize || '50x70';
    
    if (size === '30x40') {
      price = isFramed 
        ? (product.price30x40Framed || Math.round(product.priceFramed * 0.7))
        : (product.price30x40Unframed || Math.round(product.priceUnframed * 0.7));
    } else {
      price = isFramed 
        ? (product.price50x70Framed || product.priceFramed)
        : (product.price50x70Unframed || product.priceUnframed);
    }
    
    const discountedPrice = product.discount > 0 ? Math.round(price * (1 - product.discount / 100)) : price;
    const quantity = product.quantity || 1;
    const cartId = `${product.id}-${size}-${isFramed}`;
    
    const cartItem = { 
      ...product, 
      isFramed, 
      selectedSize: size,
      price: discountedPrice, 
      cartId 
    };
    
    const existing = cart.find(item => item.cartId === cartId);
    if (existing) {
      setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...cartItem, quantity }]);
    }
    setSelectedProduct(null);
  };

  const updateQuantity = (cartId, change) => setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item).filter(item => item.quantity > 0));
  const applyCoupon = () => { const c = coupons[couponCode.toUpperCase()]; c ? setAppliedCoupon({ code: couponCode.toUpperCase(), ...c }) : alert('Geçersiz kupon!'); };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const couponDiscount = appliedCoupon ? (appliedCoupon.type === 'percent' ? subtotal * appliedCoupon.discount / 100 : appliedCoupon.discount) : 0;
  const totalPrice = subtotal - couponDiscount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!checkoutData.firstName || !checkoutData.email || !checkoutData.cardNumber) { alert('Lütfen zorunlu alanları doldurun'); return; }
    alert(`Siparişiniz alındı! Takip: LUUZ${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    setCart([]); setAppliedCoupon(null); setShowCheckout(false); setShowCart(false);
  };

  const theme = {
    bg: darkMode ? 'bg-stone-900' : 'bg-white', bgSecondary: darkMode ? 'bg-stone-800' : 'bg-white', bgTertiary: darkMode ? 'bg-stone-950' : 'bg-stone-100',
    text: darkMode ? 'text-white' : 'text-stone-900', textSecondary: darkMode ? 'text-stone-400' : 'text-stone-600', textMuted: darkMode ? 'text-stone-500' : 'text-stone-400',
    border: darkMode ? 'border-stone-700' : 'border-stone-200', card: darkMode ? 'bg-stone-800/50 border-stone-700/50' : 'bg-white border-stone-200',
    input: darkMode ? 'bg-stone-800 border-stone-700 text-white placeholder-stone-500' : 'bg-white border-stone-300 text-stone-900', accent: '#e8dcc4',
  };

  if (isLoading) return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
      <div className="text-center">
        <h1 className="text-4xl tracking-widest font-light mb-8" style={{fontFamily: "'Raleway', sans-serif", letterSpacing: '0.3em', color: theme.accent}}>LUUZ</h1>
        <div className="flex gap-2 justify-center">{[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full animate-bounce" style={{background: theme.accent, animationDelay: `${i*0.15}s`}}/>)}</div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;500&display=swap" rel="stylesheet" />
      <link href="https://fonts.cdnfonts.com/css/tan-st-canard" rel="stylesheet" />
      
      {/* Header */}
      <header className={`${theme.bgTertiary} sticky top-0 z-40 border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`lg:hidden ${theme.textSecondary}`}><Menu size={24} /></button>
            <button onClick={() => { setShowCollection(false); setSelectedProduct(null); }} className="hover:opacity-80 transition">
              <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-8" />
            </button>
          </div>
          <nav className={`hidden lg:flex items-center gap-6 text-sm font-semibold ${theme.textSecondary}`}>
            <button onClick={() => navigateToPage('collection')} className={`transition ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'}`}>Tüm Koleksiyon</button>
            <button onClick={() => setShowAbout(true)} className={`transition ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'}`}>{t.about}</button>
            <button onClick={() => setShowFAQ(true)} className={`transition ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'}`}>{t.faq}</button>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${theme.textSecondary}`}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
            <button onClick={() => setShowFavorites(true)} className={`relative p-2 ${theme.textSecondary}`}>
              <Heart size={18} fill={favorites.length > 0 ? theme.accent : 'none'} color={favorites.length > 0 ? theme.accent : 'currentColor'} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{favorites.length}</span>}
            </button>
            {user ? (
              <button onClick={() => setShowProfile(true)} className={`p-2 ${theme.textSecondary} relative`}>
                <User size={18} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2" style={{borderColor: darkMode ? '#1c1917' : '#fafaf9'}}></span>
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className={`p-2 ${theme.textSecondary}`}>
                <User size={18} />
              </button>
            )}
            <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary}`}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="px-4 pb-4">
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigateToPage('collection');
                  setShowSearch(false);
                }
              }}
              className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none`} 
              autoFocus 
            />
            {searchQuery && (
              <div className={`mt-2 ${theme.card} rounded-xl border max-h-64 overflow-y-auto`}>
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map(product => (
                  <button 
                    key={product.id}
                    onClick={() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); setShowSearch(false); setSearchQuery(''); }}
                    className={`w-full px-4 py-3 flex items-center gap-3 ${theme.text} hover:${theme.bgTertiary} transition text-left border-b ${theme.border} last:border-0`}
                  >
                    <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className={`text-xs ${theme.textMuted}`}>₺{product.priceUnframed}</p>
                    </div>
                  </button>
                ))}
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <p className={`px-4 py-3 text-sm ${theme.textMuted}`}>Ürün bulunamadı</p>
                )}
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 5 && (
                  <button 
                    onClick={() => { navigateToPage('collection'); setShowSearch(false); }}
                    className={`w-full px-4 py-3 text-sm font-medium text-center hover:${theme.bgTertiary} transition`}
                    style={{color: theme.accent}}
                  >
                    Tüm sonuçları gör ({products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length} ürün)
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {showMobileMenu && (
          <div className={`lg:hidden ${theme.bgSecondary} border-t ${theme.border} px-4 py-4 space-y-3`}>
            <button onClick={() => { navigateToPage('collection'); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>Tüm Koleksiyon</button>
            <button onClick={() => { setShowAbout(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.about}</button>
            <button onClick={() => { setShowFAQ(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.faq}</button>
          </div>
        )}
      </header>

      {/* Promo */}
      <div className={`${theme.bgTertiary} ${theme.textSecondary} py-2.5 text-center border-b ${theme.border}`}>
        <p className="text-xs">Yeni Müşterilere %15 İndirim — Kod: <span className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>HOSGELDIN15</span></p>
      </div>

      {/* Hero - Minimal with Logo */}
      <section className="relative h-[50vh] min-h-[350px] bg-stone-950 overflow-hidden">
        {/* Subtle Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-black"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-stone-500 uppercase tracking-[0.4em] mb-6 animate-fade-in">Özgün Duvar Sanatı</p>
          <img src="/luuz-logo-white.png" alt="LUUZ" className="h-12 md:h-16 mb-6 animate-fade-in" />
          <p className="text-base md:text-lg text-stone-400 font-light mb-8 animate-fade-in-delay tracking-wide">
            Duvarlarınıza karakter katın
          </p>
          <div className="animate-fade-in-delay-2">
            <button 
              onClick={() => navigateToPage('collection')} 
              className="px-10 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all border border-white/30 text-white hover:bg-white hover:text-stone-900"
            >
              Koleksiyonu Keşfet
            </button>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.3; filter: brightness(0.9); }
          50% { opacity: 0.5; filter: brightness(1.1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .skeleton {
          background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .page-transition-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease-out;
        }
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounceX 1s ease-in-out infinite;
        }
  
      `}</style>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl md:text-2xl font-medium tracking-wide ${theme.text} uppercase`}>Çok Satanlar</h3>
          </div>
          <button 
            onClick={() => setShowBestSellers(true)}
            className={`text-xs font-medium ${theme.textSecondary} hover:${theme.text} transition-colors flex items-center gap-1`}
          >
            Tümünü Gör <ChevronRight size={14} />
          </button>
        </div>
        <div className="relative">
          <div id="bestSellerScroll" className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {products.filter(p => p.isBestSeller).length > 0 ? (
              products.filter(p => p.isBestSeller).map((product) => (
                <div key={product.id} className="flex-shrink-0 w-48 md:w-56 group cursor-pointer" onClick={() => { navigateToPage('product', {...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                  <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-stone-100">
                    {/* First Image */}
                    <img src={product.images?.[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
            {/* Second Image (shown on hover) */}
                    <img src={product.images?.[1] || product.images?.[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" />
                  
 
{/* Hover Icons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <Heart size={16} fill={isFavorite(product.id) ? theme.accent : 'none'} color={isFavorite(product.id) ? theme.accent : (darkMode ? '#fff' : '#000')} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setQuickViewProduct({...product, selectedSize: undefined, selectedFrame: undefined, quantity: 1}); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <ZoomIn size={16} className={darkMode ? 'text-white' : 'text-stone-900'} />
                      </button>
                    </div>
                    {product.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[10px] font-medium uppercase z-10">İndirim</div>}
                  </div>
                  <div>
                    <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                    <h4 className={`text-sm ${theme.text} mb-1 line-clamp-2`}>{product.name}</h4>
                    <p className={`text-sm ${theme.text}`}>
                      {product.discount > 0 ? (
                        <>
                          <span className="line-through text-stone-400 mr-2">{product.priceUnframed} TL</span>
                          <span className="text-red-500">{Math.round(product.priceUnframed * (1 - product.discount/100))} TL</span>
                        </>
                      ) : (
                        <span>{Math.round(product.priceUnframed * 0.7)} TL – {product.priceUnframed} TL</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={`${theme.textMuted} text-sm`}>Henüz çok satan ürün yok</p>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl md:text-2xl font-medium tracking-wide ${theme.text} uppercase`}>Yeni Gelenler</h3>
          </div>
          <button 
            onClick={() => setShowNewArrivals(true)}
            className={`text-xs font-medium ${theme.textSecondary} hover:${theme.text} transition-colors flex items-center gap-1`}
          >
            Tümünü Gör <ChevronRight size={14} />
          </button>
        </div>
        <div className="relative">
          <div id="newArrivalsScroll" className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {products.filter(p => p.isNew).length > 0 ? (
              products.filter(p => p.isNew).map((product) => (
                <div key={product.id} className="flex-shrink-0 w-48 md:w-56 group cursor-pointer" onClick={() => { navigateToPage('product', {...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                  <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-stone-100">
                    {/* First Image */}
                    <img src={product.images?.[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
                    {/* Second Image (shown on hover) */}
                    <img src={product.images?.[1] || product.images?.[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" />
                    {/* Hover Icons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <Heart size={16} fill={isFavorite(product.id) ? theme.accent : 'none'} color={isFavorite(product.id) ? theme.accent : (darkMode ? '#fff' : '#000')} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setQuickViewProduct({...product, selectedSize: undefined, selectedFrame: undefined, quantity: 1}); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <ZoomIn size={16} className={darkMode ? 'text-white' : 'text-stone-900'} />
                      </button>
                    </div>
                    {product.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[10px] font-medium uppercase z-10">İndirim</div>}
                  </div>
                  <div>
                    <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                    <h4 className={`text-sm ${theme.text} mb-1 line-clamp-2`}>{product.name}</h4>
                    <p className={`text-sm ${theme.text}`}>
                      {product.discount > 0 ? (
                        <>
                          <span className="line-through text-stone-400 mr-2">{product.priceUnframed} TL</span>
                          <span className="text-red-500">{Math.round(product.priceUnframed * (1 - product.discount/100))} TL</span>
                        </>
                      ) : (
                        <span>{Math.round(product.priceUnframed * 0.7)} TL – {product.priceUnframed} TL</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={`${theme.textMuted} text-sm`}>Henüz yeni ürün yok</p>
            )}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h3 className={`text-lg font-medium ${theme.text} mb-4 uppercase tracking-wide`}>{t.recentlyViewed}</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recentlyViewed.map(p => (
              <div key={p.id} className="flex-shrink-0 w-32 cursor-pointer group" onClick={() => setSelectedProduct(p)}>
                <div className="aspect-square overflow-hidden bg-stone-100 mb-2">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className={`text-xs ${theme.text} truncate`}>{p.name}</p>
                <p className={`text-xs ${theme.textMuted}`}>{p.priceUnframed} TL</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Compare Bar */}
      {compareProducts.length > 0 && (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 ${theme.bgSecondary} shadow-2xl border ${theme.border} px-4 py-2 flex items-center gap-3 z-30`}>
          <span className={`text-xs ${theme.textSecondary}`}>{compareProducts.length} ürün</span>
          <div className="flex -space-x-2">{compareProducts.map(p => <img key={p.id} src={p.images[0]} alt="" className="w-8 h-8 border-2 border-stone-700 object-cover" />)}</div>
          <button onClick={() => setShowCompare(true)} className={`px-3 py-1 text-xs font-medium ${darkMode ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'}`}>{t.compare}</button>
          <button onClick={() => setCompareProducts([])} className={theme.textMuted}><X size={16} /></button>
        </div>
      )}

      {/* Features - Minimal */}
      <section className={`py-6 border-y ${theme.border}`}>
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-12">
          {[{icon: Truck, title: 'Ücretsiz Kargo'}, {icon: Shield, title: 'Güvenli Ödeme'}, {icon: RotateCcw, title: '14 Gün İade'}, {icon: Package, title: 'Özenli Paket'}].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <item.icon size={14} className={theme.textMuted} />
              <span className={`text-xs ${theme.textMuted}`}>{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter - Minimal */}
      <section className={`py-12 border-b ${theme.border}`}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className={`text-[10px] ${theme.textMuted} uppercase tracking-[0.2em] mb-2`}>Bülten</p>
          <h3 className={`text-xl font-medium ${theme.text} mb-3`}>{t.newsletter}</h3>
          <p className={`${theme.textMuted} mb-6 text-xs`}>İndirimlerden ve yeni ürünlerden ilk siz haberdar olun</p>
          <div className="flex gap-0 max-w-md mx-auto">
            <input type="email" placeholder="E-posta adresiniz" className={`flex-1 px-4 py-3 text-sm ${theme.input} border ${theme.border} border-r-0 focus:outline-none`} />
            <button className={`px-6 py-3 text-xs font-medium uppercase tracking-wider transition ${darkMode ? 'bg-white text-stone-900 hover:bg-stone-200' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>{t.subscribe}</button>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className={`py-16 ${theme.bg}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-6 mb-4" />
              <p className={`${theme.textMuted} text-xs leading-relaxed`}>Özgün duvar sanatı tasarımları ile mekanlarınıza karakter katın.</p>
            </div>
            <div>
              <h5 className={`text-xs font-medium uppercase tracking-wider mb-4 ${theme.text}`}>Linkler</h5>
              <ul className={`space-y-3 ${theme.textMuted} text-xs`}>
                <li><button onClick={() => navigateToPage('collection')} className="hover:underline">{t.collection}</button></li>
                <li><button onClick={() => setShowAbout(true)} className="hover:underline">{t.about}</button></li>
                <li><button onClick={() => setShowFAQ(true)} className="hover:underline">{t.faq}</button></li>
              </ul>
            </div>
            <div>
              <h5 className={`text-xs font-medium uppercase tracking-wider mb-4 ${theme.text}`}>Yardım</h5>
              <ul className={`space-y-3 ${theme.textMuted} text-xs`}>
                <li className="hover:underline cursor-pointer">Kargo Bilgileri</li>
                <li className="hover:underline cursor-pointer">İade & Değişim</li>
                <li><button onClick={() => setShowOrderHistory(true)} className="hover:underline">{t.orderHistory}</button></li>
              </ul>
            </div>
            <div>
              <h5 className={`text-xs font-medium uppercase tracking-wider mb-4 ${theme.text}`}>İletişim</h5>
              <ul className={`space-y-3 ${theme.textMuted} text-xs`}>
                <li>info@luuz.com.tr</li>
                <li>+90 212 555 00 00</li>
                <li>İstanbul, Türkiye</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <button className={`${theme.textMuted} hover:${theme.text} transition`}><Instagram size={16} /></button>
                <button className={`${theme.textMuted} hover:${theme.text} transition`}><Twitter size={16} /></button>
                <button className={`${theme.textMuted} hover:${theme.text} transition`}><Facebook size={16} /></button>
              </div>
            </div>
          </div>
          <div className={`border-t ${theme.border} pt-8 flex justify-between items-center ${theme.textMuted} text-xs`}>
            <span>© 2025 LUUZ. Tüm hakları saklıdır.</span>
            <button onClick={() => setShowAdmin(true)} className={`hover:${theme.text} transition`}><Settings size={14} /></button>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}></div>
          <div className={`relative ${theme.bg} w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in`}>
            <button onClick={() => setQuickViewProduct(null)} className={`absolute top-4 right-4 z-10 p-2 ${theme.textSecondary} hover:${theme.text}`}>
              <X size={24} />
            </button>
            
            <div className="grid md:grid-cols-2 gap-0">
              {/* Product Images with Thumbnails */}
              <div className="p-4 md:p-6">
                {/* Main Image */}
                <div className="relative aspect-[3/4] bg-stone-100 mb-3">
                  <img src={quickViewProduct.images?.[quickViewProduct.activeIndex || 0]} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                  {quickViewProduct.discount > 0 && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-medium uppercase">İndirim</div>}
                </div>
                {/* Thumbnails */}
                {quickViewProduct.images?.length > 1 && (
                  <div className="flex gap-2">
                    {quickViewProduct.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setQuickViewProduct({...quickViewProduct, activeIndex: idx})}
                        className={`w-16 h-20 overflow-hidden transition-all ${(quickViewProduct.activeIndex || 0) === idx ? 'ring-1 ring-stone-900 dark:ring-white' : 'opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-6 md:p-8 space-y-4">
                <div>
                  <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-2`}>LUUZ POSTER</p>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className={`text-xl md:text-2xl font-medium ${theme.text}`}>{quickViewProduct.name}</h2>
                    <button 
                      onClick={() => toggleFavorite(quickViewProduct.id)}
                      className={`flex-shrink-0 p-2 transition ${isFavorite(quickViewProduct.id) ? 'text-red-500' : theme.textMuted}`}
                    >
                      <Heart size={20} fill={isFavorite(quickViewProduct.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  {/* Price */}
                  {(() => {
                    let basePrice;
                    if (quickViewProduct.selectedSize === '30x40') {
                      basePrice = quickViewProduct.selectedFrame && quickViewProduct.selectedFrame !== 'none'
                        ? (quickViewProduct.price30x40Framed || Math.round(quickViewProduct.priceFramed * 0.7))
                        : (quickViewProduct.price30x40Unframed || Math.round(quickViewProduct.priceUnframed * 0.7));
                    } else {
                      basePrice = quickViewProduct.selectedFrame && quickViewProduct.selectedFrame !== 'none'
                        ? (quickViewProduct.price50x70Framed || quickViewProduct.priceFramed)
                        : (quickViewProduct.price50x70Unframed || quickViewProduct.priceUnframed);
                    }
                    const quantity = quickViewProduct.quantity || 1;
                    const discountedPrice = quickViewProduct.discount > 0 ? Math.round(basePrice * (1 - quickViewProduct.discount / 100)) : basePrice;
                    const minPrice = quickViewProduct.price30x40Unframed || Math.round(quickViewProduct.priceUnframed * 0.7);
                    const maxPrice = quickViewProduct.price50x70Framed || quickViewProduct.priceFramed || quickViewProduct.priceUnframed;
                    
                    return (
                      <div className="mb-3">
                        {quickViewProduct.selectedSize && quickViewProduct.selectedFrame !== undefined ? (
                          <div className="flex items-baseline gap-2">
                            {quickViewProduct.discount > 0 && <span className={`text-base ${theme.textMuted} line-through`}>{basePrice * quantity} TL</span>}
                            <span className={`text-xl font-medium ${quickViewProduct.discount > 0 ? 'text-red-500' : theme.text}`}>{discountedPrice * quantity} TL</span>
                          </div>
                        ) : (
                          <p className={`text-lg ${theme.text}`}>{minPrice} TL – {maxPrice} TL</p>
                        )}
                      </div>
                    );
                  })()}
                  
                  {quickViewProduct.stock > 0 ? (
                    <p className={`text-xs ${theme.textMuted} flex items-center gap-2`}><Check size={14} className="text-green-500" />Stokta mevcut</p>
                  ) : (
                    <p className="text-xs text-red-400">{t.outOfStock}</p>
                  )}
                </div>

                {/* Options */}
                <div className={`pt-4 border-t ${theme.border} space-y-4`}>
                  {/* Size */}
                  <div>
                    <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2`}>Boyut</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, selectedSize: '30x40'})}
                        className="px-4 py-2 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: quickViewProduct.selectedSize === '30x40' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: quickViewProduct.selectedSize === '30x40' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${quickViewProduct.selectedSize === '30x40' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        30x40 cm
                      </button>
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, selectedSize: '50x70'})}
                        className="px-4 py-2 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: quickViewProduct.selectedSize === '50x70' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: quickViewProduct.selectedSize === '50x70' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${quickViewProduct.selectedSize === '50x70' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        50x70 cm
                      </button>
                    </div>
                  </div>

                  {/* Frame */}
                  <div>
                    <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2`}>Çerçeve</p>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, selectedFrame: 'none'})}
                        className="px-3 py-2 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: quickViewProduct.selectedFrame === 'none' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: quickViewProduct.selectedFrame === 'none' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${quickViewProduct.selectedFrame === 'none' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Çerçevesiz
                      </button>
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, selectedFrame: 'wood'})}
                        className="px-3 py-2 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: quickViewProduct.selectedFrame === 'wood' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: quickViewProduct.selectedFrame === 'wood' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${quickViewProduct.selectedFrame === 'wood' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Ahşap
                      </button>
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, selectedFrame: 'black'})}
                        className="px-3 py-2 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: quickViewProduct.selectedFrame === 'black' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: quickViewProduct.selectedFrame === 'black' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${quickViewProduct.selectedFrame === 'black' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Siyah
                      </button>
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, selectedFrame: 'white'})}
                        className="px-3 py-2 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: quickViewProduct.selectedFrame === 'white' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: quickViewProduct.selectedFrame === 'white' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${quickViewProduct.selectedFrame === 'white' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Beyaz
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2`}>Adet</p>
                    <div 
                      className="inline-flex items-center rounded-sm"
                      style={{ border: `1px solid ${darkMode ? '#78716c' : '#a8a29e'}` }}
                    >
                      <button 
                        onClick={() => quickViewProduct.quantity > 1 && setQuickViewProduct({...quickViewProduct, quantity: quickViewProduct.quantity - 1})}
                        className="w-9 h-9 flex items-center justify-center"
                        style={{ color: darkMode ? '#ffffff' : '#1c1917' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium" style={{ color: darkMode ? '#ffffff' : '#1c1917' }}>{quickViewProduct.quantity || 1}</span>
                      <button 
                        onClick={() => setQuickViewProduct({...quickViewProduct, quantity: (quickViewProduct.quantity || 1) + 1})}
                        className="w-9 h-9 flex items-center justify-center"
                        style={{ color: darkMode ? '#ffffff' : '#1c1917' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-2">
                    <button 
                      onClick={() => {
                        if (quickViewProduct.selectedFrame === undefined || quickViewProduct.selectedSize === undefined) {
                          alert('Lütfen boyut ve çerçeve seçin');
                        } else {
                          addToCart(quickViewProduct, quickViewProduct.selectedFrame !== 'none');
                          setQuickViewProduct(null);
                        }
                      }}
                      disabled={quickViewProduct.stock === 0}
                      className={`w-full py-3 text-sm font-medium uppercase tracking-wider transition rounded-sm ${quickViewProduct.stock === 0 ? 'opacity-50' : 'hover:opacity-90'}`}
                      style={{ 
                        backgroundColor: darkMode ? '#ffffff' : '#1c1917',
                        color: darkMode ? '#1c1917' : '#ffffff'
                      }}
                    >
                      {quickViewProduct.stock === 0 ? t.outOfStock : t.addToCart}
                    </button>
                    <button 
                      onClick={() => { setSelectedProduct({...quickViewProduct}); setQuickViewProduct(null); addToRecentlyViewed(quickViewProduct); }}
                      className={`text-sm ${theme.textMuted} hover:${theme.text} underline transition`}
                    >
                      Ürün detayına git →
                    </button>
                  </div>

                  {/* Accordion */}
                  <div className={`pt-4 border-t ${theme.border}`}>
                    {/* Detaylar */}
                    <div className={`border-b ${theme.border}`}>
                      <button 
                        onClick={() => setOpenAccordion(openAccordion === 'qv-details' ? null : 'qv-details')}
                        className={`w-full py-3 flex items-center justify-between ${theme.text}`}
                      >
                        <span className="text-sm font-medium">Detaylar</span>
                        {openAccordion === 'qv-details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openAccordion === 'qv-details' && (
                        <div className={`pb-3 text-sm ${theme.textSecondary}`}>
                          <p>{quickViewProduct.description || 'Yüksek kaliteli baskı teknolojisi ile üretilmiş poster.'}</p>
                        </div>
                      )}
                    </div>

                    {/* Kargo */}
                    <div className={`border-b ${theme.border}`}>
                      <button 
                        onClick={() => setOpenAccordion(openAccordion === 'qv-shipping' ? null : 'qv-shipping')}
                        className={`w-full py-3 flex items-center justify-between ${theme.text}`}
                      >
                        <span className="text-sm font-medium">Kargo</span>
                        {openAccordion === 'qv-shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openAccordion === 'qv-shipping' && (
                        <div className={`pb-3 text-sm ${theme.textSecondary} space-y-1`}>
                          <p>• Türkiye geneli ücretsiz kargo</p>
                          <p>• 2-4 iş günü içinde teslimat</p>
                        </div>
                      )}
                    </div>

                    {/* Malzemeler */}
                    <div>
                      <button 
                        onClick={() => setOpenAccordion(openAccordion === 'qv-materials' ? null : 'qv-materials')}
                        className={`w-full py-3 flex items-center justify-between ${theme.text}`}
                      >
                        <span className="text-sm font-medium">Malzemeler</span>
                        {openAccordion === 'qv-materials' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openAccordion === 'qv-materials' && (
                        <div className={`pb-3 text-sm ${theme.textSecondary} space-y-1`}>
                          <p>• 200gr mat kuşe kağıt</p>
                          <p>• UV dayanıklı mürekkep</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); fetchProducts(); }} />}

      {/* Best Sellers Page - Full Screen */}
      {showBestSellers && (
        <div className={`fixed inset-0 z-50 ${theme.bg} overflow-y-auto animate-fade-in`}>
          <div className={`sticky top-0 ${theme.bgTertiary} border-b ${theme.border} z-10`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button onClick={goBack} className={`flex items-center gap-2 ${theme.textSecondary} ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'} transition`}>
                <ChevronLeft size={20} />
                <span className="text-sm">Geri</span>
              </button>
              <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-6" />
              <div className="flex items-center gap-1">
                <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
                <button onClick={() => setShowFavorites(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <Heart size={18} fill={favorites.length > 0 ? theme.accent : 'none'} color={favorites.length > 0 ? theme.accent : 'currentColor'} />
                  {favorites.length > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{favorites.length}</span>}
                </button>
                {user ? (
                  <button onClick={() => setShowProfile(true)} className={`p-2 ${theme.textSecondary} relative`}>
                    <User size={18} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2" style={{borderColor: darkMode ? '#1c1917' : '#fafaf9'}}></span>
                  </button>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className={`p-2 ${theme.textSecondary}`}><User size={18} /></button>
                )}
                <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <ShoppingCart size={18} />
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className={`text-2xl font-medium tracking-wide ${theme.text} uppercase mb-8 text-center`}>Çok Satanlar</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.filter(p => p.isBestSeller).map((product, idx) => (
                <div key={product.id} className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => { setPageHistory(prev => [...prev, 'bestSellers']); setShowBestSellers(false); setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                    <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {/* Hover Icons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <Heart size={16} fill={isFavorite(product.id) ? theme.accent : 'none'} color={isFavorite(product.id) ? theme.accent : (darkMode ? '#fff' : '#000')} />
                      </button>
                      <button className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <ZoomIn size={16} className={darkMode ? 'text-white' : 'text-stone-900'} />
                      </button>
                    </div>
                    {product.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[10px] font-medium uppercase">İndirim</div>}
                    {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white text-sm font-medium">{t.outOfStock}</span></div>}
                  </div>
                  <div>
                    <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                    <h3 className={`text-sm ${theme.text} mb-1 line-clamp-2`}>{product.name}</h3>
                    <p className={`text-sm ${theme.text}`}>
                      {product.discount > 0 ? (
                        <>
                          <span className="line-through text-stone-400 mr-2">{product.priceUnframed} TL</span>
                          <span className="text-red-500">{Math.round(product.priceUnframed * (1 - product.discount/100))} TL</span>
                        </>
                      ) : (
                        <span>{Math.round(product.priceUnframed * 0.7)} TL – {product.priceUnframed} TL</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {products.filter(p => p.isBestSeller).length === 0 && (
              <div className="text-center py-16">
                <p className={theme.textMuted}>Henüz çok satan ürün yok</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Arrivals Page - Full Screen */}
      {showNewArrivals && (
        <div className={`fixed inset-0 z-50 ${theme.bg} overflow-y-auto animate-fade-in`}>
          <div className={`sticky top-0 ${theme.bgTertiary} border-b ${theme.border} z-10`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button onClick={goBack} className={`flex items-center gap-2 ${theme.textSecondary} ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'} transition`}>
                <ChevronLeft size={20} />
                <span className="text-sm">Geri</span>
              </button>
              <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-6" />
              <div className="flex items-center gap-1">
                <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
                <button onClick={() => setShowFavorites(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <Heart size={18} fill={favorites.length > 0 ? theme.accent : 'none'} color={favorites.length > 0 ? theme.accent : 'currentColor'} />
                  {favorites.length > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{favorites.length}</span>}
                </button>
                {user ? (
                  <button onClick={() => setShowProfile(true)} className={`p-2 ${theme.textSecondary} relative`}>
                    <User size={18} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2" style={{borderColor: darkMode ? '#1c1917' : '#fafaf9'}}></span>
                  </button>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className={`p-2 ${theme.textSecondary}`}><User size={18} /></button>
                )}
                <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <ShoppingCart size={18} />
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className={`text-2xl font-medium tracking-wide ${theme.text} uppercase mb-8 text-center`}>Yeni Gelenler</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.filter(p => p.isNew).map((product, idx) => (
                <div key={product.id} className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => { setPageHistory(prev => [...prev, 'newArrivals']); setShowNewArrivals(false); setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                    <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {/* Hover Icons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <Heart size={16} fill={isFavorite(product.id) ? theme.accent : 'none'} color={isFavorite(product.id) ? theme.accent : (darkMode ? '#fff' : '#000')} />
                      </button>
                      <button className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <ZoomIn size={16} className={darkMode ? 'text-white' : 'text-stone-900'} />
                      </button>
                    </div>
                    {product.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[10px] font-medium uppercase">İndirim</div>}
                    {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white text-sm font-medium">{t.outOfStock}</span></div>}
                  </div>
                  <div>
                    <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                    <h3 className={`text-sm ${theme.text} mb-1 line-clamp-2`}>{product.name}</h3>
                    <p className={`text-sm ${theme.text}`}>
                      {product.discount > 0 ? (
                        <>
                          <span className="line-through text-stone-400 mr-2">{product.priceUnframed} TL</span>
                          <span className="text-red-500">{Math.round(product.priceUnframed * (1 - product.discount/100))} TL</span>
                        </>
                      ) : (
                        <span>{Math.round(product.priceUnframed * 0.7)} TL – {product.priceUnframed} TL</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {products.filter(p => p.isNew).length === 0 && (
              <div className="text-center py-16">
                <p className={theme.textMuted}>Henüz yeni ürün yok</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collection Page - Full Screen */}
      {showCollection && (
        <div className={`fixed inset-0 z-50 ${theme.bg} overflow-y-auto animate-fade-in`}>
          {/* Collection Header */}
          <div className={`sticky top-0 ${theme.bgTertiary} border-b ${theme.border} z-10`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button onClick={() => { setShowCollection(false); setSpecialFilter(null); setSearchQuery(''); setPageHistory([]); }} className={`flex items-center gap-2 ${theme.textSecondary} ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'} transition`}>
                <ChevronLeft size={20} />
                <span className="text-sm">Anasayfa</span>
              </button>
              <button onClick={() => { setShowCollection(false); setSpecialFilter(null); setSearchQuery(''); setPageHistory([]); }} className="hover:opacity-80 transition">
                <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-6" />
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
                <button onClick={() => setShowFavorites(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <Heart size={18} fill={favorites.length > 0 ? theme.accent : 'none'} color={favorites.length > 0 ? theme.accent : 'currentColor'} />
                  {favorites.length > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{favorites.length}</span>}
                </button>
                {user ? (
                  <button onClick={() => setShowProfile(true)} className={`p-2 ${theme.textSecondary} relative`}>
                    <User size={18} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2" style={{borderColor: darkMode ? '#1c1917' : '#fafaf9'}}></span>
                  </button>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className={`p-2 ${theme.textSecondary}`}><User size={18} /></button>
                )}
                <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <ShoppingCart size={18} />
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
                </button>
              </div>
            </div>
            {showSearch && (
              <div className="px-4 pb-4">
                <input type="text" placeholder={t.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none`} autoFocus />
              </div>
            )}
          </div>

          {/* Collection Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold ${theme.text} mb-2`}>Koleksiyon</h1>
              <p className={`${theme.textSecondary}`}>Tüm posterlerimizi keşfedin</p>
            </div>

            {/* Categories */}
            <div className="mb-8">
              {/* Special Filters - Best Sellers & New Arrivals */}
              <div className="flex gap-3 mb-6 justify-center">
                <button 
                  onClick={() => setSpecialFilter(specialFilter === 'bestSeller' ? null : 'bestSeller')}
                  className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all rounded-sm"
                  style={{ 
                    backgroundColor: specialFilter === 'bestSeller' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                    color: specialFilter === 'bestSeller' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                    border: `1px solid ${specialFilter === 'bestSeller' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                  }}
                >
                  Çok Satanlar
                </button>
                <button 
                  onClick={() => setSpecialFilter(specialFilter === 'newArrival' ? null : 'newArrival')}
                  className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all rounded-sm"
                  style={{ 
                    backgroundColor: specialFilter === 'newArrival' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                    color: specialFilter === 'newArrival' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                    border: `1px solid ${specialFilter === 'newArrival' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                  }}
                >
                  Yeni Ürünler
                </button>
              </div>

              {/* Regular Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className="px-4 py-2 text-xs transition-all rounded-sm"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif', 
                      fontWeight: 700,
                      backgroundColor: selectedCategory === cat ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                      color: selectedCategory === cat ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#a8a29e' : '#57534e'),
                      border: `1px solid ${selectedCategory === cat ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters & Sort - Minimalist */}
            <div className={`flex items-center justify-between gap-4 mb-8 pb-4 border-b ${theme.border}`}>
              <span className={`text-xs ${theme.textMuted}`}>{filteredProducts.length} ürün</span>
              <div className="flex items-center gap-3">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`px-3 py-2 text-xs ${theme.bg} ${theme.text} border ${theme.border} focus:outline-none rounded-sm`}>
                  <option value="popular">Popüler</option>
                  <option value="newest">En Yeni</option>
                  <option value="priceLow">Fiyat ↑</option>
                  <option value="priceHigh">Fiyat ↓</option>
                </select>
                <div className={`flex items-center border ${theme.border} rounded-sm overflow-hidden`}>
                  <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? (darkMode ? 'bg-white text-stone-900' : 'bg-stone-900 text-white') : ''}`}><Grid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? (darkMode ? 'bg-white text-stone-900' : 'bg-stone-900 text-white') : ''}`}><List size={14} /></button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="skeleton aspect-[3/4] bg-stone-200 dark:bg-stone-700"></div>
                    <div className="skeleton h-4 mt-3 bg-stone-200 dark:bg-stone-700"></div>
                    <div className="skeleton h-4 w-1/2 mt-2 bg-stone-200 dark:bg-stone-700"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className={theme.textMuted}>Ürün bulunamadı</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, idx) => (
                  <div 
                    key={product.id} 
                    className="group animate-fade-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                      {!imagesLoaded[product.id] && <div className="skeleton absolute inset-0"></div>}
                      <img 
                        src={product.images?.[0]} 
                        alt={product.name} 
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${imagesLoaded[product.id] ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImagesLoaded(prev => ({...prev, [product.id]: true}))}
                        onClick={() => { navigateToPage('product', {...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}
                      />
                      {/* Hover Icons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                          <Heart size={16} fill={isFavorite(product.id) ? theme.accent : 'none'} color={isFavorite(product.id) ? theme.accent : (darkMode ? '#fff' : '#000')} />
                        </button>
                        <button className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                          <ZoomIn size={16} className={darkMode ? 'text-white' : 'text-stone-900'} />
                        </button>
                      </div>
                      {product.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[10px] font-medium uppercase">İndirim</div>}
                      {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white text-sm font-medium">{t.outOfStock}</span></div>}
                    </div>
                    <div className="cursor-pointer" onClick={() => { navigateToPage('product', {...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                      <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                      <h3 className={`text-sm ${theme.text} mb-1 line-clamp-2`}>{product.name}</h3>
                      <p className={`text-sm ${theme.text}`}>
                        {product.discount > 0 ? (
                          <>
                            <span className="line-through text-stone-400 mr-2">{product.priceUnframed} TL</span>
                            <span className="text-red-500">{Math.round(product.priceUnframed * (1 - product.discount/100))} TL</span>
                          </>
                        ) : (
                          <span>{Math.round(product.priceUnframed * 0.7)} TL – {product.priceUnframed} TL</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div key={product.id} className={`flex gap-4 ${theme.card} border p-3 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer`} onClick={() => { navigateToPage('product', {...product, selectedSize: undefined, selectedFrame: undefined}); }}>
                    <div className="w-24 h-24 overflow-hidden bg-stone-100">
                      <img 
                        src={product.images?.[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                          <h3 className={`font-medium ${theme.text}`}>{product.name}</h3>
                          <p className={`text-xs ${theme.textMuted}`}>{product.category}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}>
                          <Heart size={16} fill={isFavorite(product.id) ? theme.accent : 'none'} color={isFavorite(product.id) ? theme.accent : (darkMode ? '#a8a29e' : '#78716c')} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {product.discount > 0 ? (
                            <>
                              <span className={`text-sm ${theme.textMuted} line-through`}>{product.priceUnframed}₺</span>
                              <span className="text-sm text-green-400 font-bold">{Math.round(product.priceUnframed * (1 - product.discount/100))}₺</span>
                            </>
                          ) : (
                            <span className={`text-sm font-bold ${theme.text}`}>{product.priceUnframed}₺</span>
                          )}
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigateToPage('product', {...product, selectedSize: undefined, selectedFrame: undefined}); }} 
                          className="text-stone-900 px-4 py-1.5 rounded-lg text-xs font-medium" 
                          style={{background: theme.accent}}
                        >
                          İncele
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Transition Overlay */}
      {pageTransition && (
        <div className="fixed inset-0 z-[60] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Product Page - Full Screen */}
      {selectedProduct && (
        <div className={`fixed inset-0 z-50 ${theme.bg} overflow-y-auto animate-fade-in`}>
          {/* Product Page Header */}
          <div className={`sticky top-0 ${theme.bgTertiary} border-b ${theme.border} z-10`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button onClick={() => { 
                setPageTransition(true); 
                setTimeout(() => { 
                  const prevPage = pageHistory[pageHistory.length - 1];
                  setPageHistory(prev => prev.slice(0, -1));
                  setSelectedProduct(null);
                  if (prevPage === 'collection') setShowCollection(true);
                  else if (prevPage === 'bestSellers') setShowBestSellers(true);
                  else if (prevPage === 'newArrivals') setShowNewArrivals(true);
                  setPageTransition(false); 
                }, 150); 
              }} className={`flex items-center gap-2 ${theme.textSecondary} hover:${theme.text} transition`}>
                <ChevronLeft size={20} />
                <span className="text-sm">Geri</span>
              </button>
              <button onClick={() => { setSelectedProduct(null); setShowCollection(false); setShowBestSellers(false); setShowNewArrivals(false); setPageHistory([]); }} className="hover:opacity-80 transition">
                <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-6" />
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
                <button onClick={() => selectedProduct?.id && toggleFavorite(selectedProduct.id)} className={`p-2 ${theme.textSecondary} rounded-full hover:scale-110 transition-transform`}>
                  <Heart size={18} fill={isFavorite(selectedProduct?.id) ? theme.accent : 'none'} color={isFavorite(selectedProduct?.id) ? theme.accent : (darkMode ? '#a8a29e' : '#78716c')} />
                </button>
                {user ? (
                  <button onClick={() => setShowProfile(true)} className={`p-2 ${theme.textSecondary} relative`}>
                    <User size={18} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2" style={{borderColor: darkMode ? '#1c1917' : '#fafaf9'}}></span>
                  </button>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className={`p-2 ${theme.textSecondary}`}><User size={18} /></button>
                )}
                <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary} hover:scale-110 transition-transform`}>
                  <ShoppingCart size={18} />
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Product Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              {/* Product Images with Vertical Thumbnails */}
              <div className="animate-slide-in">
                <div className="flex gap-4">
                  {/* Vertical Thumbnails */}
                  {selectedProduct.images.length > 1 && (
                    <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
                      {selectedProduct.images.map((img, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setActiveImageIndex(idx)} 
                          className={`w-16 h-20 overflow-hidden transition-all duration-200 ${activeImageIndex === idx ? 'ring-1 ring-stone-900 dark:ring-white' : 'opacity-60 hover:opacity-100'}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Main Image */}
                  <div className="flex-1">
                    <div 
                      className="relative overflow-hidden cursor-zoom-in group bg-stone-100"
                      onMouseEnter={() => setShowZoom(true)}
                      onMouseLeave={() => setShowZoom(false)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        setZoomPosition({ x, y });
                      }}
                      onClick={() => setShowZoom(!showZoom)}
                    >
                      <img 
                        src={selectedProduct.images[activeImageIndex]} 
                        alt="" 
                        className="w-full aspect-[3/4] object-cover transition-transform duration-300"
                        style={showZoom ? { transform: 'scale(2)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                      />
                      
                      {/* Zoom indicator */}
                      <div className={`absolute bottom-4 right-4 ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <ZoomIn size={18} className={theme.textSecondary} />
                      </div>
                      
                      {selectedProduct.images.length > 1 && !showZoom && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images.length - 1); }} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm p-2 transition hover:scale-110`}>
                            <ChevronLeft size={20} className={darkMode ? 'text-white' : 'text-stone-900'} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev < selectedProduct.images.length - 1 ? prev + 1 : 0); }} className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm p-2 transition hover:scale-110`}>
                            <ChevronRight size={20} className={darkMode ? 'text-white' : 'text-stone-900'} />
                          </button>
                        </>
                      )}
                      {selectedProduct.discount > 0 && !showZoom && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-medium uppercase">İndirim</div>}
                    </div>
                    
                    {/* Mobile Thumbnails */}
                    {selectedProduct.images.length > 1 && (
                      <div className="flex sm:hidden gap-2 mt-4">
                        {selectedProduct.images.map((img, idx) => (
                          <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-16 h-20 overflow-hidden transition-all duration-200 ${activeImageIndex === idx ? 'ring-1 ring-stone-900 dark:ring-white' : 'opacity-60 hover:opacity-100'}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                {/* Main Info */}
                <div>
                  <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-2`}>LUUZ POSTER</p>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h1 className={`text-2xl md:text-3xl font-medium ${theme.text}`}>{selectedProduct.name}</h1>
                    <button 
                      onClick={() => selectedProduct?.id && toggleFavorite(selectedProduct.id)}
                      className={`flex-shrink-0 p-2 transition ${isFavorite(selectedProduct?.id) ? 'text-red-500' : theme.textMuted}`}
                    >
                      <Heart size={22} fill={isFavorite(selectedProduct?.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  {/* Dynamic Price Display */}
                  {(() => {
                    // Yeni fiyat yapısını kullan, yoksa eski yapıya geri dön
                    let basePrice;
                    if (selectedProduct.selectedSize === '30x40') {
                      basePrice = selectedProduct.selectedFrame && selectedProduct.selectedFrame !== 'none'
                        ? (selectedProduct.price30x40Framed || Math.round(selectedProduct.priceFramed * 0.7))
                        : (selectedProduct.price30x40Unframed || Math.round(selectedProduct.priceUnframed * 0.7));
                    } else {
                      basePrice = selectedProduct.selectedFrame && selectedProduct.selectedFrame !== 'none'
                        ? (selectedProduct.price50x70Framed || selectedProduct.priceFramed)
                        : (selectedProduct.price50x70Unframed || selectedProduct.priceUnframed);
                    }
                    
                    const quantity = selectedProduct.quantity || 1;
                    const unitPrice = basePrice;
                    const discountedUnitPrice = selectedProduct.discount > 0 ? Math.round(unitPrice * (1 - selectedProduct.discount / 100)) : unitPrice;
                    const totalPrice = discountedUnitPrice * quantity;
                    
                    // Fiyat aralığı hesaplama (seçim yapılmadan önce)
                    const minPrice = selectedProduct.price30x40Unframed || Math.round(selectedProduct.priceUnframed * 0.7);
                    const maxPrice = selectedProduct.price50x70Framed || selectedProduct.priceFramed || selectedProduct.priceUnframed;
                    
                    return (
                      <div className="mb-4">
                        {selectedProduct.selectedSize && selectedProduct.selectedFrame !== undefined ? (
                          <div className="flex items-baseline gap-3 flex-wrap">
                            {selectedProduct.discount > 0 && (
                              <span className={`text-lg ${theme.textMuted} line-through`}>{unitPrice * quantity} TL</span>
                            )}
                            <span className={`text-2xl font-medium ${selectedProduct.discount > 0 ? 'text-red-500' : theme.text}`}>
                              {totalPrice} TL
                            </span>
                            {quantity > 1 && (
                              <span className={`text-sm ${theme.textMuted}`}>({discountedUnitPrice} TL x {quantity})</span>
                            )}
                          </div>
                        ) : (
                          <p className={`text-lg ${theme.text}`}>{minPrice} TL – {maxPrice} TL</p>
                        )}
                      </div>
                    );
                  })()}
                  
                  {selectedProduct.stock > 0 ? (
                    <p className={`text-xs ${theme.textMuted} flex items-center gap-2 mb-4`}><Check size={14} className="text-green-500" />Stokta mevcut</p>
                  ) : (
                    <p className="text-xs text-red-400 mb-4">{t.outOfStock}</p>
                  )}
                </div>

                {/* Options Section - Compact Design */}
                <div className={`pt-4 border-t ${theme.border} space-y-4`}>
                  {/* Size Selection */}
                  <div>
                    <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2`}>Boyut</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedSize: '30x40'})}
                        className="px-4 py-2.5 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: selectedProduct.selectedSize === '30x40' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: selectedProduct.selectedSize === '30x40' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${selectedProduct.selectedSize === '30x40' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        30x40 cm
                      </button>
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedSize: '50x70'})}
                        className="px-4 py-2.5 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: selectedProduct.selectedSize === '50x70' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: selectedProduct.selectedSize === '50x70' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${selectedProduct.selectedSize === '50x70' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        50x70 cm
                      </button>
                    </div>
                  </div>

                  {/* Frame Selection - Updated Options */}
                  <div>
                    <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2`}>Çerçeve</p>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedFrame: 'none'})}
                        className="px-3 py-2.5 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: selectedProduct.selectedFrame === 'none' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: selectedProduct.selectedFrame === 'none' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${selectedProduct.selectedFrame === 'none' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Çerçevesiz
                      </button>
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedFrame: 'wood'})}
                        className="px-3 py-2.5 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: selectedProduct.selectedFrame === 'wood' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: selectedProduct.selectedFrame === 'wood' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${selectedProduct.selectedFrame === 'wood' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Ahşap Çerçeve
                      </button>
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedFrame: 'black'})}
                        className="px-3 py-2.5 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: selectedProduct.selectedFrame === 'black' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: selectedProduct.selectedFrame === 'black' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${selectedProduct.selectedFrame === 'black' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Siyah Çerçeve
                      </button>
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedFrame: 'white'})}
                        className="px-3 py-2.5 text-sm font-medium transition rounded-sm"
                        style={{ 
                          backgroundColor: selectedProduct.selectedFrame === 'white' ? (darkMode ? '#ffffff' : '#1c1917') : 'transparent',
                          color: selectedProduct.selectedFrame === 'white' ? (darkMode ? '#1c1917' : '#ffffff') : (darkMode ? '#ffffff' : '#1c1917'),
                          border: `1px solid ${selectedProduct.selectedFrame === 'white' ? (darkMode ? '#ffffff' : '#1c1917') : '#a8a29e'}`
                        }}
                      >
                        Beyaz Çerçeve
                      </button>
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div>
                    <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider mb-2`}>Adet</p>
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex items-center rounded-sm"
                        style={{ border: `1px solid ${darkMode ? '#78716c' : '#a8a29e'}` }}
                      >
                        <button 
                          onClick={() => selectedProduct.quantity > 1 && setSelectedProduct({...selectedProduct, quantity: (selectedProduct.quantity || 1) - 1})}
                          className="w-9 h-9 flex items-center justify-center transition disabled:opacity-50"
                          style={{ color: darkMode ? '#ffffff' : '#1c1917' }}
                          disabled={!selectedProduct.quantity || selectedProduct.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium" style={{ color: darkMode ? '#ffffff' : '#1c1917' }}>
                          {selectedProduct.quantity || 1}
                        </span>
                        <button 
                          onClick={() => setSelectedProduct({...selectedProduct, quantity: (selectedProduct.quantity || 1) + 1})}
                          className="w-9 h-9 flex items-center justify-center transition"
                          style={{ color: darkMode ? '#ffffff' : '#1c1917' }}
                          disabled={selectedProduct.stock <= (selectedProduct.quantity || 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {selectedProduct.stock < 10 && selectedProduct.stock > 0 && (
                        <span className="text-xs text-orange-500">Son {selectedProduct.stock} adet!</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={() => {
                        if (selectedProduct.selectedFrame === undefined) {
                          alert('Lütfen çerçeve seçeneği seçin');
                        } else if (selectedProduct.selectedSize === undefined) {
                          alert('Lütfen boyut seçin');
                        } else {
                          addToCart(selectedProduct, selectedProduct.selectedFrame !== 'none');
                        }
                      }} 
                      disabled={selectedProduct.stock === 0}
                      className={`w-full py-3.5 text-sm font-medium uppercase tracking-wider transition rounded-sm ${selectedProduct.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                      style={{ 
                        backgroundColor: darkMode ? '#ffffff' : '#1c1917',
                        color: darkMode ? '#1c1917' : '#ffffff'
                      }}
                    >
                      {selectedProduct.stock === 0 ? t.outOfStock : t.addToCart}
                    </button>

                    <button 
                      onClick={() => {
                        if (selectedProduct.selectedSize === undefined) {
                          alert('Lütfen boyut seçin');
                        } else if (selectedProduct.selectedFrame === undefined) {
                          alert('Lütfen çerçeve seçeneği seçin');
                        } else {
                          const frameText = selectedProduct.selectedFrame === 'none' ? 'Çerçevesiz' : 
                            selectedProduct.selectedFrame === 'wood' ? 'Ahşap Çerçeve' :
                            selectedProduct.selectedFrame === 'black' ? 'Siyah Çerçeve' : 'Beyaz Çerçeve';
                          const message = `Merhaba! LUUZ'dan sipariş vermek istiyorum:\n\n` +
                            `Urun: ${selectedProduct.name}\n` +
                            `Boyut: ${selectedProduct.selectedSize}\n` +
                            `Cerceve: ${frameText}\n` +
                            `Siparis vermek istiyorum.`;
                          window.open(`https://wa.me/905060342409?text=${encodeURIComponent(message)}`, '_blank');
                        }
                      }}
                      className="w-full py-3.5 text-sm font-medium uppercase tracking-wider transition flex items-center justify-center gap-2 rounded-sm group"
                      style={{ 
                        border: `1px solid ${darkMode ? '#78716c' : '#a8a29e'}`,
                        color: darkMode ? '#ffffff' : '#1c1917',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#ffffff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = darkMode ? '#78716c' : '#a8a29e'; e.currentTarget.style.color = darkMode ? '#ffffff' : '#1c1917'; }}
                    >
                      <MessageCircle size={16} />
                      WhatsApp ile Sipariş Ver
                    </button>
                  </div>

                  {/* Accordion - Detaylar, Kargo, Malzemeler */}
                  <div className={`pt-4 border-t ${theme.border} space-y-0`}>
                    {/* Detaylar */}
                    <div className={`border-b ${theme.border}`}>
                      <button 
                        onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                        className={`w-full py-4 flex items-center justify-between ${theme.text}`}
                      >
                        <span className="text-sm font-medium">Detaylar</span>
                        {openAccordion === 'details' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {openAccordion === 'details' && (
                        <div className={`pb-4 text-sm ${theme.textSecondary} leading-relaxed`}>
                          <p>{selectedProduct.description || 'Bu poster, yüksek kaliteli baskı teknolojisi ile üretilmiştir. Canlı renkler ve keskin detaylar ile mekanlarınıza şıklık katacaktır.'}</p>
                        </div>
                      )}
                    </div>

                    {/* Kargo */}
                    <div className={`border-b ${theme.border}`}>
                      <button 
                        onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                        className={`w-full py-4 flex items-center justify-between ${theme.text}`}
                      >
                        <span className="text-sm font-medium">Kargo</span>
                        {openAccordion === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {openAccordion === 'shipping' && (
                        <div className={`pb-4 text-sm ${theme.textSecondary} leading-relaxed space-y-2`}>
                          <p>• Türkiye geneli ücretsiz kargo</p>
                          <p>• 2-4 iş günü içinde teslimat</p>
                          <p>• Özel koruyucu ambalaj ile gönderim</p>
                          <p>• Kargo takip numarası SMS ile iletilir</p>
                        </div>
                      )}
                    </div>

                    {/* Malzemeler */}
                    <div>
                      <button 
                        onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
                        className={`w-full py-4 flex items-center justify-between ${theme.text}`}
                      >
                        <span className="text-sm font-medium">Malzemeler</span>
                        {openAccordion === 'materials' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {openAccordion === 'materials' && (
                        <div className={`pb-4 text-sm ${theme.textSecondary} leading-relaxed space-y-2`}>
                          <p>• 200gr mat kuşe kağıt</p>
                          <p>• UV dayanıklı mürekkep</p>
                          <p>• Çerçeveli seçenekte: Ahşap çerçeve</p>
                          <p>• Anti-yansıma cam</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Products */}
            <div className={`mt-12 pt-8 border-t ${theme.border}`}>
              <h3 className={`text-xl font-medium tracking-wide ${theme.text} uppercase mb-6`}>Benzer Ürünler</h3>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">{products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 6).map(p => (
                <div 
                  key={p.id} 
                  className="flex-shrink-0 w-48 md:w-56 group cursor-pointer" 
                  onClick={() => navigateToPage('product', {...p, selectedSize: undefined, selectedFrame: undefined})}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                    {/* First Image */}
                    <img src={p.images?.[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
                    {/* Second Image (shown on hover) */}
                    <img src={p.images?.[1] || p.images?.[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <Heart size={16} fill={isFavorite(p.id) ? theme.accent : 'none'} color={isFavorite(p.id) ? theme.accent : (darkMode ? '#fff' : '#000')} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setQuickViewProduct({...p, selectedSize: undefined, selectedFrame: undefined, quantity: 1, activeIndex: 0}); }} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-stone-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
                        <ZoomIn size={16} className={darkMode ? 'text-white' : 'text-stone-900'} />
                      </button>
                    </div>
                    {p.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-[10px] font-medium uppercase z-10">İndirim</div>}
                  </div>
                  <div>
                    <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider mb-1`}>LUUZ POSTER</p>
                    <h4 className={`text-sm ${theme.text} mb-1 line-clamp-2`}>{p.name}</h4>
                    <p className={`text-sm ${theme.text}`}>
                      {p.discount > 0 ? (
                        <>
                          <span className="line-through text-stone-400 mr-2">{p.priceUnframed} TL</span>
                          <span className="text-red-500">{Math.round(p.priceUnframed * (1 - p.discount/100))} TL</span>
                        </>
                      ) : (
                        <span>{Math.round(p.priceUnframed * 0.7)} TL – {p.priceUnframed} TL</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}</div>
            </div>
          </div>

          {/* Newsletter - Product Page */}
          <section className={`py-8 ${darkMode ? 'bg-stone-800' : 'bg-stone-100'}`}>
            <div className="max-w-2xl mx-auto px-4 text-center">
              <h3 className={`text-lg font-bold ${theme.text} mb-2`}>{t.newsletter}</h3>
              <p className={`${theme.textSecondary} mb-4 text-xs`}>İndirimlerden ilk siz haberdar olun</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input type="email" placeholder="E-posta" className={`flex-1 px-3 py-2 rounded-lg text-sm ${theme.input} border`} />
                <button className="text-stone-900 px-4 py-2 rounded-lg text-sm font-medium" style={{background: theme.accent}}>{t.subscribe}</button>
              </div>
            </div>
          </section>

          {/* Footer - Product Page */}
          <footer className={`${theme.bgTertiary} py-12 border-t ${theme.border}`}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-8 mb-4" />
                  <p className={`${theme.textMuted} text-xs`}>Özgün duvar sanatı tasarımları.</p>
                  <div className="flex gap-3 mt-4"><button className={theme.textMuted}><Instagram size={18} /></button><button className={theme.textMuted}><Twitter size={18} /></button><button className={theme.textMuted}><Facebook size={18} /></button></div>
                </div>
                <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>Linkler</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li><button onClick={() => navigateToPage('collection')}>{t.collection}</button></li><li><button onClick={() => setShowAbout(true)}>{t.about}</button></li><li><button onClick={() => setShowFAQ(true)}>{t.faq}</button></li></ul></div>
                <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>Yardım</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li>Kargo Bilgileri</li><li>İade & Değişim</li><li><button onClick={() => setShowOrderHistory(true)}>{t.orderHistory}</button></li></ul></div>
                <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>İletişim</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li>info@luuz.com.tr</li><li>+90 212 555 00 00</li><li>İstanbul, Türkiye</li></ul></div>
              </div>
              <div className={`border-t ${theme.border} mt-8 pt-8 flex justify-between items-center ${theme.textMuted} text-xs`}>
                <span>© 2025 LUUZ. Tüm hakları saklıdır.</span>
              </div>
            </div>
          </footer>
        </div>
      )}
      {/* Cart */}
      {showCart && (
        <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className={`absolute right-0 top-0 h-full w-full max-w-md ${theme.bgSecondary} shadow-2xl flex flex-col`}>
            <div className={`p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.cart} ({totalItems})</h2><button onClick={() => setShowCart(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? <div className="text-center py-16"><ShoppingCart size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><p className={theme.textMuted}>{t.empty}</p></div> : (
                <div className="space-y-4">{cart.map(item => (
                  <div key={item.cartId} className={`flex gap-4 ${theme.card} border rounded-xl p-3`}>
                    <img src={item.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${theme.text}`}>{item.name}</h3>
                      <p className={`text-xs ${theme.textMuted}`}>{item.selectedSize || '50x70'} cm • {item.isFramed ? t.framed : t.unframed}</p>
                      {item.discount > 0 && <p className="text-xs text-green-400">-{item.discount}%</p>}
                      <p className="font-bold mt-1" style={{color: theme.accent}}>{item.price}₺</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className={`w-7 h-7 ${theme.card} border rounded flex items-center justify-center`}><Minus size={12} /></button>
                        <span className={`w-6 text-center text-sm ${theme.text}`}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className={`w-7 h-7 ${theme.card} border rounded flex items-center justify-center`}><Plus size={12} /></button>
                        <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="ml-auto text-red-400 text-xs">Kaldır</button>
                      </div>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
            {cart.length > 0 && (
              <div className={`p-5 border-t ${theme.border} ${theme.bgTertiary}`}>
                <div className="flex gap-2 mb-4"><input type="text" placeholder="Kupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className={`flex-1 px-3 py-2 rounded-lg text-sm ${theme.input} border`} /><button onClick={applyCoupon} className="px-4 py-2 rounded-lg text-xs font-medium text-stone-900" style={{background: theme.accent}}>{t.applyCoupon}</button></div>
                {appliedCoupon && <div className="flex items-center justify-between mb-2 text-green-400 text-sm"><span className="flex items-center gap-1"><Tag size={14} />{appliedCoupon.code}</span><span>-{appliedCoupon.type === 'percent' ? `${appliedCoupon.discount}%` : `${appliedCoupon.discount}₺`}</span></div>}
                <div className={`flex justify-between mb-2 text-sm ${theme.textSecondary}`}><span>Ara Toplam</span><span>{subtotal}₺</span></div>
                {couponDiscount > 0 && <div className="flex justify-between mb-2 text-sm text-green-400"><span>İndirim</span><span>-{Math.round(couponDiscount)}₺</span></div>}
                <div className={`flex justify-between mb-2 text-sm ${theme.textSecondary}`}><span>Kargo</span><span>{totalPrice >= 500 ? 'Ücretsiz' : '49₺'}</span></div>
                <div className={`flex justify-between mb-4 text-lg font-bold ${theme.text}`}><span>{t.total}</span><span style={{color: theme.accent}}>{totalPrice >= 500 ? Math.round(totalPrice) : Math.round(totalPrice) + 49}₺</span></div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true); }} className="w-full text-stone-900 py-4 rounded-xl font-semibold shadow-lg" style={{background: theme.accent}}>{t.checkout}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-lg w-full my-8 shadow-2xl`}>
            <div className={`p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.checkout}</h2><button onClick={() => setShowCheckout(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Ad *" value={checkoutData.firstName} onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
                <input type="text" placeholder="Soyad" value={checkoutData.lastName} onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              </div>
              <input type="email" placeholder="E-posta *" value={checkoutData.email} onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})} className={`w-full ${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              <input type="tel" placeholder="Telefon" value={checkoutData.phone} onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})} className={`w-full ${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              <input type="text" placeholder="Adres" value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})} className={`w-full ${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Şehir" value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
                <input type="text" placeholder="Posta Kodu" value={checkoutData.postalCode} onChange={(e) => setCheckoutData({...checkoutData, postalCode: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              </div>
              <hr className={theme.border} />
              <input type="text" placeholder="Kart No *" value={checkoutData.cardNumber} onChange={(e) => setCheckoutData({...checkoutData, cardNumber: e.target.value})} className={`w-full ${theme.input} border rounded-xl px-4 py-3 text-sm font-mono`} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="AA/YY" value={checkoutData.expiry} onChange={(e) => setCheckoutData({...checkoutData, expiry: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
                <input type="text" placeholder="CVV" value={checkoutData.cvv} onChange={(e) => setCheckoutData({...checkoutData, cvv: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              </div>
              <div className={`${theme.card} border rounded-xl p-4 flex justify-between text-lg font-bold ${theme.text}`}><span>{t.total}</span><span style={{color: theme.accent}}>{totalPrice >= 500 ? Math.round(totalPrice) : Math.round(totalPrice) + 49}₺</span></div>
              <button onClick={handleCheckout} className="w-full text-stone-900 py-4 rounded-xl font-semibold shadow-lg" style={{background: theme.accent}}>Siparişi Tamamla</button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.favorites} ({favorites.length})</h2><button onClick={() => setShowFavorites(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-5">
              {favorites.length === 0 ? <div className="text-center py-12"><Heart size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><p className={theme.textMuted}>Henüz favori yok</p></div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.filter(p => isFavorite(p.id)).map(product => (
                    <div key={product.id}>
                      <div className={`relative overflow-hidden ${theme.card} rounded-xl border`}>
                        <button onClick={() => toggleFavorite(product.id)} className="absolute top-2 right-2 z-10 bg-red-500/80 rounded-full p-1.5"><X size={12} className="text-white" /></button>
                        <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover cursor-pointer" onClick={() => { setSelectedProduct(product); setShowFavorites(false); }} />
                      </div>
                      <p className={`text-sm ${theme.text} mt-2`}>{product.name}</p>
                      <p className={`text-xs ${theme.textMuted}`}>{product.priceUnframed}₺</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.orderHistory}</h2><button onClick={() => setShowOrderHistory(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-5 space-y-3">
              {!user ? (
                <div className="text-center py-12">
                  <User size={48} className={`mx-auto mb-4 ${theme.textMuted}`} />
                  <p className={`${theme.textMuted} mb-4`}>Siparişlerinizi görmek için giriş yapın</p>
                  <button onClick={() => { setShowOrderHistory(false); setShowAuthModal(true); }} className="px-6 py-2 rounded-xl text-stone-900 font-medium" style={{background: theme.accent}}>Giriş Yap</button>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-12"><Package size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><p className={theme.textMuted}>Henüz sipariş yok</p></div>
              ) : (
                userOrders.map(order => (
                  <div key={order.id} className={`${theme.card} border rounded-xl p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div><p className={`font-mono text-sm ${theme.text}`}>#{order.id.slice(-8).toUpperCase()}</p><p className={`text-xs ${theme.textMuted}`}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p></div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-stone-500/20 text-stone-400'
                      }`}>
                        {order.status === 'delivered' ? 'Teslim Edildi' :
                         order.status === 'shipped' ? 'Kargoda' :
                         order.status === 'processing' ? 'Hazırlanıyor' : 'Bekliyor'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center"><span className={`text-xs ${theme.textMuted}`}>{order.items?.length || 0} ürün</span><span className={`font-bold ${theme.text}`}>₺{order.total}</span></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compare */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.compare} ({compareProducts.length})</h2><button onClick={() => setShowCompare(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full">
                <thead><tr><th className={`text-left p-2 ${theme.textMuted} text-xs`}></th>{compareProducts.map(p => <th key={p.id} className="p-2 min-w-[150px]"><img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-2" /><p className={`text-sm ${theme.text}`}>{p.name}</p></th>)}</tr></thead>
                <tbody className={`text-sm ${theme.textSecondary}`}>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">{t.price}</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.priceUnframed}₺</td>)}</tr>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">{t.size}</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.size}</td>)}</tr>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">Kategori</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.category}</td>)}</tr>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">Stok</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.stock > 0 ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-red-400 mx-auto" />}</td>)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.about}</h2><button onClick={() => setShowAbout(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl tracking-widest font-light mb-4" style={{fontFamily: "'Raleway', sans-serif", letterSpacing: '0.3em', color: theme.accent}}>LUUZ</h3>
                <p className={theme.textSecondary}>LUUZ, 2020 yılında İstanbul'da kurulmuş bir duvar sanatı markasıdır. Misyonumuz, özgün ve kaliteli tasarımlarla yaşam alanlarınıza karakter katmaktır.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`${theme.card} border rounded-xl p-4`}><p className="text-2xl font-bold" style={{color: theme.accent}}>5000+</p><p className={`text-xs ${theme.textMuted}`}>Mutlu Müşteri</p></div>
                <div className={`${theme.card} border rounded-xl p-4`}><p className="text-2xl font-bold" style={{color: theme.accent}}>200+</p><p className={`text-xs ${theme.textMuted}`}>Özgün Tasarım</p></div>
                <div className={`${theme.card} border rounded-xl p-4`}><p className="text-2xl font-bold" style={{color: theme.accent}}>4.9</p><p className={`text-xs ${theme.textMuted}`}>Ortalama Puan</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.faq}</h2><button onClick={() => setShowFAQ(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-5 space-y-2">
              {faqData.map((faq, idx) => (
                <div key={idx} className={`${theme.card} border rounded-xl overflow-hidden`}>
                  <button onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)} className={`w-full p-4 flex justify-between items-center text-left ${theme.text}`}>
                    <span className="font-medium text-sm">{faq.q}</span>
                    {openFAQ === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openFAQ === idx && <div className={`px-4 pb-4 ${theme.textSecondary} text-sm`}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat */}
      {showChat && (
        <div className={`fixed bottom-24 right-6 w-80 ${theme.bgSecondary} rounded-2xl shadow-2xl z-40 overflow-hidden border ${theme.border}`}>
          <div className="p-4 text-stone-900 flex justify-between items-center" style={{background: theme.accent}}>
            <div className="flex items-center gap-3"><MessageCircle size={20} /><div><h3 className="font-semibold text-sm">Canlı Destek</h3><p className="text-xs opacity-80">Genellikle 2 dk içinde</p></div></div>
            <button onClick={() => setShowChat(false)}><X size={18} /></button>
          </div>
          <div className={`p-4 h-64 ${theme.bgTertiary}`}><div className={`${theme.bgSecondary} p-3 rounded-xl shadow-sm`}><p className={`text-sm ${theme.text}`}>Merhaba! Nasıl yardımcı olabilirim? 😊</p></div></div>
          <div className={`p-3 border-t ${theme.border}`}>
            <div className="flex gap-2"><input type="text" placeholder="Mesajınızı yazın..." className={`flex-1 ${theme.input} border rounded-xl px-4 py-2 text-sm`} /><button className="w-10 h-10 rounded-xl text-stone-900 flex items-center justify-center" style={{background: theme.accent}}><ChevronRight size={18} /></button></div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
          <div className={`${theme.bgSecondary} rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={`p-6 border-b ${theme.border} flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${theme.text}`}>
                {authMode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
              </h2>
              <button onClick={() => setShowAuthModal(false)} className={theme.textMuted}><X size={24} /></button>
            </div>

            {/* Form */}
            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="p-6 space-y-4">
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Ad</label>
                    <input
                      type="text"
                      value={authForm.firstName}
                      onChange={e => setAuthForm({...authForm, firstName: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Soyad</label>
                    <input
                      type="text"
                      value={authForm.lastName}
                      onChange={e => setAuthForm({...authForm, lastName: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>E-posta</label>
                <div className="relative">
                  <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.textMuted}`} />
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={e => setAuthForm({...authForm, email: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Telefon</label>
                  <div className="relative">
                    <Phone size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.textMuted}`} />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={authForm.phone}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        let formatted = value;
                        if (value.length > 4) formatted = value.slice(0, 4) + ' ' + value.slice(4);
                        if (value.length > 7) formatted = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
                        if (value.length > 9) formatted = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 9) + ' ' + value.slice(9);
                        setAuthForm({...authForm, phone: formatted});
                      }}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      placeholder="0532 123 45 67"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Şifre</label>
                <div className="relative">
                  <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.textMuted}`} />
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={e => setAuthForm({...authForm, password: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Şifre Tekrar</label>
                  <div className="relative">
                    <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.textMuted}`} />
                    <input
                      type="password"
                      value={authForm.confirmPassword}
                      onChange={e => setAuthForm({...authForm, confirmPassword: e.target.value})}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-500 text-sm">{authError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl text-stone-900 font-semibold hover:opacity-90 transition disabled:opacity-50"
                style={{background: theme.accent}}
              >
                {authLoading ? 'Yükleniyor...' : authMode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
              </button>
            </form>

            {/* Footer */}
            <div className={`p-6 border-t ${theme.border} text-center`}>
              {authMode === 'login' ? (
                <p className={`text-sm ${theme.textSecondary}`}>
                  Hesabınız yok mu?{' '}
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="font-semibold hover:underline"
                    style={{color: theme.accent}}
                  >
                    Kayıt Ol
                  </button>
                </p>
              ) : (
                <p className={`text-sm ${theme.textSecondary}`}>
                  Zaten hesabınız var mı?{' '}
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="font-semibold hover:underline"
                    style={{color: theme.accent}}
                  >
                    Giriş Yap
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && user && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
          <div className={`${theme.bgSecondary} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={`sticky top-0 ${theme.bgSecondary} p-6 border-b ${theme.border} flex items-center justify-between z-10`}>
              <h2 className={`text-xl font-bold ${theme.text}`}>Hesabım</h2>
              <button onClick={() => setShowProfile(false)} className={theme.textMuted}><X size={24} /></button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* User Info Card */}
              <div className={`${theme.card} rounded-2xl border p-6`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-stone-900" style={{background: theme.accent}}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme.text}`}>{user.displayName || 'Kullanıcı'}</h3>
                    <p className={`text-sm ${theme.textMuted}`}>{user.email}</p>
                  </div>
                </div>

                {editingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Ad</label>
                        <input
                          type="text"
                          value={userProfile?.firstName || ''}
                          onChange={e => setUserProfile({...userProfile, firstName: e.target.value})}
                          className={`w-full px-4 py-2 rounded-xl ${theme.input} border text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Soyad</label>
                        <input
                          type="text"
                          value={userProfile?.lastName || ''}
                          onChange={e => setUserProfile({...userProfile, lastName: e.target.value})}
                          className={`w-full px-4 py-2 rounded-xl ${theme.input} border text-sm`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Telefon</label>
                      <input
                        type="tel"
                        value={userProfile?.phone || ''}
                        onChange={e => setUserProfile({...userProfile, phone: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl ${theme.input} border text-sm`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Adres</label>
                      <input
                        type="text"
                        value={userProfile?.address || ''}
                        onChange={e => setUserProfile({...userProfile, address: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl ${theme.input} border text-sm`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Şehir</label>
                        <input
                          type="text"
                          value={userProfile?.city || ''}
                          onChange={e => setUserProfile({...userProfile, city: e.target.value})}
                          className={`w-full px-4 py-2 rounded-xl ${theme.input} border text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-medium ${theme.textSecondary} mb-1 block`}>Posta Kodu</label>
                        <input
                          type="text"
                          value={userProfile?.postalCode || ''}
                          onChange={e => setUserProfile({...userProfile, postalCode: e.target.value})}
                          className={`w-full px-4 py-2 rounded-xl ${theme.input} border text-sm`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 py-2 rounded-xl text-stone-900 font-medium text-sm" style={{background: theme.accent}}>
                        Kaydet
                      </button>
                      <button type="button" onClick={() => setEditingProfile(false)} className={`flex-1 py-2 rounded-xl border ${theme.border} ${theme.text} font-medium text-sm`}>
                        İptal
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setEditingProfile(true)} className={`w-full py-2 rounded-xl border ${theme.border} ${theme.textSecondary} text-sm font-medium hover:border-amber-500 transition`}>
                    Profili Düzenle
                  </button>
                )}
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => { setShowProfile(false); setShowFavorites(true); }} className={`${theme.card} rounded-xl border p-4 text-center hover:border-amber-500 transition`}>
                  <Heart size={24} className={`mx-auto mb-2 ${theme.textSecondary}`} style={{color: favorites.length > 0 ? theme.accent : undefined}} />
                  <p className={`text-sm font-medium ${theme.text}`}>Favorilerim</p>
                  <p className={`text-xs ${theme.textMuted}`}>{favorites.length} ürün</p>
                </button>
                <button onClick={() => { setShowProfile(false); setShowOrderHistory(true); }} className={`${theme.card} rounded-xl border p-4 text-center hover:border-amber-500 transition`}>
                  <Package size={24} className={`mx-auto mb-2 ${theme.textSecondary}`} />
                  <p className={`text-sm font-medium ${theme.text}`}>Siparişlerim</p>
                  <p className={`text-xs ${theme.textMuted}`}>{userOrders.length} sipariş</p>
                </button>
                <button onClick={() => { setShowProfile(false); setShowCart(true); }} className={`${theme.card} rounded-xl border p-4 text-center hover:border-amber-500 transition`}>
                  <ShoppingCart size={24} className={`mx-auto mb-2 ${theme.textSecondary}`} />
                  <p className={`text-sm font-medium ${theme.text}`}>Sepetim</p>
                  <p className={`text-xs ${theme.textMuted}`}>{totalItems} ürün</p>
                </button>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Son Siparişler</h3>
                {userOrders.length > 0 ? (
                  <div className="space-y-3">
                    {userOrders.slice(0, 3).map(order => (
                      <div key={order.id} className={`${theme.card} rounded-xl border p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${theme.text}`}>#{order.id.slice(-8).toUpperCase()}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                            order.status === 'processing' ? 'bg-amber-500/20 text-amber-500' :
                            'bg-stone-500/20 text-stone-500'
                          }`}>
                            {order.status === 'delivered' ? 'Teslim Edildi' :
                             order.status === 'shipped' ? 'Kargoda' :
                             order.status === 'processing' ? 'Hazırlanıyor' : 'Bekliyor'}
                          </span>
                        </div>
                        <p className={`text-xs ${theme.textMuted}`}>
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')} • {order.items?.length || 0} ürün • ₺{order.total}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${theme.card} rounded-xl border p-8 text-center`}>
                    <Package size={40} className={`mx-auto mb-3 ${theme.textMuted}`} />
                    <p className={`${theme.textMuted}`}>Henüz siparişiniz yok</p>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full py-3 rounded-xl border border-red-500/30 text-red-500 font-medium hover:bg-red-500/10 transition flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/905060342409?text=Merhaba! LUUZ hakkında bilgi almak istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </a>

      {/* Scroll Top */}
      {showScrollTop && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 left-6 w-12 h-12 ${theme.bgSecondary} border ${theme.border} rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center justify-center ${theme.textSecondary}`}><ArrowUp size={20} /></button>}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
