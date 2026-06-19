import { Search } from 'lucide-react';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: ProductSearchProps) {
  return (
    <div className="hidden md:block w-fit max-w-sm">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full border rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
