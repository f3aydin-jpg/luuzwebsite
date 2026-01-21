import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu, Search, Heart, MessageCircle, Package, Star, ChevronDown, ChevronUp, Filter, Grid, List, ArrowUp, Moon, Sun, Globe, Clock, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Tag, TrendingUp, Eye, Instagram, Twitter, Facebook, ZoomIn, Settings } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollection, setShowCollection] = useState(false);
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['Tümü', 'Minimalist', 'Soyut', 'Doğa', 'Geometrik', 'Modern'];

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'newest') return 1;
      return 0;
    });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const theme = {
    bg: darkMode ? 'bg-stone-950' : 'bg-white',
    bgSecondary: darkMode ? 'bg-stone-900' : 'bg-stone-50',
    text: darkMode ? 'text-stone-100' : 'text-stone-900',
    textSecondary: darkMode ? 'text-stone-400' : 'text-stone-500',
    border: darkMode ? 'border-stone-800' : 'border-stone-200',
    accent: '#d4af37',
    input: darkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'
  };

  if (showAdmin) return <AdminPanel onBack={() => setShowAdmin(false)} darkMode={darkMode} />;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} selection:bg-stone-700 selection:text-white transition-colors duration-300 font-sans`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 ${theme.bgSecondary} border-b ${theme.border} backdrop-blur-md bg-opacity-80`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => setShowMobileMenu(true)} className="lg:hidden hover:scale-110 transition">
              <Menu size={24} />
            </button>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowCollection(false)}>
              <span className="text-3xl font-light tracking-[0.2em] text-white">LUUZ</span>
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-60">Digital Art</span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              {['Koleksiyon', 'Yeni Gelenler', 'En Çok Satanlar'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    if(item === 'En Çok Satanlar') {
                       setSelectedCategory('Tümü');
                       setSortBy('popular');
                       setShowCollection(true);
                    } else if(item === 'Yeni Gelenler') {
                       setSelectedCategory('Tümü');
                       setSortBy('newest');
                       setShowCollection(true);
                    } else {
                       setShowCollection(true);
                    }
                  }}
                  className="text-sm font-medium tracking-widest uppercase hover:text-stone-400 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setShowSearch(true)} className="hover:scale-110 transition"><Search size={20} /></button>
            <button onClick={() => setDarkMode(!darkMode)} className="hover:scale-110 transition">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setShowCart(true)} className="relative group hover:scale-110 transition">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-100 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <button onClick={() => setShowAdmin(true)} className="hover:scale-110 transition opacity-20 hover:opacity-100">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      {!showCollection ? (
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative h-[90vh] overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000" 
                className="w-full h-full object-cover scale-105"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
              <div className="space-y-6 max-w-2xl">
                <span className="inline-block text-xs tracking-[0.5em] uppercase opacity-60">Sınırlı Sayıda Koleksiyon</span>
                <h1 className="text-6xl md:text-8xl font-light leading-tight tracking-tight">
                  Modern Sanatın <br />
                  <span className="italic font-serif">Dijital Hali</span>
                </h1>
                <p className="text-lg text-stone-400 font-light max-w-md">
                  Yaşam alanınıza ruh katacak, özenle seçilmiş dijital sanat eserlerini keşfedin.
                </p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowCollection(true)}
                    className="px-10 py-5 bg-white text-stone-950 font-medium tracking-widest uppercase hover:bg-stone-200 transition-all rounded-sm flex items-center gap-3 group"
                  >
                    Koleksiyonu Keşfet
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Categories */}
          <section className="py-24 max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Değiştirilen Buton 1: Çok Satanlar */}
              <div className="group relative h-[500px] overflow-hidden cursor-pointer" 
                   onClick={() => { setSelectedCategory('Tümü'); setSortBy('popular'); setShowCollection(true); }}>
                <img src="https://images.unsplash.com/photo-1515405299443-f71bb768a69e?w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-all" />
                <div className="absolute bottom-10 left-10 space-y-4">
                  <h3 className="text-3xl font-light tracking-wider">Çok Satanlar</h3>
                  <button className="text-sm font-medium tracking-[0.3em] uppercase border-b border-white pb-2 hover:opacity-70 transition">Tümünü Gör</button>
                </div>
              </div>

              {/* Değiştirilen Buton 2: Yeni Ürünler */}
              <div className="group relative h-[500px] overflow-hidden cursor-pointer md:mt-12"
                   onClick={() => { setSelectedCategory('Tümü'); setSortBy('newest'); setShowCollection(true); }}>
                <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-all" />
                <div className="absolute bottom-10 left-10 space-y-4">
                  <h3 className="text-3xl font-light tracking-wider">Yeni Ürünler</h3>
                  <button className="text-sm font-medium tracking-[0.3em] uppercase border-b border-white pb-2 hover:opacity-70 transition">Tümünü Gör</button>
                </div>
              </div>

              <div className="group relative h-[500px] overflow-hidden cursor-pointer"
                   onClick={() => { setSelectedCategory('Soyut'); setShowCollection(true); }}>
                <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-all" />
                <div className="absolute bottom-10 left-10 space-y-4">
                  <h3 className="text-3xl font-light tracking-wider">Soyut Seri</h3>
                  <button className="text-sm font-medium tracking-[0.3em] uppercase border-b border-white pb-2 hover:opacity-70 transition">Tümünü Gör</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* Collection Page - Bu alan diğer kategoriler tıklandığında açılan ana sayfa */
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-5xl font-light tracking-tight italic font-serif">Koleksiyon</h2>
              <div className="flex gap-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs tracking-[0.2em] uppercase transition-all pb-1 border-b-2 
                      ${selectedCategory === cat ? 'border-stone-100 text-stone-100' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-6 border-b border-stone-800 pb-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs tracking-widest uppercase focus:outline-none cursor-pointer"
              >
                <option value="featured">Öne Çıkanlar</option>
                <option value="popular">En Çok Satanlar</option>
                <option value="newest">En Yeniler</option>
                <option value="price-low">Fiyat (Artan)</option>
                <option value="price-high">Fiyat (Azalan)</option>
              </select>
              <div className="flex gap-4 items-center pl-6 border-l border-stone-800">
                <button onClick={() => setViewMode('grid')} className={`${viewMode === 'grid' ? 'text-white' : 'text-stone-600'} hover:text-white transition`}>
                  <Grid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`${viewMode === 'list' ? 'text-white' : 'text-stone-600'} hover:text-white transition`}>
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16" : "space-y-8"}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative space-y-4">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-all duration-500" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.new && <span className="bg-white text-stone-950 text-[10px] tracking-widest uppercase px-3 py-1 font-bold">Yeni</span>}
                    {product.rating > 4.8 && <span className="bg-stone-100 text-stone-950 text-[10px] tracking-widest uppercase px-3 py-1 font-bold">En Çok Satan</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-stone-950">
                    <Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="absolute bottom-0 left-0 right-0 py-5 bg-white text-stone-950 text-xs tracking-[0.3em] uppercase font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    Sepete Ekle
                  </button>
                </div>
                <div className="flex justify-between items-start px-2">
                  <div className="space-y-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone-500">{product.category}</p>
                    <h3 className="text-sm tracking-widest uppercase font-medium">{product.name}</h3>
                  </div>
                  <p className="text-sm font-light text-stone-400">{product.price} TL</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl" onClick={() => setSelectedProduct(null)} />
          <div className={`relative w-full max-w-6xl ${theme.bgSecondary} overflow-hidden rounded-sm flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]`}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-10 p-2 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
            <div className="w-full md:w-1/2 h-2/3 md:h-auto relative bg-stone-900 group">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-zoom-in bg-stone-950/20">
                <ZoomIn className="text-white" size={32} />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-stone-500 text-[10px] tracking-[0.3em] uppercase">
                    <span>{selectedProduct.category}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={10} fill="currentColor" />
                      <span className="text-stone-300">{selectedProduct.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-light tracking-tight">{selectedProduct.name}</h2>
                  <p className="text-2xl font-light text-stone-300">{selectedProduct.price} TL</p>
                </div>
                <p className="text-stone-400 leading-relaxed font-light">{selectedProduct.description || "Bu eşsiz parça, modern yaşam alanlarınıza derinlik ve estetik katmak için özel olarak tasarlandı. En yüksek kalitede dijital baskı standartlarına uygun olarak hazırlandı."}</p>
                <div className="space-y-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-bold">Ölçü Seçenekleri</p>
                  <div className="flex flex-wrap gap-3">
                    {['30x40cm', '50x70cm', '70x100cm'].map(size => (
                      <button key={size} className="px-6 py-3 border border-stone-800 text-xs tracking-widest hover:border-white transition rounded-sm">{size}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button onClick={() => addToCart(selectedProduct)} className="flex-1 py-5 bg-white text-stone-950 text-xs tracking-[0.3em] uppercase font-bold hover:bg-stone-200 transition rounded-sm">Sepete Ekle</button>
                  <button onClick={() => toggleFavorite(selectedProduct.id)} className={`w-16 flex items-center justify-center border ${favorites.includes(selectedProduct.id) ? 'border-red-500 text-red-500' : 'border-stone-800 text-white'} hover:border-white transition rounded-sm`}>
                    <Heart size={20} fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="pt-10 grid grid-cols-2 gap-8 border-t border-stone-800">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-white group-hover:text-stone-950 transition-all"><Truck size={20} /></div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-widest uppercase">Ücretsiz Kargo</p>
                      <p className="text-[10px] text-stone-500">2-4 iş günü</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-white group-hover:text-stone-950 transition-all"><Shield size={20} /></div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-widest uppercase">Güvenli Ödeme</p>
                      <p className="text-[10px] text-stone-500">256-bit SSL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className={`absolute right-0 top-0 h-full w-full max-w-md ${theme.bgSecondary} shadow-2xl transition-transform duration-500 ease-in-out border-l ${theme.border}`}>
            <div className="flex flex-col h-full">
              <div className="p-8 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-light tracking-widest uppercase">Sepetim</h2>
                  <span className="text-[10px] px-2 py-1 bg-stone-800 text-stone-400 rounded-full">{cart.length} Ürün</span>
                </div>
                <button onClick={() => setShowCart(false)} className="hover:rotate-90 transition-transform duration-300"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center opacity-50"><ShoppingCart size={32} /></div>
                    <div className="space-y-2">
                      <p className="text-sm tracking-widest uppercase opacity-50">Sepetiniz Boş</p>
                      <p className="text-xs text-stone-500 max-w-[200px]">Sanat koleksiyonunuza başlamak için ürünleri keşfedin.</p>
                    </div>
                    <button onClick={() => {setShowCart(false); setShowCollection(true);}} className="text-xs tracking-[0.2em] uppercase border-b border-white pb-2 hover:text-stone-400 transition">Alışverişe Başla</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-32 bg-stone-900 overflow-hidden rounded-sm">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                          <h4 className="text-xs tracking-widest uppercase font-medium">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-stone-600 hover:text-white transition"><X size={14} /></button>
                        </div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest">Digital Download</p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-stone-800 rounded-sm">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white/5 transition"><Minus size={12} /></button>
                            <span className="w-8 text-center text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white/5 transition"><Plus size={12} /></button>
                          </div>
                          <p className="text-sm font-light">{item.price * item.quantity} TL</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-stone-800 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs tracking-widest uppercase text-stone-500">
                      <span>Ara Toplam</span>
                      <span>{cart.reduce((a, b) => a + (b.price * b.quantity), 0)} TL</span>
                    </div>
                    <div className="flex justify-between text-xs tracking-widest uppercase text-stone-500">
                      <span>Kargo</span>
                      <span className="text-green-500">Ücretsiz</span>
                    </div>
                    <div className="flex justify-between text-lg tracking-widest uppercase pt-4">
                      <span>Toplam</span>
                      <span>{cart.reduce((a, b) => a + (b.price * b.quantity), 0)} TL</span>
                    </div>
                  </div>
                  <button className="w-full py-5 bg-white text-stone-950 text-xs tracking-[0.3em] uppercase font-bold hover:bg-stone-200 transition rounded-sm shadow-xl">Ödemeye Geç</button>
                  <p className="text-[10px] text-center text-stone-500 tracking-widest">Tüm ödemeleriniz 256-bit SSL ile korunmaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`${theme.bgSecondary} border-t ${theme.border} pt-24 pb-12`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8 col-span-1 md:col-span-1">
            <div className="flex flex-col">
              <span className="text-3xl font-light tracking-[0.2em]">LUUZ</span>
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-40">Digital Art Studio</span>
            </div>
            <p className="text-stone-400 text-sm font-light leading-relaxed">Modern, minimalist ve dijital sanatın en seçkin örneklerini yaşam alanlarınıza taşıyoruz.</p>
            <div className="flex gap-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-stone-500 hover:text-white transition-colors hover:scale-110 transform duration-300"><Icon size={20} /></a>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.3em] uppercase font-bold">Keşfet</h4>
            <ul className="space-y-4 text-sm text-stone-400 font-light">
              <li><button onClick={() => {setShowCollection(true); setSelectedCategory('Tümü');}} className="hover:text-white transition">Tüm Ürünler</button></li>
              <li><button onClick={() => {setShowCollection(true); setSortBy('popular');}} className="hover:text-white transition">En Çok Satanlar</button></li>
              <li><button onClick={() => {setShowCollection(true); setSortBy('newest');}} className="hover:text-white transition">Yeni Gelenler</button></li>
              <li><a href="#" className="hover:text-white transition">Sanatçı Hikayemiz</a></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.3em] uppercase font-bold">Destek</h4>
            <ul className="space-y-4 text-sm text-stone-400 font-light">
              <li><a href="#" className="hover:text-white transition">Sıkça Sorulan Sorular</a></li>
              <li><a href="#" className="hover:text-white transition">Kargo ve İade</a></li>
              <li><a href="#" className="hover:text-white transition">Kullanım Koşulları</a></li>
              <li><a href="#" className="hover:text-white transition">Gizlilik Politikası</a></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.3em] uppercase font-bold">Bülten</h4>
            <p className="text-stone-400 text-sm font-light">Yeni koleksiyonlar ve özel indirimlerden haberdar olun.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="E-posta adresi" className={`flex-1 ${theme.bg} border ${theme.border} px-4 py-3 text-sm focus:outline-none focus:border-white transition rounded-sm`} />
              <button className="px-6 py-3 bg-white text-stone-950 text-xs font-bold tracking-widest uppercase hover:bg-stone-200 transition rounded-sm">Katıl</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-500">© 2024 LUUZ Digital Art. Tüm hakları saklıdır.</p>
          <div className="flex gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2 border border-stone-800 px-3 py-1 rounded">
              <Shield size={12} />
              <span className="text-[10px] tracking-widest uppercase font-bold italic">VISA</span>
            </div>
            <div className="flex items-center gap-2 border border-stone-800 px-3 py-1 rounded">
              <Shield size={12} />
              <span className="text-[10px] tracking-widest uppercase font-bold italic">MasterCard</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-stone-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-950 flex items-center justify-center text-white"><MessageCircle size={16} /></div>
              <div>
                <p className="text-xs font-bold text-stone-950">Müşteri Destek</p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Çevrimiçi</p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-stone-950 hover:rotate-90 transition-transform"><X size={20} /></button>
          </div>
          <div className="h-64 p-4 space-y-4 overflow-y-auto">
            <div className="bg-stone-800 p-3 rounded-xl rounded-tl-none max-w-[80%]"><p className="text-sm text-stone-100">Merhaba! Nasıl yardımcı olabilirim? 😊</p></div>
          </div>
          <div className={`p-3 border-t ${theme.border}`}>
            <div className="flex gap-2">
              <input type="text" placeholder="Mesajınızı yazın..." className={`flex-1 ${theme.input} border rounded-xl px-4 py-2 text-sm focus:outline-none`} />
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-stone-950 hover:scale-105 transition"><ChevronRight size={18} /></button>
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
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="fixed bottom-6 left-6 w-12 h-12 bg-stone-900 border border-stone-800 rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center justify-center text-white"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[110] bg-stone-950/98 backdrop-blur-xl flex flex-col p-10 animate-in fade-in duration-300">
          <div className="max-w-3xl mx-auto w-full space-y-12">
            <div className="flex justify-between items-center border-b border-stone-800 pb-6">
              <input 
                autoFocus
                type="text" 
                placeholder="SANAT ESERİ ARA..." 
                className="bg-transparent text-4xl font-light w-full focus:outline-none tracking-tight uppercase"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => {setShowSearch(false); setSearchQuery('');}}><X size={40} className="hover:rotate-90 transition-all duration-300" /></button>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-stone-500 font-bold">Popüler Aramalar</p>
              <div className="flex flex-wrap gap-4">
                {['Minimalist', 'Soyut', 'Doğa', 'Siyah Beyaz'].map(tag => (
                  <button key={tag} onClick={() => {setSearchQuery(tag); setShowCollection(true); setShowSearch(false);}} className="px-6 py-2 border border-stone-800 rounded-full text-xs tracking-widest hover:bg-white hover:text-stone-950 transition-all">{tag}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
