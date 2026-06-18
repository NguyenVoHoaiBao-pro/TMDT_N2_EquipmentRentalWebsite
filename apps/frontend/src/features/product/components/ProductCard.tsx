import { type Product } from '@/features/product/types/product.types.ts';

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden flex flex-col group hover:shadow-lg transition">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />

        {product.badge && (
          <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs rounded">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-2">
        <span className="text-blue-600 uppercase text-xs">{product.brand}</span>

        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

        <ul className="space-y-1">
          {product.specs.map((spec, index) => (
            <li key={`${product.id}-${index}`} className="text-sm text-gray-500">
              {spec}
            </li>
          ))}
        </ul>

        <div
          className="mt-auto pt-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
        >
          <span className="font-bold text-green-600">${product.price}/day</span>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">Rent Now</button>
        </div>
      </div>
    </div>
  );
}
