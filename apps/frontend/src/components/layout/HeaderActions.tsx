// @/components/layout/HeaderActions.tsx
import { LucideBell, LucideShoppingCart, LucideUser, LucideHistory, LucideLogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router-dom';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared_components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared_components/ui/dropdown-menu';

export function HeaderActions() {
  // Get state from the store
  const { user, isAuthenticated, logoutSuccess } = useAuthStore();

  const fallbackLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  // Get avatar URL from social login provider
  const avatarUrl = '';

  return (
    <div className="flex items-center space-x-2 lg:space-x-4">
      <LucideBell className="text-gray-700 hover:text-gray-900 cursor-pointer h-5 w-5" />

      <LucideShoppingCart className="text-gray-700 hover:text-gray-900 cursor-pointer h-5 w-5" />

      {isAuthenticated && user ? (
        <DropdownMenu>
          {/* Activate when clicking on the avatar image */}
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-85 transition-opacity">
              <AvatarImage src={avatarUrl} alt={user.username} />
              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                {fallbackLetter}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          {/* Dropdown menu content */}
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuGroup>
              <div className="px-1.5 py-1">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Xin chào, {user.username}</p>
                  <p className="pt-2 text-xs leading-none text-muted-foreground">
                    Quyền: {user.roles.join(', ')}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* User profile */}
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/profile" className="w-full flex items-center">
                  <LucideUser className="mr-2 h-4 w-4" />
                  <span>Trang cá nhân</span>
                </Link>
              </DropdownMenuItem>

              {/* Rental history */}
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/rental-history" className="w-full flex items-center">
                  <LucideHistory className="mr-2 h-4 w-4" />
                  <span>Lịch sử thuê đồ</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout button */}
              <DropdownMenuItem
                onClick={logoutSuccess}
                className="text-red-600 focus:text-red-600 focus:bg-red-50/50 cursor-pointer"
              >
                <LucideLogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 border px-3 py-1.5 rounded-md transition-colors"
        >
          Đăng nhập
        </Link>
      )}
    </div>
  );
}
