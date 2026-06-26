import { ArrowUp, ArrowDown } from 'lucide-react';

interface ProductSortProps {
  totalItems: number;
  sortField: 'name' | 'price';
  sortDirection: 'asc' | 'desc';
  onSortFieldChange: (field: 'name' | 'price') => void;
  onSortDirectionToggle: () => void;
}

export function ProductSort({
  totalItems,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionToggle,
}: ProductSortProps) {
  return (
    <div className="flex items-center gap-4 text-sm font-sora text-gray-400">
      <span>
        Found <span className="text-cine-cyan font-medium">{totalItems}</span> items
      </span>

      <div className="flex items-center gap-2">
        <span className="text-gray-500">Sort by:</span>

        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as 'name' | 'price')}
          className="bg-cine-card border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cine-cyan/40 cursor-pointer"
        >
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>

        <button
          onClick={onSortDirectionToggle}
          className="border border-white/10 rounded-lg p-2 hover:border-cine-cyan/30 hover:text-cine-cyan transition-colors"
        >
          {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
      </div>
    </div>
  );
}
