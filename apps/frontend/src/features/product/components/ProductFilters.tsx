// ProductFilters.tsx
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  resetFilters: () => void;
}

export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  onCategoryChange,
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  resetFilters,
}: ProductFiltersProps) {
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="font-sora text-white space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-xs text-cine-cyan hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`text-left rounded-lg px-3 py-2 text-sm border transition-all ${
                selectedCategory === category
                  ? 'bg-cine-cyan/10 border-cine-cyan/40 text-cine-cyan'
                  : 'border-white/8 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <Slider
          range
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={(value) => onPriceRangeChange(value as [number, number])}
          trackStyle={[{ backgroundColor: '#5eead4' }]}
          handleStyle={[
            { borderColor: '#5eead4', backgroundColor: '#5eead4', opacity: 1 },
            { borderColor: '#5eead4', backgroundColor: '#5eead4', opacity: 1 },
          ]}
          railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        />
        <p className="text-xs text-gray-500 mt-2">
          {new Intl.NumberFormat('vi-VN').format(priceRange[0])}đ –{' '}
          {new Intl.NumberFormat('vi-VN').format(priceRange[1])}đ / ngày
        </p>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Brand</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <li key={brand}>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-cine-cyan rounded"
                  />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
