import { ArrowUp, ArrowDown } from 'lucide-react';

interface ProductSortProps {
  totalItems: number;

  sortField: 'name' | 'price';
  sortDirection: 'asc' | 'desc';

  onSortFieldChange: (
    field: 'name' | 'price',
  ) => void;

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
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <span>
        Found {totalItems} items
      </span>

      <div className="flex items-center gap-2">
        <span className="text-gray-400">
          Sort by:
        </span>

        <select
          value={sortField}
          onChange={(e) =>
            onSortFieldChange(
              e.target.value as | 'name' | 'price',
            )
          }
          className="border rounded px-2 py-1 bg-white cursor-pointer"
        >
          <option value="price">
            Price
          </option>

          <option value="name">
            Name
          </option>
        </select>

        <button
          onClick={onSortDirectionToggle}
          className="border rounded p-2 hover:bg-gray-100
          "
        >
          {sortDirection === 'asc'
            ? <ArrowUp size={16} />
            : <ArrowDown size={16} />}
        </button>
      </div>
    </div>
  );
}
