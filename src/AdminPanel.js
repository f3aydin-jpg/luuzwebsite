import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Edit, Save, X, Upload, LogOut, Bold, Italic, Underline, List } from 'lucide-react';

const ADMIN_PASSWORD = "luuz2025"; // Basit şifre - sonra değiştir

export default function AdminPanel({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Minimal',
    price30x40Unframed: '',
    price30x40Framed: '',
    price50x70Unframed: '',
    price50x70Framed: '',
    stock: '',
    isNew: false,
    isBestSeller: false,
    discount: 0,
    images: []
  });
const descriptionRef = React.useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    descriptionRef.current?.focus();
  };

  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      setFormData(prev => ({
        ...prev,
        description: descriptionRef.current.innerHTML
      }));
    }
  };
  const categories = ['Minimal', 'Soyut', 'Doğa', 'Geometrik', 'Tipografi', 'Modern', 'Klasik', 'Portre', 'Manzara'];

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Yanlış şifre!');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `products/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    } catch (error) {
      console.error('Yükleme hatası:', error);
      alert('Fotoğraf yüklenirken hata oluştu');
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

const generateProductCode = () => {
    // Mevcut ürünlerdeki en yüksek kodu bul
    const existingCodes = products
      .map(p => p.productCode)
      .filter(code => code)
      .map(code => parseInt(code, 10));
    
    const maxCode = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    const newCode = (maxCode + 1).toString().padStart(5, '0');
    return newCode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert('En az bir fotoğraf ekleyin');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price30x40Unframed: Number(formData.price30x40Unframed),
        price30x40Framed: Number(formData.price30x40Framed),
        price50x70Unframed: Number(formData.price50x70Unframed),
        price50x70Framed: Number(formData.price50x70Framed),
        priceUnframed: Number(formData.price50x70Unframed),
        priceFramed: Number(formData.price50x70Framed),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        images: formData.images,
        reviews: [],
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        // Düzenlemede mevcut kodu koru
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        alert('Ürün güncellendi!');
      } else {
        // Yeni ürün için kod oluştur
        productData.productCode = generateProductCode();
        productData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'products'), productData);
        alert(`Ürün eklendi! Ürün Kodu: ${productData.productCode}`);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', product.id));
      alert('Ürün silindi!');
      fetchProducts();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price30x40Unframed: product.price30x40Unframed || Math.round(product.priceUnframed * 0.7) || '',
      price30x40Framed: product.price30x40Framed || Math.round(product.priceFramed * 0.7) || '',
      price50x70Unframed: product.price50x70Unframed || product.priceUnframed || '',
      price50x70Framed: product.price50x70Framed || product.priceFramed || '',
      stock: product.stock,
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      discount: product.discount || 0,
      images: product.images || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Minimal',
      price30x40Unframed: '',
      price30x40Framed: '',
      price50x70Unframed: '',
      price50x70Framed: '',
      stock: '',
      isNew: false,
      isBestSeller: false,
      discount: 0,
      images: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-stone-900 z-50 flex items-center justify-center p-4">
        <div className="bg-stone-800 rounded-2xl p-8 max-w-md w-full border border-stone-700">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">LUUZ Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-amber-500 text-stone-900 py-3 rounded-xl font-semibold hover:bg-amber-400 transition"
            >
              Giriş Yap
            </button>
          </form>
          <button
            onClick={onClose}
            className="w-full mt-4 text-stone-400 hover:text-white transition"
          >
            İptal
          </button>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="fixed inset-0 bg-stone-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-stone-800 border-b border-stone-700 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">LUUZ Admin Panel</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowForm(true); setEditingProduct(null); }}
              className="flex items-center gap-2 bg-amber-500 text-stone-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition"
            >
              <Plus size={18} /> Yeni Ürün
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-stone-700 text-white px-4 py-2 rounded-lg hover:bg-stone-600 transition"
            >
              <LogOut size={18} /> Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-stone-400 mt-4">Yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-stone-800 border border-stone-700 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Toplam Ürün</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
              <div className="bg-stone-800 border border-stone-700 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Stokta</p>
                <p className="text-2xl font-bold text-green-400">{products.filter(p => p.stock > 0).length}</p>
              </div>
              <div className="bg-stone-800 border border-stone-700 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Tükenen</p>
                <p className="text-2xl font-bold text-red-400">{products.filter(p => p.stock === 0).length}</p>
              </div>
              <div className="bg-stone-800 border border-stone-700 rounded-xl p-4">
                <p className="text-stone-400 text-sm">İndirimli</p>
                <p className="text-2xl font-bold text-amber-400">{products.filter(p => p.discount > 0).length}</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-stone-800 border border-stone-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-700">
              
                    <tr>
                      <th className="text-left px-4 py-3 text-stone-300 text-sm font-medium">Kod</th>
                      <th className="text-left px-4 py-3 text-stone-300 text-sm font-medium">Ürün</th>
                      <th className="text-left px-4 py-3 text-stone-300 text-sm font-medium">Kategori</th>
                      <th className="text-left px-4 py-3 text-stone-300 text-sm font-medium">Fiyat</th>
                      <th className="text-left px-4 py-3 text-stone-300 text-sm font-medium">Stok</th>
                      <th className="text-left px-4 py-3 text-stone-300 text-sm font-medium">Durum</th>
                      <th className="text-right px-4 py-3 text-stone-300 text-sm font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-stone-400">
                          Henüz ürün eklenmemiş
                        </td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product.id} className="border-t border-stone-700 hover:bg-stone-700/50">
                          <td className="px-4 py-3">
                      <span className="text-amber-500 font-mono text-sm">#{product.productCode || '-----'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {product.images?.[0] && (
                                <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                              )}
                              <div>
                                <p className="text-white font-medium">{product.name}</p>
                                <p className="text-stone-400 text-sm truncate max-w-[200px]">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-stone-300">{product.category}</td>
                          <td className="px-4 py-3 text-stone-300">{product.priceUnframed}₺</td>
                          <td className="px-4 py-3">
                            <span className={`${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {product.isNew && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">YENİ</span>}
                              {product.isBestSeller && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">BEST</span>}
                              {product.discount > 0 && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">-{product.discount}%</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-stone-400 hover:text-amber-400 transition"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(product)}
                                className="p-2 text-stone-400 hover:text-red-400 transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-700">
            <div className="sticky top-0 bg-stone-800 p-4 border-b border-stone-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <button onClick={resetForm} className="text-stone-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-stone-300 text-sm mb-2">Fotoğraflar *</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-stone-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500 transition">
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Upload size={24} className="text-stone-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-stone-300 text-sm mb-2">Ürün Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                  required
                />
              </div>

             {/* Description with Rich Text Editor */}
              <div>
                <label className="block text-stone-300 text-sm mb-2">Açıklama *</label>
                {/* Toolbar */}
                <div className="flex gap-1 mb-2 p-2 bg-stone-600 rounded-t-xl border border-stone-600 border-b-0">
                  <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 hover:bg-stone-500 rounded text-white transition"
                    title="Kalın"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 hover:bg-stone-500 rounded text-white transition"
                    title="İtalik"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('underline')}
                    className="p-2 hover:bg-stone-500 rounded text-white transition"
                    title="Altı Çizili"
                  >
                    <Underline size={16} />
                  </button>
                  <div className="w-px bg-stone-500 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-2 hover:bg-stone-500 rounded text-white transition"
                    title="Madde İşareti"
                  >
                    <List size={16} />
                  </button>
                </div>
                {/* Editable Area */}
                <div
                  ref={descriptionRef}
                  contentEditable
                  onInput={handleDescriptionChange}
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                  className="w-full bg-stone-700 border border-stone-600 rounded-b-xl px-4 py-3 text-white min-h-[100px] focus:outline-none focus:border-amber-500"
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>
              {/* Category */}
              <div>
                <label className="block text-stone-300 text-sm mb-2">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Prices - 30x40 */}
              <div>
                <label className="block text-amber-400 text-sm mb-2 font-medium">30x40 cm Fiyatları</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Çerçevesiz *</label>
                    <input
                      type="number"
                      value={formData.price30x40Unframed}
                      onChange={(e) => setFormData({ ...formData, price30x40Unframed: e.target.value })}
                      className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                      placeholder="₺"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Çerçeveli *</label>
                    <input
                      type="number"
                      value={formData.price30x40Framed}
                      onChange={(e) => setFormData({ ...formData, price30x40Framed: e.target.value })}
                      className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                      placeholder="₺"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Prices - 50x70 */}
              <div>
                <label className="block text-amber-400 text-sm mb-2 font-medium">50x70 cm Fiyatları</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Çerçevesiz *</label>
                    <input
                      type="number"
                      value={formData.price50x70Unframed}
                      onChange={(e) => setFormData({ ...formData, price50x70Unframed: e.target.value })}
                      className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                      placeholder="₺"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Çerçeveli *</label>
                    <input
                      type="number"
                      value={formData.price50x70Framed}
                      onChange={(e) => setFormData({ ...formData, price50x70Framed: e.target.value })}
                      className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                      placeholder="₺"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stock & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 text-sm mb-2">Stok *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-300 text-sm mb-2">İndirim (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-5 h-5 rounded border-stone-600 bg-stone-700 text-amber-500"
                  />
                  <span className="text-stone-300">Yeni Ürün</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-5 h-5 rounded border-stone-600 bg-stone-700 text-amber-500"
                  />
                  <span className="text-stone-300">Çok Satan</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-amber-500 text-stone-900 py-4 rounded-xl font-semibold text-lg hover:bg-amber-400 transition flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {editingProduct ? 'Güncelle' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
