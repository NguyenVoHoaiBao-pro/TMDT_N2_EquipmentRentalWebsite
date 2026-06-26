// @/components/layout/Navigation.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { path: '/home', label: 'Home', roles: ['GUEST', 'RENTER', 'OWNER', 'ADMIN'] },
  { path: '/products', label: 'Products', roles: ['GUEST', 'RENTER', 'OWNER', 'ADMIN'] },
  { path: '/about', label: 'About', roles: ['GUEST', 'RENTER', 'OWNER', 'ADMIN'] },
  { path: 'contact', label: 'Contact', roles: ['GUEST', 'RENTER', 'OWNER', 'ADMIN'] },
  { path: '/register-device', label: 'Register Device', roles: ['OWNER', 'ADMIN'] },
  { path: '/admin/dashboard', label: 'Admin Dashboard', roles: ['ADMIN'] },
];

export function Navigation() {
  const { user } = useAuthStore();
  const userRoles = user?.roles || 'GUEST';

  const visibleItems = navItems.filter(item =>
    item.roles.some(role => userRoles.includes(role)),
  );

  return (
    <ul className="hidden lg:flex space-x-4">
      {visibleItems.map(item => (
        <li key={item.path}>
          <Link to={item.path} className="text-gray-700 hover:underline">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
