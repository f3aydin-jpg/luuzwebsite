import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu, Search, Heart, MessageCircle, Package, Star, ChevronDown, ChevronUp, Grid, List, ArrowUp, Moon, Sun, Clock, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Tag, TrendingUp, Eye, Instagram, Twitter, Facebook, ZoomIn, Settings } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
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
  const [orderHistory] = useState([{ id: 'LUUZ7X8K2M', date: '12.01.2025', total: 1850, status: 'Teslim Edildi', items: 2 }]);
  const [checkoutData, setCheckoutData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', cardNumber: '', expiry: '', cvv: '' });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [pageTransition, setPageTransition] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [showCollection, setShowCollection] = useState(false);
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [specialFilter, setSpecialFilter] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);

  const t = { collection: 'Koleksiyon', about: 'Hakkımızda', howItWorks: 'Nasıl Çalışır', faq: 'SSS', search: 'Ürün ara...', cart: 'Sepetim', favorites: 'Favorilerim', addToCart: 'Sepete Ekle', checkout: 'Ödemeye Geç', total: 'Toplam', empty: 'Sepetiniz boş', filters: 'Filtreler', price: 'Fiyat', size: 'Boyut', bestSellers: 'Çok Satanlar', newArrivals: 'Yeni Gelenler', allCollection: 'Tüm Koleksiyon', framed: 'Çerçeveli', unframed: 'Çerçevesiz', inStock: 'Stokta', outOfStock: 'Tükendi', similarProducts: 'Benzer Ürünler', applyCoupon: 'Uygula', newsletter: 'Yeni Koleksiyonlardan Haberdar Olun', subscribe: 'Abone Ol', compare: 'Karşılaştır', recentlyViewed: 'Son Görüntülenenler', orderHistory: 'Sipariş Geçmişi' };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const firebaseProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(firebaseProducts);
      } catch (error) { console.error('Firebase hatası:', error); setProducts([]); }
      setIsLoading(false);
    };
    fetchProducts();
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToRecentlyViewed = (p) => setRecentlyViewed(prev => [p, ...prev.filter(x => x.id !== p.id)].slice(0, 6));

  const theme = {
    bg: darkMode ? 'bg-stone-900' : 'bg-stone-50',
    bgSecondary: darkMode ? 'bg-stone-800' : 'bg-white',
    bgTertiary: darkMode ? 'bg-stone-950' : 'bg-stone-100',
    text: darkMode ? 'text-white' : 'text-stone-900',
    textSecondary: darkMode ? 'text-stone-400' : 'text-stone-600',
    textMuted: darkMode ? 'text-stone-500' : 'text-stone-400',
    border: darkMode ? 'border-stone-700' : 'border-stone-200',
    card: darkMode ? 'bg-stone-800/50 border-stone-700/50' : 'bg-white border-stone-200',
    input: darkMode ? 'bg-stone-800 border-stone-700 text-white placeholder-stone-500' : 'bg-white border-stone-300 text-stone-900',
    accent: '#e8dcc4',
  };

  if (isLoading) return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
      <div className="text-center font-light tracking-[0.3em] text-[2rem]" style={{color: theme.accent}}>LUUZ</div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 font-['Raleway']`}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className={`${theme.bgTertiary} sticky top-0 z-40 border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden"><Menu size={24} className={theme.textSecondary} /></button>
            <img src={darkMode ? "/luuz-logo-white.png" : "/luuz-logo-black.png"} alt="LUUZ" className="h-8 cursor-pointer" onClick={() => window.location.reload()} />
          </div>
          <nav className={`hidden lg:flex items-center gap-8 text-sm font-semibold ${theme.textSecondary}`}>
            <button className="hover:text-amber-600 transition">Koleksiyon</button>
            <button className="hover:text-amber-600 transition">Hakkımızda</button>
            <button className="hover:text-amber-600 transition">SSS</button>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className={theme.textSecondary}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button className={`relative ${theme.textSecondary}`}>
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-stone-800 text-center text-white">
        <div className="z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Mekanınıza <span style={{color: theme.accent}}>Ruh</span> Katın</h1>
          <p className="text-stone-300 mb-8 max-w-lg mx-auto">Modern ve özgün duvar sanatı koleksiyonumuzu keşfedin.</p>
          <button className="px-8 py-3 rounded-full font-bold bg-white text-black hover:scale-105 transition">Keşfet</button>
        </div>
      </section>

      {/* ÇOK SATANLAR - BÜYÜTÜLMÜŞ VERSİYON */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className={`text-3xl md:text-4xl font-bold ${theme.text}`}>Çok Satanlar</h3>
            <div className="h-1 w-20 bg-amber-500 mt-2 rounded-full"></div>
          </div>
          <button className="text-amber-600 font-bold hover:underline">Tümünü Gör</button>
        </div>
        
        <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide">
          {products.filter(p => p.isBestSeller).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-80 group transition-all duration-300">
              <div className={`relative overflow-hidden ${theme.card} rounded-3xl border p-5 shadow-sm hover:shadow-2xl transition-all`}>
                <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-black z-10">POPÜLER</div>
                <div className="cursor-pointer overflow-hidden rounded-2xl" onClick={() => { setSelectedProduct(product); addToRecentlyViewed(product); }}>
                  <img 
                    src={product.images?.[0]} 
                    alt={product.name} 
                    className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                </div>
              </div>
              <div className="mt-5 px-2">
                <h4 className={`text-lg font-bold ${theme.text} truncate`}>{product.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">
                    <span className="text-amber-600 font-black text-xl">₺{product.priceUnframed}</span>
                    <span className={`${theme.textMuted} ml-1`}>'den</span>
                  </p>
                  <button className="p-2 bg-stone-100 rounded-full hover:bg-amber-500 transition-colors">
                    <Plus size={20} className="text-black" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* YENİ GELENLER - BÜYÜTÜLMÜŞ VERSİYON */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-opacity-50">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className={`text-3xl md:text-4xl font-bold ${theme.text}`}>Yeni Gelenler</h3>
            <div className="h-1 w-20 bg-green-500 mt-2 rounded-full"></div>
          </div>
          <button className="text-green-600 font-bold hover:underline">Yeni Koleksiyon →</button>
        </div>
        
        <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide">
          {products.filter(p => p.isNew).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-80 group">
              <div className={`relative overflow-hidden ${theme.card} rounded-3xl border p-5 shadow-sm hover:shadow-2xl transition-all`}>
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-black z-10">YENİ</div>
                <div className="cursor-pointer overflow-hidden rounded-2xl" onClick={() => { setSelectedProduct(product); addToRecentlyViewed(product); }}>
                  <img 
                    src={product.images?.[0]} 
                    alt={product.name} 
                    className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                </div>
              </div>
              <div className="mt-5 px-2">
                <h4 className={`text-lg font-bold ${theme.text} truncate`}>{product.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">
                    <span className="text-green-600 font-black text-xl">₺{product.priceUnframed}</span>
                    <span className={`${theme.textMuted} ml-1`}>'den</span>
                  </p>
                  <button className="p-2 bg-stone-100 rounded-full hover:bg-green-500 hover:text-white transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className={`border-t ${theme.border} py-12 text-center ${theme.textSecondary}`}>
        <p className="text-sm">© 2025 LUUZ Art Studio. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
