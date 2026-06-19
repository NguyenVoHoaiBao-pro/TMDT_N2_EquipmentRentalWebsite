import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { SearchInput } from '@/components/layout/SearchInput.tsx';
import { HeaderActions } from '@/components/layout/HeaderActions';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function Header({
                                 searchQuery,
                                 setSearchQuery,
                               }:
                               HeaderProps,
) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo width={200} height={100} />

        {/* Navigation + Search */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Navigation />
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Header Actions */}
        <HeaderActions />
      </div>
    </header>
  );
}
