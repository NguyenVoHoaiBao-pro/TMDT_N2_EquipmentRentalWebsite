import { Link } from 'react-router-dom';

export function Navigation() {
  return (
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
  );
}
