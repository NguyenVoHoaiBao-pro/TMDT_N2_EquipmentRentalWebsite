import { Button } from '@/shared_components/ui/button';
import { PackageX, Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'package';
  onAction?: () => void;
  actionText?: string;
}

export default function EmptyState({
                                     title,
                                     description,
                                     icon = 'search',
                                     onAction,
                                     actionText,
                                   }: EmptyStateProps) {
  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50 duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon === 'search' ? (
          <Search className="h-10 w-10 text-muted-foreground" />
        ) : (
          <PackageX className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {onAction && (
        <Button onClick={onAction} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
