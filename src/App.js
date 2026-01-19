import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu, Search, Heart, MessageCircle, Package, Star, ChevronDown, ChevronUp, Filter, Grid, List, ArrowUp, Moon, Sun, Globe, Clock, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Copy, Tag, TrendingUp, Eye, Instagram, Twitter, Facebook } from 'lucide-react';

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
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [orderHistory] = useState([{ id: 'LUUZ7X8K2M', date: '12.01.2025', total: 1850, status: 'Teslim Edildi', items: 2 }]);
  const [checkoutData, setCheckoutData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', cardNumber: '', expiry: '', cvv: '' });

  const t = language === 'tr' ? { collection: 'Koleksiyon', about: 'Hakkımızda', howItWorks: 'Nasıl Çalışır', faq: 'SSS', search: 'Ara...', cart: 'Sepetim', favorites: 'Favorilerim', addToCart: 'Sepete Ekle', checkout: 'Ödemeye Geç', total: 'Toplam', empty: 'Sepetiniz Boş', filters: 'Filtreler', price: 'Fiyat', size: 'Boyut', bestSellers: 'Çok Satanlar', newArrivals: 'Yeni Gelenler', allCollection: 'Tüm Koleksiyon', framed: 'Çerçeveli', unframed: 'Çerçevesiz', inStock: 'Stokta', outOfStock: 'Tükendi', similarProducts: 'Benzer Ürünler', applyCoupon: 'Uygula', newsletter: 'Yeni Koleksiyonlardan Haberdar Olun', subscribe: 'Abone Ol', compare: 'KarÅŸÄ±laÅŸtÄ±r', recentlyViewed: 'Son Görüntülenenler', orderHistory: 'Sipariş Geçmişi' } : { collection: 'Collection', about: 'About', howItWorks: 'How It Works', faq: 'FAQ', search: 'Search...', cart: 'Cart', favorites: 'Favorites', addToCart: 'Add to Cart', checkout: 'Checkout', total: 'Total', empty: 'Cart is empty', filters: 'Filters', price: 'Price', size: 'Size', bestSellers: 'Best Sellers', newArrivals: 'New Arrivals', allCollection: 'All Collection', framed: 'Framed', unframed: 'Unframed', inStock: 'In Stock', outOfStock: 'Out of Stock', similarProducts: 'Similar', applyCoupon: 'Apply', newsletter: 'Stay Updated', subscribe: 'Subscribe', compare: 'Compare', recentlyViewed: 'Recently Viewed', orderHistory: 'Orders' };

  const products = [
    { id: 1, name: "Minimal Çizgiler", images: ["https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80", "https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80"], priceFramed: 850, priceUnframed: 450, category: "Minimal", description: "Modern ve minimal Ã§izgilerle tasarlanmÄ±ÅŸ.", size: "50x70 cm", stock: 12, isNew: false, isBestSeller: true, discount: 0, reviews: [{ name: "AyÅŸe K.", rating: 5, comment: "Harika!" }] },
    { id: 2, name: "Soyut Kompozisyon", images: ["https://unsplash.com/illustrations/puppet-masters-controlling-figures-with-strings--BUWHvWDHm0"], priceFramed: 920, priceUnframed: 520, category: "Soyut", description: "Cesur fırça darbeleri.", size: "60x80 cm", stock: 8, isNew: true, isBestSeller: false, discount: 15, reviews: [] },
    { id: 3, name: "Botanik Siluet", images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&q=80"], priceFramed: 780, priceUnframed: 380, category: "DoÄŸa", description: "Doğadan ilham alan tasarÄ±m.", size: "40x60 cm", stock: 15, isNew: false, isBestSeller: true, discount: 0, reviews: [] },
    { id: 4, name: "Geometrik Denge", images: ["https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600&q=80"], priceFramed: 890, priceUnframed: 490, category: "Geometrik", description: "Simetri ve geometrik formlar.", size: "50x70 cm", stock: 6, isNew: false, isBestSeller: false, discount: 10, reviews: [] },
    { id: 5, name: "Mavi Soyutlama", images: ["https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80"], priceFramed: 950, priceUnframed: 550, category: "Soyut", description: "Mavi tonlarÄ±nÄ±n derinliÄŸi.", size: "70x100 cm", stock: 4, isNew: false, isBestSeller: true, discount: 0, reviews: [{ name: "Elif T.", rating: 5, comment: "MuhteÅŸem!" }] },
    { id: 6, name: "Modern Tipografi", images: ["https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"], priceFramed: 820, priceUnframed: 420, category: "Tipografi", description: "Etkileyici tipografik dÃ¼zenlemeler.", size: "50x70 cm", stock: 10, isNew: true, isBestSeller: false, discount: 0, reviews: [] },
    { id: 7, name: "Pastel Düzenler", images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80"], priceFramed: 880, priceUnframed: 480, category: "Soyut", description: "YumuÅŸak pastel tonlar.", size: "60x80 cm", stock: 7, isNew: false, isBestSeller: false, discount: 20, reviews: [] },
    { id: 8, name: "Siyah Beyaz", images: ["https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=600&q=80"], priceFramed: 790, priceUnframed: 390, category: "Minimal", description: "Klasik kontrast.", size: "40x60 cm", stock: 0, isNew: false, isBestSeller: false, discount: 0, reviews: [] },
    { id: 9, name: "Altın Çizgiler", images: ["https://images.unsplash.com/photo-1582561833583-1d4d7d1ac5c2?w=600&q=80"], priceFramed: 990, priceUnframed: 590, category: "Geometrik", description: "LÃ¼ks altÄ±n detaylar.", size: "50x70 cm", stock: 5, isNew: true, isBestSeller: false, discount: 0, reviews: [] },
    { id: 10, name: "Yaprak Detayları", images: ["https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=600&q=80"], priceFramed: 750, priceUnframed: 350, category: "DoÄŸa", description: "DoÄŸanÄ±n incelikleri.", size: "40x60 cm", stock: 20, isNew: false, isBestSeller: true, discount: 0, reviews: [] },
    { id: 11, name: "Renkli Daireler", images: ["https://images.unsplash.com/photo-1535952427495-2b0e9a4c5e66?w=600&q=80"], priceFramed: 860, priceUnframed: 460, category: "Geometrik", description: "Oyuncu renkler.", size: "60x80 cm", stock: 9, isNew: false, isBestSeller: false, discount: 25, reviews: [] },
    { id: 12, name: "Turuncu Ton", images: ["https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80"], priceFramed: 840, priceUnframed: 440, category: "Soyut", description: "SÄ±cak tonlar.", size: "50x70 cm", stock: 11, isNew: false, isBestSeller: false, discount: 0, reviews: [] }
  ];

  const categories = ['TÃ¼mÃ¼', 'Minimal', 'Soyut', 'DoÄŸa', 'Geometrik', 'Tipografi', 'Modern', 'Klasik', 'Portre', 'Manzara'];
  const sizes = ['40x60 cm', '50x70 cm', '60x80 cm', '70x100 cm'];
  const coupons = { 'HOSGELDIN15': { discount: 15, type: 'percent' }, 'YAZ50': { discount: 50, type: 'fixed' } };
  const faqData = [{ q: 'Kargo ne kadar sÃ¼rede gelir?', a: '2-4 iÅŸ gÃ¼nÃ¼ iÃ§inde teslim edilir.' }, { q: 'Ä°ade koÅŸullarÄ± nelerdir?', a: '14 gÃ¼n iÃ§inde koÅŸulsuz iade hakkÄ±nÄ±z var.' }, { q: 'Ã‡erÃ§eve malzemesi nedir?', a: '%100 doÄŸal ahÅŸaptan el iÅŸÃ§iliÄŸi ile Ã¼retilir.' }];

  useEffect(() => { setTimeout(() => setIsLoading(false), 1500); const handleScroll = () => setShowScrollTop(window.scrollY > 400); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'TÃ¼mÃ¼' || p.category === selectedCategory;
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
  const applyCoupon = () => { const c = coupons[couponCode.toUpperCase()]; c ? setAppliedCoupon({ code: couponCode.toUpperCase(), ...c }) : alert('GeÃ§ersiz kupon!'); };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const couponDiscount = appliedCoupon ? (appliedCoupon.type === 'percent' ? subtotal * appliedCoupon.discount / 100 : appliedCoupon.discount) : 0;
  const totalPrice = subtotal - couponDiscount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!checkoutData.firstName || !checkoutData.email || !checkoutData.cardNumber) { alert('LÃ¼tfen zorunlu alanlarÄ± doldurun'); return; }
    alert(`SipariÅŸiniz alÄ±ndÄ±! Takip: LUUZ${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
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
      
      {/* Header */}
      <header className={`${theme.bgTertiary} sticky top-0 z-40 border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`lg:hidden ${theme.textSecondary}`}><Menu size={24} /></button>
            <h1 className="text-2xl tracking-widest font-light" style={{fontFamily: "'Raleway', sans-serif", letterSpacing: '0.3em', color: theme.accent}}>LUUZ</h1>
          </div>
          <nav className={`hidden lg:flex items-center gap-6 text-sm ${theme.textSecondary}`}>
            <a href="#collection" className="hover:text-white transition">{t.collection}</a>
            <button onClick={() => setShowHowItWorks(true)} className="hover:text-white">{t.howItWorks}</button>
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
            <a href="#collection" className={`block py-2 ${theme.textSecondary}`}>{t.collection}</a>
            <button onClick={() => { setShowHowItWorks(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.howItWorks}</button>
            <button onClick={() => { setShowAbout(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.about}</button>
            <button onClick={() => { setShowFAQ(true); setShowMobileMenu(false); }} className={`block py-2 ${theme.textSecondary} text-left w-full`}>{t.faq}</button>
          </div>
        )}
      </header>

      {/* Promo */}
      <div className={`${theme.bgTertiary} ${theme.textSecondary} py-2.5 text-center border-b ${theme.border}`}>
        <p className="text-xs">ğŸ‰ Yeni Müşterilere %15 İndirim - Kod: <span className="text-white font-semibold">HOSGELDIN15</span></p>
      </div>

      {/* Hero */}
      <section className={`relative py-20 overflow-hidden ${darkMode ? 'bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800' : 'bg-gradient-to-br from-stone-100 to-amber-50'}`}>
        <div className="absolute inset-0 opacity-20"><div className="absolute top-10 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div><div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500 rounded-full blur-3xl"></div></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className={`text-5xl font-bold mb-4 ${theme.text}`}>Duvarlarınıza <span style={{color: theme.accent}}>Sanat Katın</span></h2>
          <p className={`text-xl ${theme.textSecondary} max-w-2xl mx-auto mb-8`}>Özgün tasarımlarla mekanlarınıza karakter katın</p>
          <button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-900 px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition" style={{background: theme.accent}}>Koleksiyonu Keşfet</button>
        </div>
      </section>

      {/* Features */}
      <section className={`py-8 ${theme.bgSecondary} border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{icon: Truck, title: 'Ücretsiz Kargo', desc: '₺500 üzeri'}, {icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL'}, {icon: RotateCcw, title: '14 Gün içinde İade', desc: 'Koşulsuz'}, {icon: Package, title: 'Özenli Paket', desc: 'Hasar Garantisi'}].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 justify-center py-2">
              <item.icon size={20} style={{color: theme.accent}} />
              <div><p className={`text-xs font-medium ${theme.text}`}>{item.title}</p><p className={`text-xs ${theme.textMuted}`}>{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'text-stone-900 shadow-lg' : `${theme.card} ${theme.textSecondary} border`}`} style={selectedCategory === cat ? {background: theme.accent} : {}}>{cat}</button>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className={`max-w-7xl mx-auto px-4 py-8 ${theme.card} rounded-2xl my-4 border`}>
        <div className="flex items-center gap-2 mb-6"><TrendingUp size={18} style={{color: theme.accent}} /><h3 className={`text-xl font-bold ${theme.text}`}>{t.bestSellers}</h3></div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.filter(p => p.isBestSeller).map(product => (
            <div key={product.id} className="flex-shrink-0 w-44 group">
              <div className={`relative overflow-hidden ${theme.card} rounded-xl shadow-lg border`}>
                <div className="absolute top-2 left-2 text-stone-900 px-2 py-0.5 rounded-full text-xs font-medium z-10" style={{background: theme.accent}}>BEST</div>
                {product.discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs z-10">-{product.discount}%</div>}
                <button onClick={() => toggleFavorite(product.id)} className={`absolute top-8 right-2 z-10 ${theme.bgTertiary} rounded-full p-1 opacity-0 group-hover:opacity-100 transition`}><Heart size={14} fill={favorites.includes(product.id) ? theme.accent : 'none'} color={theme.accent} /></button>
                <div className="cursor-pointer" onClick={() => { setSelectedProduct(product); addToRecentlyViewed(product); }}>
                  <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                    <h3 className="text-xs font-semibold text-white">{product.name}</h3>
                    <p className="text-xs text-stone-300">{product.priceUnframed}â‚º</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedProduct(product)} className="w-full mt-2 text-stone-900 py-1.5 rounded-lg text-xs font-medium" style={{background: theme.accent}}>{t.addToCart}</button>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className={`max-w-7xl mx-auto px-4 py-8 ${theme.card} rounded-2xl my-4 border`}>
        <div className="flex items-center gap-2 mb-6"><span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">YENÄ°</span><h3 className={`text-xl font-bold ${theme.text}`}>{t.newArrivals}</h3></div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.filter(p => p.isNew).map(product => (
            <div key={product.id} className="flex-shrink-0 w-44 group">
              <div className={`relative overflow-hidden ${theme.card} rounded-xl shadow-lg border`}>
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs z-10">YENÄ°</div>
                {product.discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs z-10">-{product.discount}%</div>}
                <div className="cursor-pointer" onClick={() => { setSelectedProduct(product); addToRecentlyViewed(product); }}>
                  <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                    <h3 className="text-xs font-semibold text-white">{product.name}</h3>
                    <p className="text-xs text-stone-300">{product.priceUnframed}â‚º</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedProduct(product)} className="w-full mt-2 text-stone-900 py-1.5 rounded-lg text-xs font-medium" style={{background: theme.accent}}>{t.addToCart}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Filters & Collection */}
      <section id="collection" className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className={`text-xl font-bold ${theme.text}`}>{t.allCollection} <span className={`text-sm font-normal ${theme.textMuted}`}>({filteredProducts.length})</span></h3>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs ${theme.card} border ${theme.textSecondary}`}><Filter size={14} />{t.filters}</button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`px-4 py-2 rounded-lg text-xs ${theme.input} border`}>
              <option value="popular">PopÃ¼ler</option><option value="newest">En Yeni</option><option value="priceLow">Fiyat â†‘</option><option value="priceHigh">Fiyat â†“</option>
            </select>
            <div className={`hidden md:flex items-center gap-1 ${theme.card} border rounded-lg p-1`}>
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-stone-600' : ''}`}><Grid size={14} className={viewMode === 'grid' ? 'text-white' : theme.textMuted} /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-stone-600' : ''}`}><List size={14} className={viewMode === 'list' ? 'text-white' : theme.textMuted} /></button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className={`${theme.card} border rounded-xl p-4 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`text-xs font-medium ${theme.text} mb-2 block`}>{t.price}</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className={`w-20 px-2 py-1 rounded text-xs ${theme.input} border`} />
                  <span className={theme.textMuted}>-</span>
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className={`w-20 px-2 py-1 rounded text-xs ${theme.input} border`} />
                  <span className={`text-xs ${theme.textMuted}`}>â‚º</span>
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium ${theme.text} mb-2 block`}>{t.size}</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => <button key={size} onClick={() => selectedSizes.includes(size) ? setSelectedSizes(selectedSizes.filter(s => s !== size)) : setSelectedSizes([...selectedSizes, size])} className={`px-2 py-1 rounded text-xs ${selectedSizes.includes(size) ? 'text-stone-900' : `${theme.card} border ${theme.textSecondary}`}`} style={selectedSizes.includes(size) ? {background: theme.accent} : {}}>{size}</button>)}
                </div>
              </div>
              <div className="flex items-end"><button onClick={() => { setPriceRange([0, 1500]); setSelectedSizes([]); setSelectedCategory('TÃ¼mÃ¼'); }} className={`text-xs ${theme.textSecondary} underline`}>Temizle</button></div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? <div className="text-center py-16"><p className={theme.textMuted}>ÃœrÃ¼n bulunamadÄ±</p></div> : viewMode === 'grid' ? (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="group">
                <div className={`relative overflow-hidden ${theme.card} rounded-xl shadow-lg border transform hover:-translate-y-1 hover:scale-[1.02] transition-all`}>
                  {product.isNew && <div className="absolute top-2 left-2 bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[10px] z-10">YENÄ°</div>}
                  {product.discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] z-10">-{product.discount}%</div>}
                  {product.stock === 0 && <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center"><span className="text-white text-xs">{t.outOfStock}</span></div>}
                  <button onClick={() => toggleFavorite(product.id)} className={`absolute ${product.isNew ? 'left-12' : 'left-2'} top-2 z-20 ${theme.bgTertiary} rounded-full p-1 opacity-0 group-hover:opacity-100 transition`}><Heart size={12} fill={favorites.includes(product.id) ? theme.accent : 'none'} color={theme.accent} /></button>
                  <button onClick={() => toggleCompare(product)} className={`absolute ${product.isNew ? 'left-12' : 'left-2'} top-8 z-20 ${theme.bgTertiary} rounded-full p-1 opacity-0 group-hover:opacity-100 transition`}><Copy size={12} className={compareProducts.find(p => p.id === product.id) ? 'text-green-400' : ''} /></button>
                  <div className="cursor-pointer" onClick={() => { setSelectedProduct(product); addToRecentlyViewed(product); }}>
                    <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">
                      <h3 className="text-[10px] font-semibold text-white">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        {product.discount > 0 ? <><p className="text-[10px] text-stone-400 line-through">{product.priceUnframed}â‚º</p><p className="text-[10px] text-green-400">{Math.round(product.priceUnframed * (1 - product.discount/100))}â‚º</p></> : <p className="text-[10px] text-stone-300">{product.priceUnframed}â‚º</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProduct(product)} disabled={product.stock === 0} className={`w-full mt-2 text-stone-900 py-1.5 rounded-lg text-xs font-medium ${product.stock === 0 ? 'opacity-50' : ''}`} style={{background: theme.accent}}>{product.stock === 0 ? t.outOfStock : t.addToCart}</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map(product => (
              <div key={product.id} className={`flex gap-4 ${theme.card} border rounded-xl p-3`}>
                <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-lg cursor-pointer" onClick={() => setSelectedProduct(product)} />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div><h3 className={`font-medium ${theme.text}`}>{product.name}</h3><p className={`text-xs ${theme.textMuted}`}>{product.category} â€¢ {product.size}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleFavorite(product.id)}><Heart size={16} fill={favorites.includes(product.id) ? theme.accent : 'none'} color={theme.accent} /></button>
                      <button onClick={() => toggleCompare(product)}><Copy size={16} className={compareProducts.find(p => p.id === product.id) ? 'text-green-400' : theme.textMuted} /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {product.discount > 0 ? <><span className={`text-sm ${theme.textMuted} line-through`}>{product.priceUnframed}â‚º</span><span className="text-sm text-green-400 font-bold">{Math.round(product.priceUnframed * (1 - product.discount/100))}â‚º</span></> : <span className={`text-sm font-bold ${theme.text}`}>{product.priceUnframed}â‚º</span>}
                    </div>
                    <button onClick={() => setSelectedProduct(product)} className="text-stone-900 px-4 py-1.5 rounded-lg text-xs font-medium" style={{background: theme.accent}}>{t.addToCart}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h3 className={`text-lg font-bold ${theme.text} mb-4 flex items-center gap-2`}><Eye size={18} style={{color: theme.accent}} />{t.recentlyViewed}</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {recentlyViewed.map(p => <div key={p.id} className="flex-shrink-0 w-32 cursor-pointer" onClick={() => setSelectedProduct(p)}><img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover rounded-lg" /><p className={`text-xs ${theme.text} mt-1 truncate`}>{p.name}</p><p className={`text-xs ${theme.textMuted}`}>{p.priceUnframed}â‚º</p></div>)}
          </div>
        </section>
      )}

      {/* Compare Bar */}
      {compareProducts.length > 0 && (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 ${theme.bgSecondary} rounded-full shadow-2xl border ${theme.border} px-4 py-2 flex items-center gap-3 z-30`}>
          <span className={`text-xs ${theme.textSecondary}`}>{compareProducts.length} Ã¼rÃ¼n</span>
          <div className="flex -space-x-2">{compareProducts.map(p => <img key={p.id} src={p.images[0]} alt="" className="w-8 h-8 rounded-full border-2 border-stone-700 object-cover" />)}</div>
          <button onClick={() => setShowCompare(true)} className="text-stone-900 px-3 py-1 rounded-full text-xs font-medium" style={{background: theme.accent}}>{t.compare}</button>
          <button onClick={() => setCompareProducts([])} className={theme.textMuted}><X size={16} /></button>
        </div>
      )}

      {/* Instagram */}
      <section className={`max-w-7xl mx-auto px-4 py-12 ${theme.card} rounded-2xl my-8 border`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2"><Instagram size={24} style={{color: theme.accent}} /><h3 className={`text-xl font-bold ${theme.text}`}>@luuzposter</h3></div>
          <p className={`${theme.textSecondary} text-sm`}>Bizi Instagram'da takip edin</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {products.slice(0, 6).map((p, idx) => <div key={idx} className="aspect-square overflow-hidden rounded-lg group cursor-pointer"><img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>)}
        </div>
      </section>

      {/* Newsletter */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-r from-stone-800 to-stone-800' : 'bg-gradient-to-r from-stone-200 to-stone-100'} border-y ${theme.border}`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className={`text-2xl font-bold ${theme.text} mb-3`}>{t.newsletter}</h3>
          <p className={`${theme.textSecondary} mb-6 text-sm`}>Ä°ndirimlerden ilk siz haberdar olun</p>
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
              <h4 className="text-xl tracking-widest font-light mb-4" style={{fontFamily: "'Raleway', sans-serif", letterSpacing: '0.3em', color: theme.accent}}>LUUZ</h4>
              <p className={`${theme.textMuted} text-xs`}>Ã–zgÃ¼n duvar sanatÄ± tasarÄ±mlarÄ±.</p>
              <div className="flex gap-3 mt-4"><button className={theme.textMuted}><Instagram size={18} /></button><button className={theme.textMuted}><Twitter size={18} /></button><button className={theme.textMuted}><Facebook size={18} /></button></div>
            </div>
            <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>Linkler</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li><button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>{t.collection}</button></li><li><button onClick={() => setShowAbout(true)}>{t.about}</button></li><li><button onClick={() => setShowFAQ(true)}>{t.faq}</button></li></ul></div>
            <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>YardÄ±m</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li>Kargo Bilgileri</li><li>Ä°ade & DeÄŸiÅŸim</li><li><button onClick={() => setShowOrderHistory(true)}>{t.orderHistory}</button></li></ul></div>
            <div><h5 className={`font-medium mb-3 text-sm ${theme.text}`}>Ä°letiÅŸim</h5><ul className={`space-y-2 ${theme.textMuted} text-xs`}><li>info@luuz.com.tr</li><li>+90 212 555 00 00</li><li>Ä°stanbul, TÃ¼rkiye</li></ul></div>
          </div>
          <div className={`border-t ${theme.border} mt-8 pt-8 text-center ${theme.textMuted} text-xs`}>Â© 2025 LUUZ. TÃ¼m haklarÄ± saklÄ±dÄ±r.</div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-4 border-b ${theme.border} flex justify-between items-center z-10`}>
              <h3 className={`text-lg font-bold ${theme.text}`}>{selectedProduct.name}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFavorite(selectedProduct.id)} className={`p-2 rounded-full ${theme.card}`}><Heart size={18} fill={favorites.includes(selectedProduct.id) ? theme.accent : 'none'} color={theme.accent} /></button>
                <button onClick={() => setSelectedProduct(null)} className={`p-2 rounded-full ${theme.card}`}><X size={18} /></button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div>
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <img src={selectedProduct.images[activeImageIndex]} alt="" className="w-full aspect-square object-cover" />
                  {selectedProduct.images.length > 1 && <><button onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images.length - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"><ChevronLeft size={20} className="text-white" /></button><button onClick={() => setActiveImageIndex(prev => prev < selectedProduct.images.length - 1 ? prev + 1 : 0)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"><ChevronRight size={20} className="text-white" /></button></>}
                  {selectedProduct.discount > 0 && <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">-{selectedProduct.discount}%</div>}
                </div>
                {selectedProduct.images.length > 1 && <div className="flex gap-2">{selectedProduct.images.map((img, idx) => <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImageIndex === idx ? 'border-amber-500' : 'border-transparent'}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>)}</div>}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${theme.card} border ${theme.textSecondary}`}>{selectedProduct.category}</span>
                    {selectedProduct.isNew && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">YENÄ°</span>}
                    {selectedProduct.stock > 0 && selectedProduct.stock < 5 && <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">Son {selectedProduct.stock}</span>}
                  </div>
                  <p className={`${theme.textSecondary} text-sm`}>{selectedProduct.description}</p>
                  <p className={`text-xs ${theme.textMuted} mt-2`}>{t.size}: {selectedProduct.size}</p>
                  {selectedProduct.stock > 0 ? <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><Check size={12} />{t.inStock} ({selectedProduct.stock})</p> : <p className="text-xs text-red-400 mt-1">{t.outOfStock}</p>}
                </div>
                {selectedProduct.reviews.length > 0 && (
                  <div className={`p-3 rounded-xl ${theme.card} border`}>
                    <h4 className={`text-sm font-medium ${theme.text} mb-2`}>Yorumlar ({selectedProduct.reviews.length})</h4>
                    {selectedProduct.reviews.map((r, idx) => <div key={idx} className="py-2"><div className="flex gap-0.5 mb-1">{[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill={theme.accent} color={theme.accent} />)}</div><p className={`text-xs ${theme.textSecondary}`}>"{r.comment}" - {r.name}</p></div>)}
                  </div>
                )}
                <div className="space-y-2 pt-4">
                  <button onClick={() => addToCart(selectedProduct, false)} disabled={selectedProduct.stock === 0} className={`w-full border ${theme.border} hover:border-amber-500 py-3 rounded-xl transition flex justify-between items-center px-4 ${selectedProduct.stock === 0 ? 'opacity-50' : ''}`}>
                    <div className="text-left"><span className={`font-medium ${theme.text}`}>{t.unframed}</span><p className={`text-xs ${theme.textMuted}`}>Premium baskÄ±</p></div>
                    <div>{selectedProduct.discount > 0 ? <><span className={`text-sm ${theme.textMuted} line-through mr-2`}>{selectedProduct.priceUnframed}â‚º</span><span className="font-bold text-lg text-green-400">{Math.round(selectedProduct.priceUnframed * (1 - selectedProduct.discount/100))}â‚º</span></> : <span className={`font-bold text-lg ${theme.text}`}>{selectedProduct.priceUnframed}â‚º</span>}</div>
                  </button>
                  <button onClick={() => addToCart(selectedProduct, true)} disabled={selectedProduct.stock === 0} className={`w-full text-stone-900 py-3 rounded-xl flex justify-between items-center px-4 shadow-lg ${selectedProduct.stock === 0 ? 'opacity-50' : ''}`} style={{background: theme.accent}}>
                    <div className="text-left"><span className="font-medium">{t.framed}</span><p className="text-xs text-stone-600">AhÅŸap Ã§erÃ§eve</p></div>
                    <div>{selectedProduct.discount > 0 ? <><span className="text-sm text-stone-500 line-through mr-2">{selectedProduct.priceFramed}â‚º</span><span className="font-bold text-lg">{Math.round(selectedProduct.priceFramed * (1 - selectedProduct.discount/100))}â‚º</span></> : <span className="font-bold text-lg">{selectedProduct.priceFramed}â‚º</span>}</div>
                  </button>
                </div>
                <div className="pt-4">
                  <h4 className={`text-sm font-medium ${theme.text} mb-3`}>{t.similarProducts}</h4>
                  <div className="flex gap-2 overflow-x-auto">{products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4).map(p => <div key={p.id} className="flex-shrink-0 w-20 cursor-pointer" onClick={() => { setSelectedProduct(p); setActiveImageIndex(0); }}><img src={p.images[0]} alt="" className="w-full aspect-square object-cover rounded-lg" /><p className={`text-[10px] ${theme.textMuted} mt-1`}>{p.priceUnframed}â‚º</p></div>)}</div>
                </div>
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
                      <p className="font-bold mt-1" style={{color: theme.accent}}>{item.price}â‚º</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className={`w-7 h-7 ${theme.card} border rounded flex items-center justify-center`}><Minus size={12} /></button>
                        <span className={`w-6 text-center text-sm ${theme.text}`}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className={`w-7 h-7 ${theme.card} border rounded flex items-center justify-center`}><Plus size={12} /></button>
                        <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="ml-auto text-red-400 text-xs">KaldÄ±r</button>
                      </div>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
            {cart.length > 0 && (
              <div className={`p-5 border-t ${theme.border} ${theme.bgTertiary}`}>
                <div className="flex gap-2 mb-4"><input type="text" placeholder="Kupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className={`flex-1 px-3 py-2 rounded-lg text-sm ${theme.input} border`} /><button onClick={applyCoupon} className="px-4 py-2 rounded-lg text-xs font-medium text-stone-900" style={{background: theme.accent}}>{t.applyCoupon}</button></div>
                {appliedCoupon && <div className="flex items-center justify-between mb-2 text-green-400 text-sm"><span className="flex items-center gap-1"><Tag size={14} />{appliedCoupon.code}</span><span>-{appliedCoupon.type === 'percent' ? `${appliedCoupon.discount}%` : `${appliedCoupon.discount}â‚º`}</span></div>}
                <div className={`flex justify-between mb-2 text-sm ${theme.textSecondary}`}><span>Ara Toplam</span><span>{subtotal}â‚º</span></div>
                {couponDiscount > 0 && <div className="flex justify-between mb-2 text-sm text-green-400"><span>Ä°ndirim</span><span>-{Math.round(couponDiscount)}â‚º</span></div>}
                <div className={`flex justify-between mb-2 text-sm ${theme.textSecondary}`}><span>Kargo</span><span>{totalPrice >= 500 ? 'Ãœcretsiz' : '49â‚º'}</span></div>
                <div className={`flex justify-between mb-4 text-lg font-bold ${theme.text}`}><span>{t.total}</span><span style={{color: theme.accent}}>{totalPrice >= 500 ? Math.round(totalPrice) : Math.round(totalPrice) + 49}â‚º</span></div>
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
                <input type="text" placeholder="Åehir" value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
                <input type="text" placeholder="Posta Kodu" value={checkoutData.postalCode} onChange={(e) => setCheckoutData({...checkoutData, postalCode: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              </div>
              <hr className={theme.border} />
              <input type="text" placeholder="Kart No *" value={checkoutData.cardNumber} onChange={(e) => setCheckoutData({...checkoutData, cardNumber: e.target.value})} className={`w-full ${theme.input} border rounded-xl px-4 py-3 text-sm font-mono`} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="AA/YY" value={checkoutData.expiry} onChange={(e) => setCheckoutData({...checkoutData, expiry: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
                <input type="text" placeholder="CVV" value={checkoutData.cvv} onChange={(e) => setCheckoutData({...checkoutData, cvv: e.target.value})} className={`${theme.input} border rounded-xl px-4 py-3 text-sm`} />
              </div>
              <div className={`${theme.card} border rounded-xl p-4 flex justify-between text-lg font-bold ${theme.text}`}><span>{t.total}</span><span style={{color: theme.accent}}>{totalPrice >= 500 ? Math.round(totalPrice) : Math.round(totalPrice) + 49}â‚º</span></div>
              <button onClick={handleCheckout} className="w-full text-stone-900 py-4 rounded-xl font-semibold shadow-lg" style={{background: theme.accent}}>SipariÅŸi Tamamla</button>
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
              {favorites.length === 0 ? <div className="text-center py-12"><Heart size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><p className={theme.textMuted}>HenÃ¼z favori yok</p></div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.filter(p => favorites.includes(p.id)).map(product => (
                    <div key={product.id}>
                      <div className={`relative overflow-hidden ${theme.card} rounded-xl border`}>
                        <button onClick={() => toggleFavorite(product.id)} className="absolute top-2 right-2 z-10 bg-red-500/80 rounded-full p-1.5"><X size={12} className="text-white" /></button>
                        <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover cursor-pointer" onClick={() => { setSelectedProduct(product); setShowFavorites(false); }} />
                      </div>
                      <p className={`text-sm ${theme.text} mt-2`}>{product.name}</p>
                      <p className={`text-xs ${theme.textMuted}`}>{product.priceUnframed}â‚º</p>
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
              {orderHistory.length === 0 ? <div className="text-center py-12"><Package size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><p className={theme.textMuted}>HenÃ¼z sipariÅŸ yok</p></div> : (
                orderHistory.map(order => (
                  <div key={order.id} className={`${theme.card} border rounded-xl p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div><p className={`font-mono text-sm ${theme.text}`}>{order.id}</p><p className={`text-xs ${theme.textMuted}`}>{order.date}</p></div>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Teslim Edildi' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{order.status}</span>
                    </div>
                    <div className="flex justify-between items-center"><span className={`text-xs ${theme.textMuted}`}>{order.items} Ã¼rÃ¼n</span><span className={`font-bold ${theme.text}`}>{order.total}â‚º</span></div>
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
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">{t.price}</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.priceUnframed}â‚º</td>)}</tr>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">{t.size}</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.size}</td>)}</tr>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">Kategori</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.category}</td>)}</tr>
                  <tr className={`border-t ${theme.border}`}><td className="p-2 font-medium">Stok</td>{compareProducts.map(p => <td key={p.id} className="p-2 text-center">{p.stock > 0 ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-red-400 mx-auto" />}</td>)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme.bgSecondary} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <div className={`sticky top-0 ${theme.bgSecondary} p-5 border-b ${theme.border} flex justify-between items-center`}><h2 className={`text-xl font-bold ${theme.text}`}>{t.howItWorks}</h2><button onClick={() => setShowHowItWorks(false)} className={theme.textSecondary}><X size={24} /></button></div>
            <div className="p-6 space-y-6">
              {[{ step: 1, title: 'Eserinizi Seçin', desc: 'Koleksiyonumuzdan size uygun eseri seçin', icon: 'ğŸ¨' }, { step: 2, title: 'Ã‡erÃ§eve SeÃ§eneÄŸi', desc: 'Ã‡erÃ§eveli veya Ã§erÃ§evesiz seÃ§in', icon: 'ğŸ–¼ï¸' }, { step: 3, title: 'GÃ¼venli Ã–deme', desc: '256-bit SSL ile gÃ¼venli Ã¶deme', icon: 'ğŸ”’' }, { step: 4, title: 'HÄ±zlÄ± Teslimat', desc: '2-4 iÅŸ gÃ¼nÃ¼ iÃ§inde kapÄ±nÄ±za', icon: 'ğŸšš' }].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{background: `${theme.accent}20`}}>{item.icon}</div>
                  <div><h3 className={`font-medium ${theme.text}`}>{item.title}</h3><p className={`text-sm ${theme.textMuted}`}>{item.desc}</p></div>
                </div>
              ))}
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
                <p className={theme.textSecondary}>LUUZ, 2020 yÄ±lÄ±nda Ä°stanbul'da kurulmuÅŸ bir duvar sanatÄ± markasÄ±dÄ±r. Misyonumuz, Ã¶zgÃ¼n ve kaliteli tasarÄ±mlarla yaÅŸam alanlarÄ±nÄ±za karakter katmaktÄ±r.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`${theme.card} border rounded-xl p-4`}><p className="text-2xl font-bold" style={{color: theme.accent}}>5000+</p><p className={`text-xs ${theme.textMuted}`}>Mutlu MÃ¼ÅŸteri</p></div>
                <div className={`${theme.card} border rounded-xl p-4`}><p className="text-2xl font-bold" style={{color: theme.accent}}>200+</p><p className={`text-xs ${theme.textMuted}`}>Ã–zgÃ¼n TasarÄ±m</p></div>
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
            <div className="flex items-center gap-3"><MessageCircle size={20} /><div><h3 className="font-semibold text-sm">CanlÄ± Destek</h3><p className="text-xs opacity-80">Genellikle 2 dk iÃ§inde</p></div></div>
            <button onClick={() => setShowChat(false)}><X size={18} /></button>
          </div>
          <div className={`p-4 h-64 ${theme.bgTertiary}`}><div className={`${theme.bgSecondary} p-3 rounded-xl shadow-sm`}><p className={`text-sm ${theme.text}`}>Merhaba! NasÄ±l yardÄ±mcÄ± olabilirim? ğŸ˜Š</p></div></div>
          <div className={`p-3 border-t ${theme.border}`}>
            <div className="flex gap-2"><input type="text" placeholder="MesajÄ±nÄ±zÄ± yazÄ±n..." className={`flex-1 ${theme.input} border rounded-xl px-4 py-2 text-sm`} /><button className="w-10 h-10 rounded-xl text-stone-900 flex items-center justify-center" style={{background: theme.accent}}><ChevronRight size={18} /></button></div>
          </div>
        </div>
      )}

      {/* Chat FAB */}
      <button onClick={() => setShowChat(!showChat)} className="fixed bottom-6 right-6 w-14 h-14 text-stone-900 rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center" style={{background: theme.accent}}>{showChat ? <X size={24} /> : <MessageCircle size={24} />}</button>

      {/* Scroll Top */}
      {showScrollTop && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 left-6 w-12 h-12 ${theme.bgSecondary} border ${theme.border} rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center justify-center ${theme.textSecondary}`}><ArrowUp size={20} /></button>}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
