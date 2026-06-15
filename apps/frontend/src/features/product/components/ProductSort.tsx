export function ProductSort() {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <span>Found 101 items</span>

      <div className="flex items-center gap-2">
        <span className="text-gray-400">Sort by:</span>
        <select className="border rounded px-2 py-1 bg-white cursor-pointer font-medium text-gray-800">
          <option value="popularity">Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
}
