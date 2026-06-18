import { LucideBell, LucideShoppingCart, User } from 'lucide-react';

export function HeaderActions() {
  return (<>
    <div className="flex items-center space-x-2 lg:space-x-4">
      <LucideBell className="text-gray-700 hover:text-gray-900 cursor-pointer" />

      <LucideShoppingCart className="text-gray-700 hover:text-gray-900 cursor-pointer" />

      <User className="text-gray-700 hover:text-gray-900 cursor-pointer" />
    </div>
  </>);
}
