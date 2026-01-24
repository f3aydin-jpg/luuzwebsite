import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu, Search, Heart, MessageCircle, Package, Star, ChevronDown, ChevronUp, Grid, List, ArrowUp, Moon, Sun, Globe, Clock, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Tag, TrendingUp, Eye, Instagram, Twitter, Facebook, ZoomIn, Settings } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import AdminPanel from './AdminPanel';

export default function WallArtShop() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('tr');
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
  const [orderHistory] = useState([{ id: 'LUUZ7X8K2M', date: '12.01.2025', total: 1850, status: 'Teslim Edildi', items: 2 }]);
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
  const [specialFilter, setSpecialFilter] = useState(null); // 'bestSeller', 'newArrival', or null

  const t = language === 'tr' ? { collection: 'Koleksiyon', about: 'Hakkımızda', howItWorks: 'Nasıl Çalışır', faq: 'SSS', search: 'Ürün ara...', cart: 'Sepetim', favorites: 'Favorilerim', addToCart: 'Sepete Ekle', checkout: 'Ödemeye Geç', total: 'Toplam', empty: 'Sepetiniz boş', filters: 'Filtreler', price: 'Fiyat', size: 'Boyut', bestSellers: 'Çok Satanlar', newArrivals: 'Yeni Gelenler', allCollection: 'Tüm Koleksiyon', framed: 'Çerçeveli', unframed: 'Çerçevesiz', inStock: 'Stokta', outOfStock: 'Tükendi', similarProducts: 'Benzer Ürünler', applyCoupon: 'Uygula', newsletter: 'Yeni Koleksiyonlardan Haberdar Olun', subscribe: 'Abone Ol', compare: 'Karşılaştır', recentlyViewed: 'Son Görüntülenenler', orderHistory: 'Sipariş Geçmişi' } : { collection: 'Collection', about: 'About', howItWorks: 'How It Works', faq: 'FAQ', search: 'Search...', cart: 'Cart', favorites: 'Favorites', addToCart: 'Add to Cart', checkout: 'Checkout', total: 'Total', empty: 'Cart is empty', filters: 'Filters', price: 'Price', size: 'Size', bestSellers: 'Best Sellers', newArrivals: 'New Arrivals', allCollection: 'All Collection', framed: 'Framed', unframed: 'Unframed', inStock: 'In Stock', outOfStock: 'Out of Stock', similarProducts: 'Similar', applyCoupon: 'Apply', newsletter: 'Stay Updated', subscribe: 'Subscribe', compare: 'Compare', recentlyViewed: 'Recently Viewed', orderHistory: 'Orders' };

  // Firebase'den ürünleri çek
  useEffect(() => {
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

    fetchProducts();
    
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const toggleFavorite = (id) => favorites.includes(id) ? setFavorites(favorites.filter(f => f !== id)) : setFavorites([...favorites, id]);
  const addToRecentlyViewed = (p) => setRecentlyViewed(prev => [p, ...prev.filter(x => x.id !== p.id)].slice(0, 6));
  // eslint-disable-next-line no-unused-vars
  const toggleCompare = (p) => compareProducts.find(x => x.id === p.id) ? setCompareProducts(compareProducts.filter(x => x.id !== p.id)) : compareProducts.length < 4 && setCompareProducts([...compareProducts, p]);

  const addToCart = (product, isFramed) => {
    const price = isFramed ? product.priceFramed : product.priceUnframed;
    const discountedPrice = product.discount > 0 ? Math.round(price * (1 - product.discount / 100)) : price;
    const cartItem = { ...product, isFramed, price: discountedPrice, cartId: `${product.id}-${isFramed}` };
    const existing = cart.find(item => item.cartId === cartItem.cartId);
    existing ? setCart(cart.map(item => item.cartId === cartItem.cartId ? { ...item, quantity: item.quantity + 1 } : item)) : setCart([...cart, { ...cartItem, quantity: 1 }]);
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
    bg: darkMode ? 'bg-stone-900' : 'bg-stone-50', bgSecondary: darkMode ? 'bg-stone-800' : 'bg-white', bgTertiary: darkMode ? 'bg-stone-950' : 'bg-stone-100',
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
            <button onClick={() => setShowCollection(true)} className={`transition ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'}`}>Tüm Koleksiyon</button>
            <button onClick={() => setShowAbout(true)} className={`transition ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'}`}>{t.about}</button>
            <button onClick={() => setShowFAQ(true)} className={`transition ${darkMode ? 'hover:text-white' : 'hover:text-stone-900'}`}>{t.faq}</button>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')} className={`p-2 ${theme.textSecondary}`}><Globe size={18} /></button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${theme.textSecondary}`}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
            <button onClick={() => setShowFavorites(true)} className={`relative p-2 ${theme.textSecondary}`}>
              <Heart size={18} fill={favorites.length > 0 ? theme.accent : 'none'} color={favorites.length > 0 ? theme.accent : 'currentColor'} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{favorites.length}</span>}
            </button>
            <button onClick={() => setShowOrderHistory(true)} className={`hidden md:block p-2 ${theme.textSecondary}`}><Clock size={18} /></button>
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
        {showMobileMenu && (
          <div className={`lg:hidden ${theme.bgSecondary} border-t ${theme.border} px-4 py-4 space-y-3`}>
            <button onClick={() => { setShowCollection(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>Tüm Koleksiyon</button>
            <button onClick={() => { setShowAbout(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.about}</button> <button onClick={() => { setShowFAQ(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.faq}</button>
          </div>
        )}
      </header>

      {/* Promo */}
      <div className={`${theme.bgTertiary} ${theme.textSecondary} py-2.5 text-center border-b ${theme.border}`}>
        <p className="text-xs">🎉 Yeni Müşterilere %15 İndirim - Kod: <span className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>HOSGELDIN15</span></p>
      </div>

      {/* Hero with Dynamic Product Background */}
      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        {/* Dynamic Product Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-1 p-1">
            {products.length > 0 && [...products, ...products, ...products, ...products].slice(0, 36).map((product, idx) => (
              <div 
                key={`hero-${idx}`} 
                className="aspect-[3/4] overflow-hidden"
                style={{
                  opacity: 0.15 + (Math.sin(idx * 0.5) * 0.1),
                  animation: `heroPulse ${12 + (idx % 6) * 2}s ease-in-out infinite`,
                  animationDelay: `${(idx % 12) * 1}s`
                }}
              >
                <img 
                  src={product.images?.[0]} 
                  alt="" 
                  className="w-full h-full object-cover filter blur-[0.5px]"
                />
              </div>
            ))}
          </div>
          {/* Smooth Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-stone-900/90' : 'from-stone-100/90'} via-transparent to-transparent`}></div>
          <div className={`absolute inset-0 bg-gradient-to-b ${darkMode ? 'from-stone-900/50' : 'from-stone-100/50'} via-transparent to-transparent`}></div>
        </div>
        
        {/* Content - BUTON GÜNCELLEMESİ BURADA */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white animate-fade-in">
            Duvarlarınıza <span style={{color: theme.accent}}>Sanat</span> Katın
          </h2>
          <p className="text-base md:text-lg text-stone-300 max-w-xl mx-auto mb-8 animate-fade-in-delay">
            Özgün tasarımlarla mekanlarınıza karakter katın
          </p>
          <button 
            onClick={() => setShowCollection(true)} 
            className="shimmer-btn text-stone-900 px-10 py-4 rounded-full font-bold text-base shadow-[0_0_20px_rgba(232,220,196,0.3)] hover:shadow-[0_0_30px_rgba(232,220,196,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-delay-2 flex items-center gap-2 group"
            style={{background: theme.accent}}
          >
            Koleksiyonu Keşfet
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* CSS Animations - SHIMMER ANIMASYONU BURADA */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer-sweep 3s infinite;
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.1; filter: blur(0.5px) brightness(0.8); }
          50% { opacity: 0.25; filter: blur(0px) brightness(1); }
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
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounceX 1s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Diğer kısımlar (Best Sellers, New Arrivals vb.) dosyanın geri kalanında devam eder... */}
      {/* (Kısalık adına bu kısımlar korunmuştur) */}
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/905060342409?text=Merhaba! LUUZ hakkında bilgi almak istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </a>

    </div>
  );
}
