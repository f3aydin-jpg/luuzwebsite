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
  const [specialFilter, setSpecialFilter] = useState(null);

  const t = language === 'tr' ? { collection: 'Koleksiyon', about: 'Hakkımızda', howItWorks: 'Nasıl Çalışır', faq: 'SSS', search: 'Ürün ara...', cart: 'Sepetim', favorites: 'Favorilerim', addToCart: 'Sepete Ekle', checkout: 'Ödemeye Geç', total: 'Toplam', empty: 'Sepetiniz boş', filters: 'Filtreler', price: 'Fiyat', size: 'Boyut', bestSellers: 'Çok Satanlar', newArrivals: 'Yeni Gelenler', allCollection: 'Tüm Koleksiyon', framed: 'Çerçeveli', unframed: 'Çerçevesiz', inStock: 'Stokta', outOfStock: 'Tükendi', similarProducts: 'Benzer Ürünler', applyCoupon: 'Uygula', newsletter: 'Yeni Koleksiyonlardan Haberdar Olun', subscribe: 'Abone Ol', compare: 'Karşılaştır', recentlyViewed: 'Son Görüntülenenler', orderHistory: 'Sipariş Geçmişi' } : { collection: 'Collection', about: 'About', howItWorks: 'How It Works', faq: 'FAQ', search: 'Search...', cart: 'Cart', favorites: 'Favorites', addToCart: 'Add to Cart', checkout: 'Checkout', total: 'Total', empty: 'Cart is empty', filters: 'Filters', price: 'Price', size: 'Size', bestSellers: 'Best Sellers', newArrivals: 'New Arrivals', allCollection: 'All Collection', framed: 'Framed', unframed: 'Unframed', inStock: 'In Stock', outOfStock: 'Out of Stock', similarProducts: 'Similar', applyCoupon: 'Apply', newsletter: 'Stay Updated', subscribe: 'Subscribe', compare: 'Compare', recentlyViewed: 'Recently Viewed', orderHistory: 'Orders' };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const firebaseProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(firebaseProducts);
      } catch (error) {
        console.error('Firebase hatası:', error);
      }
      setIsLoading(false);
    };
    fetchProducts();
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const theme = {
    bg: darkMode ? 'bg-stone-900' : 'bg-stone-50',
    bgSecondary: darkMode ? 'bg-stone-800' : 'bg-white',
    bgTertiary: darkMode ? 'bg-stone-950' : 'bg-stone-100',
    text: darkMode ? 'text-white' : 'text-stone-900',
    textSecondary: darkMode ? 'text-stone-400' : 'text-stone-600',
    border: darkMode ? 'border-stone-700' : 'border-stone-200',
    input: darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900',
    accent: '#e8dcc4',
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
      <div className="text-center">
        <h1 className="text-4xl tracking-widest font-light mb-8" style={{color: theme.accent}}>LUUZ</h1>
        <div className="flex gap-2 justify-center">{[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full animate-bounce" style={{background: theme.accent, animationDelay: `${i*0.15}s`}}/>)}</div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <style>{`
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .shimmer-btn { position: relative; overflow: hidden; }
        .shimmer-btn::after {
          content: ''; position: absolute; top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer-sweep 3s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>

      {/* Header (Basitleştirilmiş Versiyon) */}
      <header className={`${theme.bgTertiary} sticky top-0 z-40 border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`lg:hidden ${theme.textSecondary}`}><Menu size={24} /></button>
            <span className="text-2xl font-light tracking-tighter" style={{color: darkMode ? '#fff' : '#000'}}>LUUZ</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={20} className="text-white"/> : <Moon size={20}/>}</button>
            <button onClick={() => setShowCart(true)} className="relative">
                <ShoppingCart size={20} className={theme.text}/>
                {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-amber-200 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - BUTONUN OLDUĞU YER */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-stone-900">
        <div className="absolute inset-0 opacity-40">
           <div className="grid grid-cols-6 gap-2">
              {products.slice(0,12).map((p, i) => <img key={i} src={p.images?.[0]} className="w-full h-32 object-cover grayscale" alt=""/>)}
           </div>
        </div>
        <div className="relative z-10 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">Duvarlarınıza <span style={{color: theme.accent}}>Sanat</span> Katın</h2>
          <p className="text-stone-400 mb-8 max-w-lg mx-auto">Mekanlarınıza modern bir dokunuş ekleyin.</p>
          
          <button 
            onClick={() => setShowCollection(true)} 
            className="shimmer-btn text-stone-900 px-12 py-5 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(232,220,196,0.4)] hover:shadow-[0_0_40px_rgba(232,220,196,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto group"
            style={{background: theme.accent}}
          >
            Koleksiyonu Keşfet
            <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Ana İçerik (Koleksiyon Görüntüleme) */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200">
                <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className={`mt-4 font-medium ${theme.text}`}>{product.name}</h3>
              <p className="text-amber-600 font-bold">₺{product.priceUnframed}</p>
            </div>
          ))}
        </div>
      </main>

      {/* WhatsApp & Admin Panel Butonu */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
         <button onClick={() => setShowAdmin(true)} className="w-12 h-12 bg-stone-800 text-white rounded-full flex items-center justify-center"><Settings size={20}/></button>
         <a href="https://wa.me/905060342409" className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl"><MessageCircle size={24}/></a>
      </div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
