// components/layout/Header.tsx
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { SearchInput } from '@/components/layout/SearchInput.tsx';
import { HeaderActions } from '@/components/layout/HeaderActions';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo width={200} height={100} />
        </Link>

        {/* Navigation + Search */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Navigation />
          {showSearch && <SearchInput />}
        </div>

        <HeaderActions />
      </div>
    </header>
  );
}
