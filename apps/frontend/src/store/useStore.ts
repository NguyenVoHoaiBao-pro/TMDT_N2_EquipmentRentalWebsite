import { create } from 'zustand';

// Define store types
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  token: string;
}

export interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface CartItem {
  equipmentId: string;
  name: string;
  price: number;
  quantity: number;
  rentalDays: number;
}

export interface CartStore {
  items: CartItem[];
  total: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (equipmentId: string) => void;
  updateQuantity: (equipmentId: string, quantity: number) => void;
  clear: () => void;
  calculateTotal: () => number;
}

// Auth Store
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    localStorage.setItem('token', user.token);
    set({ user, error: null });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Cart Store
export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.equipmentId === item.equipmentId);

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.equipmentId === item.equipmentId ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }

      return { items: [...state.items, item] };
    });
  },

  removeItem: (equipmentId) => {
    set((state) => ({
      items: state.items.filter((i) => i.equipmentId !== equipmentId),
    }));
  },

  updateQuantity: (equipmentId, quantity) => {
    set((state) => ({
      items: state.items.map((i) => (i.equipmentId === equipmentId ? { ...i, quantity } : i)),
    }));
  },

  clear: () => set({ items: [], total: 0 }),

  calculateTotal: () => {
    set((state) => {
      const total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity * item.rentalDays,
        0
      );
      return { total };
    });
    return 0;
  },
}));
