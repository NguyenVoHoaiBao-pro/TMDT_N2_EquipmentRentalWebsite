// ProductFilters.tsx
import { brands } from '@/features/product/constants/brands.ts';
import { categories } from '@/features/product/constants/categories.ts';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  resetFilters: () => void;
}

export function ProductFilters({

                                 selectedCategory,
                                 onCategoryChange,
                                 selectedBrands,
                                 onBrandChange,
                                 priceRange,
                                 onPriceRangeChange,
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
    <>
      <div className="flex justify-between">
        <h2>Filters</h2>
        <button onClick={resetFilters}>
          Clear All
        </button>
      </div>

      {/* Category filter */}
      <div className="mt-4 pb-2 mb-4 text-left">
        <h2>Category</h2>
        <div className="flex flex-col gap-2 mt-2 text-left">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`rounded-lg px-2 py-1 border cursor-pointer hover:bg-gray-100 border-gray-300
                ${selectedCategory === category ? 'bg-blue-100 border-blue-400' : ''}`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col gap-2 mt-2 text-left">
          <h2>Price Range</h2>
          <Slider
            range
            min={1}
            max={1000}
            value={priceRange}
            onChange={(value) => onPriceRangeChange(value as [number, number])}
          />
          <p>Selected range: {priceRange[0]}$ - {priceRange[1]}$</p>
        </div>
      </div>

      {/* Brand filter */}
      <div className="mt-4 pb-2 mb-4 text-left">
        <h2>Brand</h2>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li key={brand}>
              <input
                type="checkbox"
                id={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span className="ml-2">{brand}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
