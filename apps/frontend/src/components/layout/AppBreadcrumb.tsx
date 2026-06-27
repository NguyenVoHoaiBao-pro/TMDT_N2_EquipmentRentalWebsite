// src/components/layout/AppBreadcrumb.tsx
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared_components/ui/breadcrumb';
import { HomeIcon } from 'lucide-react';
import React from 'react';

const pathNameMap: Record<string, string> = {
  home: 'Home',
  products: 'Products',
  lenses: 'Lenses',
  cameras: 'Cameras',
  profile: 'Profile',
};

export function AppBreadcrumb() {
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter(Boolean);

  if (pathNames.length === 0) return null;

  return (
    <Breadcrumb className="bg-blue-300 text-white px-4 py-2 rounded w-fit">
      <BreadcrumbList>
        {/* FIX 1: Separator is now a sibling to Item, not a child */}
        <BreadcrumbItem>
          <BreadcrumbLink
            render={(props) => (
              <Link to="/home" {...props}>
                <HomeIcon className="inline-block mr-1" /> Home
              </Link>
            )}
          />
        </BreadcrumbItem>
        {pathNames.length > 0 && <BreadcrumbSeparator />}

        {pathNames.map((segment, index) => {
          const routeTo = '/' + pathNames.slice(0, index + 1).join('/');
          const isLast = index === pathNames.length - 1;
          const label = pathNameMap[segment] || segment;

          return (
            /* FIX 2: Wrapped the iteration block in a Fragment so Separator stays outside Item */
            <React.Fragment key={routeTo}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-yellow-200 font-bold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={(props) => (
                      <Link to={routeTo} {...props}>
                        {label}
                      </Link>
                    )}
                  />
                )}
              </BreadcrumbItem>

              {/* Separator is safely rendered as an independent list item sibling */}
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
