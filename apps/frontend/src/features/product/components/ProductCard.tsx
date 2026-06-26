import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { type Product } from '@/features/product/types/product.types.ts';

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-cine-card border border-white/8 hover:border-cine-cyan/30 transition-all duration-500 hover:shadow-glow-cyan-sm flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/20 to-transparent" />

        {product.badge && (
          <span className="absolute top-3 left-3 font-sora text-xs font-medium bg-cine-cyan/90 text-black px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}

        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-cine-cyan" />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3">
        <span className="font-sora text-xs font-medium text-cine-cyan uppercase tracking-wider">
          {product.brand}
        </span>

        <h3 className="font-sora font-semibold text-white text-lg leading-snug line-clamp-2">
          {product.name}
        </h3>

        {product.specs.length > 0 && (
          <ul className="space-y-1">
            {product.specs.slice(0, 2).map((spec, index) => (
              <li key={`${product.id}-spec-${index}`} className="font-sora text-xs text-gray-500">
                {spec}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="font-sora text-2xl font-bold text-white">
              {new Intl.NumberFormat('vi-VN').format(product.price)}
            </span>
            <span className="font-sora text-xs text-gray-500">đ/ngày</span>
          </div>
          <Link
            to="/products"
            className="font-sora text-sm font-medium bg-cine-cyan/10 text-cine-cyan border border-cine-cyan/30 px-4 py-2 rounded-full hover:bg-cine-cyan hover:text-black transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
