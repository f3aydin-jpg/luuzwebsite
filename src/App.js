import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu, Search, Heart, MessageCircle, Package, Star, ChevronDown, ChevronUp, Filter, Grid, List, ArrowUp, Moon, Sun, Globe, Clock, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Copy, Tag, TrendingUp, Eye, Instagram, Twitter, Facebook, ZoomIn, Settings } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import AdminPanel from './AdminPanel';

export default function WallArtShop() {
  const [darkMode, setDarkMode] = useState(true);
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
  const [showFilters, setShowFilters] = useState(false);
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
  const [orderHistory] = useState([{ id: 'LUUZ7X8K2M', date: '12.01.2025', total: 1850, status: 'Teslim Edildi', items: 2 }]);
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
  const sizes = ['40x60 cm', '50x70 cm', '60x80 cm', '70x100 cm'];
  const coupons = { 'HOSGELDIN15': { discount: 15, type: 'percent' }, 'YAZ50': { discount: 50, type: 'fixed' } };
  const faqData = [{ q: 'Kargo ne kadar sürede gelir?', a: '2-4 iş günü içinde teslim edilir.' }, { q: 'İade koşulları nelerdir?', a: '14 gün içinde koşulsuz iade hakkınız var.' }, { q: 'Çerçeve malzemesi nedir?', a: '%100 doğal ahşaptan el işçiliği ile üretilir.' }];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.priceUnframed >= priceRange[0] && p.priceUnframed <= priceRange[1];
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.size);
    return matchesCategory && matchesSearch && matchesPrice && matchesSize;
  }).sort((a, b) => sortBy === 'priceLow' ? a.priceUnframed - b.priceUnframed : sortBy === 'priceHigh' ? b.priceUnframed - a.priceUnframed : sortBy === 'newest' ? b.isNew - a.isNew : b.isBestSeller - a.isBestSeller);

  const toggleFavorite = (id) => favorites.includes(id) ? setFavorites(favorites.filter(f => f !== id)) : setFavorites([...favorites, id]);
  const addToRecentlyViewed = (p) => setRecentlyViewed(prev => [p, ...prev.filter(x => x.id !== p.id)].slice(0, 6));
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
            <button onClick={() => { setShowCollection(false); setSelectedProduct(null); }} className="text-2xl tracking-wider" style={{fontFamily: "'TAN ST CANARD', serif", letterSpacing: '0.15em', color: theme.accent}}>LUUZ</button>
          </div>
          <nav className={`hidden lg:flex items-center gap-6 text-sm ${theme.textSecondary}`}>
            <button onClick={() => setShowCollection(true)} className="hover:text-white transition">Tüm Koleksiyon</button>
            <button onClick={() => setShowAbout(true)} className="hover:text-white">{t.about}</button>
            <button onClick={() => setShowFAQ(true)} className="hover:text-white">{t.faq}</button>
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
            <button onClick={() => { setShowAbout(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.about}</button>
            <button onClick={() => { setShowFAQ(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.faq}</button>
          </div>
        )}
      </header>

      {/* Promo */}
      <div className={`${theme.bgTertiary} ${theme.textSecondary} py-2.5 text-center border-b ${theme.border}`}>
        <p className="text-xs">🎉 Yeni Müşterilere %15 İndirim - Kod: <span className="text-white font-semibold">HOSGELDIN15</span></p>
      </div>

      {/* Hero with Video Background */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1920&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-fade-in">
            Duvarlarınıza <span style={{color: theme.accent}}>Sanat</span> Katın
          </h2>
          <p className="text-xl md:text-2xl text-stone-300 max-w-2xl mx-auto mb-10 animate-fade-in-delay">
            Özgün tasarımlarla mekanlarınıza karakter katın
          </p>
          <button 
            onClick={() => setShowCollection(true)} 
            className="text-stone-900 px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-delay-2"
            style={{background: theme.accent}}
          >
            Koleksiyonu Keşfet
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-white/70" />
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
      `}</style>

      {/* Features */}
      <section className={`py-8 ${theme.bgSecondary} border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{icon: Truck, title: 'Ücretsiz Kargo', desc: '500₺ üzeri'}, {icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL'}, {icon: RotateCcw, title: '14 Gün İade', desc: 'Koşulsuz'}, {icon: Package, title: 'Özenli Paket', desc: 'Hasar garantisi'}].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 justify-center py-2">
              <item.icon size={20} style={{color: theme.accent}} />
              <div><p className={`text-xs font-medium ${theme.text}`}>{item.title}</p><p className={`text-xs ${theme.textMuted}`}>{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers & New Arrivals - Side by Side */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Best Sellers */}
          <div className={`${theme.card} rounded-2xl border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} style={{color: theme.accent}} />
                <h3 className={`text-xl font-bold ${theme.text}`}>Çok Satanlar</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setBestSellerIndex(prev => prev > 0 ? prev - 1 : Math.max(0, products.filter(p => p.isBestSeller).length - 1))}
                  className={`p-2 rounded-full ${theme.bgTertiary} hover:bg-amber-500 hover:text-stone-900 transition-all`}
                >
                  <ChevronUp size={18} />
                </button>
                <button 
                  onClick={() => setBestSellerIndex(prev => prev < products.filter(p => p.isBestSeller).length - 1 ? prev + 1 : 0)}
                  className={`p-2 rounded-full ${theme.bgTertiary} hover:bg-amber-500 hover:text-stone-900 transition-all`}
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
            
            <div className="relative h-[320px] overflow-hidden">
              {products.filter(p => p.isBestSeller).length > 0 ? (
                products.filter(p => p.isBestSeller).map((product, idx) => (
                  <div 
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      idx === bestSellerIndex 
                        ? 'opacity-100 translate-y-0' 
                        : idx < bestSellerIndex 
                          ? 'opacity-0 -translate-y-full' 
                          : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <div className="flex gap-4 h-full">
                      <div className="relative w-1/2 rounded-xl overflow-hidden group cursor-pointer" onClick={() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 text-stone-900 px-3 py-1 rounded-full text-xs font-bold" style={{background: theme.accent}}>BEST</div>
                        {product.discount > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs">-{product.discount}%</div>}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className={`text-lg font-bold ${theme.text} mb-2`}>{product.name}</h4>
                        <p className={`text-sm ${theme.textSecondary} mb-4 line-clamp-2`}>{product.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                          {product.discount > 0 ? (
                            <>
                              <span className={`text-lg ${theme.textMuted} line-through`}>{product.priceUnframed}₺</span>
                              <span className="text-2xl font-bold text-green-400">{Math.round(product.priceUnframed * (1 - product.discount/100))}₺</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold" style={{color: theme.accent}}>{product.priceUnframed}₺</span>
                          )}
                        </div>
                        <button 
                          onClick={() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); }}
                          className="text-stone-900 px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition w-fit"
                          style={{background: theme.accent}}
                        >
                          Ürünü İncele
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={theme.textMuted}>Henüz çok satan ürün yok</p>
                </div>
              )}
            </div>
            
            {/* Dots Indicator */}
            {products.filter(p => p.isBestSeller).length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {products.filter(p => p.isBestSeller).map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setBestSellerIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === bestSellerIndex ? 'w-6' : ''}`}
                    style={{background: idx === bestSellerIndex ? theme.accent : theme.border}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* New Arrivals */}
          <div className={`${theme.card} rounded-2xl border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">YENİ</span>
                <h3 className={`text-xl font-bold ${theme.text}`}>Yeni Ürünler</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setNewArrivalIndex(prev => prev > 0 ? prev - 1 : Math.max(0, products.filter(p => p.isNew).length - 1))}
                  className={`p-2 rounded-full ${theme.bgTertiary} hover:bg-green-500 hover:text-white transition-all`}
                >
                  <ChevronUp size={18} />
                </button>
                <button 
                  onClick={() => setNewArrivalIndex(prev => prev < products.filter(p => p.isNew).length - 1 ? prev + 1 : 0)}
                  className={`p-2 rounded-full ${theme.bgTertiary} hover:bg-green-500 hover:text-white transition-all`}
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
            
            <div className="relative h-[320px] overflow-hidden">
              {products.filter(p => p.isNew).length > 0 ? (
                products.filter(p => p.isNew).map((product, idx) => (
                  <div 
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      idx === newArrivalIndex 
                        ? 'opacity-100 translate-y-0' 
                        : idx < newArrivalIndex 
                          ? 'opacity-0 -translate-y-full' 
                          : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <div className="flex gap-4 h-full">
                      <div className="relative w-1/2 rounded-xl overflow-hidden group cursor-pointer" onClick={() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); }}>
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">YENİ</div>
                        {product.discount > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs">-{product.discount}%</div>}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className={`text-lg font-bold ${theme.text} mb-2`}>{product.name}</h4>
                        <p className={`text-sm ${theme.textSecondary} mb-4 line-clamp-2`}>{product.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                          {product.discount > 0 ? (
                            <>
                              <span className={`text-lg ${theme.textMuted} line-through`}>{product.priceUnframed}₺</span>
                              <span className="text-2xl font-bold text-green-400">{Math.round(product.priceUnframed * (1 - product.discount/100))}₺</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold" style={{color: theme.accent}}>{product.priceUnframed}₺</span>
                          )}
                        </div>
                        <button 
                          onClick={() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); }}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition w-fit"
                        >
                          Ürünü İncele
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={theme.textMuted}>Henüz yeni ürün yok</p>
                </div>
              )}
            </div>
            
            {/* Dots Indicator */}
            {products.filter(p => p.isNew).length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {products.filter(p => p.isNew).map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setNewArrivalIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === newArrivalIndex ? 'w-6 bg-green-500' : ''}`}
                    style={{background: idx === newArrivalIndex ? undefined : theme.border}}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h3 className={`text-lg font-bold ${theme.text} mb-4 flex items-center gap-2`}><Eye size={18} style={{color: theme.accent}} />{t.recentlyViewed}</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {recentlyViewed.map(p => <div key={p.id} className="flex-shrink-0 w-32 cursor-pointer" onClick={() => setSelectedProduct(p)}><img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover rounded-lg" /><p className={`text-xs ${theme.text} mt-1 truncate`}>{p.name}</p><p className={`text-xs ${theme.textMuted}`}>{p.priceUnframed}₺</p></div>)}
          </div>
        </section>
      )}

      {/* Compare Bar */}
      {compareProducts.length > 0 && (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 ${theme.bgSecondary} rounded-full shadow-2xl border ${theme.border} px-4 py-2 flex items-center gap-3 z-30`}>
          <span className={`text-xs ${theme.textSecondary}`}>{compareProducts.length} ürün</span>
          <div className="flex -space-x-2">{compareProducts.map(p => <img key={p.id} src={p.images[0]} alt="" className="w-8 h-8 rounded-full border-2 border-stone-700 object-cover" />)}</div>
          <button onClick={() => setShowCompare(true)} className="text-stone-900 px-3 py-1 rounded-full text-xs font-medium" style={{background: theme.accent}}>{t.compare}</button>
          <button onClick={() => setCompareProducts([])} className={theme.textMuted}><X size={16} /></button>
        </div>
      )}

      {/* Newsletter */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-r from-stone-800 to-stone-800' : 'bg-gradient-to-r from-stone-200 to-stone-100'} border-y ${theme.border}`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className={`text-2xl font-bold ${theme.text} mb-3`}>{t.newsletter}</h3>
          <p className={`${theme.textSecondary} mb-6 text-sm`}>İndirimlerden ilk siz haberdar olun</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="E-posta" className={`flex-1 px-4 py-3 rounded-xl ${theme.input} border`} />
            <button className="text-stone-900 px-6 py-3 rounded-xl font-medium" style={{background: theme.accent}}>{t.subscribe}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme.bgTertiary} py-12 border-t ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl tracking-wider mb-4" style={{fontFamily: "'TAN ST CANARD', serif", letterSpacing: '0.15em', color: theme.accent}}>LUUZ</h4>
              <p className={`${theme.textMuted} text-xs`}>Özgün duvar sanatı tasarımları.</p>
              <div className="flex gap-3 mt-4"><button className={theme.textMuted}><Instagram size={18} /></button><button className={theme.textMuted}><Twitter size={18} /></button><button className={theme.textMuted}><Facebook size={18} /></button></div>
            </div>
            <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>Linkler</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li><button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>{t.collection}</button></li><li><button onClick={() => setShowAbout(true)}>{t.about}</button></li><li><button onClick={() => setShowFAQ(true)}>{t.faq}</button></li></ul></div>
            <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>Yardım</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li>Kargo Bilgileri</li><li>İade & Değişim</li><li><button onClick={() => setShowOrderHistory(true)}>{t.orderHistory}</button></li></ul></div>
            <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>İletişim</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li>info@luuz.com.tr</li><li>+90 212 555 00 00</li><li>İstanbul, Türkiye</li></ul></div>
          </div>
          <div className={`border-t ${theme.border} mt-8 pt-8 flex justify-between items-center ${theme.textMuted} text-xs`}>
            <span>© 2025 LUUZ. Tüm hakları saklıdır.</span>
            <button onClick={() => setShowAdmin(true)} className="flex items-center gap-1 hover:text-amber-500 transition"><Settings size={14} /> Admin</button>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      {/* Collection Page - Full Screen */}
      {showCollection && (
        <div className={`fixed inset-0 z-50 ${theme.bg} overflow-y-auto animate-fade-in`}>
          {/* Collection Header */}
          <div className={`sticky top-0 ${theme.bgTertiary} border-b ${theme.border} z-10`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button onClick={() => setShowCollection(false)} className={`flex items-center gap-2 ${theme.textSecondary} hover:text-white transition`}>
                <ChevronLeft size={20} />
                <span className="text-sm">Ana Sayfa</span>
              </button>
              <button onClick={() => setShowCollection(false)} className="text-xl tracking-wider hover:opacity-80 transition" style={{fontFamily: "'TAN ST CANARD', serif", letterSpacing: '0.15em', color: theme.accent}}>LUUZ</button>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSearch(!showSearch)} className={`p-2 ${theme.textSecondary}`}><Search size={18} /></button>
                <button onClick={() => setShowFavorites(true)} className={`relative p-2 ${theme.textSecondary}`}>
                  <Heart size={18} fill={favorites.length > 0 ? theme.accent : 'none'} color={favorites.length > 0 ? theme.accent : 'currentColor'} />
                  {favorites.length > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{favorites.length}</span>}
                </button>
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
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'text-stone-900 shadow-lg' : `${theme.card} ${theme.textSecondary} border hover:border-stone-500`}`} 
                  style={selectedCategory === cat ? {background: theme.accent} : {}}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className={`${theme.textMuted} text-sm`}>{filteredProducts.length} ürün</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs ${theme.card} border ${theme.textSecondary}`}><Filter size={14} />{t.filters}</button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`px-4 py-2 rounded-lg text-xs ${theme.input} border`}>
                  <option value="popular">Popüler</option>
                  <option value="newest">En Yeni</option>
                  <option value="priceLow">Fiyat ↑</option>
                  <option value="priceHigh">Fiyat ↓</option>
                </select>
                <div className={`hidden md:flex items-center gap-1 ${theme.card} border rounded-lg p-1`}>
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-stone-600' : ''}`}><Grid size={14} className={viewMode === 'grid' ? 'text-white' : theme.textMuted} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-stone-600' : ''}`}><List size={14} className={viewMode === 'list' ? 'text-white' : theme.textMuted} /></button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className={`${theme.card} border rounded-xl p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`text-xs font-medium ${theme.text} mb-2 block`}>{t.price}</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className={`w-full px-3 py-2 rounded-lg text-xs ${theme.input} border`} placeholder="Min" />
                      <span className={theme.textMuted}>-</span>
                      <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className={`w-full px-3 py-2 rounded-lg text-xs ${theme.input} border`} placeholder="Max" />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${theme.text} mb-2 block`}>{t.size}</label>
                    <div className="flex flex-wrap gap-1">
                      {sizes.map(s => (
                        <button key={s} onClick={() => selectedSizes.includes(s) ? setSelectedSizes(selectedSizes.filter(x => x !== s)) : setSelectedSizes([...selectedSizes, s])} className={`px-2 py-1 rounded-lg text-xs ${selectedSizes.includes(s) ? 'bg-amber-500 text-stone-900' : `${theme.bgTertiary} ${theme.textMuted}`}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => { setPriceRange([0, 1500]); setSelectedSizes([]); setSelectedCategory('Tümü'); }} className={`text-xs ${theme.textMuted} underline`}>Filtreleri Temizle</button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className={`${theme.card} rounded-2xl overflow-hidden border`}>
                      <div className="skeleton aspect-square"></div>
                    </div>
                    <div className="skeleton h-10 rounded-xl mt-3"></div>
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
                    <div className={`relative overflow-hidden ${theme.card} rounded-2xl shadow-lg border transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`}>
                      {product.isNew && <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs z-10">YENİ</div>}
                      {product.discount > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs z-10">-{product.discount}%</div>}
                      {product.stock === 0 && <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center"><span className="text-white text-sm font-medium">{t.outOfStock}</span></div>}
                      <button onClick={() => toggleFavorite(product.id)} className={`absolute ${product.isNew ? 'left-16' : 'left-3'} top-3 z-20 ${theme.bgTertiary} rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110`}><Heart size={16} fill={favorites.includes(product.id) ? theme.accent : 'none'} color={theme.accent} /></button>
                      <div className="cursor-pointer" onClick={() => { setShowCollection(false); setPageTransition(true); setTimeout(() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); addToRecentlyViewed(product); setPageTransition(false); }, 150); }}>
                        <div className="relative">
                          {!imagesLoaded[product.id] && <div className="skeleton absolute inset-0"></div>}
                          <img 
                            src={product.images?.[0]} 
                            alt={product.name} 
                            className={`w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700 ${imagesLoaded[product.id] ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImagesLoaded(prev => ({...prev, [product.id]: true}))}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-sm font-semibold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                            {product.discount > 0 ? (
                              <>
                                <p className="text-sm text-stone-400 line-through">{product.priceUnframed}₺</p>
                                <p className="text-sm text-green-400 font-bold">{Math.round(product.priceUnframed * (1 - product.discount/100))}₺</p>
                              </>
                            ) : (
                              <p className="text-sm text-stone-300">{product.priceUnframed}₺</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowCollection(false); setPageTransition(true); setTimeout(() => { setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); setPageTransition(false); }, 150); }} 
                      disabled={product.stock === 0} 
                      className={`w-full mt-3 text-stone-900 py-2.5 rounded-xl text-sm font-medium transform hover:scale-[1.02] transition-all duration-200 ${product.stock === 0 ? 'opacity-50' : 'hover:shadow-lg'}`} 
                      style={{background: theme.accent}}
                    >
                      {product.stock === 0 ? t.outOfStock : 'Ürünü İncele'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div key={product.id} className={`flex gap-4 ${theme.card} border rounded-xl p-3 hover:shadow-lg transition-all`}>
                    <img 
                      src={product.images?.[0]} 
                      alt={product.name} 
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer" 
                      onClick={() => { setShowCollection(false); setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); }} 
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${theme.text}`}>{product.name}</h3>
                          <p className={`text-xs ${theme.textMuted}`}>{product.category}</p>
                        </div>
                        <button onClick={() => toggleFavorite(product.id)}>
                          <Heart size={16} fill={favorites.includes(product.id) ? theme.accent : 'none'} color={theme.accent} />
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
                          onClick={() => { setShowCollection(false); setSelectedProduct({...product, selectedSize: undefined, selectedFrame: undefined}); }} 
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
              <button onClick={() => { setPageTransition(true); setTimeout(() => { setSelectedProduct(null); setPageTransition(false); }, 150); }} className={`flex items-center gap-2 ${theme.textSecondary} hover:${theme.text} transition`}>
                <ChevronLeft size={20} />
                <span className="text-sm">Geri</span>
              </button>
              <button onClick={() => { setPageTransition(true); setTimeout(() => { setSelectedProduct(null); setPageTransition(false); }, 150); }} className="text-xl tracking-wider hover:opacity-80 transition" style={{fontFamily: "'TAN ST CANARD', serif", letterSpacing: '0.15em', color: theme.accent}}>LUUZ</button>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFavorite(selectedProduct.id)} className={`p-2 rounded-full ${theme.card} hover:scale-110 transition-transform`}>
                  <Heart size={20} fill={favorites.includes(selectedProduct.id) ? theme.accent : 'none'} color={theme.accent} />
                </button>
                <button onClick={() => setShowCart(true)} className={`relative p-2 ${theme.textSecondary} hover:scale-110 transition-transform`}>
                  <ShoppingCart size={20} />
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 text-stone-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{background: theme.accent}}>{totalItems}</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Product Content */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Images with Zoom */}
              <div className="animate-slide-in">
                <div 
                  className="relative rounded-2xl overflow-hidden mb-4 cursor-zoom-in group"
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
                    className="w-full aspect-square object-cover transition-transform duration-300"
                    style={showZoom ? { transform: 'scale(2)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                  />
                  
                  {/* Zoom indicator */}
                  <div className={`absolute bottom-4 right-4 ${theme.bgTertiary} rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ZoomIn size={20} className={theme.textSecondary} />
                  </div>
                  
                  {selectedProduct.images.length > 1 && !showZoom && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images.length - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full transition hover:scale-110">
                        <ChevronLeft size={24} className="text-white" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev < selectedProduct.images.length - 1 ? prev + 1 : 0); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full transition hover:scale-110">
                        <ChevronRight size={24} className="text-white" />
                      </button>
                    </>
                  )}
                  {selectedProduct.discount > 0 && !showZoom && <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">-{selectedProduct.discount}%</div>}
                  {selectedProduct.isNew && !showZoom && <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">YENİ</div>}
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-3">
                    {selectedProduct.images.map((img, idx) => (
                      <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-transparent hover:border-stone-500'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                {/* Main Info - More Prominent */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-sm px-3 py-1 rounded-full ${theme.card} border ${theme.textSecondary}`}>{selectedProduct.category}</span>
                    {selectedProduct.stock > 0 && selectedProduct.stock < 5 && <span className="text-sm px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">Son {selectedProduct.stock} adet</span>}
                  </div>
                  <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>{selectedProduct.name}</h1>
                  <p className={`${theme.textSecondary} text-lg leading-relaxed mb-6`}>{selectedProduct.description}</p>
                  
                  {/* Dynamic Price Display */}
                  {(() => {
                    const sizeMultiplier = selectedProduct.selectedSize === '30x40' ? 0.7 : 1;
                    const basePrice = selectedProduct.selectedFrame ? selectedProduct.priceFramed : selectedProduct.priceUnframed;
                    const calculatedPrice = Math.round(basePrice * sizeMultiplier);
                    const originalPrice = Math.round((selectedProduct.selectedFrame ? selectedProduct.priceFramed : selectedProduct.priceUnframed) * sizeMultiplier);
                    const discountedPrice = selectedProduct.discount > 0 ? Math.round(calculatedPrice * (1 - selectedProduct.discount / 100)) : calculatedPrice;
                    
                    return (
                      <div className="flex items-baseline gap-3 mb-4">
                        {selectedProduct.selectedSize || selectedProduct.selectedFrame !== undefined ? (
                          selectedProduct.discount > 0 ? (
                            <>
                              <span className={`text-2xl ${theme.textMuted} line-through`}>{originalPrice}₺</span>
                              <span className="text-4xl font-bold text-green-400">{discountedPrice}₺</span>
                              <span className="text-sm text-green-400">%{selectedProduct.discount} indirim</span>
                            </>
                          ) : (
                            <span className={`text-4xl font-bold`} style={{color: theme.accent}}>{calculatedPrice}₺</span>
                          )
                        ) : (
                          <span className={`text-4xl font-bold ${theme.text}`}>{Math.round(selectedProduct.priceUnframed * 0.7)}₺'den başlayan</span>
                        )}
                      </div>
                    );
                  })()}
                  
                  {selectedProduct.stock > 0 ? (
                    <p className="text-sm text-green-400 flex items-center gap-2"><Check size={16} />Stokta mevcut</p>
                  ) : (
                    <p className="text-sm text-red-400">{t.outOfStock}</p>
                  )}
                </div>

                {/* Reviews */}
                {selectedProduct.reviews.length > 0 && (
                  <div className={`p-4 rounded-xl ${theme.card} border`}>
                    <h4 className={`text-base font-medium ${theme.text} mb-3`}>Müşteri Yorumları ({selectedProduct.reviews.length})</h4>
                    {selectedProduct.reviews.map((r, idx) => (
                      <div key={idx} className="py-2">
                        <div className="flex gap-1 mb-1">{[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill={theme.accent} color={theme.accent} />)}</div>
                        <p className={`text-sm ${theme.textSecondary}`}>"{r.comment}" - <span className={theme.text}>{r.name}</span></p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Options Section - Minimal Design */}
                <div className={`p-5 rounded-2xl ${theme.card} border space-y-5`}>
                  {/* Size Selection - Minimal */}
                  <div>
                    <p className={`text-sm font-medium ${theme.textSecondary} mb-3`}>Boyut</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedSize: '30x40'})}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${selectedProduct.selectedSize === '30x40' ? 'text-stone-900' : `${theme.text} border ${theme.border} hover:border-amber-500`}`}
                        style={selectedProduct.selectedSize === '30x40' ? {background: theme.accent} : {}}
                      >
                        30x40 cm
                      </button>
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedSize: '50x70'})}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${selectedProduct.selectedSize === '50x70' ? 'text-stone-900' : `${theme.text} border ${theme.border} hover:border-amber-500`}`}
                        style={selectedProduct.selectedSize === '50x70' ? {background: theme.accent} : {}}
                      >
                        50x70 cm
                      </button>
                    </div>
                  </div>

                  {/* Frame Selection - Minimal */}
                  <div>
                    <p className={`text-sm font-medium ${theme.textSecondary} mb-3`}>Çerçeve</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedFrame: false})}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${selectedProduct.selectedFrame === false ? 'text-stone-900' : `${theme.text} border ${theme.border} hover:border-amber-500`}`}
                        style={selectedProduct.selectedFrame === false ? {background: theme.accent} : {}}
                      >
                        Çerçevesiz
                      </button>
                      <button 
                        onClick={() => selectedProduct.stock > 0 && setSelectedProduct({...selectedProduct, selectedFrame: true})}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${selectedProduct.selectedFrame === true ? 'text-stone-900' : `${theme.text} border ${theme.border} hover:border-amber-500`}`}
                        style={selectedProduct.selectedFrame === true ? {background: theme.accent} : {}}
                      >
                        Çerçeveli
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => {
                      if (selectedProduct.selectedFrame === undefined) {
                        alert('Lütfen çerçeve seçeneği seçin');
                      } else if (selectedProduct.selectedSize === undefined) {
                        alert('Lütfen boyut seçin');
                      } else {
                        addToCart(selectedProduct, selectedProduct.selectedFrame);
                      }
                    }} 
                    disabled={selectedProduct.stock === 0}
                    className={`w-full text-stone-900 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3 ${selectedProduct.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-xl transition-all'}`}
                    style={{background: theme.accent}}
                  >
                    <ShoppingCart size={22} />
                    {selectedProduct.stock === 0 ? t.outOfStock : t.addToCart}
                  </button>

                  {/* WhatsApp Order Button */}
                  <button 
                    onClick={() => {
                      if (selectedProduct.selectedSize === undefined) {
                        alert('Lütfen boyut seçin');
                      } else if (selectedProduct.selectedFrame === undefined) {
                        alert('Lütfen çerçeve seçeneği seçin');
                      } else {
                        const message = `Merhaba! LUUZ'dan sipariş vermek istiyorum:\n\n` +
                          `Urun: ${selectedProduct.name}\n` +
                          `Boyut: ${selectedProduct.selectedSize}\n` +
                          `Cerceve: ${selectedProduct.selectedFrame ? 'Cerceveli' : 'Cercevesiz'}\n` +
                          `Fiyat: ${(() => {
                            const sizeMultiplier = selectedProduct.selectedSize === '30x40' ? 0.7 : 1;
                            const basePrice = selectedProduct.selectedFrame ? selectedProduct.priceFramed : selectedProduct.priceUnframed;
                            return Math.round(basePrice * sizeMultiplier);
                          })()}TL\n\n` +
                          `Siparis vermek istiyorum.`;
                        window.open(`https://wa.me/905060342409?text=${encodeURIComponent(message)}`, '_blank');
                      }
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl"
                  >
                    <MessageCircle size={22} />
                    WhatsApp ile Sipariş Ver
                  </button>
                </div>
              </div>
            </div>

            {/* Similar Products - Enhanced Section */}
            <div className={`mt-12 pt-8 border-t ${theme.border}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${theme.text}`}>Benzer Ürünler</h3>
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className={`text-sm ${theme.textSecondary} hover:${theme.text} flex items-center gap-1`}
                >
                  Tümünü Gör <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4).map(p => (
                  <div 
                    key={p.id} 
                    className="group cursor-pointer" 
                    onClick={() => { setSelectedProduct({...p, selectedSize: undefined, selectedFrame: undefined}); setActiveImageIndex(0); window.scrollTo(0, 0); }}
                  >
                    <div className={`relative overflow-hidden rounded-2xl ${theme.card} border shadow-lg transform group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300`}>
                      {p.discount > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs z-10">-{p.discount}%</div>}
                      {p.isNew && <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs z-10">YENİ</div>}
                      <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <span className="text-white text-sm font-medium">Ürünü İncele</span>
                      </div>
                    </div>
                    <div className="mt-3 px-1">
                      <h4 className={`font-medium ${theme.text} truncate`}>{p.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {p.discount > 0 ? (
                          <>
                            <span className={`text-sm ${theme.textMuted} line-through`}>{p.priceUnframed}₺</span>
                            <span className="text-lg font-bold text-green-400">{Math.round(p.priceUnframed * (1 - p.discount/100))}₺</span>
                          </>
                        ) : (
                          <span className={`text-lg font-bold ${theme.text}`}>{p.priceUnframed}₺</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                      <p className={`text-xs ${theme.textMuted}`}>{item.isFramed ? t.framed : t.unframed}</p>
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
                  {products.filter(p => favorites.includes(p.id)).map(product => (
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
              {orderHistory.length === 0 ? <div className="text-center py-12"><Package size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><p className={theme.textMuted}>Henüz sipariş yok</p></div> : (
                orderHistory.map(order => (
                  <div key={order.id} className={`${theme.card} border rounded-xl p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div><p className={`font-mono text-sm ${theme.text}`}>{order.id}</p><p className={`text-xs ${theme.textMuted}`}>{order.date}</p></div>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Teslim Edildi' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{order.status}</span>
                    </div>
                    <div className="flex justify-between items-center"><span className={`text-xs ${theme.textMuted}`}>{order.items} ürün</span><span className={`font-bold ${theme.text}`}>{order.total}₺</span></div>
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
