import { brands } from '@/features/product/constants/brands.ts';
import { categories } from '@/features/product/constants/categories.ts';

export function ProductFilters() {
  return (
    <>
      <div className="flex justify-between">
        <h2>Filters</h2>
        <button>Clear All</button>
      </div>
      <div className="mt-4 pb-2 mb-4 text-left">
        <h2>Category</h2>
        <div className="flex flex-col gap-2 mt-2 text-left">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-lg px-2 py-1 border cursor-pointer hover:bg-gray-100 border-gray-300"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-col gap-2 mt-2 text-left">
          <h2>Price Range</h2>
          <span>$1 - $1000</span>
          <input type="range" min="1" max="1000" className="w-full" />
        </div>
      </div>

      <div className="mt-4">
        <h2>Brand</h2>
        <div className="flex flex-col gap-2 mt-2 text-left">
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand}>
                <input type="checkbox" id={brand} />
                <span className="ml-2">{brand}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
