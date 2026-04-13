import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { AxiosError } from 'axios';

// Equipment types
export interface Equipment {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  availability: boolean;
  category: string;
}

export interface EquipmentListParams {
  keyword?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}

// Equipment hooks
export const useEquipmentList = (params?: EquipmentListParams) => {
  return useQuery<Equipment[], AxiosError>({
    queryKey: ['equipment', params],
    queryFn: async () => {
      const response = await api.equipment.list(params as Record<string, unknown>);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly known as cacheTime)
  });
};

export const useEquipmentById = (id: string) => {
  return useQuery<Equipment, AxiosError>({
    queryKey: ['equipment', id],
    queryFn: async () => {
      const response = await api.equipment.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useEquipmentSearch = (keyword: string) => {
  return useQuery<Equipment[], AxiosError>({
    queryKey: ['equipment', 'search', keyword],
    queryFn: async () => {
      const response = await api.equipment.search(keyword);
      return response.data;
    },
    enabled: keyword.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Order types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface OrderItem {
  equipmentId: string;
  quantity: number;
  rentalDays: number;
  price: number;
}

// Order hooks
export const useOrderList = () => {
  return useQuery<Order[], AxiosError>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.orders.list();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrderById = (id: string) => {
  return useQuery<Order, AxiosError>({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await api.orders.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
      const response = await api.orders.create(orderData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Usage example:
/*
function EquipmentPage() {
  // Fetch equipment list
  const { data: equipment, isLoading, error } = useEquipmentList();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {equipment?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

function CheckoutPage() {
  // Create order mutation
  const { mutate: createOrder, isPending } = useCreateOrder();

  const handleSubmit = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    createOrder(orderData, {
      onSuccess: () => {
        console.log('Order created successfully!');
      },
    });
  };

  return (
    <button onClick={() => handleSubmit(...)} disabled={isPending}>
      {isPending ? 'Creating...' : 'Place Order'}
    </button>
  );
}
*/
