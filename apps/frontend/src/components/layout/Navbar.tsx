import { LucideBell } from 'lucide-react';
import { LucideShoppingCart } from 'lucide-react';
import { User } from 'lucide-react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white border-b h-16 px-4 lg:px-8 flex items-center justify-between">
      <h1 className="font-bold text-2xl text-blue-700">EquipRent</h1>

      <ul className="hidden lg:flex space-x-4">
        <li>
          <Link to="/home" className="text-gray-700 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" className="text-gray-700 hover:underline">
            Products
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-gray-700 hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-gray-700 hover:underline">
            Contact
          </Link>
        </li>
      </ul>

      <div className="hidden md:flex items-center space-x-2 relative">
        <Search className="text-gray-700 hover:text-gray-900 cursor-pointer absolute left-3" />
        <input type="text" placeholder="Search..." className="border p-2 rounded-md pl-10" />
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        <LucideBell className="text-gray-700 hover:text-gray-900 cursor-pointer" />

        <LucideShoppingCart className="text-gray-700 hover:text-gray-900 cursor-pointer" />

        <User className="text-gray-700 hover:text-gray-900 cursor-pointer" />
      </div>
    </nav>
  );
}
