import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema with Zod
const equipmentSearchSchema = z.object({
  keyword: z.string().min(2, 'Search term must be at least 2 characters').optional(),
  category: z.string().optional(),
  priceMin: z.coerce.number().min(0, 'Minimum price cannot be negative').optional(),
  priceMax: z.coerce.number().min(0, 'Maximum price cannot be negative').optional(),
});

type EquipmentFilterData = z.infer<typeof equipmentSearchSchema>;

export function EquipmentFilter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentFilterData>({
    resolver: zodResolver(equipmentSearchSchema as unknown as any),
    defaultValues: {
      keyword: '',
      category: 'all',
      priceMin: 0,
      priceMax: 10000000,
    },
  });

  const onSubmit = (data: EquipmentFilterData) => {
    console.log('Filter data:', data);
    // Fetch equipment with filters
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="mb-4">
        <label htmlFor="keyword" className="block text-sm font-medium mb-1">
          Search
        </label>
        <input
          {...register('keyword')}
          type="text"
          id="keyword"
          placeholder="Search equipment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          {...register('category')}
          id="category"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="tools">Tools</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="priceMin" className="block text-sm font-medium mb-1">
            Min Price
          </label>
          <input
            {...register('priceMin')}
            type="number"
            id="priceMin"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.priceMin && (
            <p className="text-red-500 text-sm mt-1">{errors.priceMin.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priceMax" className="block text-sm font-medium mb-1">
            Max Price
          </label>
          <input
            {...register('priceMax')}
            type="number"
            id="priceMax"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.priceMax && (
            <p className="text-red-500 text-sm mt-1">{errors.priceMax.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </form>
  );
}
