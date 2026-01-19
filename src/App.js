{/* Filters & Collection */}
<section id="collection" className="max-w-7xl mx-auto px-4 py-6">
  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
    <div className="flex flex-col">
      <h3 className={`text-2xl font-light tracking-tight ${theme.text}`}>
        {t.allCollection} 
      </h3>
      <span className={`text-xs uppercase tracking-widest ${theme.textMuted}`}>
        {filteredProducts.length} Parça Eser
      </span>
    </div>

    <div className="flex items-center gap-4">
      {/* Filtre Butonu - Yenilenmiş Tasarım */}
      <button 
        onClick={() => setShowFilters(!showFilters)} 
        className={`group relative flex items-center gap-3 px-6 py-3 rounded-full text-xs font-medium transition-all duration-300 border
          ${showFilters 
            ? 'bg-stone-900 text-white border-stone-800' 
            : `${theme.card} ${theme.textSecondary} hover:border-stone-400 shadow-sm`}`}
      >
        <Filter size={14} className={showFilters ? 'text-amber-200' : 'group-hover:rotate-12 transition-transform'} />
        <span className="tracking-wide">{t.filters}</span>
        {(selectedSizes.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1500) && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-stone-900 font-bold">
            !
          </span>
        )}
      </button>

      {/* Sıralama Butonu - Yenilenmiş Tasarım */}
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none ${theme.textMuted}`}>
          <TrendingUp size={14} />
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className={`appearance-none pl-10 pr-10 py-3 rounded-full text-xs font-medium transition-all duration-300 border focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer
            ${theme.input} shadow-sm hover:border-stone-400`}
        >
          <option value="popular">En Popüler</option>
          <option value="newest">En Yeniler</option>
          <option value="priceLow">Fiyat: Düşükten Yükseğe</option>
          <option value="priceHigh">Fiyat: Yüksekten Düşüğe</option>
        </select>
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none ${theme.textMuted}`}>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Görünüm Modu - Yenilenmiş Tasarım */}
      <div className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border ${theme.card}`}>
        <button 
          onClick={() => setViewMode('grid')} 
          className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-stone-700 text-white shadow-md' : theme.textMuted + ' hover:text-stone-400'}`}
        >
          <Grid size={15} />
        </button>
        <button 
          onClick={() => setViewMode('list')} 
          className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-stone-700 text-white shadow-md' : theme.textMuted + ' hover:text-stone-400'}`}
        >
          <List size={15} />
        </button>
      </div>
    </div>
  </div>

  {/* Filtre Paneli Açıldığında Daha Yumuşak Geçiş (Opsiyonel) */}
  {showFilters && (
    <div className={`${theme.card} border rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300`}>
      {/* Mevcut filtre içeriği buraya gelecek */}
    </div>
  )}
</section>
