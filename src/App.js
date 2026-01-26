{/* ÜRÜN DETAY MODALI */}
{selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className={`${theme.bgSecondary} w-full max-w-4xl max-h-[90vh] overflow-y-auto relative rounded-sm shadow-2xl flex flex-col md:flex-row border ${theme.border}`}>
      <button onClick={() => setSelectedProduct(null)} className={`absolute top-4 right-4 z-10 p-2 ${theme.textSecondary} hover:${theme.text}`}><X size={24} /></button>
      
      {/* Görsel Alanı */}
      <div className="w-full md:w-1/2 bg-stone-100">
        <img src={selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-full h-full object-cover aspect-[3/4]" />
      </div>

      {/* İçerik Alanı */}
      <div className="w-full md:w-1/2 p-8 md:p-12">
        <p className={`text-[10px] tracking-[0.3em] uppercase mb-2 ${theme.textMuted}`}>LUUZ POSTER</p>
        <h2 className={`text-3xl font-light mb-4 ${theme.text}`} style={{fontFamily: "'Raleway', sans-serif"}}>{selectedProduct.name}</h2>
        
        <div className="flex items-baseline gap-3 mb-8">
          <p className={`text-2xl font-medium ${theme.text}`}>
            {selectedProduct.selectedSize === '30x40' 
              ? (selectedProduct.selectedFrame === 'Çerçevesiz' ? selectedProduct.price30x40Unframed : selectedProduct.price30x40Framed) 
              : (selectedProduct.selectedFrame === 'Çerçevesiz' ? selectedProduct.price50x70Unframed : selectedProduct.price50x70Framed)} TL
          </p>
        </div>

        {/* BOYUT SEÇİMİ */}
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
                      ? (darkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                      : `bg-transparent ${theme.border} ${theme.text} hover:border-stone-400`
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* ÇERÇEVE SEÇİMİ */}
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
                      ? (darkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                      : `bg-transparent ${theme.border} ${theme.text} hover:border-stone-400`
                  }`}
                >
                  {frame}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEPETE EKLE */}
        <div className="flex flex-col gap-4 mt-10">
          <div className={`flex items-center w-32 border ${theme.border}`}>
            <button onClick={() => setSelectedProduct({...selectedProduct, quantity: Math.max(1, (selectedProduct.quantity || 1) - 1)})} className={`p-3 ${theme.text}`}><Minus size={14} /></button>
            <span className={`flex-1 text-center text-sm font-bold ${theme.text}`}>{selectedProduct.quantity || 1}</span>
            <button onClick={() => setSelectedProduct({...selectedProduct, quantity: (selectedProduct.quantity || 1) + 1})} className={`p-3 ${theme.text}`}><Plus size={14} /></button>
          </div>
          <button
            onClick={() => addToCart(selectedProduct, selectedProduct.selectedFrame !== 'Çerçevesiz')}
            className={`w-full py-5 text-[11px] font-bold uppercase tracking-[0.4em] transition-all ${
              darkMode 
                ? 'bg-white text-black hover:bg-stone-200' 
                : 'bg-black text-white hover:bg-stone-800'
            }`}
          >
            SEPETE EKLE
          </button>
        </div>
      </div>
    </div>
  </div>
)}
